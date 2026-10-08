# yourturn — working notes

Agent skill that renders an on-the-fly browser UI to collect input mid-task,
then returns the answer to the agent. The UI is a json-render spec, saved as an
artifact folder under `.agents/artifacts/` in the user's project. How it
works is in `src/yourturn/docs/design.md`. What is open, what was already
tested and why things are the way they are is in
`src/yourturn/docs/notes.md`.

## Layout

`skills/yourturn/` is what an install copies, so it holds only what runs:
`SKILL.md`, `references/`, `scripts/`, `examples/` and the built `dist/`, plus
a `README.md` for people and a copy of the root `LICENSE`. Keep the two
license files the same. The source of the viewer, the build config and all
tests are in `src/yourturn/`, which never ships. Nothing in the skill folder
may point at `src/`.

- `src/yourturn/src/catalog.ts`: component names, descriptions and prop schemas.
- `src/yourturn/src/components.tsx`: the React implementations and bindings.
- `src/yourturn/src/page.tsx`: the page shell, the player and `Prose`.
- `src/yourturn/src/styles.css`: the theme variables at the top, then the built-ins.
- `src/yourturn/src/main.tsx`: bootstrap, spec fetch, submit transport.
- `src/yourturn/public/index.html`: the page template with the import map.
- `src/yourturn/test/`: the `node:test` files of the scripts.

## Build (only after editing `src/yourturn/src` or `src/yourturn/public`)

```bash
cd src/yourturn && npm install && npm run build
```

Rebuilds `skills/yourturn/dist/` (`index.html`, the viewer in `_core/` and `catalog.mjs`) — commit all of it.

## Run / test

```bash
echo '<spec>' | node skills/yourturn/scripts/create.mjs   # writes the artifact, prints its id
node skills/yourturn/scripts/open.mjs <id>                 # opens it, exits on submit
echo '<spec>' | node skills/yourturn/scripts/create.mjs --target remote   # a page for the deployed site
node skills/yourturn/scripts/open.mjs <id> --url <site>    # opens the deployed copy of a remote page
```

Result prints to stdout. Add `--no-open` for headless. `npm test` in
`src/yourturn` runs the script tests.

## Working rules

- `design.md` is the source of truth. If it is wrong or stale, fix it and
  tell the user. A decision goes at the end of the log in `notes.md`, with
  its reason and what was turned down.
- Change `SKILL.md` and `references/` in the same change that changes
  behavior. An installed skill can be a symlink to this checkout, and then
  the working tree is live.
- Run `npm test` in `src/yourturn`. The test file of a new script goes in
  `test/` and into the `test` line of `package.json`.
- Check the result in a real browser before calling a change done.
- When a reply lays out options or needs a decision, make it a yourturn page
  with the scripts of this repo and keep the chat message to a line or two.
- Commit only when the user asks.

## Conventions

- `dist/` is committed (zero-install); rebuild after any `src` change. Libraries
  are not bundled. The page loads them through the import map in
  `public/index.html`, so a new library needs an entry there and in `external` of
  `vite.config.ts`. Keep the versions there equal to `package.json`. Views that need
  a heavy library (diffs, screenshots) stay behind `React.lazy` / dynamic `import()`.
- A spec is untrusted data, never code. Built-in components are added by editing
  `catalog.ts` + `components.tsx` and rebuilding. A project adds its own as files in
  `.agents/artifacts/components/`, see `references/components.md`.
- Every colour and corner in the CSS comes from the theme variables at the top of
  `src/styles.css`: greys for the page, a hue only for accent, success, error and
  warning, four tones that only tell groups apart, one `--radius` with
  `corner-shape: squircle`. No colour values anywhere
  else. The rules are in "Visual rules" of `references/components.md`, which points
  at that block in the built `dist/_core/style.css` instead of listing the
  variables. That is why the stylesheet is built unminified, comments included.
- Every page has a content security policy, written by `create.mjs` from the
  import map. A new kind of thing the page loads, like a font or a worker,
  needs a line there. `public/_core/jitless.js` is a file the build only
  copies, it must load before `boot.js`.
- `create.mjs` copies `dist/_core/` and the project's components into every
  artifact, so an artifact is a static site of its own and `open.mjs` serves only
  that folder.
- Artifacts go to `.agents/artifacts/local/<id>/` or
  `.agents/artifacts/remote/<id>/` and answers to
  `.agents/artifacts/answers/<id>/`. Nothing is written outside the project.
  `remote/` is the only folder a deploy uploads, so a page in `local/` never
  leaves the machine. The folder a page is in says how `open.mjs` opens it.
- `open.mjs` never deploys and cannot check that a deploy happened. It does
  check that a remote page is not public: a site that gives it the page with
  no login stops it, unless the config has `public: true`. For a page in
  `remote/` it serves nothing and waits for the form POST of the deployed
  page. `create.mjs` writes a page with a diff from git into `remote/` only
  with `--code-ok`, which says the user was asked. The
  setup of a project is `.agents/artifacts/config.json`, written by the agent
  from "Setup" in `SKILL.md`.
- Notices are sentences `open.mjs` adds to the result line, for the agent to
  show: a newer version and a donation note. The newest version is the `version` in
  `skills/yourturn/SKILL.md` on `main` of the public repo, so a release is a
  new `version` merged into `main` and nothing else. Their times
  are in `.agents/artifacts/config.local.json`, one person's file that git ignores.
- The scripts need no install. They take zod from `dist/catalog.mjs`, never
  from `node_modules`.
