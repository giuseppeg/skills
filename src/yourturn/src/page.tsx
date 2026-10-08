import { Fragment, lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useStateStore } from "@json-render/react";
import { z } from "zod";
import { useSubmit } from "./submit";
import "./page.css";

// A comment the agent leaves on a card, from the spec.
type AgentComment = { author?: string; side?: "old" | "new"; startLine: number; endLine?: number; body: string };
type Contents = { name: string; contents: string };
// A reader comment on lines of a code or diff card. Stored in the form state
// under /comments, so it comes back in the result.
export const commentSchema = z.object({
  id: z.string(),
  author: z.string().optional(), // set on the agent's comments
  card: z.number(), // 1-based order of the card in the page
  path: z.string(),
  side: z.enum(["old", "new"]).nullable(), // null for plain code cards
  startLine: z.number(),
  endLine: z.number(),
  snippet: z.string().nullable(), // the commented lines
  body: z.string()
});
export type CardComment = z.infer<typeof commentSchema>;

type Player = { status: "paused" | "playing"; index: number; section: number };

// What the outline lists, in page order: the section headings, and under a
// section the files of a Diff that shows a whole change.
const outlined = ".page-section > h2, .page-files .page-ref";
type OutlineEntry = { text: string; path?: string; section: number };

// Only specs with code refs pay for the diff renderer and highlighter.
const RefCard = lazy(() => import("./ref-card"));

const segmenter = new Intl.Segmenter(undefined, { granularity: "sentence" });

// The voices macOS only has as an Enhanced or Premium download. Chromium lists
// a voice by its bare name with no mark of its quality, so the name is all
// there is to go by.
const natural =
  /^(Zoe|Ava|Allison|Evan|Nathan|Joelle|Noelle|Susan|Tom|Serena|Jamie|Oliver|Stephanie|Kate|Matilda|Lee|Fiona|Isha)$/;
// The voice hint goes away for good once the reader has opened it. A cookie
// remembers that, because a local page is on a new port each time and a
// cookie is the one store that ports share. Read once, so the hint stays
// while it is being read.
const voiceHintSeen = document.cookie.includes("yourturn-voice-hint=");

// Text the player can read aloud. It is split into sentences and **keyword**
// becomes <mark>. Any block that wants its text read renders it through this.
export function Prose(props: { text: string }) {
  return Array.from(segmenter.segment(props.text), (s) => s.segment.trim())
    .filter(Boolean)
    .map((sentence, i) => (
      <span key={i} className="page-sentence" data-sentence="">
        {sentence
          .split(/\*\*(.+?)\*\*/g)
          .map((part, j) => (j % 2 ? <mark key={j}>{part}</mark> : <Fragment key={j}>{part}</Fragment>))}{" "}
      </span>
    ));
}

// What an input says when the player reaches it. The player then stops, see `stop`.
export const stop = { "data-sentence": "Your turn. Answer here, then press play to go on.", "data-stop": "" };

// What the player walks, in page order. An element says its own text, or the
// value of data-sentence when it has one. Queried on every step because blocks
// load lazily. Inputs in a row are one stop, so only the first is kept.
function spoken() {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-sentence]")).filter(
    (el, i, all) => !("stop" in el.dataset && all[i - 1] && "stop" in all[i - 1].dataset)
  );
}

// A Code or Diff block: the note, then the card the player announces and waits on.
export function CodeCard(props: {
  type: "code" | "diff";
  path: string;
  note?: string | null;
  content?: string; // code, or a pasted unified diff
  // Filled in by create.mjs for git-backed diffs so context can expand.
  oldFile?: Contents;
  newFile?: Contents;
  comments?: AgentComment[];
}) {
  const store = useStateStore();
  const comments = z.array(commentSchema).catch([]).parse(store.get("/comments"));
  // The card's number is its place among the cards in the page, known once it is in the DOM.
  const [card, setCard] = useState(0);
  return (
    <>
      {/* A note is spoken like a paragraph. */}
      {props.note ? (
        <p>
          <Prose text={props.note} />
        </p>
      ) : null}
      <div
        className="page-ref"
        data-sentence="Code block."
        data-path={props.path}
        // After the card is announced, wait so the user can look at it: 1s plus 0.15s per line, max 6s.
        data-pause={Math.min(6000, 1000 + (props.content?.split("\n").length ?? 10) * 150)}
        ref={(el) => {
          if (el) setCard(Array.from(document.querySelectorAll(".page-ref")).indexOf(el) + 1);
        }}
      >
        {/* Shown while the diff view loads and highlights, which takes seconds on a big review. */}
        <div className="page-ref-loading" aria-hidden="true">
          {props.path}
        </div>
        <Suspense fallback={null}>
          <RefCard
            type={props.type}
            path={props.path}
            content={props.content}
            oldFile={props.oldFile}
            newFile={props.newFile}
            card={card}
            comments={[
              // The agent's comments come with the spec (no id, so no delete button).
              ...(props.comments ?? []).map((c) => ({
                ...c,
                id: "",
                card,
                path: props.path,
                side: props.type === "code" ? null : c.side ?? "new",
                endLine: c.endLine ?? c.startLine,
                snippet: null
              })),
              ...comments.filter((c) => c.card === card)
            ]}
            onAdd={(c) => store.set("/comments", [...comments, { ...c, id: crypto.randomUUID() }])}
            onRemove={(id) => store.set("/comments", comments.filter((c) => c.id !== id))}
          />
        </Suspense>
      </div>
    </>
  );
}

// The shell of every page: the big picture, the sections, the comment box and
// the submit bar, plus the outline and the read-aloud player.
export function Page(props: { overview?: string | null; width?: "base" | "wide" | null; children: React.ReactNode }) {
  const store = useStateStore();
  const { state, live, submit } = useSubmit();
  const [player, setPlayer] = useState<Player>({ status: "paused", index: 0, section: -1 });
  const [outline, setOutline] = useState<OutlineEntry[]>([]);
  const token = useRef(0);
  const supported = "speechSynthesis" in window;
  // True on a Mac whose voice list has no natural voice, so the player can say
  // how to get one. Safari hides downloaded voices, so there it is true until
  // the hint was opened once.
  const plainVoice = useSyncExternalStore(
    (notify) => {
      window.speechSynthesis?.addEventListener("voiceschanged", notify);
      return () => window.speechSynthesis?.removeEventListener("voiceschanged", notify);
    },
    () => {
      // The voices of the Mac load late, in Chrome after its own online ones.
      const voices = (window.speechSynthesis?.getVoices() ?? []).filter((v) => v.localService);
      return (
        !voiceHintSeen &&
        navigator.userAgent.includes("Macintosh") &&
        voices.length > 0 &&
        !voices.some((v) => natural.test(v.name) || /premium|enhanced/i.test(v.voiceURI))
      );
    }
  );

  useEffect(() => {
    // The blocks are in the DOM now, so the outline comes from it.
    let section = -1;
    setOutline(
      Array.from(document.querySelectorAll<HTMLElement>(outlined), (el) =>
        el.dataset.path === undefined
          ? { text: el.textContent?.trim() ?? "", section: ++section }
          : { text: el.dataset.path.split("/").pop() ?? "", path: el.dataset.path, section }
      )
    );
    // Stop speaking when the page goes away.
    return () => {
      token.current++;
      window.speechSynthesis?.cancel();
    };
  }, []);

  function go(input: { index: number; play: boolean }) {
    const all = spoken();
    const index = Math.max(0, Math.min(all.length - 1, input.index));
    const el = all[index];
    if (!el) return;
    const mine = ++token.current;
    window.speechSynthesis.cancel();
    document.querySelector("[data-sentence].active")?.classList.remove("active");
    el.classList.toggle("active", input.play || index > 0);
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    const within = el.closest(".page-section");
    const section = within ? Array.from(document.querySelectorAll(".page-section")).indexOf(within) : -1;
    setPlayer({ status: input.play ? "playing" : "paused", index, section });
    if (!input.play) return;
    const utterance = new SpeechSynthesisUtterance(el.dataset.sentence || el.textContent || "");
    utterance.onend = () => {
      setTimeout(() => {
        if (token.current !== mine) return;
        const more = index + 1 < spoken().length;
        // The reader answers, then presses play to go on from the next sentence.
        if (more && "stop" in el.dataset) return setPlayer((p) => ({ ...p, status: "paused", index: index + 1 }));
        if (more) return go({ index: index + 1, play: true });
        el.classList.remove("active");
        setPlayer((p) => ({ ...p, status: "paused", index: 0, section: -1 }));
      }, document.hasFocus() ? Number(el.dataset.pause ?? 0) : 0); // nobody is looking, keep reading
    };
    window.speechSynthesis.speak(utterance);
  }

  const commented = z.array(commentSchema).catch([]).parse(store.get("/comments")).map((c) => c.path);
  const playing = player.status === "playing";
  const busy = state.status === "submitting" || state.status === "done";

  return (
    <div className={props.width === "wide" ? "page page-wide" : "page"}>
      <article
        className="page-content"
        onClick={(e) => {
          const el = e.target instanceof HTMLElement ? e.target.closest<HTMLElement>(".page-sentence") : null;
          // Dragging to select text ends in a click, which must not start playback.
          if (el && supported && !window.getSelection()?.toString()) go({ index: spoken().indexOf(el), play: true });
        }}
      >
        {props.overview ? (
          <section className="page-overview">
            <span className="page-kicker">Big picture</span>
            <p>
              <Prose text={props.overview} />
            </p>
          </section>
        ) : null}
        {props.children}
        <label className="page-comment">
          <span>Anything to add?</span>
          <textarea
            className="input textarea"
            rows={4}
            placeholder="Optional comment for the agent"
            value={String(store.get("/comment") ?? "")}
            onChange={(e) => store.set("/comment", e.target.value)}
          />
        </label>
        <button className="submit-button page-submit" disabled={busy} onClick={() => submit(store.getSnapshot())}>
          {state.status === "submitting"
            ? "Submitting..."
            : state.status === "done"
              ? "Done"
              : live
                ? "Send to agent"
                : "Copy response"}
        </button>
        {live ? null : (
          <p className="page-hint">
            No agent is waiting on this page. That also happens when a login got in the way. Copy your response and
            paste it in the chat. If you have written nothing yet, you can also ask the agent to open the page again.
          </p>
        )}
      </article>
      {outline.length > 1 ? (
        <nav className="outline" aria-label="Sections">
          {outline.map((entry, i) => (
            <button
              key={i}
              className={entry.path ? "outline-file" : entry.section === player.section ? "active" : undefined}
              title={entry.path}
              onClick={() => document.querySelectorAll(outlined)[i]?.scrollIntoView({ block: "start", behavior: "smooth" })}
            >
              {entry.text}
              {entry.path && commented.includes(entry.path) ? <span className="outline-dot" aria-label="has your comment" /> : null}
            </button>
          ))}
        </nav>
      ) : null}

      {supported ? (
        <div className="page-player" role="group" aria-label="Read aloud">
          <button aria-label="Previous sentence" onClick={() => go({ index: player.index - 1, play: playing })}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM20 5v14L9 12z" /></svg>
          </button>
          <button
            className="page-play"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => go({ index: player.index, play: !playing })}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              {playing ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
          </button>
          <button aria-label="Next sentence" onClick={() => go({ index: player.index + 1, play: playing })}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 5h2v14h-2zM4 5v14l11-7z" /></svg>
          </button>
          {plainVoice ? (
            <details
              className="page-voice"
              onToggle={() => (document.cookie = "yourturn-voice-hint=seen; max-age=31536000; path=/")}
            >
              <summary>Better voice?</summary>
              <div className="page-voice-steps">
                <p>macOS has more natural voices than the one it comes with. Here is how to install one.</p>
                <ol>
                  <li>Open <strong>System Settings</strong>.</li>
                  <li>Go to <strong>Accessibility &gt; Spoken Content</strong>.</li>
                  <li>Under <strong>System voice</strong>, click the <strong>ⓘ (info)</strong> button.</li>
                  <li>Click <strong>Voice</strong>.</li>
                  <li>Search for <strong>Premium</strong>.</li>
                  <li>Choose a premium voice, such as <strong>Zoe</strong>, and install it.</li>
                  <li>Once the download is complete, select that voice as your <strong>System voice</strong>.</li>
                </ol>
              </div>
            </details>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
