# yourturn

An agent skill that renders an on-the-fly UI so a person can complete a step
mid-task, then hands the answer back to the agent. The agent writes a
[json-render](https://json-render.dev/) spec, the user fills the form in their
browser and submits, and the result comes back as JSON. Each page is saved as
an artifact folder under `.agents/artifacts/` in the project, so it can be
opened again later.

## Install

Installed with the [skills](https://www.skills.sh/docs) CLI:

```bash
npx skills add giuseppeg/skills --skill yourturn
```

This makes the `yourturn` skill available to your AI agent. No build or extra
setup is needed, the UI ships prebuilt.

## When it triggers

The skill is meant to be used by an agent (or another skill) when it needs
richer input from the user than a short chat reply, for example:

- collecting several fields or choices at once (a form)
- letting the user pick, fill or review values in a real UI
- any step where a yes/no/ok answer in chat is not enough

When triggered, the agent writes a UI spec to disk and starts a small local
server, the user's browser opens the page in a new tab, they submit, and the
agent resumes with their answers.

It is not used for simple confirmations, those stay in chat.

### Make it trigger more

Until an agent loads a skill it only sees its name and description. If you
want pages more often, add a line like this to your global agent
instructions, for example `~/.claude/CLAUDE.md`:

```
When a reply would lay out options, need me to decide something or run longer
than about ten lines, use the yourturn skill and answer with a page.
```

## How it works

```
spec   agent ──stdin──► create.mjs ──► .agents/artifacts/local/<id>/   (or remote/<id>/)
page   agent ──► open.mjs <id> ──► browser tab
answer browser tab ──HTTP──► open.mjs ──stdout──► agent
```

See [`SKILL.md`](SKILL.md) for the workflow and
[`references/authoring.md`](references/authoring.md) for the spec format and
components.
