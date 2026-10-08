import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { JSONUIProvider, Renderer } from "@json-render/react";
import { createStateStore, type Spec, type StateModel, type UIElement } from "@json-render/core";
import { registry, renderErrors } from "./components";
import { FeedbackOverlay, type FeedbackAttachment } from "./feedback-overlay";
import { SubmitProvider, type SubmitState } from "./submit";
import "./styles.css";

// What ./entry.json holds, written by create.mjs. `spec` is the json-render
// flat Spec (root id + elements map + optional seed `state`).
type Entry = { version: 1; id: string; title: string; createdAt: string; spec: Spec };

type Session =
  | { status: "live"; port: string; token: string } // submit posts to the agent
  | { status: "none" }; // nobody is listening: show "Copy response"

// The agent opens the page with #port=<port>&s=<token>. Both move to
// sessionStorage and leave the URL, so they stay out of history and bookmarks.
const sessionKey = `yourturn:session:${location.pathname}`;
if (location.hash.includes("s=")) {
  sessionStorage.setItem(sessionKey, location.hash.slice(1));
  history.replaceState(null, "", location.pathname + location.search);
}
const fragment = new URLSearchParams(sessionStorage.getItem(sessionKey) ?? "");
const port = fragment.get("port") ?? "";
const token = fragment.get("s") ?? "";
// Digits only. A crafted link like port=1234@evil.com would otherwise post the
// answer and the token to another host.
let session: Session = /^\d{1,5}$/.test(port) && token ? { status: "live", port, token } : { status: "none" };

// Asked for again on every load. A static server lets the browser reuse the
// file for a while, and an artifact made again under the same id would then
// show the old page with the old draft.
const entry: Entry = await fetch("./entry.json", { cache: "no-cache" }).then((res) => {
  if (!res.ok) throw new Error(`could not load entry.json: ${res.status}`);
  return res.json();
});
document.title = entry.title;
// json-render does not tell a component which element it renders. The error
// card of a failed block names it, so each element carries its own id.
for (const [id, el] of Object.entries<UIElement & { id?: string }>(entry.spec.elements)) el.id = id;

// The bound state is kept as a draft, so a reload loses nothing. Attachments
// stay out of it, they can be megabytes. It lives in sessionStorage and goes
// with the tab: what a reader typed can be private, and whatever stays in
// localStorage can be read later by any page of this origin, which for a
// local page is a port any program can take. So a page the agent opens again
// is a new tab, on a port of its own, and starts empty.
//
// An id can come back while the tab is open, when its folder was deleted and
// made again. The draft belongs to one artifact, so the time that one was
// made is in its name.
const draftKey = `yourturn:draft:${location.pathname}:${entry.createdAt}`;
const draft: StateModel | null = JSON.parse(sessionStorage.getItem(draftKey) ?? "null");
const store = createStateStore(draft ?? entry.spec.state ?? {});
store.subscribe(() => sessionStorage.setItem(draftKey, JSON.stringify(store.getSnapshot())));
// Older viewers kept drafts in localStorage. What they left there goes.
for (const key of Object.keys(localStorage)) {
  if (key.startsWith("yourturn:draft:")) localStorage.removeItem(key);
}

// favicon: a "Y" mark
const icon = document.createElement("canvas");
icon.width = icon.height = 32;
const ctx = icon.getContext("2d");
if (ctx) {
  ctx.fillStyle = "#ccff00"; // neon so the tab pops on light and dark tab bars
  ctx.beginPath();
  ctx.roundRect(2, 2, 28, 28, 7);
  ctx.fill();
  ctx.fillStyle = "#171717";
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Y", 16, 17);
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = icon.toDataURL("image/png");
  document.head.appendChild(link);
}

function App() {
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });
  const [attachments, setAttachments] = useState<FeedbackAttachment[]>([]);

  function doSubmit(result: unknown) {
    const answer = JSON.stringify({ type: "form", version: 1, result, feedback: { attachments }, errors: renderErrors });
    const onError = (err: unknown) => setSubmit({ status: "error", message: String(err) });
    if (session.status === "none") {
      navigator.clipboard.writeText(answer).then(() => {
        setSubmit({ status: "copied" });
        // The response is in the clipboard now. A change after this starts a new draft.
        sessionStorage.removeItem(draftKey);
      }, onError);
      return;
    }
    if (location.origin !== `http://127.0.0.1:${session.port}`) {
      // A deployed page cannot fetch a loopback server, but a form POST that
      // moves the whole tab there gets through. The tab lands on the "Sent"
      // page of the agent and this one never learns the outcome. So the draft
      // stays and the session goes: the token is used up, and a reader who
      // comes back finds their answers and "Copy response".
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `http://127.0.0.1:${session.port}/answer`;
      for (const [name, value] of [["s", session.token], ["answer", answer]]) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.append(input);
      }
      document.body.append(form);
      sessionStorage.removeItem(sessionKey);
      session = { status: "none" };
      // The tab is about to leave. The button changes for a reader who comes
      // back, or right here when the browser could not reach the agent and stayed.
      setTimeout(() => setSubmit({ status: "idle" }), 1000);
      form.submit();
      return;
    }
    setSubmit({ status: "submitting" });
    // The agent stopped waiting, or another wait got its port since and does
    // not know the token of this page. From here the page behaves like one opened
    // without a session. A page opened again would start empty, so the
    // reader is sent to "Copy response".
    function lost() {
      sessionStorage.removeItem(sessionKey);
      session = { status: "none" };
      setSubmit({ status: "error", message: "The agent is no longer waiting. Copy your response and paste it in the chat." });
    }
    // URLSearchParams makes this a urlencoded form body, the same one a plain form POST sends.
    fetch(`http://127.0.0.1:${session.port}/answer`, {
      method: "POST",
      body: new URLSearchParams({ s: session.token, answer })
    }).then((res) => {
      if (res.status === 403) return lost();
      if (!res.ok) return onError(`submit failed: ${res.status}`);
      setSubmit({ status: "done" });
      // The agent has the answer and its server is gone.
      sessionStorage.removeItem(sessionKey);
      sessionStorage.removeItem(draftKey);
    }, lost);
  }

  const locked = submit.status === "submitting" || submit.status === "done";

  return (
    <SubmitProvider value={{ state: submit, live: session.status === "live", submit: doSubmit }}>
      {submit.status === "done" ? <div className="banner done">Submitted. You can close this tab.</div> : null}
      {submit.status === "copied" ? (
        <div className="banner done">Response copied. Paste it to the agent.</div>
      ) : null}
      {submit.status === "error" ? <div className="banner error">{submit.message}</div> : null}
      <JSONUIProvider registry={registry} store={store}>
        <div className={locked ? "ui-locked" : undefined}>
          <Renderer spec={entry.spec} registry={registry} />
        </div>
        <FeedbackOverlay attachments={attachments} setAttachments={setAttachments} disabled={locked} />
      </JSONUIProvider>
    </SubmitProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
