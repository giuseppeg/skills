# Yourturn: notes and decision log

Working notes, not documentation. `design.md` next to this file says how
yourturn works. This file holds what is still open, what was already tested
and the decisions with their reasons, so a later reader can tell why
something is the way it is. To use the skill read
`skills/yourturn/README.md`.

An AI agent built yourturn over several sessions in October 2026. "The user"
is the author of the skill.

## Not tried yet

Worth doing before a release.

- A real deploy with the new folders: a page made in `remote/`, the question
  before source code goes up, and a local page moved to `remote/`. The two
  folders were only checked with a static server on another local port, in headless
  Chromium, Firefox and WebKit.
- A code review by an agent in a fresh session. The guided review wording in
  `SKILL.md` and `references/authoring.md` was used once, by the agent that
  wrote it. Its shape changed after that run: the verdict moved to the front
  and each decision sits right after its card.
- How often the description makes the skill trigger. It was sharpened on
  2026-10-08 for a topic the user wants explained and softened the same day
  for other people, see the log. Neither was tried in a fresh session.
- The voice hint in Safari and Firefox. It was only seen in headless Chrome
  Canary, with Zoe taken out of the voice list by a script.
- The real Firefox app.

Seen by the user in a real browser: a review of 29 files, the guided review,
follow-up pages with step lists, choices on a card and the feedback list, a
chart component from an npm package and the feedback buttons.

## Known problems

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
- **Pages in `site/` are no longer read.** That folder held every page until
  2026-10-07, when `local/` and `remote/` replaced it. `open.mjs` tells the agent to create such a page
  again.
- **Moving a page between the folders is a manual step.** The agent moves the
  folder, as `SKILL.md` says. No script does it and nothing checks that a
  page moved to `remote/` was confirmed by the user.
- **Artifacts show up as changes.** `.agents/artifacts/` is untracked, so it
  appears in `git status`, in `changes.mjs` and in a dirty-tree diff review.
  "Setup" in `SKILL.md` writes the `.gitignore` that ends this, but only in a
  project where the user chose not to commit them.
- **The import map versions are kept in sync by hand.** `public/index.html`
  pins what `package.json` installs. Nothing checks that they match.
- **No test opens a page.** The tests cover the scripts. A change that breaks
  the viewer passes all of them.
- **The check runs after a push to `main` too**, where a new `version` is
  already a release. There it reports a stale `dist/`, it does not stop it.
  A pull request is checked before.
- **`config.local.json` is read before the wait and written after it.** A change
  made to it during a wait, like `confirmCode`, is overwritten when that
  wait ends with new notice times.
- **No Node version check.** The design asks every script to check for Node 20
  on start. It is not built.
- **Browser open on Windows is untested.** `open.mjs` escapes the `&`
  of the fragment for `cmd`.

## Already tested, do not redo

These come from the design review on 2026-10-06 and from the build. Recheck a
detail only if it fails when you build on it.

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

## Decision log

Oldest first. Each entry says what was chosen and why, and what was turned
down where something was. Add to the end.

### 2026-10-06: artifacts on disk

- **Pages are files and the daemon is gone.** `create.mjs` writes an artifact
  folder and `open.mjs` is a one-shot server for one page. Each wait has its
  own server, so several agents can wait at once. Given up: tab reuse, the
  event stream, the chime and the favicon dot.
- **The scripts take zod from the built `dist/catalog.mjs`.** `node_modules`
  is not committed, so a fresh install could not run them before.
- **A submit after the wait died falls back to "Copy response".** The answer
  is never lost with the agent.
- **The root is `Page` and not `Explainer`.** The user asked to drop the
  explainer name from the code. A page usually explains something but it can
  be any artifact.
- **A nullable prop can be left out, an unknown prop is an error.** Every
  example leaves the optional ones out, and a misspelled prop should fail in
  `create.mjs` and not show up as a missing feature in the browser.
- **The viewer folder of an artifact is `_core/`**, with the project's
  components in `_core/components/`. `_yourturn/` was the first name. The
  subfolder keeps a component file from overwriting a viewer file.
- **The import map pins the versions of `package.json`**, so the page runs
  what the build was typed against.
- **Every `.js` file at the top of the components folder is a component.** A
  rule based on a capital first letter was dropped: a file named the wrong
  way would be skipped without a word.
- **No dev server.** The viewer does not run without an artifact. Its files
  are served with `no-cache` because their names carry no hash.
- **The read-aloud player stops at an input.** It says "Your turn", marks the
  input and waits for play. Skipping inputs was the first design.
- **One theme.** The variables at the top of `styles.css` are the only source
  of colours and corners. `--accent` is the blue of what is active and not a
  button fill, filled buttons are `--fg` with `--bg` text. Code and diff
  cards sit on `--card` and not on the highlighter's own background.

### 2026-10-06: remote pages

- **No deploy check.** A site behind a login only answers the user's browser,
  so Node cannot tell a missed deploy from a login page.
- **`fetch` only on the agent's own origin, a form POST from anywhere else.**
  A deployed HTTPS page cannot `fetch` loopback, a top-level navigation can.
- **After a form POST the page keeps the draft and drops the session.** It
  cannot learn the outcome and the token is used up. WebKit stays on the page
  when the agent is gone, so the page switches to "Copy response" by itself a
  second after the POST.
- **`--url` with a local target is an error**, as is a remote target with no
  address.
- **An answer is data.** `SKILL.md` tells the agent so, since a shared page
  can carry the words of someone else.
- **A private site is proven private before a real page goes up.** Learned
  from a real deploy: the first deploy of a Vercel project becomes production
  whatever the flags, and the production domain is public on the free plan.
  Two test pages were public for about a minute. The fix is an empty page as
  the production deploy and `--target preview` for real pages. "Setup" in
  `SKILL.md` has the rule.
- **A login can cost the session.** A browser that is already logged in to
  the host keeps the fragment through the redirect, seen in Brave. A login
  form drops it, seen in Safari. The page then offers "Copy response" with a
  hint, and the next open works.

### 2026-10-06: one format for reviews

- **The diff review mode folded into the `Diff` block.** A `Diff` with a
  `source` and no `path` is the whole change, one card per file.
- **No replies to an agent comment.** The reader comments on the same lines.
- **The outline lists the files of a whole change**, with no counts and with
  a dot on a file the reader commented on.
- **The snapshot stays in `entry.json`.** A file of its own under `assets/`
  was put off until a big review feels slow.
- **A review answers in the shape of any page**: `result.comment` and
  `result.comments`.
- **A block keeps its props until their content changes.** Typing froze a
  review of 29 files: a keystroke changes the state, json-render renders
  every block again with a fresh copy of its props, and the diff view
  highlighted every file again. One key cost 1.4 seconds and costs about 10ms
  now. Turned down: a form serialized on submit and text inputs that write on
  blur. The draft, conditions on an answer and the result all read the state,
  and a form would leave a click as slow as a key was.
- **A card shows its file name over a placeholder** until the diff view says
  its lines are drawn.
- **`width: "wide"` on the `Page`** lets cards take the window while text
  keeps its reading width.
- **The form of a line comment keeps its text in the textarea until Add**, so
  typing there renders nothing.
- **The feedback list shows the line comments too.** It then holds everything
  that goes to the agent. They stay in `result.comments`.
- **`entry.json` is fetched with `cache: "no-cache"`.** A plain static server
  let the browser reuse the file of an artifact made again under the same id.
- **A review page is a guided review.** The agent's own review always comes
  first, by a subagent when the harness has one. The raw diff is only for a
  user who asks for it. A question before the agent shows its own changes was
  written and removed again.

### 2026-10-07: drafts, reviews and follow-ups

- **Drafts live in `sessionStorage`.** What a reader typed can be private,
  and `localStorage` keeps it readable by any later page of the origin. A
  draft survives a reload and goes with its tab. The price: a page opened
  again starts empty. The expiry and the clean-up of the first version went.
  Not done: clearing on close, since a page cannot tell a close from a
  reload, and encrypting the draft, since the key would sit next to it.
- **A tab that lost its agent offers "Copy response".** That is a send with
  no answer or a `403` because another wait took the port.
- **No fixed port.** It only existed so a draft in `localStorage` survived a
  killed wait. Any free port makes every wait an origin of its own.
- **The shape of a guided review.** Overview, then the verdict with the
  things to be aware of only named, then one section per thing with its
  decision right after the card, then "Smaller things". The user acts on a
  problem when they see it, so nothing is held back for a last section. A
  new or changed contract is always shown. Nits are listed once.
- **The change is read once.** An agent that wrote it briefs the reviewer and
  does not read it again. One that has not seen it lets the reviewer read.
  The main agent only reads the lines a finding points at.
- **"Explain" is a plain explainer, "review" is a guided review.**
- **A follow-up is a page.** When an answer leaves things open the reply is a
  new page and not a long chat message, and its overview names the page it
  follows. A link back was not built: a local wait serves one artifact only.
- **The steps of a `StepNav` are read aloud** and a `RadioGroup` sits on a
  card, so a question stands out from the text.
- **The description says when to use a page**: a reply that lays out options,
  needs a decision or runs longer than about ten lines. The README has a line
  users can add to their own agent instructions.

### 2026-10-07: local and remote folders

- **Pages live in `local/` or `remote/`.** A page with a diff from git holds
  whole source files. While all pages shared one folder, a deploy uploaded a
  page that was only meant to be opened locally. Now a deploy only names
  `remote/`.
- **`target: "local"` means local first.** A page goes to the site only when
  the user asks, and then the agent moves its folder. No script does it.
- **The agent asks before every deploy of a page with a diff from git.**
  `confirmCode: false` in a person's `config.local.json` ends the question
  for them.

### 2026-10-07: notices and what ships

- **Notices travel in the result line and the agent shows them.** After an
  answer the user looks at the agent and not at the tab.
- **The donation note comes a week after the first answer in a project, then
  every two months.** The design said monthly. The install date of the skill
  was left out as a start, it would come from file dates a test cannot pin.
- **The notice times are in `config.local.json`.** `config.json` is committed
  and shared: every answer would change a tracked file and one person's note
  would use up the two months for everyone.
- **`open.mjs` prints the answer parsed and written again**, so it can drop a
  `notices` field a page sent. A notice must not be forgeable.
- **The newest version came from git tags.** Chosen over a `latest.json`
  file, replaced on 2026-10-08.
- **The skill folder holds only what runs.** An install copies it, and an
  agent that finds source and a `package.json` there may try to build it.
  The stylesheet is built unminified so `components.md` can point at its
  theme block, 22KB where it was 16KB.
- **No counter in the read-aloud player**, like "48 / 51". The user called it
  useless.
- **The name stays yourturn.** It is free on npm and nothing in the agent
  space uses it.

### 2026-10-07 and 08: project components

A fresh agent that read only the skill folder wrote a chart component around
`recharts`. What came out of it:

- **`external` names every import map entry a package imports.**
  `?external=react` is not enough for one that imports `react-dom`, esm.sh
  then loads a second copy.
- **`create.mjs` fails when a component imports a package the import map
  does not have.** An agent cannot check a component without a browser. It
  reads static `import` and `export ... from` lines only.
- **A package with dependencies takes `?bundle`.** esm.sh then builds them
  into one file, 53 requests where the page made 165. It is close to pinned
  and not a promise. Fully pinned is a copy of that file in the components
  folder, 590KB in every page. A list of every dependency in `imports` would
  be a lockfile written by hand.
- **A component reads a data file with `fetch("assets/rows.json")`.**
- **An apostrophe in a title leaves no dash in the id.**

### 2026-10-08: the voice hint

- **On a Mac with no natural voice the player shows "Better voice?"** with
  the steps to install one.
- **The check goes by the names of the voices that only exist as a
  download.** Chromium lists a Premium voice by its bare name with no mark of
  its quality, so an enhanced Samantha cannot be told from the plain one.
  Chrome lists its online voices first, so the check waits for a local one.
- **The hint is shown once.** Opening it sets a cookie and it is gone for
  good. A cookie, because a local page is on a new port each time and ports
  share nothing else. Safari does not list downloaded voices at all, so there
  it shows until opened.
- **The description names explaining a topic outright**, also one that had to
  be researched, and says a wish for short chat replies is a reason to use a
  page. An agent had answered "explain how X works" in chat for that reason.

### 2026-10-08: a repo for all skills

- **The repo is `giuseppeg/skills` and yourturn is one folder in it.** The
  skill stayed in `skills/yourturn/`, so an install did not change. Its
  source moved from `app/` to `src/yourturn/`, with its own `AGENTS.md` and
  these docs. The next skill gets the same.
- **The README of yourturn is in the skill folder** and ships with an
  install. It is for people and GitHub shows it to whoever opens the folder.
  The worry behind "only what runs" was source and a `package.json`.
- **The newest version is the `version` of `SKILL.md` on `main`.** Tags are
  shared by a whole repo, so each skill would need a prefix like
  `yourturn-v0.2.0` and a tag to remember on every release. `main` is what
  an update delivers, so that file names exactly the version one gets. The
  price: a new `version` on `main` is a release at once. Also turned down:
  no update check at all.
- **The donation link is the GitHub sponsors page of the author.**
- **The feedback buttons look like the read-aloud player**: a see-through
  pill with a blur and round buttons with a light fill on hover. The `+`
  keeps its dark fill while picking an element, or nobody could tell that
  picking is on.
- **No `CLAUDE.md` next to `AGENTS.md`.** Claude reads `AGENTS.md`.
- **This repo's own pages are not in git.** `.agents/artifacts/` is in the
  root `.gitignore`, with its setup and its answers.
- **This file replaced the plan.** The step by step plan and its session log
  were cut down to this log once every step was built.

### 2026-10-08: before the first release

- **MIT license.** With no license nobody may use or copy a public repo.
- **The description no longer asks for a page on every long reply.** It names
  explanations, reviews and replies that lay out options or need a decision.
  "Longer than about ten lines" suited the author and would open a tab too
  often for a stranger. Who wants that adds the line from "Make it trigger
  more" in the README to their own agent instructions.
- **The README says what a stranger should know before installing**: the
  libraries come from a CDN that runs code in the page, one network call a
  week, the donation note and how to turn the last two off.
- **A GitHub action checks every push and pull request**: a build from the
  lockfile must leave `dist/` unchanged, and the tests must pass on Node 20,
  the lowest version the scripts support. A release is a new `version` on
  `main` with no step in between, so a forgotten build would ship a stale
  viewer.
- **The title of a diagram has the colour of a heading**, `--fg`. It had the
  colour of a paragraph.
