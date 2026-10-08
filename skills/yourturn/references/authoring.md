# Authoring a page

Every yourturn artifact is one page with the same shape. Use it to help the
user understand something you made or found (a change set, an architecture, a
bug, a plan), to collect input, or both. It replaces a wall of chat text with a
page that is easy to read and can be read aloud.

## The format

```json
{
  "title": "What changed in auth",
  "spec": {
    "root": "page",
    "state": { "merge": "yes" },
    "elements": {
      "page": {
        "type": "Page",
        "props": { "overview": "I moved **token checking** out of the HTTP layer. Tests are now much simpler." },
        "children": ["why", "moved", "decide"]
      },
      "why": { "type": "Section", "props": { "heading": "Why I changed it" }, "children": ["t1"] },
      "t1": {
        "type": "Text",
        "props": { "text": "Auth was tied to the request object. You could not test it alone. Every test had to fake a full **HTTP request**." }
      },
      "moved": { "type": "Section", "props": { "heading": "One function checks tokens" }, "children": ["t2", "d1"] },
      "t2": { "type": "Text", "props": { "text": "There is now one function called **verifyToken**. The middleware just calls it." } },
      "d1": {
        "type": "Diff",
        "props": { "path": "src/auth.ts", "note": "The middleware shrinks to one call.", "source": { "mode": "dirty-tree" } }
      },
      "decide": { "type": "Section", "props": { "heading": "One thing to decide" }, "children": ["t3", "q1"] },
      "t3": { "type": "Text", "props": { "text": "Old tokens stop working after this." } },
      "q1": {
        "type": "RadioGroup",
        "props": { "label": "Ship it now?", "options": ["yes", "after the migration"], "value": { "$bindState": "/merge" } }
      }
    }
  }
}
```

The `spec` uses json-render's **flat** format: a `root` element id, an
`elements` map keyed by id (each `{ type, props, children?: string[] }`) and an
optional `state` object with seed values.

Rules, checked by `create.mjs`:

- The root element is a `Page` with `{ overview, width }`. `overview` is the
  big picture in 1 to 3 sentences, or leave it out. `width` is `"base"` or
  `"wide"`, default `"base"`. On a wide page the `Code` and `Diff` cards take
  the width of the window and the text keeps its reading width. Use it when
  the code is the point, like a raw diff review.
- Its children are `Section` elements with `{ heading }`. Nothing else goes
  directly under the `Page`.
- A section's children are blocks. A block is any other component below, or
  one of the project's own components, see `components.md`.
- Every element lives in `elements` keyed by a unique id. Containers reference
  children by id in `children` (an array of strings).
- A prop marked optional below can be left out or set to `null`. An unknown
  prop or a wrong type is an error that names the element.

Put an input where its question comes up, right after the text that explains
it. Bind its value to a JSON Pointer path with `{ "$bindState": "/path" }` and
seed your recommended answer in `spec.state` under the same path. The result is
the full state model, so plan your paths (e.g. `/form/email`).

## What the page adds itself

Do not add any of these to a spec.

- The submit button, after the last section.
- An "Anything to add?" text area, so the user can always reply. Its text
  comes back as `result.comment`.
- Comments on lines of any `Code` or `Diff` card: hover the gutter, click the
  plus, write a note. They come back as `result.comments`.
- The section outline on wide screens, made from the section headings. Under
  a section it lists the files of a `Diff` that shows a whole change, with a
  dot on each file the user commented on.
- A fixed bottom player: prev sentence, play/pause, next sentence. The spoken
  sentence is highlighted and scrolled into view. The user can click any
  sentence to start reading from it. The player uses the browser's
  `speechSynthesis`. When it reaches an input it says "Your turn", marks the
  input and stops. The user answers and presses play to go on. Inputs in a
  row are one stop.
- A small feedback toolbar in the bottom-right corner. The user can drop image
  files onto the page, select an element and capture it as a screenshot, or
  comment on selected text. Those come back in `feedback.attachments`. Its
  list also shows the comments on lines, which stay in `result.comments`.

```ts
type Result = {
  // ...your bound state paths
  comment?: string;
  comments?: {
    card: number; // 1-based order of the card in the page
    path: string;
    side: "old" | "new" | null; // null for code cards
    startLine: number;
    endLine: number;
    snippet: string | null; // the commented lines
    body: string;
  }[];
};
```

Do not bind your own fields to `/comment` or `/comments`.

Use `**word**` inside any text to highlight a keyword. Read-aloud ignores the
marks. Keep a mark inside one sentence.

## Writing rules

Follow the shared writing rules in `SKILL.md`. On top of those:

- 3 to 6 sections. A guided review may need more, one per idea.
- Sentences must make sense read aloud: no tables, code blocks, file paths
  lists or symbols like `->`. Name things in words. Put code in a `Code` or
  `Diff` card instead.
- If the explanation is about a code change and a few lines make it clearer,
  add a `Diff` or `Code` block right after the `Text` block that introduces
  it. For a real change prefer `Diff` with `source` (see `DiffSource` below,
  `path` is repo-relative). yourturn reads the real file
  from git and the reader can expand the hidden lines around each change. The
  card shows every change in that file. To talk about one change, add
  `contains` with a short snippet from a changed line (added or removed), for
  example `"Math.max(amount"`. Other changes stay in the file as plain code.
  No match is an error. Do not read whole diffs just to fill `contains`: use
  text you already know, or list the changes cheaply with
  `node scripts/changes.mjs [dirty-tree|staged|unstaged] [-- paths...]` (or
  `range <base> <head>`), which prints one line per change like
  `L20-21  +2 -2  <first changed line>`. Copy a piece of that line. Paste `content` only for a hunk that is not in git, and use `Code` for
  a snippet worth seeing whole. Never paste whole files. Skip cards when words are enough. The player says
  "Code block" and waits 1 to 6 seconds (longer for longer code) so the user
  can look. The code itself is not read aloud, so the `note` must say the
  point on its own. When the card holds several things or the point is easy
  to miss, name one keyword from the code in the `note` or the text before it
  (an identifier or a short phrase, like **Math.max**), so the reader can spot
  the matching line at once. Skip it when the card is short and obvious.
- To explain a change set, go from broad to specific: first the contract or
  intent (new type, interface, config, public API), then the key design
  decisions in the order they affect each other, then the call site that ties
  it together. Name the concept in headings ("One function checks tokens"), not
  the code action ("Added verifyToken"). Say why, not what: the constraint,
  the tradeoff, what would break without it. Pick the 4 to 7 most important
  changes and skip the rest.
- A page that only collects input can be shorter: one or two sections, with a
  line of `Text` before the fields that says what they are for.

## Guided review

This is the guided review of "Code and PR reviews" in `SKILL.md`. Use it when
the user asks to review a PR or a change set, their own or someone else's. A
user who only asks to explain changes gets a plain page with no review. It is
the same page with the same plain style. The review comes first, see the
steps in `SKILL.md`. Then write the page.

The reader should understand the change, hear the verdict, then deal with
each thing where they meet it. People act on a problem as soon as they see
it. So a problem is explained once and decided right there, and never held
back for the end.

1. `overview`: what the change does and why, in 1 to 3 sentences.
2. First section, the verdict. Its heading says it, like "Good to go", "Good
   to go after two fixes" or "Not yet". Then what the change touches, and one
   sentence per thing to be aware of. Only name each one, the detail comes
   below. Say so when there is nothing. Never pad.
3. One section per thing that is worth the reader's time, grouped by intent,
   not by file, from broad to specific. That is every problem that needs
   their decision, and what they should know even when nothing is wrong with
   it. Always show a new or changed contract: a type, an interface, a config
   key, a public API. The reader has to learn it. A section has:
   - A short `Text`: what this is and why it matters. For a problem, what is
     wrong and what would happen, in plain words. A hard part gets more
     explanation, never less: do not skip something because it is complex.
   - A git-backed `Diff` card (see above).
   - For a problem, a note in `comments` on the card, with an `author` like
     "Agent Reviewer". It is the same as the reader's comments on lines, only
     with an author. The `Text` already explained the problem, so do not say
     it again: the comment is one short sentence that points at the spot and
     gives the fix when you know it. Start a doubt with "Question:". Line
     numbers are new-file lines, check them against the file.
   - For a problem, the input for its decision right after the card: a
     `Checkbox` like "Fix this", checked when you recommend it, or a
     `RadioGroup` when there is more than one way. For code you should not
     change, like someone else's PR, ask whether to pass the finding on.

   When a section depends on a later one, say so in one sentence.
4. Last section, only when needed, "Smaller things": what belongs to no
   line, like a test that is missing, and the nits, one sentence each. One
   `Checkbox` asks whether to fix the nits. No cards here.

Comments are not read aloud, which is one more reason the `Text` says the
problem. Skip `comments` on cards with nothing to flag. The page adds the
"Anything to add?" box itself.

## Raw diff review

Use this only when the user asks for the raw diff. A review is a guided one
by default, see "Code and PR reviews" in `SKILL.md` and the section above.
This one shows the changes with no tour, for a user who wants to read them
alone and comment on lines.

A `Diff` with a `source` and no `path` shows the whole change, one card per
changed file. You write no code into the spec, `create.mjs` reads git.

```json
{
  "title": "Review the auth changes",
  "spec": {
    "root": "page",
    "elements": {
      "page": { "type": "Page", "props": { "width": "wide" }, "children": ["changes"] },
      "changes": { "type": "Section", "props": { "heading": "Changes" }, "children": ["all"] },
      "all": {
        "type": "Diff",
        "props": {
          "source": { "mode": "dirty-tree", "paths": ["src/auth.ts", "src/session.ts"] },
          "comments": [
            { "path": "src/auth.ts", "author": "Agent Reviewer", "startLine": 24, "endLine": 29, "body": "Validation now happens before the session is made." }
          ]
        }
      }
    }
  }
}
```

- Leave `paths` out to show every changed file. Give it to narrow the review.
- Make the page `"wide"`, so long lines fit.
- The outline lists the files under the heading of their section.
- Each of your `comments` names the `path` of its file. A path that is not in
  the change is an error.
- Files with no lines to show, like a binary, a symlink or a plain rename,
  are named in one line under the cards.
- The user's comments on lines come back in `result.comments` and their
  overall note in `result.comment`, like on any page.
- It is a normal page, so it can also have an `overview`, text before the
  cards and inputs after them, for example a "Ship it?" question.

A change may hold up to 100 files, 1 MB of patch per file and 10 MB in all.
Over that `create.mjs` fails and says which limit was hit, so narrow `paths`.
A file over 1 MB is shown as its patch only, the lines around its changes
cannot be expanded.

## Text, code and images

`Text`, `Heading`, the `note` of a card and the steps of a `StepNav` are read
aloud. The player announces a card and an input, see above. Everything else
is skipped.

| Component | Props | Notes |
|-----------|-------|-------|
| `Text` | `text`: string, `muted`: boolean (optional) | One paragraph. `muted` makes it small helper copy. |
| `Heading` | `text`: string | Sub-heading inside a section. The section's own `heading` is usually enough. |
| `Code` | see below | Card with a short piece of code. |
| `Diff` | see below | Card with the changes of one file, or of the whole change. |
| `Image` | `src`: string, `alt`: string, `caption`: string (optional) | An image from the artifact's `assets/` folder, see "Assets". |
| `Divider` | none | Horizontal rule. |

```ts
type CardComment = {
  author?: string; // label, e.g. "Agent Reviewer"
  side?: "old" | "new"; // diff cards only, default "new"
  startLine: number; // new-file line (old-file line when side is "old")
  endLine?: number;
  body: string; // plain words, 1-2 sentences
};

type Code = {
  path: string; // shown in the card header
  content: string; // plain code
  note?: string | null; // one plain sentence on why it matters, read aloud
  comments?: CardComment[]; // your review notes, see "Guided review"
};

type Diff = {
  path?: string; // repo-relative when using source. Without it: the whole change, see "Raw diff review"
  note?: string | null;
  source?: DiffSource; // the real change from git
  oldPath?: string; // previous name, only for a renamed file
  contains?: string | string[]; // show only the changes with this text
  content?: string; // or a pasted unified diff (one file, with ---/+++ and @@)
  comments?: (CardComment & { path?: string })[]; // `path` only on the whole change
};

type DiffSource =
  | { mode: "unstaged" | "staged" | "dirty-tree"; paths?: string[] }
  | { mode: "merge-base-range"; base: string; head: string; paths?: string[] };
```

A `Diff` takes either `source` or `content`, never both. `contains`, `oldPath`
and `content` need a `path`. `paths` in a source is for the whole change.

| Source mode | What it shows |
|---|---|
| `"unstaged"` | Unstaged changes (`git diff`) and untracked files |
| `"staged"` | Staged changes (`git diff --cached`) |
| `"dirty-tree"` | Everything against HEAD (`git diff HEAD`) and untracked files |
| `"merge-base-range"` | What `head` added since it left `base` (`git diff base...head`) |

`create.mjs` snapshots a `Diff` with `source` when it writes the artifact, so
the page shows the change as it was at that moment.

## Assets

An artifact is a folder, so it can carry files. `create.mjs` prints the
artifact `path`. Copy images into `<path>/assets/` before you run `open.mjs`
and refer to them by relative path:

```json
{ "type": "Image", "props": { "src": "assets/before.png", "alt": "The old login screen", "caption": "Before the change." } }
```

`src` must be relative and stay inside `assets/`. Absolute paths, `..` and
URLs are rejected.

## Inputs

All inputs take `label` and an optional `help` string. Bind the value prop with
`$bindState`.

| Component | Value prop | Other props |
|-----------|-----------|-------------|
| `TextField` | `value` (string) | `type`: `"text" \| "email" \| "number" \| "url"`, `placeholder`, `required` |
| `Textarea` | `value` (string) | `placeholder`, `rows` (number), `required` |
| `Select` | `value` (string) | `options`, `placeholder`, `required` |
| `RadioGroup` | `value` (string) | `options` |
| `Checkbox` | `checked` (boolean) | none |

`options` is an array of either bare strings (`["A", "B"]`) or
`{ "label": "...", "value": "..." }` objects.

There is no password field. Answers are saved to disk and a page may be
deployed, so never ask for a secret on a page.

A page that only collects input:

```json
{
  "title": "Tell us about you",
  "spec": {
    "root": "page",
    "state": { "form": { "name": "", "role": "", "notes": "", "remote": false } },
    "elements": {
      "page":   { "type": "Page", "props": { "overview": "A few questions so I can set up **your profile**." }, "children": ["who"] },
      "who":    { "type": "Section", "props": { "heading": "Who you are" }, "children": ["name", "role", "remote", "notes"] },
      "name":   { "type": "TextField", "props": { "label": "Name", "value": { "$bindState": "/form/name" }, "required": true } },
      "role":   { "type": "Select", "props": { "label": "Role", "value": { "$bindState": "/form/role" }, "options": ["Engineering", "Design", "Product"] } },
      "remote": { "type": "Checkbox", "props": { "label": "Works remotely", "checked": { "$bindState": "/form/remote" } } },
      "notes":  { "type": "Textarea", "props": { "label": "Notes", "value": { "$bindState": "/form/notes" }, "rows": 3 } }
    }
  }
}
```

Submitting yields:

```json
{
  "type": "form",
  "version": 1,
  "result": {
    "form": { "name": "...", "role": "...", "remote": true, "notes": "..." }
  },
  "feedback": { "attachments": [] },
  "errors": []
}
```

## Layout, slides and diagrams

| Component | Props | Notes |
|-----------|-------|-------|
| `Stack` | `gap`: `"sm" \| "md" \| "lg"` (optional) | Vertical container. |
| `Columns` | `gap`: `"sm" \| "md" \| "lg"` (optional) | Responsive two-column layout. Use for paired fields or content that benefits from side-by-side layout on wide screens. |
| `Card` | `title`: string (optional) | Bordered container with optional title. Use it only for grouped subcontent that needs a visible frame. |
| `Slideshow` | `slides`: `{ title, body? }[]` | Paginated slides with prev/next nav. Display-only. |
| `DiagramFlow` | `title`: string (optional), `nodes`: `{ id, label, detail? }[]`, `edges`: `{ from, to, label? }[]` | Simple relationship diagram for data flow, lifecycle, architecture boundaries, or before/after structure. Use only when a visual makes relationships clearer. Node ids must be unique. |
| `StepNavHorizontal` | `steps`: `{ title, detail?, status? }[]` | Display-only step rail for short flows. Its steps are read aloud. Prefer this when progress context helps but a sidebar would waste space. |
| `StepNavVertical` | `steps`: `{ title, detail?, status? }[]` | Display-only side rail for longer walkthroughs or dense wide layouts. Its steps are read aloud. Use only when the side space is worth it. |

Use `Slideshow` when you need to walk the user through something before they
answer: architecture decisions, a summary of changes, a step-by-step
explanation, a before/after review.

```json
{
  "slides": {
    "type": "Slideshow",
    "props": {
      "slides": [
        { "title": "Why we refactored", "body": "The old approach coupled auth tightly to the HTTP layer, making unit tests painful." },
        { "title": "What moved", "body": "Auth logic is now in a standalone verifyToken() function. The middleware just calls it." },
        { "title": "What stayed the same", "body": "Public API surface, error codes, and all existing tests are unchanged." }
      ]
    }
  }
}
```

Use `DiagramFlow` sparingly. It is helpful for data flow, lifecycle,
architecture boundaries, or before/after structure. Do not use it for simple
forms, short explanations, or obvious summaries. Put each concept in `nodes`
once and connect them with `edges`.

```json
{
  "flow": {
    "type": "DiagramFlow",
    "props": {
      "title": "yourturn round trip",
      "nodes": [
        { "id": "agent", "label": "Agent", "detail": "Authors JSON spec" },
        { "id": "browser", "label": "Browser UI", "detail": "User reviews and submits" },
        { "id": "stdout", "label": "Agent resumes", "detail": "Reads one JSON result" }
      ],
      "edges": [
        { "from": "agent", "to": "browser", "label": "render" },
        { "from": "browser", "to": "stdout", "label": "submit" }
      ]
    }
  }
}
```

Use step navigation sparingly. `status` can be `"complete"`, `"current"`, or
`"upcoming"`; omit it to mark the first step current and the rest upcoming.
Prefer horizontal for 2-5 short steps. Use vertical only for longer
walkthroughs or dense wide layouts.

## Dynamic values and conditional fields

Beyond `$bindState`, any prop value can be a data-driven expression, and any
element can declare a `visible` condition. These resolve against the same state
model, so they compose with the bound inputs above.

Prop expressions:
- `{ "$state": "/path" }` reads a value from state (one-way).
- `{ "$template": "Hello, ${/form/name}!" }` interpolates state into a string.
- `{ "$cond": <condition>, "$then": <value>, "$else": <value> }` picks a value.

Visibility (`visible` on any element):
- `{ "$state": "/path" }` shows when the value is truthy.
- `{ "$state": "/path", "eq": <value> }` shows when it equals a value.
- `{ "$state": "/path", "not": true }` shows when it is falsy.
- `{ "$and": [<cond>, <cond>] }` / `{ "$or": [<cond>, <cond>] }` combine.

Example: reveal a field only when a checkbox is unticked.

```json
{
  "remote":  { "type": "Checkbox", "props": { "label": "Remote?", "checked": { "$bindState": "/form/remote" } } },
  "address": {
    "type": "TextField",
    "props": { "label": "Office address", "value": { "$bindState": "/form/address" } },
    "visible": { "$state": "/form/remote", "not": true }
  }
}
```
