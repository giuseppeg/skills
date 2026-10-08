import { describe, it } from "node:test";
import { deepEqual, equal, match, ok } from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The scripts under test are in the skill folder, the only part that ships.
const scripts = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "skills", "yourturn", "scripts");
const sample = JSON.parse(readFileSync(join(scripts, "..", "examples", "sample-spec.json"), "utf8"));

function create({ cwd, input, args = [] }) {
  return spawnSync(process.execPath, [join(scripts, "create.mjs"), ...args], { cwd, input: JSON.stringify(input), encoding: "utf8" });
}

describe("create.mjs", () => {
  it("writes the artifact as a site of its own and prints the id and path", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const res = create({ cwd, input: sample });
      equal(res.status, 0, res.stderr);
      const { id, path, target, confirm } = JSON.parse(res.stdout);
      equal(target, "local");
      equal(confirm, undefined);
      match(id, /^\d{4}-\d{2}-\d{2}-tell-us-about-you$/);
      ok(path.endsWith(join(".agents", "artifacts", "local", id)));

      const entry = JSON.parse(readFileSync(join(path, "entry.json"), "utf8"));
      equal(entry.version, 1);
      equal(entry.id, id);
      equal(entry.title, sample.title);
      ok(!Number.isNaN(Date.parse(entry.createdAt)));
      deepEqual(entry.spec, sample.spec);

      // The viewer comes along, so the folder opens with no skill around.
      ok(existsSync(join(path, "_core", "boot.js")));
      ok(existsSync(join(path, "_core", "yourturn.js")));
      ok(existsSync(join(path, "_core", "style.css")));
      const html = readFileSync(join(path, "index.html"), "utf8");
      match(html, /<script type="module" src="\.\/_core\/boot\.js">/);
      match(html, /<script type="application\/json" id="components">\[\]<\/script>/);
      const { imports } = JSON.parse(html.match(/<script type="importmap">([^]*?)<\/script>/)[1]);
      equal(imports.yourturn, "./_core/yourturn.js");
      match(imports.react, /^https:\/\/esm\.sh\/react@/);

      // The page may only talk to the hosts of its import map and to loopback.
      const policy = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)"/)[1];
      const map = createHash("sha256").update(html.match(/<script type="importmap">([^]*?)<\/script>/)[1]).digest("base64");
      match(policy, /^default-src 'none'; /);
      ok(policy.includes(`script-src 'self' 'wasm-unsafe-eval' 'sha256-${map}' https://esm.sh;`));
      ok(policy.includes("connect-src 'self' https://esm.sh;"));
      ok(policy.includes("form-action http://127.0.0.1:*;"));
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("makes an id from the title and drops an apostrophe", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const res = create({ cwd, input: { ...sample, title: "Last week's signups, Q3!" } });
      equal(res.status, 0, res.stderr);
      match(JSON.parse(res.stdout).id, /^\d{4}-\d{2}-\d{2}-last-weeks-signups-q3$/);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("numbers a made-up id that is taken", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const ids = [1, 2, 3].map(() => JSON.parse(create({ cwd, input: sample }).stdout).id);
      equal(ids[1], `${ids[0]}-2`);
      equal(ids[2], `${ids[0]}-3`);
      equal(JSON.parse(readFileSync(join(cwd, ".agents", "artifacts", "local", ids[2], "entry.json"), "utf8")).id, ids[2]);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("fails when a given id exists", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      equal(create({ cwd, input: { ...sample, id: "intro" } }).status, 0);
      const res = create({ cwd, input: { ...sample, id: "intro" } });
      equal(res.status, 1);
      match(res.stderr, /'intro' already exists/);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("rejects an id that is not a plain folder name", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const res = create({ cwd, input: { ...sample, id: "../escape" } });
      equal(res.status, 1);
      match(res.stderr, /lowercase letters, digits and dashes/);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("rejects a spec with a broken structure", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const spec = { root: "page", elements: { page: { type: "Page", props: {}, children: ["gone"] } } };
      const res = create({ cwd, input: { title: "Broken", spec } });
      equal(res.status, 1);
      match(res.stderr, /"gone"/);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("rejects a spec whose root is not a Page", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const spec = { root: "stack", elements: { stack: { type: "Stack", props: {} } } };
      const res = create({ cwd, input: { title: "Old format", spec } });
      equal(res.status, 1);
      match(res.stderr, /root element must be a Page.*got 'Stack'.*references\/authoring\.md/);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("names every element that breaks the spec rules or has a bad prop", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const spec = {
        root: "page",
        state: { age: 7 },
        elements: {
          page: { type: "Page", props: {}, children: ["loose", "sec"] },
          loose: { type: "Text", props: { text: "Not in a section." } },
          sec: { type: "Section", props: { heading: "One" }, children: ["nested", "go", "num", "typo", "pic", "bound"] },
          nested: { type: "Section", props: { heading: "Two" } },
          go: { type: "SubmitButton", props: { label: "Go" } },
          num: { type: "Text", props: { text: 5 } },
          typo: { type: "Text", props: { text: "Fine.", mute: true } },
          pic: { type: "Image", props: { src: "https://example.com/a.png", alt: "" } },
          bound: { type: "TextField", props: { label: "Age", value: { $bindState: "/age" } } }
        }
      };
      const res = create({ cwd, input: { title: "Broken", spec } });
      equal(res.status, 1);
      match(res.stderr, /- loose: a child of the Page must be a Section, not Text/);
      match(res.stderr, /- nested: a Section must be a child of the Page/);
      match(res.stderr, /- go: unknown component 'SubmitButton'/);
      match(res.stderr, /- num \(Text\): text: .*string/);
      match(res.stderr, /- typo \(Text\): .*"mute"/);
      match(res.stderr, /- pic \(Image\): src: must be a relative path inside assets\//);
      match(res.stderr, /- bound \(TextField\): value: .*string/);
      ok(!/- (page|sec)\b/.test(res.stderr), res.stderr);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("accepts props left out and values bound to state", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const spec = {
        root: "page",
        state: { merge: "yes" },
        elements: {
          page: { type: "Page", props: { overview: null }, children: ["sec"] },
          sec: { type: "Section", props: { heading: "One" }, children: ["q", "open", "pic"] },
          q: { type: "RadioGroup", props: { label: "Ship?", options: ["yes", "no"], value: { $bindState: "/merge" } } },
          open: { type: "Textarea", props: { label: "Why", value: { $bindState: "/why" } } },
          pic: { type: "Image", props: { src: "assets/shots/before.png", alt: "Before" } }
        }
      };
      const res = create({ cwd, input: { title: "Fine", spec } });
      equal(res.status, 0, res.stderr);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("takes the project's components and import map entries", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const artifacts = join(cwd, ".agents", "artifacts");
      mkdirSync(join(artifacts, "components", "lib"), { recursive: true });
      // Any file name is a component, whatever its case. Subfolders hold helpers.
      writeFileSync(join(artifacts, "components", "PriceTable.js"), "export const render = () => null;");
      writeFileSync(join(artifacts, "components", "price-note.js"), "export const render = () => null;");
      writeFileSync(join(artifacts, "components", "Text.js"), "export const render = () => null;");
      writeFileSync(join(artifacts, "components", "lib", "money.js"), "export const money = (n) => `$${n}`;");
      writeFileSync(join(artifacts, "components", "notes.md"), "not a component");
      writeFileSync(
        join(artifacts, "config.json"),
        JSON.stringify({ target: "local", imports: { react: "./vendor/react.js", "d3</script>": "https://esm.sh/d3@7" } })
      );

      const spec = {
        root: "page",
        elements: {
          page: { type: "Page", props: {}, children: ["sec"] },
          sec: { type: "Section", props: { heading: "Plans" }, children: ["table", "note", "text"] },
          // Props of project components are left to the page.
          table: { type: "PriceTable", props: { rows: "not checked here" } },
          note: { type: "price-note", props: {} },
          text: { type: "Text", props: { anything: true } }
        }
      };
      const res = create({ cwd, input: { title: "Plans", spec } });
      equal(res.status, 0, res.stderr);
      match(res.stderr, /project components replace the built-in Text\n/);

      const { path } = JSON.parse(res.stdout);
      ok(existsSync(join(path, "_core", "components", "PriceTable.js")));
      ok(existsSync(join(path, "_core", "components", "lib", "money.js")));
      const html = readFileSync(join(path, "index.html"), "utf8");
      deepEqual(JSON.parse(html.match(/id="components">([^]*?)<\/script>/)[1]).sort(), ["PriceTable", "Text", "price-note"]);
      const { imports } = JSON.parse(html.match(/<script type="importmap">([^]*?)<\/script>/)[1]);
      equal(imports.react, "./vendor/react.js");
      equal(imports["d3</script>"], "https://esm.sh/d3@7");
      match(imports.zod, /^https:\/\/esm\.sh\/zod@/);
      match(html, /connect-src 'self' https:\/\/esm\.sh;/);

      // A component can only import what the import map names, or a relative file.
      writeFileSync(
        join(artifacts, "components", "PriceTable.js"),
        'import { z } from "zod";\nimport {\n  Bar\n} from "recharts";\nimport { money } from "./lib/money.js";\n' +
          '// import "left-pad";\nexport const description = \'Prices from "the sheet".\';\nexport const render = () => null;'
      );
      writeFileSync(join(artifacts, "components", "lib", "money.js"), 'export * from "big.js";');
      const unmapped = create({ cwd, input: { title: "Plans", spec } });
      equal(unmapped.status, 1);
      match(unmapped.stderr, /- PriceTable\.js: 'recharts'\n/);
      match(unmapped.stderr, /- lib\/money\.js: 'big\.js'\n/);
      match(unmapped.stderr, /Add each one to "imports" in .*config\.json/);
      equal(/left-pad|the sheet|zod/.test(unmapped.stderr), false);
      writeFileSync(
        join(artifacts, "config.json"),
        JSON.stringify({ target: "local", imports: { recharts: "https://esm.sh/recharts@3.10.1", "big.js": "./_core/components/lib/big.js" } })
      );
      equal(create({ cwd, input: { title: "Plans", spec } }).status, 0);

      const unknown = { ...spec, elements: { ...spec.elements, table: { type: "pricetable", props: {} } } };
      const bad = create({ cwd, input: { title: "Plans", spec: unknown } });
      equal(bad.status, 1);
      match(bad.stderr, /- table: unknown component 'pricetable', the project has .*PriceTable/);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("snapshots git-backed diff cards", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const git = (...args) => execFileSync("git", args, { cwd });
      git("init", "-b", "main");
      git("config", "user.email", "test@test.com");
      git("config", "user.name", "Test User");
      writeFileSync(join(cwd, "a.txt"), "one\n");
      git("add", "a.txt");
      git("commit", "-m", "first");
      writeFileSync(join(cwd, "a.txt"), "two\n");

      const spec = {
        root: "page",
        elements: {
          page: { type: "Page", props: {}, children: ["sec"] },
          sec: { type: "Section", props: { heading: "Change" }, children: ["diff"] },
          diff: { type: "Diff", props: { path: "a.txt", contains: "two", source: { mode: "dirty-tree" } } }
        }
      };
      const res = create({ cwd, input: { id: "change", title: "Change", spec } });
      equal(res.status, 0, res.stderr);

      const entry = JSON.parse(readFileSync(join(JSON.parse(res.stdout).path, "entry.json"), "utf8"));
      deepEqual(entry.spec.elements.diff.props, {
        path: "a.txt",
        oldFile: { name: "a.txt", contents: "one\n" },
        newFile: { name: "a.txt", contents: "two\n" }
      });
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("snapshots a whole change as one card per file", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const git = (...args) => execFileSync("git", args, { cwd });
      git("init", "-b", "main");
      git("config", "user.email", "test@test.com");
      git("config", "user.name", "Test User");
      writeFileSync(join(cwd, "a.txt"), "one\n");
      writeFileSync(join(cwd, "b.txt"), "same\n");
      writeFileSync(join(cwd, "logo.bin"), Buffer.from([0, 1, 2]));
      git("add", ".");
      git("commit", "-m", "first");
      writeFileSync(join(cwd, "a.txt"), "two\n");
      writeFileSync(join(cwd, "logo.bin"), Buffer.from([0, 3, 4]));
      git("mv", "b.txt", "c.txt");
      writeFileSync(join(cwd, "new.txt"), "fresh\n");

      const page = (props) => ({
        root: "page",
        elements: {
          page: { type: "Page", props: {}, children: ["sec"] },
          sec: { type: "Section", props: { heading: "Changes" }, children: ["diff"] },
          diff: { type: "Diff", props }
        }
      });
      const comments = [{ path: "a.txt", startLine: 1, body: "Why two?" }];
      const res = create({ cwd, input: { id: "review", title: "Review", spec: page({ source: { mode: "dirty-tree" }, comments }) } });
      equal(res.status, 0, res.stderr);

      const entry = JSON.parse(readFileSync(join(JSON.parse(res.stdout).path, "entry.json"), "utf8"));
      deepEqual(entry.spec.elements.diff.props, {
        comments,
        files: [
          { path: "a.txt", oldFile: { name: "a.txt", contents: "one\n" }, newFile: { name: "a.txt", contents: "two\n" } },
          { path: "new.txt", oldFile: { name: "new.txt", contents: "" }, newFile: { name: "new.txt", contents: "fresh\n" } }
        ],
        skipped: ["c.txt (renamed from b.txt)", "logo.bin (binary)"]
      });

      const narrowed = create({ cwd, input: { title: "Review", spec: page({ source: { mode: "dirty-tree", paths: ["new.txt"] } }) } });
      equal(narrowed.status, 0, narrowed.stderr);
      const { files } = JSON.parse(readFileSync(join(JSON.parse(narrowed.stdout).path, "entry.json"), "utf8")).spec.elements.diff.props;
      deepEqual(files.map((f) => f.path), ["new.txt"]);

      const stray = create({
        cwd,
        input: { title: "Review", spec: page({ source: { mode: "dirty-tree" }, comments: [{ path: "nope.txt", startLine: 1, body: "?" }] }) }
      });
      equal(stray.status, 1);
      match(stray.stderr, /a comment is on 'nope\.txt', which is not a changed file/);

      const staged = create({ cwd, input: { title: "Review", spec: page({ source: { mode: "merge-base-range", base: "HEAD", head: "HEAD" } }) } });
      equal(staged.status, 1);
      match(staged.stderr, /diff: no changes for source mode merge-base-range/);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("rejects a Diff that does not say what to show", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const spec = {
        root: "page",
        elements: {
          page: { type: "Page", props: {}, children: ["sec"] },
          sec: { type: "Section", props: { heading: "Changes" }, children: ["empty", "both", "loose", "blind", "typo"] },
          empty: { type: "Diff", props: { path: "a.txt" } },
          both: { type: "Diff", props: { path: "a.txt", content: "@@", source: { mode: "staged" } } },
          loose: { type: "Diff", props: { source: { mode: "staged" }, contains: "x" } },
          blind: { type: "Diff", props: { source: { mode: "staged" }, comments: [{ startLine: 1, body: "Where?" }] } },
          typo: { type: "Diff", props: { path: "a.txt", source: { mode: "staged", path: ["a.txt"] } } }
        }
      };
      const res = create({ cwd, input: { title: "Broken", spec } });
      equal(res.status, 1);
      match(res.stderr, /- empty \(Diff\): give either content or source/);
      match(res.stderr, /- both \(Diff\): give either content or source/);
      match(res.stderr, /- loose \(Diff\): content, contains and oldPath need a path/);
      match(res.stderr, /- blind \(Diff\): with no path every comment needs the path of its file/);
      match(res.stderr, /- typo \(Diff\): source: .*"path"/);
      match(create({ cwd, input: { type: "diff", source: { mode: "staged" } } }).stderr, /a diff review is a page now/);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("puts a page in local or in remote, and an id names one page in both", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const run = ({ args = [], input }) =>
        spawnSync(process.execPath, [join(scripts, "create.mjs"), ...args], { cwd, input: JSON.stringify(input), encoding: "utf8" });
      const artifacts = join(cwd, ".agents", "artifacts");

      const asked = JSON.parse(run({ args: ["--target", "remote"], input: { ...sample, id: "intro" } }).stdout);
      equal(asked.target, "remote");
      equal(asked.path, join(realpathSync(artifacts), "remote", "intro"));
      ok(existsSync(join(artifacts, "remote", "intro", "index.html")));
      ok(!existsSync(join(artifacts, "local")));

      // The id is taken, also for the other folder.
      const again = run({ input: { ...sample, id: "intro" } });
      equal(again.status, 1);
      match(again.stderr, /'intro' already exists/);

      // The config decides when no option is given, and the option overrules it.
      writeFileSync(join(artifacts, "config.json"), '{"target":"remote"}');
      const first = JSON.parse(run({ input: sample }).stdout);
      equal(first.target, "remote");
      const second = JSON.parse(run({ args: ["--target", "local"], input: sample }).stdout);
      equal(second.target, "local");
      equal(second.id, `${first.id}-2`);
      ok(existsSync(join(artifacts, "local", second.id, "entry.json")));

      const typo = run({ args: ["--target", "cloud"], input: sample });
      equal(typo.status, 1);
      match(typo.stderr, /unknown target 'cloud'/);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("stops a page with a diff from git on its way to remote until the user was asked", () => {
    const cwd = mkdtempSync(join(tmpdir(), "yourturn-create-test-"));
    try {
      const git = (...args) => execFileSync("git", args, { cwd });
      git("init", "-b", "main");
      git("config", "user.email", "test@test.com");
      git("config", "user.name", "Test User");
      writeFileSync(join(cwd, "a.txt"), "one\n");
      git("add", "a.txt");
      git("commit", "-m", "first");
      writeFileSync(join(cwd, "a.txt"), "two\n");

      const page = (block) => ({
        title: "Change",
        spec: {
          root: "page",
          elements: {
            page: { type: "Page", props: {}, children: ["sec"] },
            sec: { type: "Section", props: { heading: "Change" }, children: ["block"] },
            block
          }
        }
      });
      const fromGit = page({ type: "Diff", props: { path: "a.txt", source: { mode: "dirty-tree", paths: ["a.txt"] } } });
      const pasted = page({ type: "Code", props: { path: "a.txt", content: "two" } });
      // In local/ it only says so, for the day the page is moved.
      equal(JSON.parse(create({ cwd, input: fromGit }).stdout).confirm, true);
      equal(JSON.parse(create({ cwd, input: pasted }).stdout).confirm, undefined);

      const remote = join(cwd, ".agents", "artifacts", "remote");
      const stopped = create({ cwd, input: fromGit, args: ["--target", "remote"] });
      equal(stopped.status, 1);
      match(stopped.stderr, /holds source code[\s\S]*Ask the user first[\s\S]*--code-ok/);
      equal(existsSync(remote), false);
      const asked = create({ cwd, input: fromGit, args: ["--target", "remote", "--code-ok"] });
      equal(asked.status, 0, asked.stderr);
      equal(JSON.parse(asked.stdout).target, "remote");
      equal(JSON.parse(asked.stdout).confirm, undefined);
      equal(create({ cwd, input: pasted, args: ["--target", "remote"] }).status, 0);

      // This user said not to be asked again.
      writeFileSync(join(cwd, ".agents", "artifacts", "config.local.json"), '{"author":"Ada","confirmCode":false}');
      equal(JSON.parse(create({ cwd, input: fromGit }).stdout).confirm, undefined);
      equal(create({ cwd, input: fromGit, args: ["--target", "remote"] }).status, 0);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
