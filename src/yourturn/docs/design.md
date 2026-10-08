# How yourturn works

## Status

Everything here is built, except "Later, not designed", which is a list of
ideas. The decisions behind it, with their dates and what was turned down,
are in `notes.md` next to this file.

The three browser assumptions this design rests on were tested on 2026-10-06.
They held, with caveats listed in "What was verified".

## Summary

Each page is an **artifact**: a folder on disk holding a JSON file and a small
static viewer. The folder can be opened locally or deployed to any static
host. The answer always comes back to the agent through a local loopback
server and is saved on disk, outside the deployed folder.

Every artifact is one page with the same shape, written with the explainer
writing rules. A `Page` is the root of every spec. Everything else in the
catalog, including forms and user-made components, is a block inside it.

The first yourturn was a local daemon that pushed an in-memory spec to a
browser tab and waited. Its pages were gone after submit and only worked on
the machine that made them. Where this doc says what was given up or what a
choice replaced, that daemon is what it compares with.

## Decisions

- The catalog, the JSON spec and json-render stay. They are what makes the
  component library extensible.
- The explainer writing rules in `SKILL.md` and `references/authoring.md` apply
  to every artifact, unchanged.
- The code does not call a page an explainer. A page usually explains
  something but it can be any artifact, so the root component is `Page` and no
  file, type or CSS class is named after one use of it.
- Artifacts are not encrypted. The deployment service handles access control.
- The answer goes from the browser to a server on `127.0.0.1`. The secret in
  the URL is a one-time token that proves the answer came from the page the
  agent opened. It is not an encryption key.
- Deployments are fully static. There is no remote endpoint in this version.
- User components are plain ES modules in a project folder, loaded through an
  import map. A spec never names a URL or any code.
- Building the deployment is out of scope. The agent deploys with whatever the
  user already has (Vercel, Cloudflare and so on).
- Answers stay local for now. They are never part of a deployment.
- Each open is a new browser tab. There is no tab reuse and no daemon.
- Libraries load from a CDN by default. Offline use needs vendored copies.
- Whether artifacts and answers are committed to git is the user's choice.
- Remote submit relies on browsers allowing a form POST to loopback. If that
  ever closes, "Copy response" is the accepted fallback.
- Config and state are per project, under `.agents/artifacts/`. Nothing is
  written outside the project.
- Update and donation notices are shown by the agent, not by the page.
- The skill folder holds only what runs: `SKILL.md`, the references, the
  scripts, an example and the built viewer. An install copies that folder, and
  an agent that finds source and a `package.json` there may try to build it.
  The source, the build config and the tests are in `src/yourturn/`. The one
  thing in the folder that does not run is a `README.md` for people, which
  GitHub shows to whoever opens the folder.
- The repo holds all of the author's skills, `giuseppeg/skills`, and yourturn
  is one folder under `skills/`. Chosen on 2026-10-08.
- The scripts stay in Node with no dependencies to install, minimum Node 20. No
  language ships on macOS, Windows and Linux alike, and Node lets the scripts
  share the validation code with the viewer. Each script checks the Node
  version on start and says what to install if it is missing or too old.

## Goals

- One artifact format in the explainer style, with inputs anywhere on the page.
- Artifacts and answers persist on disk and can be reopened later.
- The same artifact opens locally or from a deployment, chosen by config.
- Users can add components without rebuilding or forking the skill.
- The viewer is a few small files and loads libraries through an import map.

## Non-goals

- Answers from a phone or a coworker reaching the agent. A page with no live
  session offers "Copy response" instead.
- Storing answers remotely and the answer history view. See "Later".
- Encrypting artifacts or answers.
- Loading code named by a spec.

## How it flows

```
agent ── spec ──▶ create.mjs ──▶ .agents/artifacts/local/<id>/ or remote/<id>/
                                        │
                                        │ remote only: the agent deploys remote/
                                        ▼
agent ── open.mjs <id> ──▶ browser tab at <base>/<id>/#port=<port>&s=<token>
              ▲                               │
              │                               │ the user reads, answers and submits
              └──── POST http://127.0.0.1:<port>/answer ◀──┘
        saves the answer to disk and prints one JSON line
```

`<base>` is `http://127.0.0.1:<port>` for a local target and the deployment URL
for a remote one.

## Files on disk

```
.agents/artifacts/
  config.json               project config, committed
  config.local.json         per person, always ignored by git
  components/*.js           user components, committed
  .gitignore                written by the setup flow
  local/                    pages that stay on the machine, never deployed
    <id>/                   one self-contained static site per artifact
      index.html            generated: import map, component list
      entry.json            the artifact
      assets/               optional files the page uses, like images
      _core/                a copy of the viewer
        components/         a copy of the user components
  remote/                   the deployable site, nothing else goes in here
    <id>/                   the same, for a page that is deployed
  answers/                  never deployed
    <id>/<answer id>.json   one file per answer
```

The folder sits at the project root, which is the git top level, or the current
directory outside a repo.

Everything yourturn owns in a project is under this one folder. Projects belong
to different people and organisations, so nothing is stored per machine.

Each artifact folder carries its own copy of the viewer and the user
components. An old artifact keeps rendering the way it did, whatever changes
later in the skill or the components. The copies are a few small files once
libraries load through the import map.

Pages live in two folders so that local means local. A page with a diff read
from git holds whole source files. While all pages shared one folder, a
deploy uploaded that folder, and a page that was only opened locally went up
with the next remote one. Now a deploy command only ever names `remote/`.
The folder a page is in says how it opens, and an id names one page across
both. A page moves from one to the other by moving its folder.

Answers live next to `remote/` and not inside it, so that `remote/` can be
deployed as is. Every deploy tool has a different ignore mechanism and some
have none, so keeping answers or local pages out by ignoring them would not
be reliable. With folders of their own there is nothing to ignore.

Whether these folders are committed is the user's call. The setup flow asks and
writes the matching lines to `.agents/artifacts/.gitignore`. That file sits
outside `remote/`, because some deploy tools skip what a `.gitignore` in the
deployed folder lists.

## Artifact format

```ts
type Artifact = {
  version: 1;
  id: string; // folder name: lowercase letters, digits and dashes
  title: string;
  createdAt: string; // ISO time
  spec: Spec; // json-render flat spec, fully resolved
};

// .agents/artifacts/answers/<artifact id>/<answer id>.json
type Answer = {
  id: string; // file name: compact UTC time plus the author, like 20261006T104512Z-g
  author: string; // author from config.local.json, or git user.name
  at: string; // ISO time
  result: Json; // the bound state: inputs, comment and line comments
  feedback: { attachments: Attachment[] };
  // Blocks that failed to render or had bad props. This is how the agent
  // learns about a broken user component.
  errors: { element: string; message: string }[];
};
```

"Fully resolved" means git-backed diff cards are snapshotted at create time.
`create.mjs` replaces `source` with the file contents, so a replay never reads
git. The agent writes no code into a spec, only the `source` that points at
it.

A `Diff` with a `source` and no `path` is the whole change. `create.mjs` puts
every changed text file into that one element as `files`, each with its full
old and new contents, and the block shows one card per file. Files with no
lines to show, like a binary, are named in `skipped`. A file over the size
limit carries only its patch. This is what a raw diff review is: a page with
one such `Diff`, and no mode of its own.

### Assets

An artifact is a small site, so it can carry files. After `create.mjs` prints
the artifact path, the agent copies images or data files into its `assets/`
folder. A spec refers to them by relative path, like `assets/before.png`.

- A new built-in `Image` component with `{ src, alt, caption }` shows one.
- A path prop must be relative and stay inside `assets/`. `create.mjs` rejects
  absolute paths, `..` and URLs with a scheme. This keeps every artifact
  self-contained and stops a spec from making the page load a remote address.
- Assets are deployed with the artifact, so they are as readable as the page.

### Spec rules

- The root element is `Page` with `{ overview?: string | null, width?:
  "base" | "wide" | null }`. On a wide page the code and diff cards take the
  width of the window and the text keeps its reading width.
- Its children are `Section` elements with `{ heading: string }`.
- A section's children are blocks. A block is any other catalog component:
  `Text`, `Code`, `Diff`, `DiagramFlow`, `Slideshow`, the layout components,
  every input and every user component.

So a section and each of its blocks is a real element of the spec.

```json
{
  "title": "What changed in auth",
  "spec": {
    "root": "page",
    "state": { "merge": "yes" },
    "elements": {
      "page": {
        "type": "Page",
        "props": { "overview": "I moved **token checking** out of the HTTP layer." },
        "children": ["why", "risk"]
      },
      "why": { "type": "Section", "props": { "heading": "Why I changed it" }, "children": ["t1", "d1"] },
      "t1": { "type": "Text", "props": { "text": "Auth was tied to the request object." } },
      "d1": {
        "type": "Diff",
        "props": { "path": "src/auth.ts", "note": "The middleware shrinks to one call.", "source": { "mode": "dirty-tree" } }
      },
      "risk": { "type": "Section", "props": { "heading": "One thing to decide" }, "children": ["t2", "q1"] },
      "t2": { "type": "Text", "props": { "text": "Old tokens stop working after this." } },
      "q1": {
        "type": "RadioGroup",
        "props": { "label": "Ship it now?", "options": ["yes", "after the migration"], "value": { "$bindState": "/merge" } }
      }
    }
  }
}
```

Inputs sit where the question comes up. The agent's recommended answer is the
seed value in `state`.

A prop the catalog marks as nullable can also be left out, so a spec only
names the props it uses.

### What the page shell owns

- The big picture box, the section outline and the read-aloud player. Under
  a section the outline also lists the files of a `Diff` that shows a whole
  change, with a dot on a file the reader commented on.
- The "Anything to add?" box and line comments on `Code` and `Diff` cards. The
  result has a `comment` and a `comments` field. A card's `card` number
  is its position among the card wrappers in the DOM.
- The feedback overlay (images, element screenshots, text comments). Its list
  also shows the line comments, so it holds everything that goes to the
  agent. They stay in `comments` of the result.
- The submit bar at the end. `SubmitButton` leaves the catalog and specs no
  longer include one.

The player reads the page from the DOM instead of from props, so it works with
any block.

- `Text`, headings and card notes render through one shared `Prose` component.
  It lives in `page.tsx`. It splits sentences
  and gives each one a `data-sentence` attribute.
- The steps of a `StepNav` render through `Prose` too, so they are read.
- The player queries those elements again on every step, because blocks load
  lazily. It marks the active one by toggling a class.
- A card wrapper sets `data-pause` with the milliseconds to wait after its note.
- An input sets `data-stop` and says "Your turn" through `data-sentence`. The
  player announces it and stops, and play goes on from the next sentence.
  Inputs in a row are one stop. `yourturn.js` exports both attributes as
  `stop`, so a user component with an input can do the same.
- A user component that wants its text read aloud uses the same `Prose`.

## Commands

```bash
# Validate, resolve git diffs, write the artifact folder.
cat spec.json | node scripts/create.mjs [--target local|remote] [--code-ok]
# prints {"id":"...","path":"...","target":"...","confirm"?:true}

# Open an artifact, wait for the answer, save it, print it.
node scripts/open.mjs <id> [--target local|remote] [--url <base>] [--no-open]
```

`create.mjs` reads `{ id?, title, spec }` from stdin. Without an `id` it makes
one from the date and the title, and adds `-2`, `-3` and so on when that is
taken. A given `id` is never changed, it fails if the folder exists. Making
the folder is what claims the id, so two runs at once never share one. It exits
`1` with the exact error so the agent can fix the spec before any browser
opens.

Validation, tested against json-render 0.19:

- Structure with core's `validateSpec`, then the spec rules above.
- Every element type is a built-in or a file in the components folder.
- Props of built-ins: resolve them against `state` with core's
  `resolveElementProps`, then `safeParse` with the component's zod schema made
  strict, so a misspelled prop is an error too. `catalog.validate` cannot be
  used, it does not check props.

`open.mjs` is a one-shot server.

1. Find the artifact in `local/` or `remote/`. The folder is the target.
   `--target local` serves a remote artifact from the machine, for a look
   with no deploy. A local artifact never opens remote. A remote one with no
   address fails, from `url` in the config or `--url`, and so does `--url`
   for a local one.
2. Listen on `127.0.0.1`, on any free port, and make a one-time token of 32
   random bytes. Every wait is then an origin of its own in the browser. A
   fixed port was tried first while drafts lived in `localStorage`, so a
   draft survived a killed wait. Drafts live in the tab now, see "The
   viewer", and the fixed port went.
3. Open the browser at `<base>/<id>/#port=<port>&s=<token>`. For a local target
   it also serves that one artifact folder. For a remote one it serves nothing.
4. Wait for a valid `POST /answer`, write the `Answer` file, print the result
   line and exit.

`open.mjs` does not check that a deploy happened. Only the browser holds the
login of a protected site, so Node would see a `401` or a login page and learn
nothing, and a host that hides a private site behind a `404` would make a
check fail for no reason. The page cannot report back either, it reaches
loopback only with the submit. The proof of a deploy is the exit code of the
deploy command, which the agent has just run. If one is missed anyway, the
user sees the 404 page of the host and tells the agent.

What a script with no login can tell is the opposite: a site that hands it
the page hands it to anyone. So before it opens a remote page, `open.mjs`
asks the site for `entry.json` of that page. If it gets the artifact back it
exits `1` and says the page is public, unless the config has `public: true`.
A login page, a `401` and a `404` all let it go on. Two limits: the check
runs after the upload, and it sees only the address it opens. A host can
serve the same site at a second address that is public, as Vercel does with
the production domain.

The result line is the `Result` type in "Notices". The exit codes are `0` for
an answer, `1` for an error and `2` for a timeout. Each open has its own
server, so several agents can wait at the same time.

Reopening an old artifact is the same `open.mjs <id>` call.

## The viewer

```ts
// Parsed from location.hash as URLSearchParams.
type Fragment = {
  port?: string; // loopback port of the waiting open.mjs, must match /^\d{1,5}$/
  s?: string; // one-time token
};

type Session =
  | { status: "live"; port: string; token: string } // submit posts to the agent
  | { status: "none" }; // nobody is listening: show "Copy response"
```

The viewer is two files so user components can import from it without a
module cycle. `boot.js` starts the page. `yourturn.js` exports what components
share, like `Prose`. Next to them sit a few small chunks that load on demand,
because the views that need a heavy library must stay behind a dynamic import.

Boot order:

1. Read the fragment. Reject a `port` that is not digits. Without this check a
   crafted link like `port=1234@evil.com` would post the answer and the token
   to another host.
2. Move `port` and `s` to `sessionStorage` under a key that includes the page
   path, and strip them from the URL. This keeps them out of history and
   bookmarks. It does not hide them from code running in the page.
3. Fetch `./entry.json`, with `cache: "no-cache"` so the content of an
   artifact made again under the same id is not taken from the cache of the
   browser. This covers `entry.json` only. `open.mjs` serves the viewer files
   with `no-cache` too, another host follows its own cache rules.
4. Import the user components listed in `index.html` and build the catalog and
   registry from the built-ins plus those.
5. Render. Restore the draft saved in `sessionStorage` under the page path
   and the `createdAt` of the artifact. Every change saves the draft again.
   The draft lives in its tab and goes with it. It survives a reload, and it
   is removed after a send the page saw succeed and after "Copy response".
   It is not in `localStorage` because what a reader typed can be private,
   and whatever stays there can be read later by any page of the origin. For
   a local page that is a port any program can take. The price: a page the
   agent opens again is a new tab and starts empty, so a reader whose tab
   lost the agent is sent to "Copy response". The page also removes the
   drafts older viewers left in `localStorage`. The draft is not encrypted:
   the key would sit next to it.

Submit, with a live session:

- **Page served by the agent**, so its origin is `http://127.0.0.1:<port>`: a
  same-origin `fetch` POST to `/answer`. The page shows "Submitted" or the
  error and clears the draft on success. When nothing answers, or the server
  answers `403` because another wait got the port since, the page drops the
  session and offers "Copy response".
- **Page served from anywhere else:** a top-level form POST to
  `http://127.0.0.1:<port>/answer`. The server replies with a small "Sent. You
  can close this tab." page. The viewer cannot learn the outcome, so it keeps
  the draft and drops the session, since the token is used up. A reader who
  comes back finds their answers and "Copy response". The same goes for a
  browser that could not reach the agent and stayed on the page.

The test is the whole origin and not the host name. An artifact on any other
local static server is also on `127.0.0.1`, and a `fetch` from there to the
agent's port is cross-origin: the answer arrives but the page cannot read the
reply.

Both send the same urlencoded body with the fields `s` and `answer`, so the
server has one path. With no session the submit bar shows "Copy response",
which copies the same JSON the agent would have printed.

Every change of the state makes json-render render every block again, each
with a fresh copy of its props. A block that hands a prop to a library would
make it start over on every keystroke, as the diff view did with its files. So
the wrapper around every registry component keeps the props a block has until
their content changes. This holds for user components too.

A code or diff card shows its file name over a placeholder until its lines are
drawn. Loading the diff library and highlighting takes seconds on a big review.

A block that fails to render or has bad props shows an inline error card and is
added to `errors` in the answer. The rest of the page still works. This needs a
React error boundary, which has to be a class. It is the one class allowed in
the viewer.

json-render wraps every element in its own boundary, which renders nothing and
only logs. So ours wraps each registry component, inside that one. json-render
also does not tell a component which element it renders, so the viewer puts
the id on each element when it loads the spec. That id is what `errors` names.

### Why a form POST

A deployed HTTPS page cannot `fetch` a server on `127.0.0.1`. Chrome blocks it
behind a local network permission and Safari blocks it as mixed content. A
top-level navigation is not covered by those rules today. It is the same
pattern CLI logins use to hand a result to a local server.

### Server rules

- Every route checks that the `Host` header is `127.0.0.1:<port>`. This stops
  DNS rebinding from reading artifacts.
- Static serving is an allowlist: `index.html`, `entry.json` and the files
  under `_core/` and `assets/` of the one artifact being opened.
- `/answer` compares the token in constant time over equal-length buffers.
  It always replies with the "Sent" page, which the `fetch` of a local page
  ignores.
- A wrong token gets a `403` and the wait goes on. The first valid answer wins,
  then the server exits.
- The body cap must fit screenshots after urlencoding. It is 20MB and
  attachments alone can be 3.5MB.
- There is no `Origin` check. On a navigation from HTTPS to HTTP, Chrome and
  Firefox send `Origin: null`.

Any web page can send a form POST to a local port, so the token is the real
gate. It is 256 random bits, lives only in the fragment and dies with the
server.

## Config

`.agents/artifacts/config.json`. If it is missing the skill asks the user once
and writes the file. It asks whether pages open locally or from a deployment,
how to deploy if remote, and whether artifacts and answers are committed to
git. A request in the user's prompt overrules the config for that run.

The config is per project because each project can belong to a different
person or organisation, with its own deploy target and rules.

```ts
// config.json: shared by everyone on the project
type Config = {
  // Where create.mjs puts a page. "local" is local first: every page stays on
  // the machine and one goes to the site only when the user asks. "remote":
  // every page is deployed.
  target: "local" | "remote";
  // A command or plain instructions for the agent. It must publish
  // .agents/artifacts/remote as a static site and nothing else, for example
  // "deploy with vercel to the artifacts project". A local setup can have
  // one too, for the pages the user asks to publish.
  deploy?: string;
  url?: string; // base URL of that site
  public?: boolean; // true when the user said anyone may read the site
  imports?: Record<string, string>; // merged over the default import map
  notices?: boolean; // default true, false turns off the update check and the donation note
};

// config.local.json: one person's state, never committed
type Local = {
  author?: string; // name saved with answers, default git user.name
  // false when this person said not to be asked again before a page with
  // source code is deployed
  confirmCode?: boolean;
  updateCheckedAt?: string; // ISO time of the last version check
  donationDueAt?: string; // ISO time from which the next donation note is shown
};
```

## Deployment

**What is deployed.** The `.agents/artifacts/remote/` folder, as is, as a
static site.
There is no build step, no server code and no environment variable. Every
artifact is then at `<url>/<id>/`. All paths inside an artifact are relative,
so the site can also live under a subpath.

**What the host must do.** Serve `index.html` for a folder path, serve `.js`
files with a JavaScript content type and use HTTPS. Any static host does this.

**Who deploys.** The agent. The scripts never deploy and never check a
deployment. For a page in `remote/` the agent runs `create.mjs`, follows
`config.deploy`, stops if that fails, then runs `open.mjs`.

**Source code asks first.** A page with a diff read from git holds whole
files of the repo. `create.mjs` refuses to write one into `remote/`: it exits
`1` and tells the agent to ask the user where the code may go, then to run
it again with `--code-ok` or with `--target local`. In `local/` such a page
prints `confirm`, for the day the agent is asked to move it to `remote/`. A
user who says not to ask again gets `confirmCode: false` in their own
`config.local.json`, and both are off for them. A page with only pasted code
does not ask.

This is a stop and not a lock. The agent deploys with a shell, so no code of
the skill can keep one from uploading what it wants. The stop makes sure an
agent cannot skip the question by forgetting it. One that reads the error
and adds the flag without asking is not caught. A confirmation the user
clicks in the browser would catch that, see "Later, not designed". During
setup the skill helps the user pick a service, creates the project with the
user's own CLI and saves `deploy` and `url` in the config.

**The URL.** `config.url` is the stable address of the site. Some hosts give
every deploy a new address. The agent then passes the address it got from the
deploy command with `--url`.

**What a deploy contains.** Every artifact in the folder, so old links keep
working. Hosts that upload by content hash only send the new files. To take an
artifact down, delete its folder and deploy again.

**Who can read it.** Whoever the host lets in. An artifact holds the code shown
on the page, and a git-backed diff card holds the whole old and new file so the
reader can expand context. Answers are never in a deployment. Access control is
the host's job, for example a login in front of the project.

**Login and the session.** If opening the page sends the user through a login
form, the fragment with the port and the token is usually lost on the way back.
The page then shows "Copy response" and a hint to ask the agent to open it
again. Every page with no session shows that hint. Once the browser holds the host's login cookie the problem is gone.

## Notices

After an answer the user's attention is back on the agent and not on the
browser tab. So notices travel in the result line and the agent shows them.

```ts
// The one JSON line open.mjs prints
type Result = {
  type: "form";
  version: 1;
  result: Json;
  feedback: { attachments: Attachment[] };
  errors: { element: string; message: string }[];
  notices?: string[]; // ready-made sentences for the user
};
```

`SKILL.md` tells the agent to show each notice to the user as written, at the
end of its reply, and to do nothing else with it. Notices never change what the
agent does with the answer.

- **Update available.** `SKILL.md` already has a `version` field. At most once
  a week `open.mjs` fetches `skills/yourturn/SKILL.md` from `main` of the repo
  on `raw.githubusercontent.com`, with a one second timeout, and reads its
  `version`. If it is newer it adds a notice with the new version and how to update: `git
  pull` when the skill folder is `skills/yourturn` of a git checkout, `npx
  skills update` otherwise. A skill copied into a project sits inside that
  project's repo, which is why a checkout alone is not enough. A failed check
  is silent and still counts for the week.
- **Donation.** One line with a donation link, first a week after the first
  answer in a project and then every two months. The link is a constant in
  `open.mjs`.

A release is a new `version` in `SKILL.md`, merged into `main`. Nothing else
has to be kept in sync: `npx skills update` and `git pull` both deliver what
is on `main`, so that file names exactly the version an update gives. The
price is that a new `version` on `main` is a release at once. A `latest.json`
file was the first plan and git tags the second, chosen on 2026-10-07. Tags
went on 2026-10-08, when the repo became one for all skills: they are shared
by the whole repo, so each skill would need a prefix and a tag to remember
on every release.

The check runs while `open.mjs` waits for the answer, so it never delays the
page or the result. The two times are written when the result line is
printed: a wait that timed out showed nothing and uses up nothing.

A notice is text an agent repeats to the user, so it must not be forgeable.
Only digits and dots of the version line get into the sentence. `open.mjs` builds
the list itself and drops a `notices` field the page sent.

The two times live in `config.local.json`, so the periods are counted per person
and project. They are not in `config.json` because that file is committed
and shared: every answer would change a tracked file, and one person's note
would use up the two months for everyone. `notices: false` in the config
turns both off. The version check and the check of a remote page against
its own site are the only network calls the scripts make on their own.

Old artifacts are not touched by an update, each one keeps its own viewer copy.

## Import map and user components

The viewer's own code is built with Vite, but React, json-render, zod,
`@pierre/diffs` and `@renoun/screenshot` are marked external. What ships is
two small scripts, a few on-demand chunks and one stylesheet, about 60KB in
all. The 11MB of committed syntax grammar chunks left the repo.

The pinned defaults live in the page template, `src/yourturn/public/index.html`.
`create.mjs` copies it into the artifact as `index.html`, merges
`config.imports` over its import map and fills in the component list. The
versions are the ones in `package.json`, so the page runs what the build was
typed against:

```html
<script type="importmap">
  { "imports": {
      "react": "https://esm.sh/react@19.2.7",
      "react/jsx-runtime": "https://esm.sh/react@19.2.7/jsx-runtime",
      "react-dom": "https://esm.sh/react-dom@19.2.7?external=react",
      "react-dom/client": "https://esm.sh/react-dom@19.2.7/client?external=react",
      "zod": "https://esm.sh/zod@4.4.3",
      "htm/react": "https://esm.sh/htm@3.1.1/react?external=react",
      "@json-render/core": "https://esm.sh/@json-render/core@0.19.0?external=zod",
      "@json-render/core/store-utils": "https://esm.sh/@json-render/core@0.19.0/store-utils?external=zod",
      "@json-render/react": "https://esm.sh/@json-render/react@0.19.0?external=react,zod,@json-render/core",
      "@json-render/react/schema": "https://esm.sh/@json-render/react@0.19.0/schema?external=react,zod,@json-render/core",
      "@pierre/diffs/react": "https://esm.sh/@pierre/diffs@1.4.3/react?external=react,react-dom",
      "@renoun/screenshot": "https://esm.sh/@renoun/screenshot@0.3.3",
      "yourturn": "./_core/yourturn.js"
  } }
</script>
<script type="application/json" id="components">["PriceTable"]</script>
<script type="module" src="./_core/boot.js"></script>
```

Two details of the map come from testing. A package marked external keeps its
subpath imports bare, so `@json-render/react` needs the `store-utils` entry.
And two entries of one package take the same `external` list, or esm.sh builds
their shared chunk twice.

The import map is the seam. `config.imports` can point any entry at another
CDN, a private registry or files vendored into the site. The React entries must
move together, or the page ends up with two Reacts.

A user component is one file in `.agents/artifacts/components/`. Every `.js`
file at the top of that folder is a component and the file name is its type,
whatever its case. A rule based on capital letters was dropped: a file named
the wrong way would be skipped without a word. Helpers go in a subfolder.
`create.mjs` copies the whole folder into `_core/components/` of the artifact,
so files can import each other and helpers. The subfolder keeps a component
file from overwriting a viewer file of the same name.

```js
// .agents/artifacts/components/PriceTable.js
import { z } from "zod";
import { html } from "htm/react";

export const description = "Table of plans with prices. Use it to compare options.";

export const props = z.object({
  rows: z.array(z.object({ plan: z.string(), price: z.number() }))
});

export function render({ props }) {
  return html`<table>
    ${props.rows.map((r) => html`<tr><td>${r.plan}</td><td>${r.price}</td></tr>`)}
  </table>`;
}
```

- htm gives JSX-like templates with no build step. Babel in the browser was
  rejected: it is about 3MB and does not transform imported files.
- A component from a package or a registry is a one-line file that re-exports
  it, with the package added to `imports`.
- A user component with the name of a built-in replaces it. `create.mjs` prints
  which ones were replaced.
- A user component follows the same look as the built-ins. The viewer has one
  small theme, the variables of the `:root` block in `styles.css`, which the
  build keeps readable in `dist/_core/style.css`: greys for the page, a
  hue only for accent, success, error and warning, four tones that only tell
  groups apart, and one radius. They switch
  with light and dark mode. `references/components.md` has the visual rules
  and sends the agent to that block for the names, so the list lives in one
  place.
- The agent learns the user components by reading these files. There is no
  generated catalog doc. The contract and the steps to write one for the user
  are in `references/components.md`.
- Props of user components are checked in the browser only. A file that does
  not load, a missing `props` or `render` export and bad props all show an
  error card. Each reaches the agent through `errors` in the answer.

### Trust

Code only enters the page from the skill, the config and the components folder.
All three are things the user owns and reviews like any project code.

A library CDN is a third party running code in the page. It can read the
artifact, and since it can read the token it can also post a forged answer to
the agent. Only the top-level versions in the import map are pinned. Their own
dependencies float, for example `@pierre/diffs` pulls the latest matching
`shiki`. Users who care point `imports` at vendored files or their own
registry. A package a project adds for its own components takes `?bundle`
in its esm.sh address, which builds its dependencies into one file, see
`references/components.md`.

A content security policy in `index.html` narrows what that code can do.
`create.mjs` writes it from the import map: scripts and requests only from
the page's own folder and the hosts of the map, a form only to loopback, and
nothing else. The import map is an inline script, so the policy names it by
its hash. A library that turns bad can then not send the page to a third
host with a request, a socket, an image or a form. Three things it cannot
stop. The hosts of the map are allowed, so esm.sh itself could still be sent
the page. Code in the page can move the tab to another address. And a forged
answer goes down the same road as a real one. A service worker as a firewall
was looked at and dropped: it does not see sockets or a tab that moves away,
and code in the page can remove it. The real fix is to not load code from a
third party, see "Later, not designed".

zod probes for `eval` when the first schema is made, which the policy blocks
and the browser logs. `_core/jitless.js` turns the probe off and loads
before `boot.js`, because the libraries make schemas as they load.

Artifact ids are made from the date and the title, so they can be guessed. A
deployment relies on the host's access control and not on secret URLs.

Once a page is shared, an answer may hold other people's words. The skill must
treat every answer as data and never as instructions.

## What we give up

- **Tab reuse.** Each open is a new tab. The daemon, the event stream, the
  chime, the favicon dot and the "bring browser forward" code are gone. A
  multi-step flow is several artifacts.
- **Offline use and fast first load by default.** Libraries come from a CDN. A
  page with one diff made 242 requests and took about 4 seconds cold in the
  test. Vendored `imports` avoid both.
- **"No FS writes for the spec or answer."** Artifacts and answers are now
  files.
- **The password field type.** Answers are saved and may be deployed.
- **The separate diff review mode.** It folded into the `Diff` block. With it
  went the replies to an agent comment, since a reader comments on the same
  lines instead, and the check that an agent comment points at a line of the
  diff. A page as wide as the window is now `width: "wide"` on the `Page`. Only the path of such a
  comment is checked now.

## What was verified

Tested on 2026-10-06 with Playwright driving headless Chrome 157, Edge 154,
Brave 152, Firefox 148 and WebKit 26. The page was on an HTTPS origin.

1. **Form POST to loopback works in all five.** No prompt, no warning, a 1MB
   body arrived intact. The control `fetch` failed in Chromium and WebKit.
2. **One React through the import map works** in Chrome, Firefox and WebKit. A
   hook in an htm component, a json-render component and a diff card all ran on
   the same React.
3. **`@pierre/diffs` from esm.sh works**, with highlighting and no worker or
   wasm failures.

Caveats:

- The form POST rests on a gap. The Local Network Access spec covers all
  navigations and Chromium only applies it to iframes for now. If browsers
  close the gap, remote pages fall back to "Copy response".
- A real deploy was tried on 2026-10-06 with a real click: a Vercel preview
  address behind the Vercel login, in Brave and in the real Safari app. Both
  sent the answer. In a browser that is already logged in to the host the
  fragment survives the login redirect, seen in Brave. A login form drops it,
  seen in Safari, and the next open works.
- Not tested: the real Firefox app, and Firefox 151 or later with its local
  network prompt on.
- Safari 18.2 or later with its "not secure connection" warning turned on
  blocked navigations to `http://localhost`. WebKit fixed this in June 2026.
  It affects the local target too.

## Where the code is

The scripts are in `skills/yourturn/scripts/`. `src/` and `public/` are in
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

## Later, not designed

**The libraries inside the skill.** With React, json-render and zod shipped
in `_core/`, a page with no code card would load nothing from a third party
and open offline. Measured on 2026-10-08: 588KB minified for those, 147KB
gzipped, where `_core/` is 80KB today. They would be built once and copied
like the rest of `_core/`, nothing is bundled when a page is made. The diff
view is the problem: with its grammars it is 11MB in 399 files, too much to
copy into every page, and the pages that need it are the ones that hold
source code. So this only helps once the diff view has an answer too, like
one copy for all pages of a site or a short list of languages.

**A click before code goes up.** A page with code would always be made in
`local/`, and a script would open a small page that says where the code
would go and move the folder only after the user pressed the button. An
agent cannot fake that click.

**Early check of user component props.** Split a component into a schema file
and a render file so `create.mjs` can load the schemas in Node and fail before
the browser opens. Only worth it if errors arriving with the answer are too
late in practice.

**No runtime to install.** Packaging the scripts so they run without Node on
the machine, with a tool like https://github.com/vercel-labs/scriptc. Not
evaluated yet.

**Answer history.** Each answer file already records who answered and when. The
viewer could list them and let the reader pick one to overlay on the page.
Publishing would be a deliberate step that copies chosen answers into the
artifact folder before a deploy, so it needs no backend. Open points: how
answers from several people merge when each has their own local folder.
Committing the answers folder to git is one option, and one file per answer
keeps that free of merge conflicts.

**Answers from another device.** A phone or a coworker cannot reach the agent's
loopback server. This needs a small remote store the agent polls. Only then
does the secret become an encryption key, so the store never sees plain
answers.

## Open questions

None. The untested browser cases are listed in "What was verified".
