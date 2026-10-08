import { describe, it } from "node:test";
import { strictEqual, throws } from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { formatChanges, parseChanges, selectChanges } from "../../../skills/yourturn/scripts/select-changes.mjs";

// Real unified diff from git, so the parser sees genuine hunk headers.
function diff(oldContents, newContents) {
  const dir = mkdtempSync(join(tmpdir(), "yourturn-select-test-"));
  try {
    writeFileSync(join(dir, "a"), oldContents);
    writeFileSync(join(dir, "b"), newContents);
    try {
      execFileSync("git", ["diff", "--no-index", "--unified=3", "a", "b"], { cwd: dir, encoding: "utf8" });
      return "";
    } catch (err) {
      return err.stdout;
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const lines = (n, edits = {}) =>
  Array.from({ length: n }, (_, i) => edits[i + 1] ?? `line ${i + 1}`).join("\n") + "\n";

describe("selectChanges", () => {
  const oldFile = lines(40);
  const newFile = lines(40, { 3: "line 3 renamed", 20: "line 20 fixed", 38: "line 38 logged" });
  const patch = diff(oldFile, newFile);

  it("keeps only the matching change as a difference", () => {
    const result = selectChanges({ patch, oldContents: oldFile, contains: ["20 fixed"] });
    strictEqual(result, lines(40, { 3: "line 3 renamed", 38: "line 38 logged" }));
  });

  it("keeps several changes when several needles match", () => {
    const result = selectChanges({ patch, oldContents: oldFile, contains: ["3 renamed", "38 logged"] });
    strictEqual(result, lines(40, { 20: "line 20 fixed" }));
  });

  it("matches on removed lines too", () => {
    const result = selectChanges({ patch, oldContents: oldFile, contains: ["line 20"] });
    strictEqual(result, lines(40, { 3: "line 3 renamed", 38: "line 38 logged" }));
  });

  it("handles a pure insertion", () => {
    const o = lines(20);
    const n = lines(20, { 15: "line 15 edited" }).replace("line 2\n", "line 2\nINSERTED\n");
    const p = diff(o, n);
    strictEqual(selectChanges({ patch: p, oldContents: o, contains: ["INSERTED"] }), lines(20, { 15: "line 15 edited" }));
    strictEqual(
      selectChanges({ patch: p, oldContents: o, contains: ["15 edited"] }),
      o.replace("line 2\n", "line 2\nINSERTED\n")
    );
  });

  it("handles a pure deletion", () => {
    const o = lines(10);
    const n = o.replace("line 5\n", "");
    const result = selectChanges({ patch: diff(o, n), oldContents: o, contains: ["line 5"] });
    strictEqual(result, o);
  });

  it("handles a multi-line change", () => {
    const o = lines(10);
    const n = lines(10, { 4: "four A", 5: "five B", 6: "six C" });
    const result = selectChanges({ patch: diff(o, n), oldContents: o, contains: ["five B"] });
    strictEqual(result, o);
  });

  it("throws when nothing matches", () => {
    throws(() => selectChanges({ patch, oldContents: oldFile, contains: ["nope"] }), /No change contains "nope"/);
  });
});

describe("parseChanges and formatChanges", () => {
  const o = lines(40);
  const n = lines(40, { 3: "line 3 renamed", 20: "line 20 fixed", 21: "line 21 fixed" }).replace("line 30\n", "");
  const patch = diff(o, n);

  it("reports where each change lands in the new file", () => {
    const changes = parseChanges(patch);
    strictEqual(changes.length, 3);
    strictEqual(changes[0].newStart, 3);
    strictEqual(changes[1].newStart, 20);
    strictEqual(changes[1].added.length, 2);
    strictEqual(changes[2].added.length, 0); // pure deletion
    strictEqual(changes[2].removed[0], "line 30");
  });

  it("prints one compact line per change", () => {
    const text = formatChanges({ files: [{ path: "a.ts", status: "modified", kind: "text", patch }] });
    strictEqual(
      text,
      [
        "a.ts (modified, +3 -4)",
        "  L3  +1 -1  line 3 renamed",
        "  L20-21  +2 -2  line 20 fixed",
        "  after L29  +0 -1  line 30"
      ].join("\n")
    );
  });

  it("lists non-text files without changes", () => {
    strictEqual(formatChanges({ files: [{ path: "a.png", status: "modified", kind: "binary" }] }), "a.png (binary)");
  });
});
