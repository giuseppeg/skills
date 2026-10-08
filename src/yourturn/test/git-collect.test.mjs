import { describe, it, before, after } from "node:test";
import { strictEqual, deepStrictEqual, ok, match, rejects } from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, writeFile, mkdir, rm, symlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { collectChange, collectDiff, collectFileContents, getRepoRoot, DEFAULT_LIMITS } from "../../../skills/yourturn/scripts/git-collect.mjs";

const exec = promisify(execFile);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function initRepo() {
  const dir = await mkdtemp(join(tmpdir(), "yourturn-git-test-"));
  await exec("git", ["init", "-b", "main"], { cwd: dir });
  await exec("git", ["config", "user.email", "test@test.com"], { cwd: dir });
  await exec("git", ["config", "user.name", "Test User"], { cwd: dir });
  return dir;
}

async function gitAdd(dir, ...paths) {
  await exec("git", ["add", "--", ...paths], { cwd: dir });
}

async function gitCommit(dir, message = "commit") {
  await exec("git", ["commit", "-m", message], { cwd: dir });
}

async function write(dir, relPath, content) {
  const abs = join(dir, relPath);
  await mkdir(abs.slice(0, abs.lastIndexOf("/")), { recursive: true }).catch(() => {});
  await writeFile(abs, content);
}

// ---------------------------------------------------------------------------
// Repo root
// ---------------------------------------------------------------------------

describe("getRepoRoot", () => {
  it("returns the repo root for a git worktree", async () => {
    const dir = await mkdtemp(join(tmpdir(), "yourturn-root-test-"));
    try {
      await exec("git", ["init"], { cwd: dir });
      const root = await getRepoRoot(dir);
      ok(root.length > 0);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("throws outside a git worktree", async () => {
    const dir = await mkdtemp(join(tmpdir(), "yourturn-noroot-test-"));
    try {
      await rejects(() => getRepoRoot(dir), /worktree/i);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

// ---------------------------------------------------------------------------
// Tracked file modes
// ---------------------------------------------------------------------------

describe("unstaged modified file", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "src/auth.ts", "export function auth() {}\n");
    await gitAdd(dir, "src/auth.ts");
    await gitCommit(dir, "initial");
    await write(dir, "src/auth.ts", "export function auth() { return true; }\n");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("collects one modified text file", async () => {
    const { files } = await collectDiff({ source: { mode: "unstaged" }, cwd: dir });
    strictEqual(files.length, 1);
    strictEqual(files[0].path, "src/auth.ts");
    strictEqual(files[0].status, "modified");
    strictEqual(files[0].kind, "text");
    ok(files[0].patch?.includes("@@"));
  });

  it("respects the paths filter", async () => {
    const { files } = await collectDiff({
      source: { mode: "unstaged", paths: ["src/auth.ts"] },
      cwd: dir,
    });
    strictEqual(files.length, 1);
  });
});

describe("staged added file", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "README.md", "# project\n");
    await gitAdd(dir, "README.md");
    await gitCommit(dir, "initial");
    await write(dir, "src/new.ts", "export const x = 1;\n");
    await gitAdd(dir, "src/new.ts");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("collects a staged added file", async () => {
    const { files } = await collectDiff({ source: { mode: "staged" }, cwd: dir });
    strictEqual(files.length, 1);
    strictEqual(files[0].path, "src/new.ts");
    strictEqual(files[0].status, "added");
    strictEqual(files[0].kind, "text");
    ok(files[0].patch?.includes("+export const x = 1;"));
  });

  it("staged mode does not include untracked files", async () => {
    await write(dir, "untracked.ts", "// untracked\n");
    const { files } = await collectDiff({ source: { mode: "staged" }, cwd: dir });
    ok(files.every((f) => f.path !== "untracked.ts"));
  });
});

describe("dirty-tree deleted file", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "gone.ts", "const x = 1;\n");
    await gitAdd(dir, "gone.ts");
    await gitCommit(dir, "initial");
    await exec("git", ["rm", "gone.ts"], { cwd: dir });
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("collects a deleted file", async () => {
    const { files } = await collectDiff({ source: { mode: "dirty-tree" }, cwd: dir });
    strictEqual(files.length, 1);
    strictEqual(files[0].path, "gone.ts");
    strictEqual(files[0].status, "deleted");
    strictEqual(files[0].kind, "text");
    ok(files[0].patch?.includes("-const x = 1;"));
  });
});

describe("renamed file via merge-base-range", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "old.ts", "export const a = 1;\n");
    await gitAdd(dir, "old.ts");
    await gitCommit(dir, "base");
    await exec("git", ["mv", "old.ts", "new.ts"], { cwd: dir });
    await gitCommit(dir, "rename");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("collects a renamed file between commits", async () => {
    const { stdout: head } = await exec("git", ["rev-parse", "HEAD"], { cwd: dir });
    const { stdout: base } = await exec("git", ["rev-parse", "HEAD~1"], { cwd: dir });
    const { files } = await collectDiff({
      source: { mode: "merge-base-range", base: base.trim(), head: head.trim() },
      cwd: dir,
    });
    strictEqual(files.length, 1);
    strictEqual(files[0].path, "new.ts");
    strictEqual(files[0].oldPath, "old.ts");
    strictEqual(files[0].status, "renamed");
  });
});

// ---------------------------------------------------------------------------
// Untracked files
// ---------------------------------------------------------------------------

describe("untracked text file", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "README.md", "# hi\n");
    await gitAdd(dir, "README.md");
    await gitCommit(dir, "initial");
    await write(dir, "untracked.ts", "export const y = 2;\n");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("collects an untracked text file for unstaged mode", async () => {
    const { files } = await collectDiff({ source: { mode: "unstaged" }, cwd: dir });
    const f = files.find((x) => x.path === "untracked.ts");
    ok(f, "untracked.ts should be in results");
    strictEqual(f.status, "added");
    strictEqual(f.kind, "text");
    ok(f.patch?.includes("+export const y = 2;"));
    // The header names the file by its repo path, not by where the repo lives.
    ok(f.patch.includes("+++ b/untracked.ts"));
  });

  it("collects an untracked text file for dirty-tree mode", async () => {
    const { files } = await collectDiff({ source: { mode: "dirty-tree" }, cwd: dir });
    ok(files.some((x) => x.path === "untracked.ts"));
  });

  it("does not collect untracked files for staged mode", async () => {
    const { files } = await collectDiff({ source: { mode: "staged" }, cwd: dir });
    ok(!files.some((x) => x.path === "untracked.ts"));
  });
});

describe("untracked empty file", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "README.md", "# hi\n");
    await gitAdd(dir, "README.md");
    await gitCommit(dir, "initial");
    await write(dir, "empty.ts", "");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("represents an empty untracked file as text with size 0 and no patch", async () => {
    const { files } = await collectDiff({ source: { mode: "unstaged" }, cwd: dir });
    const f = files.find((x) => x.path === "empty.ts");
    ok(f, "empty.ts should be in results");
    strictEqual(f.kind, "text");
    strictEqual(f.size, 0);
    ok(!f.patch, "empty file should have no patch");
  });
});

describe("untracked symlink", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "README.md", "# hi\n");
    await gitAdd(dir, "README.md");
    await gitCommit(dir, "initial");
    await symlink("README.md", join(dir, "link.md"));
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("lists an untracked symlink as kind symlink without following it", async () => {
    const { files } = await collectDiff({ source: { mode: "unstaged" }, cwd: dir });
    const f = files.find((x) => x.path === "link.md");
    ok(f, "link.md should be in results");
    strictEqual(f.kind, "symlink");
    strictEqual(f.status, "added");
    ok(!f.patch, "symlink should have no patch content");
  });
});

// ---------------------------------------------------------------------------
// Binary files
// ---------------------------------------------------------------------------

describe("binary file", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "README.md", "# hi\n");
    await gitAdd(dir, "README.md");
    await gitCommit(dir, "initial");
    // A file with null bytes is binary.
    await writeFile(join(dir, "image.bin"), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]));
    await gitAdd(dir, "image.bin");
    await gitCommit(dir, "add binary");
    // Modify it unstaged to test modified binary
    await writeFile(join(dir, "image.bin"), Buffer.from([0xff, 0xfe, 0x00, 0x00]));
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("classifies a modified tracked binary as kind binary with no patch", async () => {
    const { files } = await collectDiff({ source: { mode: "unstaged" }, cwd: dir });
    const f = files.find((x) => x.path === "image.bin");
    ok(f, "image.bin should be in results");
    strictEqual(f.kind, "binary");
    ok(!f.patch, "binary file should have no patch content");
  });
});

describe("untracked binary file", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "README.md", "# hi\n");
    await gitAdd(dir, "README.md");
    await gitCommit(dir, "initial");
    await writeFile(join(dir, "data.bin"), Buffer.from([0x00, 0x01, 0x02, 0x03]));
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("classifies an untracked binary as kind binary with size", async () => {
    const { files } = await collectDiff({ source: { mode: "unstaged" }, cwd: dir });
    const f = files.find((x) => x.path === "data.bin");
    ok(f, "data.bin should be in results");
    strictEqual(f.kind, "binary");
    strictEqual(f.size, 4);
    ok(!f.patch);
  });
});

// ---------------------------------------------------------------------------
// Ignored files
// ---------------------------------------------------------------------------

describe("ignored files are excluded", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, ".gitignore", "node_modules/\n*.log\n");
    await write(dir, "app.ts", "const x = 1;\n");
    await gitAdd(dir, ".gitignore", "app.ts");
    await gitCommit(dir, "initial");
    await write(dir, "debug.log", "error\n");
    await mkdir(join(dir, "node_modules"));
    await write(dir, "node_modules/pkg.js", "module.exports = {}\n");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("does not include ignored files in untracked collection", async () => {
    const { files } = await collectDiff({ source: { mode: "unstaged" }, cwd: dir });
    ok(!files.some((f) => f.path === "debug.log"), "ignored .log should be excluded");
    ok(!files.some((f) => f.path.startsWith("node_modules")), "ignored dir should be excluded");
  });
});

// ---------------------------------------------------------------------------
// Paths with spaces and leading dashes
// ---------------------------------------------------------------------------

describe("paths with spaces", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "my file.ts", "const a = 1;\n");
    await gitAdd(dir, "my file.ts");
    await gitCommit(dir, "initial");
    await write(dir, "my file.ts", "const a = 2;\n");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("correctly extracts paths containing spaces", async () => {
    const { files } = await collectDiff({ source: { mode: "unstaged" }, cwd: dir });
    strictEqual(files.length, 1);
    strictEqual(files[0].path, "my file.ts");
  });
});

describe("paths with leading dashes", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "-dashed.ts", "const a = 1;\n");
    await gitAdd(dir, "-dashed.ts");
    await gitCommit(dir, "initial");
    await write(dir, "-dashed.ts", "const a = 2;\n");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("handles paths starting with a dash without misinterpreting as a flag", async () => {
    const { files } = await collectDiff({ source: { mode: "unstaged" }, cwd: dir });
    strictEqual(files.length, 1);
    strictEqual(files[0].path, "-dashed.ts");
  });
});

describe("paths that Git quotes", () => {
  let dir;
  const tabPath = "src/tab\tfile.ts";

  before(async () => {
    dir = await initRepo();
    await write(dir, tabPath, "const a = 1;\n");
    await gitAdd(dir, tabPath);
    await gitCommit(dir, "initial");
    await write(dir, tabPath, "const a = 2;\n");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("decodes C-quoted paths from git diff headers", async () => {
    const { files } = await collectDiff({ source: { mode: "unstaged" }, cwd: dir });
    strictEqual(files.length, 1);
    strictEqual(files[0].path, tabPath);
  });
});

// ---------------------------------------------------------------------------
// Error cases
// ---------------------------------------------------------------------------

describe("invalid git ref", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "a.ts", "x\n");
    await gitAdd(dir, "a.ts");
    await gitCommit(dir, "initial");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("rejects an invalid base ref", async () => {
    await rejects(
      () => collectDiff({ source: { mode: "merge-base-range", base: "nonexistent", head: "HEAD" }, cwd: dir }),
      /Invalid Git ref/
    );
  });

  it("rejects an invalid head ref", async () => {
    await rejects(
      () => collectDiff({ source: { mode: "merge-base-range", base: "HEAD", head: "nonexistent" }, cwd: dir }),
      /Invalid Git ref/
    );
  });
});

describe("path outside repository root", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "a.ts", "x\n");
    await gitAdd(dir, "a.ts");
    await gitCommit(dir, "initial");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("rejects a path that resolves outside the repo", async () => {
    await rejects(
      () => collectDiff({ source: { mode: "unstaged", paths: ["../escape.ts"] }, cwd: dir }),
      /outside repository root/
    );
  });
});

describe("size limits", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "big.ts", "x\n".repeat(1000));
    await gitAdd(dir, "big.ts");
    await gitCommit(dir, "initial");
    await write(dir, "big.ts", "y\n".repeat(1000));
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("rejects when a single file patch exceeds the per-file limit", async () => {
    await rejects(
      () => collectDiff({ source: { mode: "unstaged" }, limits: { ...DEFAULT_LIMITS, maxFileBytes: 10 }, cwd: dir }),
      /per-file limit/
    );
  });

  it("rejects when total patch size exceeds the total limit", async () => {
    await rejects(
      () => collectDiff({ source: { mode: "unstaged" }, limits: { ...DEFAULT_LIMITS, maxTotalBytes: 10 }, cwd: dir }),
      /Total patch size/
    );
  });
});

describe("file count limit", () => {
  let dir;

  before(async () => {
    dir = await initRepo();
    await write(dir, "seed.ts", "x\n");
    await gitAdd(dir, "seed.ts");
    await gitCommit(dir, "initial");
    // Three untracked files to exceed a limit of 2
    await write(dir, "a.ts", "a\n");
    await write(dir, "b.ts", "b\n");
    await write(dir, "c.ts", "c\n");
  });

  after(async () => rm(dir, { recursive: true, force: true }));

  it("rejects when file count exceeds the limit", async () => {
    await rejects(
      () => collectDiff({ source: { mode: "unstaged" }, limits: { ...DEFAULT_LIMITS, maxFiles: 2 }, cwd: dir }),
      /File count/
    );
  });
});

// ---------------------------------------------------------------------------
// Full file contents for inline expansion
// ---------------------------------------------------------------------------

describe("collectFileContents", () => {
  let dir;
  before(async () => {
    dir = await initRepo();
    await write(dir, "a.txt", "one\ntwo\nthree\n");
    await write(dir, "old-name.txt", "keep\nme\n");
    await write(dir, "gone.txt", "bye\n");
    await gitAdd(dir, "a.txt", "old-name.txt", "gone.txt");
    await gitCommit(dir, "base");
    await exec("git", ["mv", "old-name.txt", "new-name.txt"], { cwd: dir });
    await write(dir, "a.txt", "one\nTWO\nthree\n");
    await gitAdd(dir, "a.txt", "new-name.txt");
    await write(dir, "a.txt", "one\nTWO\nTHREE\n"); // unstaged on top of staged
    await rm(join(dir, "gone.txt"));
    await write(dir, "fresh.txt", "brand new\n"); // untracked
  });
  after(() => rm(dir, { recursive: true, force: true }));

  it("unstaged compares index to worktree", async () => {
    const r = await collectFileContents({ source: { mode: "unstaged" }, path: "a.txt", cwd: dir });
    strictEqual(r.oldContents, "one\nTWO\nthree\n");
    strictEqual(r.newContents, "one\nTWO\nTHREE\n");
  });

  it("staged compares HEAD to index", async () => {
    const r = await collectFileContents({ source: { mode: "staged" }, path: "a.txt", cwd: dir });
    strictEqual(r.oldContents, "one\ntwo\nthree\n");
    strictEqual(r.newContents, "one\nTWO\nthree\n");
  });

  it("dirty-tree compares HEAD to worktree", async () => {
    const r = await collectFileContents({ source: { mode: "dirty-tree" }, path: "a.txt", cwd: dir });
    strictEqual(r.oldContents, "one\ntwo\nthree\n");
    strictEqual(r.newContents, "one\nTWO\nTHREE\n");
  });

  it("reads the old side of a rename from the old path", async () => {
    const r = await collectFileContents({
      source: { mode: "staged" },
      path: "new-name.txt",
      oldPath: "old-name.txt",
      cwd: dir
    });
    strictEqual(r.oldContents, "keep\nme\n");
    strictEqual(r.newContents, "keep\nme\n");
  });

  it("uses empty old contents for added files and empty new for deleted", async () => {
    const added = await collectFileContents({ source: { mode: "dirty-tree" }, path: "fresh.txt", cwd: dir });
    strictEqual(added.oldContents, "");
    strictEqual(added.newContents, "brand new\n");
    const deleted = await collectFileContents({ source: { mode: "dirty-tree" }, path: "gone.txt", cwd: dir });
    strictEqual(deleted.oldContents, "bye\n");
    strictEqual(deleted.newContents, "");
  });

  it("contains keeps only the matching change", async () => {
    const r = await collectFileContents({
      source: { mode: "unstaged" },
      path: "a.txt",
      contains: ["THREE"],
      cwd: dir
    });
    strictEqual(r.oldContents, "one\nTWO\nthree\n");
    strictEqual(r.newContents, "one\nTWO\nTHREE\n");
    await rejects(
      () => collectFileContents({ source: { mode: "unstaged" }, path: "a.txt", contains: ["nope"], cwd: dir }),
      /No change contains "nope"/
    );
  });

  it("rejects a path with no changes", async () => {
    await rejects(
      () => collectFileContents({ source: { mode: "dirty-tree" }, path: "nothing.txt", cwd: dir }),
      /No changes/
    );
  });

  it("rejects paths outside the repository", async () => {
    await rejects(
      () => collectFileContents({ source: { mode: "dirty-tree" }, path: "../outside.txt", cwd: dir }),
      /outside repository root/
    );
  });
});

describe("collectChange", () => {
  let dir;
  // Long enough to pass a limit that its patch of one changed line still fits.
  const lines = Array.from({ length: 200 }, (_, i) => `line ${i}`);
  before(async () => {
    dir = await initRepo();
    await write(dir, "small.txt", "a\n");
    await write(dir, "large.txt", lines.join("\n") + "\n");
    await gitAdd(dir, "small.txt", "large.txt");
    await gitCommit(dir, "base");
    await write(dir, "small.txt", "b\n");
    await write(dir, "large.txt", lines.join("\n") + "\nlast\n");
  });
  after(() => rm(dir, { recursive: true, force: true }));

  it("gives every text file its old and new contents", async () => {
    const files = await collectChange({ source: { mode: "dirty-tree" }, cwd: dir });
    deepStrictEqual(files.map((f) => f.path), ["large.txt", "small.txt"]);
    strictEqual(files[0].oldContents, lines.join("\n") + "\n");
    strictEqual(files[0].newContents, lines.join("\n") + "\nlast\n");
    strictEqual(files[1].oldContents, "a\n");
    strictEqual(files[1].newContents, "b\n");
  });

  for (const limit of ["maxFileBytes", "maxTotalBytes"]) {
    it(`leaves a file over ${limit} with only its patch`, async () => {
      const files = await collectChange({ source: { mode: "dirty-tree" }, limits: { ...DEFAULT_LIMITS, [limit]: 1000 }, cwd: dir });
      strictEqual(files[0].oldContents, undefined);
      match(files[0].patch, /\+last/);
      strictEqual(files[1].newContents, "b\n");
    });
  }

  it("rejects one file over the per-file limit", async () => {
    const limits = { ...DEFAULT_LIMITS, maxFileBytes: 1000 };
    await rejects(
      () => collectFileContents({ source: { mode: "dirty-tree" }, path: "large.txt", limits, cwd: dir }),
      /large\.txt exceeds 1000 bytes/
    );
  });
});
