# Yourturn: plan and work log

These are working notes and not documentation. An AI agent built yourturn
over several sessions, and this file is what one session handed to the next:
the status, the known problems and a log of what was tried and decided. "The
user" is the author of the skill. For how yourturn works read `design.md`
next to this file, and to use it read `skills/yourturn/README.md`.

## How to use this file

This file lets a fresh session continue the work with no other context.

1. Read `src/yourturn/docs/design.md` first. It is the design and the source of
   truth for every decision. Do not reopen its decisions. If you find it wrong
   or stale, fix it and tell the user.
2. Read "Status" below to see where the work stands.
3. Do one step at a time. Explain your approach for the step and wait for the
   user's OK before writing code.
4. At the end of a session update "Status" and add a line to "Session log".
5. Talk to the user through pages. When a reply lays out options or needs a
   decision, make it a yourturn page and keep the chat message to a line or
   two, as "Following up on an answer" in `SKILL.md` says. The user asked for
   this on 2026-10-07. Run the scripts from this repo:
   `node skills/yourturn/scripts/create.mjs` and `open.mjs`.
6. Commit only when the user asks.

## Status

Last updated: 2026-10-08, after the move to a repo for all skills.

| Step | What | State |
|---|---|---|
| 1 | Disk and one-shot open | done on branch `next` |
| 2 | The page shell | done on branch `next` |
| 3 | Import map viewer | done on branch `next` |
| 4 | Remote target | done on branch `next` |
| 5 | Fold diff review | done on branch `next`, commit `587fa38` |
| 5b | Local and remote folders | done on branch `next`, commit `9a19cd1` |
| 6 | Notices | done on branch `next`, commit `147e16d` |
| 7 | Ship only what runs | done on branch `next`, commit `147e16d` |
| 8 | A repo for all skills | done, in the first commit |

Every step of the plan is built. **The git history started over on
2026-10-08:** the repo is one first commit on `main`, made for the public
repo. The branch `next` and every commit hash this file names are from the
history before that and no longer exist. Nothing is pushed. What is left is
the release.

Must be done before a release:

- **The remote.** The repo exists on GitHub, the user said so on 2026-10-08,
  but this checkout has no git remote yet. The update check
  fetches `skills/yourturn/SKILL.md` from `main` of `giuseppeg/skills`, and
  the README tells people to install from there. Until that repo is public
  and this `main` is pushed to it the check is silent. It was only run
  against a local server.
- **The local folder is still `skills-ui`.** Renaming it is the user's step,
  after a session: the symlinks of the installed skill point into it and
  must follow.

Not tried yet, worth doing before a release:

- A real deploy with the new folders: a page made in `remote/`, the question
  before source code goes up, and a local page moved to `remote/`. Step 5b
  was only checked with a static server on another local port, in headless
  Chromium, Firefox and WebKit.
- A code review by an agent in a fresh session. The guided review wording in
  `SKILL.md` and `references/authoring.md` was used once, by the agent that
  wrote it. Its shape changed after that run: the verdict moved to the front
  and each decision sits right after its card.
- Whether the sharper description makes the skill trigger more often. It was
  sharpened again in `c42c0c5`, for a topic the user wants explained, and
  not tried in a fresh session.
- The voice hint in Safari and Firefox. It was only seen in headless Chrome
  Canary, with Zoe taken out of the voice list by a script.
- The real Firefox app.

What the user did see in a real browser: a review of 29 files, the guided
review, and five follow-up pages with step lists, choices on a card and the
feedback list.

## Where things are today

```
skills-ui/                          the repo, giuseppeg/skills on GitHub
  AGENTS.md                         a few lines on the repo
  README.md                         two lines and a link to each skill
  .agents/artifacts/                this repo's own pages: config.json (target
                                    local), local/, remote/, answers/. Ignored
                                    by git since 2026-10-08, all of it
  skills/yourturn/                  the skill, only what runs. An install copies it
    README.md                       for people: what it is, install, trigger more
    SKILL.md                        what agents read
    references/                     authoring.md, components.md
    scripts/                        Node scripts (.mjs)
    dist/                           committed build, 700KB, mostly catalog.mjs:
                                    index.html, _core/* (the viewer), catalog.mjs
    examples/sample-spec.json
  src/yourturn/                     the source, never ships
    AGENTS.md                       the working notes of yourturn
    docs/design.md                  the design
    docs/plan.md                    this file
    package.json                    npm run build, npm test
    vite.config.ts                  two entries, libraries external, builds into
                                    skills/yourturn/dist
    public/index.html               the page template with the pinned import map
    src/                            viewer source (React, TSX)
    test/                           the node:test files of the scripts
```

- The skill the user has installed is a symlink to `skills/yourturn` of this
  checkout. **The working tree is the user's live skill.**
  Never end a session with `SKILL.md` and the scripts out of sync.
- `.tmp/` was not there on 2026-10-08, so the scratch scripts described
  here are gone and a browser check needs new ones or a page the user looks
  at. `.tmp/yt-verify/` at the repo root held the scratch Playwright scripts of
  the browser checks and the specs of pages shown to the user. Their
  screenshots, logs and scratch projects were deleted on 2026-10-07, a run
  makes them again. It is not in git and the user may have deleted it.
  `step2.mjs` to `step5.mjs` are the end to end checks of those steps, run
  with `node step5.mjs`. They need the network and have the Playwright and
  browser paths of one machine hardcoded. `step4.mjs` runs in
  Chromium, Firefox and WebKit. `step1.mjs`, `perf5.mjs` and `lost5.mjs` no
  longer run. The `*-spec.json` files there are the specs of the pages shown
  to the user. A `python3 -m http.server` left over from a crashed run makes
  the next run hang: `pkill -f "http.server 876"` first.
- Work happens on `main`. The branch `next` went with the old history.

### Files that matter

The scripts are in `skills/yourturn/scripts/`, `src/` and `public/` are in
`src/yourturn/`.

| File | What is in it |
|---|---|
| `scripts/create.mjs` | Reads `{ id?, title, spec }` from stdin, checks the structure, the spec rules, the props of every built-in element and the rules of a `Diff`, resolves `source` on `Diff` elements: one file with a `path`, the whole change without. Writes into `local/` or `remote/` by `target` in the config or `--target`, prints `confirm` for a page with a diff from git unless `config.local.json` has `confirmCode: false`. Reads `imports` from `config.json` and the names in the components folder. Writes `entry.json`, copies `dist/_core/` and the components, writes `index.html` from the template. |
| `scripts/open.mjs` | Opens one artifact, waits, writes the answer file, prints the result line. Adds `notices` to that line: the weekly check of `SKILL.md` on `main` and the donation note, with their times in `config.local.json`. Finds the artifact in `local/` or `remote/`, and that folder is the target. Reads `url` from `config.json` or `--url`. `--target local` serves a remote artifact from the machine. Listens on any free port. It is the one-shot loopback server itself: `Host` check, static serving of `index.html`, `entry.json`, `_core/` and `assets/` of the artifact folder, or nothing for a remote target, `/answer` with the token and the "Sent" page as its reply, the timeout and the browser open helper. |
| `scripts/git-collect.mjs` | Git collection. `collectDiff` gives the patches of a change, `collectChange` adds the full old and new contents of each text file, `collectFileContents` does that for one file and applies `contains`. |
| `scripts/select-changes.mjs`, `changes.mjs` | The `contains` filter and the script that lists changes. `changes.mjs` takes `diffSourceSchema` from `dist/catalog.mjs`. |
| `public/index.html` | The page template: the pinned import map, the empty component list, the links to `_core/`. Copied to `dist/` by the build. |
| `src/main.tsx` | App entry, built as `_core/boot.js`. Boots at module top level: session from the fragment, `./entry.json` asked for fresh, the draft store in `sessionStorage` under the page path and `createdAt`. Then submit: `fetch` on the agent's own origin, a form POST from anywhere else, "Copy response" with no session, also after a send that got no answer or a `403`. |
| `src/catalog.ts` | The zod catalog. Also exports `z`, `diffSourceSchema`, `validateSpec` and `resolveElementProps` for the scripts, bundled into `dist/catalog.mjs` by `npm run build`. Nullable props are also optional. |
| `src/components.tsx` | The registry. `Diff` renders one card, or one per file of a whole change inside `.page-files`. At the end: `same` and the wrap that keeps the props of a block until their content changes, `BlockBoundary`, the `renderErrors` list, the loading of the project's components with their prop check, and the wrap of every component. |
| `src/page.tsx` | `Prose`, `CodeCard` (the wrapper of `Code` and `Diff` with the card number) and `Page`, the shell: the player, the outline with the files of a whole change, the comment box and the submit button. Built as `_core/yourturn.js`, so its exports are what a project component can import from `yourturn`. |
| `src/ref-card.tsx` | The lazy chunk behind `CodeCard`: code and diff views with line comments. Its options and notes are memoized, the diff view starts over when it gets new objects. |
| `src/feedback-overlay.tsx` | Images, element screenshots, text comments, and the list that also shows the line comments. Attachment cap 3.5MB at line 8. |
| `src/step-nav.tsx` | The step lists. Their text goes through `Prose`, so it is read aloud. |

### Known problems in today's code

- **A big review loads slowly.** All files are highlighted up front, on the
  main thread. A page with 29 files took 3 seconds warm and 9 seconds cold in
  headless Chromium. The cards show a placeholder meanwhile. The diff library
  has a worker pool and a virtualized view that were not tried.
- **Every change of the state renders the whole page again.** That is how
  json-render works. It costs about 10ms on a page with 29 cards, now that no
  block redoes real work. If it is ever felt, text inputs could write to the
  state on blur or after a pause. The user raised this, it was not needed.
- **Lines of an agent comment are not checked.** `create.mjs` checks the
  `path` of a comment on a whole change, not that its lines exist.
- **A whole change keeps 10MB of file contents at most.** Files past that
  budget, and any file over 1MB, fall back to their patch with no context to
  expand. All of it sits in `entry.json`, which the page loads before it
  shows anything. Moving the snapshot to a file of its own under `assets/`
  was discussed with the user and put off until a big review feels slow.
- **Elements under a `repeat` are checked like any other.** A prop that reads
  `$item` resolves to nothing in `create.mjs` and can fail the check. The
  authoring guide does not document `repeat`.
- **Pages in `site/` are no longer read.** Step 5b replaced that folder with
  `local/` and `remote/`. `open.mjs` tells the agent to create such a page
  again. In this repo the old folder was deleted on 2026-10-07, the answers
  to its pages are still in `answers/`.
- **Moving a page between the folders is a manual step.** The agent moves the
  folder, as `SKILL.md` says. No script does it and nothing checks that a
  page moved to `remote/` was confirmed by the user.
- **Artifacts show up as changes.** `.agents/artifacts/` is untracked, so it
  appears in `git status`, in `changes.mjs` and in a dirty-tree diff review.
  "Setup" in `SKILL.md` writes the `.gitignore` that ends this, but only in a
  project where the user chose not to commit them.
- **The import map versions are kept in sync by hand.** `public/index.html`
  pins what `package.json` installs. Nothing checks that they match.
- **`config.local.json` is read before the wait and written after it.** A change
  made to it during a wait, like `confirmCode`, is overwritten when that
  wait ends with new notice times.
- **No Node version check.** The design asks every script to check for Node 20
  on start. No step lists it yet.
- **Browser open on Windows is untested.** `open.mjs` escapes the `&`
  of the fragment for `cmd`.

### Things already tested, do not redo

These come from the design review on 2026-10-06. Recheck a detail only if it
fails when you build on it.

- **Validation with json-render 0.19.** `validateSpec` from
  `@json-render/core` checks structure. `catalog.validate` does not check props
  and rejects specs that have no `visible` field. A plain zod parse of props
  fails on `{ "$bindState": ... }` values. What works: resolve props against
  `state` with core's `resolveElementProps`, then `safeParse` with the
  component schema.
- **`@json-render/react/schema` does not import React**, so it can be bundled
  for Node.
- **json-render 0.19 has its own error boundary around every element.** It
  renders nothing and logs to the console. A boundary outside of it never sees
  the error. A component gets `element` (type and resolved props) but not the
  element id. Children are React elements keyed by their element id.
- **Form POST from an HTTPS page to `http://127.0.0.1:<port>`** works in
  Chrome, Edge, Brave, Firefox and WebKit. A `fetch` to the same port fails in
  Chromium and WebKit. Chrome and Firefox send `Origin: null` on that POST.
- **esm.sh with `?external=react`** leaves a bare `react` import, and an import
  map then gives one React to htm, json-render and `@pierre/diffs`. The entries
  needed are listed in the design doc. An external package keeps its subpath
  imports bare too, which is why the map has `@json-render/core/store-utils`.
- **Rollup and the two viewer files.** `preserveEntrySignatures:
  "allow-extension"` lets `boot.js` import the shared code from `yourturn.js`.
  Without it Rollup adds a third chunk and `yourturn.js` becomes a shell.
- **Vite rewrites `new URL(..., import.meta.url)`.** The viewer resolves
  component files against `document.baseURI` instead.
- **`@pierre/diffs` 1.4.3 compares by identity.** Its React components render
  a file again from scratch, highlighting included, when `options` differs in
  any key (a new callback counts), when `lineAnnotations` is a new array or
  when `oldFile` or `newFile` is a new object. json-render 0.19 deep-copies
  the props of every element on every render, so these were new every time.
  `onPostRender(node)` in the options fires when the lines are drawn.
- **`@pierre/diffs` from esm.sh** works with highlighting. A page with one diff
  made 242 requests and took about 4 seconds cold.

## Rules for every step

- The user's coding rules apply. They are loaded in every session.
- After changing `src/yourturn/src` or `src/yourturn/public`, rebuild and
  keep `skills/yourturn/dist/` in the change:
  `cd src/yourturn && npm install && npm run build`.
- Run `npm test` in `src/yourturn`. The `node:test` file of a new script goes
  in `src/yourturn/test/` and into the `test` line of its `package.json`.
- Nothing in `skills/yourturn/` may point at `src/`. Users do not have it.
- Check the result in a real browser before calling a step done.
- Update `SKILL.md` and `references/` in the same step that changes behavior.
- Commit only when the user asks.

## Step 1: disk and one-shot open

**Goal.** Pages become files and the daemon goes away. Local target only. The
spec format does not change and libraries stay bundled.

**Build.**

- `scripts/create.mjs`
  - Reads `{ id?, title, spec }` from stdin.
  - Makes the id from the date and title when missing, with `-2`, `-3` and so
    on when taken. Ids match `^[a-z0-9][a-z0-9-]*$`. A given id fails if the
    folder exists.
  - Resolves git-backed diff cards. Move that logic out of `prepareEnvelope`
    in `serve.mjs`.
  - Writes `.agents/artifacts/site/<id>/entry.json` under the project root and
    prints `{"id":"...","path":"..."}`.
  - Validates structure only, with `validateSpec`. Prop checks come in step 2.
- `scripts/open.mjs`
  - Implements "Commands" and "Server rules" in the design doc.
  - Serves the viewer from the skill's `dist/` in this step, since it is still
    11MB. The artifact folder only holds `entry.json`.
  - Reuses the browser open helper from `serve.mjs`.
  - Takes the author from `config.local.json` if present, else `git config user.name`.
  - Writes the answer file, prints the result line and exits. Keeps
    `YOURTURN_TIMEOUT` and exit code `2`.
- Viewer, in `src/main.tsx`
  - Drop `EventSource`, the rounds, the "taken" lock, `final`, the favicon dot
    and the chime.
  - Read the fragment, check `port`, move the session to `sessionStorage`,
    fetch `./entry.json`.
  - Keep a draft of the bound state in `localStorage`. Leave attachments out
    of the draft, they can be megabytes.
  - Submit with a same-origin `fetch` of the urlencoded fields `s` and
    `answer`. With no session show "Copy response".
- Vite config: `base: "./"` and `build.assetsDir: "_yourturn"`. Viewer chunks
  then never collide with the artifact's own `assets/` folder from step 2.
- Fix fresh installs: `npm run build` also bundles `src/catalog.ts` with zod
  into `dist/catalog.mjs`. `catalog.ts` re-exports `z` and every script takes
  zod from that file. Pin the `@json-render/*` versions.
- Diff review mode keeps working through `serve.mjs`. Strip its daemon and SSE
  code and make it speak the new protocol: it serves the diff envelope at
  `./entry.json`, opens the page with the same fragment and takes the result
  on `/answer`. Nothing is saved to disk for it.
- Delete `render.mjs`.
- Docs: `SKILL.md` workflow, result contract and daemon sections. The "fully
  in-memory" and "no FS writes" lines in `CLAUDE.md` and `AGENTS.md`.

**Done when.**

- `create.mjs` then `open.mjs` shows `examples/sample-spec.json` and an
  explainer spec, and submit prints the same result line as before.
- The answer file exists with author and time.
- Killing `open.mjs` mid-way and running it again shows the draft.
- Two `open.mjs` runs can wait at the same time.
- A wrong token gets `403` and the wait continues.
- A diff review request still works through `serve.mjs`.
- `npm test` passes in a clone with no `node_modules`.

## Step 2: the page shell

**Goal.** One page format. See "Spec rules", "What the page shell owns"
and "Assets" in the design doc.

**Build.**

- Catalog: `Page` as the root with `{ overview }`, new `Section`, `Text`,
  `Code`, `Diff` and `Image`. Remove `SubmitButton` and the `password` input
  type.
- `Prose`, generalised from `Sentence`. The player reads `data-sentence`
  elements from the DOM and requeries on each step. Cards set `data-pause`.
- The shell owns the outline, the player, the comment box, the feedback
  overlay and the submit bar.
- Card numbers come from DOM order. Keep the `comment` and `comments` result
  shape.
- One error boundary class. Failed blocks show an error card and go into
  `errors` in the answer.
- `create.mjs`: enforce the spec rules, check props of built-ins, check asset
  paths, resolve `source` on `Diff` elements. An old-format spec gets a clear
  error that names the new format.
- Docs: merge `references/explainer.md`, `slideshow.md` and `catalog.md` into
  one authoring guide, `references/authoring.md`. Keep the writing rules word for word. Update `SKILL.md`
  and `examples/`.

**Done when.**

- A spec with a question in the middle of a section renders and its value is
  in the result.
- Read aloud walks text, card notes and a user-visible pause on cards.
- A spec with a bad prop fails in `create.mjs` with the element id and reason.
- An image in `assets/` shows on the page.

## Step 3: import map viewer

**Goal.** A tiny viewer and user components. See "Import map and user
components" in the design doc.

**Build.**

- Vite: mark React, json-render, zod, htm, `@pierre/diffs` and
  `@renoun/screenshot` as external. Output `boot.js`, `yourturn.js` and one
  stylesheet. Remove the committed grammar chunks from `dist/`.
- `create.mjs`: generate `index.html` with the import map from pinned defaults
  plus `config.imports`, copy the viewer into `_core/` and
  `.agents/artifacts/components/` into `_core/components/`, list component
  names in `index.html`.
- `boot.js`: import the listed components, build the catalog and registry at
  runtime. A user component with a built-in's name replaces it.
- `create.mjs` accepts element types that match a file in the components
  folder.
- `open.mjs` now serves only the artifact folder.

**Done when.**

- An artifact folder opens from any static file server, with no skill present.
- A user component written with htm renders and can use `Prose`.
- The browser loads exactly one React. Check with a hook inside a user
  component and a diff card on the same page.
- `dist/` is a few small files.

## Step 4: remote target

**Goal.** Open from a deployment. See "Config" and "Deployment" in the design
doc.

**Build.**

- `open.mjs`: read `config.json`, `--target`, `--url`. No deploy check, see
  "Commands" in the design doc for why.
- Viewer: the form POST path when the page is not on `127.0.0.1`. The server
  answers with a "Sent, you can close this tab" page.
- "Copy response" shows the hint about logging in and asking the agent to open
  the page again.
- `SKILL.md`: the setup flow that asks the user and writes `config.json` and
  `.agents/artifacts/.gitignore`, and the create, deploy, open order.

**Done when.**

- The form POST path works with the site served from another origin. A second
  static server on a different local port is enough for a first check.
- A real deploy on a real host works end to end in a Chromium browser
  and the real Safari app. The real Firefox app is still untested.
- A remote target with no address fails with a clear message.

## Step 5: fold diff review

**Goal.** One format for everything. The `Diff` block without `contains` shows
the whole change and replaces the `type: "diff"` mode.

This is the largest step. Before coding, agree with the user on the unified
comment and result shape. Today the two modes differ, see `references/diff.md`
and `references/authoring.md`.

**Build.** Move what `DiffReviewView.tsx` does into the `Diff` block, then
remove `serve.mjs`, the `type: "diff"` envelope, `DiffReviewView.tsx` and
`references/diff.md`.

**Done when.** A whole-branch review runs as a normal artifact and nothing
refers to the old mode.

## Step 5b: local and remote folders

**Goal.** Private code never reaches a host by accident. Asked by the user
after step 5, settled through two follow-up pages on 2026-10-07.

**Built.**

- Pages live in `.agents/artifacts/local/` or `.agents/artifacts/remote/`.
  `site/` is gone. A deploy only ever uploads `remote/`.
- `target` in the config keeps its two values. `local` now means local
  first: every page is made in `local/` and one goes to the site only when
  the user asks. `remote` means every page is made in `remote/`.
- `create.mjs` takes `--target` and prints the target. An id is unique over
  both folders.
- `open.mjs` opens a page by the folder it is in. A local page never opens
  remote, the error says to move the folder first.
- `create.mjs` prints `confirm` for a page with a diff read from git. The
  agent then asks before every deploy and names the risk. `confirmCode:
  false` in a person's `config.local.json` stops the question for them.
- A local page becomes remote when the agent moves its folder, then deploys.
- `SKILL.md` setup and workflow, the design doc, `AGENTS.md` and the README.

**Done when.** All of these hold, checked by `npm test` and `step4.mjs`:
a page made with `--target remote` opens from another origin and sends its
answer by form POST, a page in `local/` refuses `--target remote`, and
`confirm` shows up only for a diff from git.

## Step 6: notices

**Goal.** See "Notices" in the design doc.

**Built.** All of it is in `open.mjs`, the viewer did not change.

- The weekly version check against the git tags of the repo, run during the
  wait. `YOURTURN_TAGS_URL` points it at another address, for the tests.
- The donation note, a week after the first answer in a project and then
  every two months. The link is a placeholder.
- `notices` in the result line, made by `open.mjs` only. The times in
  `config.local.json` as `updateCheckedAt` and `donationDueAt`.
- The `SKILL.md` rule for showing them and the `notices` config switch.

**Done when.** Each notice appears once per period, a failed check is silent
and `notices: false` stops both. `npm test` checks all three.

## Step 7: ship only what runs

**Goal.** An install copies `skills/yourturn`. It should hold nothing an
agent could mistake for work to do. Asked by the user on 2026-10-07.

**Built.**

- Source, build config and tests moved to `app/` at the repo root. The build
  writes into `skills/yourturn/dist/`.
- `scripts/` is a real folder and no longer a symlink. `dist/` and
  `examples/` sit next to it.
- `SKILL.md` lost "Maintaining the app bundle" and `authoring.md` lost "Where
  the code lives". Both are in `AGENTS.md` now.
- `components.md` sends agents to the theme block of `dist/_core/style.css`.
  The stylesheet is built unminified so that block keeps its comments, 22KB
  where it was 16KB.

**Done when.** `npm test` passes from `app/`, a page opens in a browser from
the new layout and nothing in the skill folder names `app/`.

## Step 8: a repo for all skills

**Goal.** The repo holds every skill the user builds and yourturn is one of
them. Asked by the user on 2026-10-08. Steps 6 and 7 above say `app/` and
git tags, which is how they were built. This step replaced both.

**Built.**

- `app/` moved to `src/yourturn/`. The skill stays in `skills/yourturn/`, so
  an install, the user's symlinks and the `git pull` hint did not change.
- The working notes of yourturn moved to `src/yourturn/AGENTS.md`. The root
  `AGENTS.md` and `README.md` are a few lines about the repo. The README of
  yourturn is `skills/yourturn/README.md` and ships with an install.
- The update check reads `version` from `skills/yourturn/SKILL.md` on `main`
  of `giuseppeg/skills` and no longer the git tags. A release is a new
  `version` merged into `main`. `YOURTURN_VERSION_URL` points the check at
  another address, for the tests.

**Done when.** `npm run build` and `npm test` pass from `src/yourturn/`, the
build changes nothing in `dist/` and a page opens from the new layout.

## Session log

- 2026-10-06: design agreed and written, this plan written. No code changed.
- 2026-10-06: step 1 built on branch `next`. `npm test` passes (78 tests), also
  in a copy with no `node_modules`. Checked in headless Chromium with
  `.tmp/yt-verify/step1.mjs`: sample and explainer specs, draft after a killed
  wait, wrong token, "Copy response", diff review. The user also submitted the
  sample from a real Brave window opened by `open.mjs`. A submit after the wait
  died now falls back to "Copy response". One addition to the plan:
  `scripts/answer-server.mjs`. Also fixed an older bug: patches of untracked
  files had the absolute path in their header.
- 2026-10-06: step 2 built on branch `next`. The user asked to drop the
  explainer name from the code, so the root is `Page` and the files are
  `page.tsx`, `page.css` and `ref-card.tsx`. The design doc has the decision.
  `npm test` passes (82 tests). Checked in headless Chromium with
  `.tmp/yt-verify/step2.mjs`: sample spec, an input in the middle of a
  section, diff and code cards, a line comment with its card number, an image
  from `assets/`, an error card with `errors` in the answer, the outline and
  the player. Headless Chromium has no voices, so the player ran against a
  stand-in for `speechSynthesis`. The user then listened to a demo page in a
  real browser opened by `open.mjs` and answered "Sounds right".
  Additions to the plan: nullable props became optional, since every example
  leaves them out and the new prop check would reject them. Unknown props are
  rejected. `open.mjs` serves `assets/`. Old artifacts made by step 1 are not
  supported.
- 2026-10-06: step 3 built on branch `next`, not committed yet. The user
  decided four things before the build: the viewer folder in an artifact is
  `_core/` and not `_yourturn/`, the components go in `_core/components/`,
  the import map pins the versions of `package.json` (React 19.2.7), and the
  small on-demand chunks stay next to `boot.js` and `yourturn.js`. The user
  also dropped the capital letter rule, so every `.js` file at the top of the
  components folder is a component, and asked for `references/components.md`
  so an agent can use and write components. The design doc has all of it.
  `npm test` passes (84 tests). Checked in headless Chromium with
  `.tmp/yt-verify/step3.mjs`: a component written with htm that uses a hook,
  `Prose`, a bound prop and a helper from a subfolder, error cards for bad
  props, a missing `render` and a file that does not load, one React version
  with a diff card on the same page, the artifact folder on
  `python3 -m http.server` with "Copy response", and a diff review through
  `serve.mjs`. `step2.mjs` still passes. A cold page with one diff card made
  256 requests in about 3 seconds. Additions to the plan: the page template is
  `public/index.html`, the `dev` script is gone since the viewer no longer
  runs without an artifact, viewer files are served with `no-cache` because
  their names carry no hash, and artifacts made by steps 1 and 2 must be
  created again. The user then opened the test page in a real browser with
  `open.mjs`, picked a plan in the `PriceTable` component, submitted and
  answered "this looks cool". Committed as `f3f9601`.
- 2026-10-06: two changes asked by the user after step 3. The read-aloud
  player now stops at inputs: it says "Your turn", marks the input and waits
  for play. This replaces "Inputs are skipped" in the design doc. The error
  card got squircle corners and a lighter red. Checked in headless Chromium
  with `.tmp/yt-verify/player.mjs`, and `step2.mjs` was updated for the stop.
- 2026-10-06: one theme, asked by the user so a look like the error card is
  standard. The variables at the top of `src/styles.css` are now the only
  source of colours and corners: `--bg`, `--card`, `--fg`, `--text`, `--muted`
  and `--border` are greys, `--accent`, `--success`, `--error` and `--warning`
  are the only hues, `--accent-fg` is text on a fill and `--radius` is the one
  corner size. `--req`, `--text-head` and `--text-body` are gone and so are
  the hardcoded reds, blues and greens. Two visible changes: `--accent` is now
  the blue of what is active and no longer the button fill, so filled buttons
  are `--fg` with `--bg` text and turn light in dark mode, and boxes that had
  12px or 32px corners now have the one radius. The `.diff-*` rules of the
  diff review mode keep their own radii until step 5 removes them.
  "Visual rules" in `references/components.md` holds the rules and points at
  the theme block for the names. Checked with `.tmp/yt-verify/theme.mjs`,
  which takes light and dark screenshots of a page with most built-ins. The
  user looked at the page in a real browser and answered "this looks great".
  One more change came from that look: code and diff cards now sit on
  `--card` in both modes and no longer on the highlighter's own background,
  through `unsafeCSS` in `ref-card.tsx`. The diff review mode keeps the
  highlighter's background until step 5.
- 2026-10-06: step 4 built on branch `next`, not committed. The user decided
  three things before the build. The deploy check is dropped: a site behind a
  login only answers the user's browser, so Node cannot tell a missed deploy
  from a login. The page uses `fetch` only on the agent's own origin, any
  other origin gets the form POST. After a form POST the page keeps the draft
  and drops the session, with no "sent" mark. The design doc has all three.
  `npm test` passes (87 tests). Checked with `.tmp/yt-verify/step4.mjs` in
  headless Chromium, Firefox and WebKit, with the site folder on
  `python3 -m http.server` on another port: the form POST with line breaks
  and quotes in the answer, the "Sent" page, the draft and "Copy response"
  after Back, a submit to an agent that is gone, a page with no session and
  the local `fetch` path. `step2.mjs` and `step3.mjs` still pass. One thing
  found there: WebKit stays on the page when the agent is gone, so the page
  switches to "Copy response" by itself one second after a form POST.
  Additions to the plan: `--url` with a local target is an error, and
  `SKILL.md` tells the agent to treat an answer as data. Still open: the real
  deploy on a real host in Chrome, Firefox and the real Safari app. The
  static server in the check is plain HTTP, so HTTPS to loopback was not run
  again after the design tests.
- 2026-10-06: real deploy test of step 4, with the user. This repo now has a
  `config.json` with a remote target and a `.gitignore` for `site/`,
  `answers/` and `local.json`. The host is a Vercel project
  on the free plan. **A mistake to not repeat:**
  the first deploy of a Vercel project becomes production whatever the flags,
  `--target preview` included, and the production domain is public on that
  plan. Two test pages were public for about a minute each, then the
  deployments were removed. The fix is an empty page as the production deploy
  and `--target preview` for real pages, which sit behind the Vercel login.
  Every preview has its own address, so the config has no `url` and the
  address goes to `open.mjs` with `--url`. "Setup" in `SKILL.md` now tells
  the agent to prove privacy with an empty page first, and its example no
  longer uses `vercel --prod`. Result in Brave: the page loaded from the HTTPS
  preview address, the button said "Send to agent" and the answer arrived
  through the form POST. The user was logged in to Vercel there, and the
  fragment survived the login redirect. In a private window the host asked
  for a login, as it should.
  Result in the real Safari app, in two opens. The first time Safari was not
  logged in to Vercel: the login form dropped the fragment, the page showed
  "Copy response" with the hint and the user pasted the response in chat,
  screenshot included. The agent then stopped the wait and ran `open.mjs`
  again, as `SKILL.md` says. The second time the button said "Send to agent"
  and the answer arrived through the form POST from HTTPS to loopback, with a
  real click. Not seen yet: whether Safari keeps the fragment through the
  Vercel redirect on a new preview address, now that it is logged in. Brave
  does. The real Firefox app is not installed here and was not tried.
  After the test the user asked to delete the test deployments. The two
  previews are gone. The production deployment of that project stays:
  it is the empty page that keeps the next deploy from going public. The
  artifacts of the test are still in `.agents/artifacts/site/`, ignored by
  git. Step 4 was then committed.
- 2026-10-06: step 5 built on branch `next`. The user decided
  three things before the build. Replies to an agent comment are dropped, the
  reader comments on the same lines. The outline lists the file names of a
  whole change under their section, with no counts. The snapshot stays in
  `entry.json`. The answer of a review has the page's shape: `result.comment`
  and `result.comments`. How it works: a `Diff` with a `source` and no `path`
  is the whole change, `create.mjs` fills `files` and `skipped` and the block
  shows one card per file. A renamed file shows both names in its header.
  Gone: `serve.mjs`, `normalize.mjs`, `diff-request-schema.mjs`,
  `answer-server.mjs` (now inside `open.mjs`), `DiffReviewView.tsx`,
  `diff-schema.ts`, `references/diff.md`, their tests and the `.diff-*` rules
  of the old layout. The plan said `normalize.mjs` stays, but it only built
  the anchors of the old view. `create.mjs` now rejects a `Diff` with neither
  or both of `content` and `source`, which was a known problem, and tells a
  `type: "diff"` request what the new format is. "Raw diff review" in
  `references/authoring.md` replaces `diff.md`. `npm test` passes (67 tests,
  fewer than before because the tests of the removed scripts went with them).
  Checked in headless Chromium with `.tmp/yt-verify/step5.mjs`: a change with
  a modified, a renamed, an added and a binary file, the outline, an agent
  comment on its file, a line comment and the overall comment in the answer.
  `step2.mjs`, `step3.mjs` and `step4.mjs` still pass, `step3.mjs` lost its
  `serve.mjs` part. Still open: the user has not looked at a review page in a
  real browser. The user also raised how private code and remote targets go
  together, see "Open question" under "Status".
- 2026-10-06: step 5 committed as `587fa38`, then three changes asked by the
  user after trying a review of 29 files in a real browser, where typing in
  the comment box froze the page. The cause: a keystroke changes the state,
  json-render renders every block again with a fresh copy of its props, and
  the diff view highlights a file again when its objects are new. One key
  cost 1.4 seconds in headless Chromium, measured with
  `.tmp/yt-verify/perf5.mjs`. The fix has two parts. The wrapper of every
  registry component in `components.tsx` keeps the props of a block until
  their content changes, which covers project components too. `ref-card.tsx`
  memoizes the options and the notes it makes itself. A key now costs about
  10ms on the same page, a radio click and a line comment under 100ms. The
  user asked whether a form serialized on submit or text inputs that write
  on blur would be better. Neither was done: the draft, conditions on an
  answer and the result all read the state, and a form would leave a click
  as slow as a key was. Second, a card shows its file name over a pulsing
  placeholder until `onPostRender` of the diff view sets `data-ready` on it.
  Third, `width: "base" | "wide"` on the `Page`: on a wide page the cards take
  the window and text stays at 680px. `step5.mjs` checks the last two.
- 2026-10-06: the user tried the fixed review page in a real browser, 29
  files on a wide page, and answered "yes, but see my comments": typing is
  fine now. Four changes came from that answer. The draft is now saved under
  the page path plus the `createdAt` of the artifact, and a draft another
  artifact left under that path is removed. Before, a page made again with
  the same id showed the old text, and two projects with the same id shared
  a draft on the local port. The form of a line comment keeps its text in
  the textarea until Add, so typing there renders nothing. A file in the
  outline gets a dot in the warning colour when the reader commented on it.
  The feedback list shows the line comments too, and its count includes
  them. They stay in `result.comments`. `step5.mjs` checks all four. Not
  done, the user agreed: encrypting the draft. Still to decide with the user:
  when a draft is cleared (today only after a local send, the user asked for
  after Copy and on closing the page too), and how `SKILL.md` leads a code
  review. The user wants a guided review with the agent's own review first,
  maybe by a subagent, and the raw diff as the lesser path. Open point:
  whether the agent's review is always done or offered.
- 2026-10-06: committed as `c73bd4b`. Then two things the user agreed to.
  Drafts: a draft is removed after "Copy response" too, each one carries the
  time of its last change and a page that opens removes drafts older than a
  week, drafts in the old format included. The user asked for a clear on
  closing the page, which was not done because a page cannot tell a close
  from a reload. `entry.json` is now fetched with `cache: "no-cache"`: on
  `python3 -m http.server` the browser reused the old file for a moment
  after an artifact was made again. Guided review: "Code and PR reviews" in
  `SKILL.md` now says a review page is a guided review, the agent's own
  review always comes first and goes to a subagent when the harness has one,
  the agent asks once before it shows changes it made itself, and the raw
  diff is only for a user who asks for it. `references/authoring.md` follows.
  `npm test` passes (67 tests) and `step5.mjs` passes with 26 checks. Not
  committed.
- 2026-10-06: guided review, settled with the user through an explainer page.
  The question the agent asked before showing its own changes is gone from
  `SKILL.md`: the agent reviews, and a user who wants the raw diff asks for
  it. "PR explainer with review" in `references/authoring.md` is now "Guided
  review". Its five parts stay, a rewrite into three was dropped because it
  came out close to what was there. What changed: a problem is named in "What
  to focus on" with no detail, so the reader does not stop there, it is
  explained in words in the section of its code, and "Verdict" does not tell
  it again but ends with one `Checkbox` per finding that asks what the agent
  should fix. A hard part gets more explanation, never less. No agent has
  run a review with the new wording yet. Not committed.
- 2026-10-07: first guided review, of the uncommitted changes, built the way
  `SKILL.md` says: a subagent reviewed read-only, the main agent checked each
  finding and built the page. It found that the draft clean-up wiped the
  drafts of pages made with an older viewer. From the user's answer and the
  talk after it:
  - Drafts moved to `sessionStorage`. The user's worry was private text left
    in `localStorage`, where any page of the origin can read it later. A
    draft now lives in its tab: it survives a reload, and a page opened again
    is a new tab and starts empty. The expiry, the clean-up loop and its
    three findings are gone. The page removes what older viewers left in
    `localStorage`. A tab whose send gets no answer or a `403` (another wait
    took the port) drops its session and offers "Copy response", checked with
    `.tmp/yt-verify/lost5.mjs`. `SKILL.md`, the hint under the button and the
    design doc say the new rule. `step4.mjs` and `step5.mjs` were updated.
  - "Guided review" in `references/authoring.md` has the user's structure:
    overview, the verdict as first section with the things to be aware of
    only named, one section per thing with its decision right after the card,
    and "Smaller things" at the end. The user acts on a problem when they
    see it, so nothing is held back for a last section. A new or changed
    contract is always shown. Nits are listed once.
  - In `SKILL.md`: "explain" is a plain explainer and "review" a guided
    review. New section "Following up on an answer": when an answer leaves
    things open, the reply is a follow-up page and not a long chat message.
  - Open with the user, asked in the first follow-up page: who reads the
    change (the user fears the subagent reads what the main agent already
    read), the fixed port, and whether a follow-up extends its page.
  `npm test` passes (67 tests), `step2` to `step5` pass. Not committed.
- 2026-10-07: the user answered the first follow-up page. Decided and built:
  - Read the change once. "Code and PR reviews" in `SKILL.md` now has three
    steps: get it reviewed, check the findings, build the page. An agent that
    wrote the change briefs the reviewer and does not read it again. An
    agent that has not seen it lets the reviewer do the reading. The main
    agent only reads the lines a finding points at.
  - The fixed port is gone. `open.mjs` listens on any free port, so every
    wait is an origin of its own. `.tmp/yt-verify/lost5.mjs` needed the fixed
    port and no longer runs.
  - A follow-up is a new page each round and its overview names the page it
    follows. A link to that page was not built: a local wait serves one
    artifact only. In chat the agent says in a line or two what a page is
    for and gives its id, and does not repeat the page.
  - The steps of a `StepNav` are read aloud, they render through `Prose`.
  - A `RadioGroup` sits on a card, so a question stands out from the text.
  The user confirmed the shape of the guided review and that the outline is
  enough, with no links inside text. Commit: "not yet, I will say when".
- 2026-10-07: three more follow-up pages with the user, then step 5b built.
  Small things first. This repo's config is `local` now. The description of
  the skill names when to use a page: a reply that lays out options, needs a
  decision or runs longer than about ten lines. The README has a line users
  can add to their global instructions, under "Make it trigger more". The
  follow-up rule in `SKILL.md` also covers a question asked in chat.
  Then the open question on private code, which is closed. The user proposed
  two folders, `local/` and `remote/`, and chose: two modes with the names
  `local` and `remote`, a confirmation before every deploy of a page with a
  diff read from git, a way to say "do not ask again", the agent moving the
  folder to publish a local page, and building it before notices. See "Step
  5b" above for what was built. `npm test` passes (69 tests). `step2` to
  `step5` pass, `step4` in three browsers with the page in `remote/`. A
  `python3 -m http.server` left over from a crashed run made `step4` hang
  once: kill those before a rerun. Not committed.
- 2026-10-07: the old `site/` folder of this repo was deleted, the build and
  the tests were run once more and everything was committed as `9a19cd1`:
  drafts in `sessionStorage`, no fixed port, the review rules, follow-ups as
  pages and step 5b. The working tree is clean apart from the untracked
  `.tmp/` and `skills/yourturn/temp/`, which were never in git. "Status" at
  the top is the place to start from.
- 2026-10-07: step 6 built on branch `next`, not committed. The approach went
  to the user as a page and came back by "Copy response", the first wait had
  timed out. The user changed two things. The newest version comes from the
  **git tags** of the repo and not from a `latest.json` file. The donation
  note comes a week after first use and then every two months, where the
  design said monthly. A follow-up page settled the details: a pushed tag is
  a release, no GitHub release needed, and the week counts from the first
  answer in a project. The install date of the skill was left out, it would
  come from file dates that a test cannot pin down. The user has no donation
  link yet and asked for a placeholder. The user also asked why the times are
  not in `config.json`: that file is committed and shared, the design doc
  now says so. `open.mjs` prints the answer parsed and written again, where
  it printed the line of the page as it came, so it can drop a `notices`
  field a page sent. `npm test` passes (73 tests). Nothing to check in a
  browser. No real notice was seen yet: the repo is not public and the first
  donation note is a week away.
- 2026-10-07: the user asked six things after step 6 and answered them on a
  page. All of it is in the working tree, not committed.
  - `local.json` is now `config.local.json`, so its name says it is the
    personal half of `config.json`. No project had the file, nothing reads
    the old name.
  - Step 7, see above: the skill folder holds only what runs and the source is
    in `app/`.
  - Deleted: `docs/yourturn-diff-review.md` and
    `docs/yourturn-runtime-and-project-extensions.md`, `src/tts.js`,
    `test/ssr.tsx`, the `react` skill of json-render in `.agents/skills/`
    with `skills-lock.json`, the third-party clone in `skills/yourturn/temp/`
    and everything in `.tmp/` but the check scripts, their specs and
    `vercel-placeholder`. Kept on the user's word: the answers of pages that
    no longer exist.
  - The counter of the read-aloud player is gone, like "48 / 51". The user
    called it useless.
  - The name stays yourturn. It is free on npm and no project in the agent
    space uses it. The skills directory itself was not searched.
  - `examples/sample-spec.json` was checked and is in today's format.
  `npm test` passes from `app/` (73 tests). `step2` to `step5` in
  `.tmp/yt-verify` pass against the new layout, `step4` in three browsers.
  `step2.mjs` and `step3.mjs` were updated for the new paths and the counter.
- 2026-10-07: committed as `147e16d`. Then the component test the user asked
  for. A fresh subagent that read only the skill folder got a request a user
  would make: signups as a bar chart from an npm package, as a component to
  reuse. It wrote `BarChart.js` around `recharts` 3.10.1, added the package
  to `imports` and `create.mjs` passed on the first run. In headless
  Chromium the page drew the chart with one React, no error card and no
  console error, the answer came back, and bars and labels took the theme
  colours in light and dark mode. Checked with `component.mjs` and
  `component-dark.mjs` in `.tmp/yt-verify`, the project is
  `.tmp/component-test`. Not a clean docs-only run: the harness gave the
  subagent the repo's `CLAUDE.md`. Fixed from its report, in
  `references/components.md`: `?external=react` is not enough for a package
  that imports `react-dom`, esm.sh then loads a second `react-dom`. The
  subagent only got it right from the template comment in `dist/index.html`.
  The docs now say to list every import map name and how to check. Also a
  pinned version in the example, how a library gets theme colours as props,
  and `className` in the htm example. `SKILL.md` names `imports` in the
  setup keys. Left open from the report: the packages a package depends on
  are picked by esm.sh when the page loads, so a page can change later.
  Nothing says how a component reads a data file from `assets/`. An agent
  cannot check a component without a browser, `create.mjs` accepts one whose
  import has no entry. An id from a title with an apostrophe reads
  `last-week-s-signups`. Not committed.
- 2026-10-08: the user looked at the chart component of the test on a page
  in a real browser and answered "It shows and looks right". The page was an
  explainer made in `.tmp/component-test` with the open points of the test
  as questions. Built from the answer, not committed:
  - `create.mjs` reads the import lines of every `.js` file in the components
    folder and fails when one names a package the import map does not have.
    It looks at static `import` and `export ... from` lines only.
  - An apostrophe in a title leaves no dash in the id.
  - `components.md` says a component reads a data file with
    `fetch("assets/rows.json")`. Checked in headless Chromium against
    `open.mjs`, with `.tmp/yt-verify/component-data.mjs`.
  `npm test` passes (74 tests).
  The user also asked to look for a way to pin the dependencies of a package.
  Found and tried in headless Chromium: `?bundle` on the esm.sh address
  builds the package and its dependencies into one file, here
  `https://esm.sh/recharts@3.10.1?bundle&external=react,react-dom,react-is`
  with `react-is` pinned by an entry of its own. The page then made 53
  requests where it made 165, and the chart drew with one React. The file is
  served as immutable, but esm.sh makes no promise to never build it again,
  so this is close to pinned and not a guarantee. Fully pinned means the
  590KB file in the components folder, which `create.mjs` copies into every
  page, and its import of `/node/process.mjs` has to be rewritten by hand.
  Listing every dependency in `imports` with `*` in the address is a
  lockfile written by hand. The user agreed to the first: `components.md`
  now tells an agent to add `bundle` for a package with dependencies and
  names the copy in the project as the strict way. Committed, without the
  formatting an editor left in `open.mjs`.
- 2026-10-08: two changes outside the plan, from a session in which the user
  asked to have a topic explained. Committed as `c42c0c5`, before `47e1724`.
  - The skill description. The agent had answered "explain me how X works"
    in chat, because it weighed the page against the user's rule for short
    chat replies. The description now names explaining a topic outright,
    also one that had to be researched, and says a wish for short replies is
    a reason to use a page.
  - The voice hint. On a Mac with no natural voice the player shows "Better
    voice?" with the steps to install one. Found on a Mac where
    Zoe is installed: Chromium lists a Premium voice by its bare name with
    no mark of its quality, so the check goes by the names of the voices
    that only exist as a download, and an enhanced Samantha cannot be told
    from the plain one. Chrome lists its own online voices before the ones
    of the Mac, so the check waits for a local voice. Safari does not list
    downloaded voices at all, so there the hint shows until it was opened.
    The user chose to show it once: opening it sets a cookie and the hint is
    gone for good, in every browser. A cookie, because a local page is on a
    new port each time and ports share nothing else.
  The formatting an editor left in `open.mjs` was restored, the user chose
  that.
- 2026-10-08: the release points and step 8. The donation link is
  `https://github.com/sponsors/giuseppeg`. The user wants this repo to hold
  all their skills, named `giuseppeg/skills`. The plan went to the user as
  the page `2026-10-08-skills-monorepo-plan` and four things came back: the
  update check reads `SKILL.md` on `main` (over prefixed tags like
  `yourturn-v0.2.0` or no check at all), the README of yourturn is in the
  skill folder, the notes of yourturn are in an `AGENTS.md` next to its
  source, and the source folder is `src/yourturn` where the page proposed
  `source/yourturn`. See "Step 8". The install line is
  `npx skills add giuseppeg/skills --skill yourturn`, the flag was checked
  against the help of the skills CLI. Also asked in that answer: the
  feedback buttons at the bottom right now look like the read-aloud player,
  a see-through pill with a blur and round buttons with a light fill on
  hover. The picking state keeps its dark fill. `npm test` passes (74
  tests). `.tmp/` is gone, so no headless check was run. The user looked at
  the buttons on the page `2026-10-08-skills-monorepo-done` in a real
  browser and answered "Looks right". Commit: "Not yet". The user sets up
  the remote later and wants to check a few things on their own first.
  Then the user had both `CLAUDE.md` symlinks removed: Claude reads
  `AGENTS.md` now.
- 2026-10-08: the docs, after a second page. They moved from `docs/` at the
  root to `src/yourturn/docs/` as `design.md` and `plan.md`, since the next
  skill will have its own. The design got a light pass and no rewrite: its
  summary says what yourturn is and no longer what it will become, and
  "Order of work" and "Docs to update when this lands" are gone, both were
  done. Older entries of this log still name the old paths and "Order of
  work". This file got its first paragraph and lost the names of the user's
  folders and of the Vercel project. The user chose one squashed first
  commit for the public repo, so the history of this checkout stays local.
  The user also took `.agents/artifacts/` out of git: the root `.gitignore`
  lists the whole folder, so this repo's setup with its deploy line, its
  pages and its answers stay on the machine.
- 2026-10-08: the history started over, on the user's word. `.git` was
  removed and the working tree became one first commit on `main`, 46 files.
  A merge of `next` into `main` first was dropped as pointless, it would
  have gone with `.git`. The hashes in this log and in "Status" are from the
  old history. The remote is still to be set up by the user.
