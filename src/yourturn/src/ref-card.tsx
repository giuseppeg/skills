import { useMemo, useState } from "react";
import { File, MultiFileDiff, PatchDiff } from "@pierre/diffs/react";
import type { DiffLineAnnotation, LineAnnotation, SelectedLineRange } from "@pierre/diffs/react";
import type { CardComment } from "./page";

const theme = { dark: "github-dark-default", light: "github-light" } as const;
// A card is a surface of the page, so the code sits on the card colour of our
// theme and not on the background of the highlighter's.
const surface = ":host { --diffs-light-bg: var(--card); --diffs-dark-bg: var(--card); }";

type Contents = { name: string; contents: string };
// What sits under a line: a saved comment, or null for the comment form being filled.
type Note = { comment: CardComment | null };
type Draft = { status: "idle" } | { status: "commenting"; range: SelectedLineRange };
type Props = {
  card: number;
  path: string;
  type: "diff" | "code";
  content?: string;
  oldFile?: Contents;
  newFile?: Contents;
  comments: CardComment[];
  onAdd: (comment: Omit<CardComment, "id">) => void;
  onRemove: (id: string) => void;
};

export default function RefCard(props: Props) {
  const [draft, setDraft] = useState<Draft>({ status: "idle" });

  // The diff view starts over, highlighting included, when its options, its
  // file or its notes are new objects. So each is made once and kept until its
  // content changes. The files of a diff come from the props, which stay the
  // same object for the same reason, see the registry in components.tsx.
  const shared = useMemo(
    () =>
      ({
        theme,
        unsafeCSS: surface,
        enableLineSelection: true,
        enableGutterUtility: true,
        controlledSelection: true,
        onGutterUtilityClick: (range: SelectedLineRange) => setDraft({ status: "commenting", range }),
        // The lines are drawn, so the placeholder of the card can go, see CodeCard.
        onPostRender: (node: HTMLElement) => node.closest(".page-ref")?.setAttribute("data-ready", "")
      }) as const,
    []
  );
  const diffOptions = useMemo(() => ({ ...shared, diffStyle: "unified", hunkSeparators: "line-info" }) as const, [shared]);
  const file = useMemo(() => ({ name: props.path, contents: props.content ?? "" }), [props.path, props.content]);
  const selectedLines = draft.status === "commenting" ? draft.range : null;

  function add(body: string) {
    if (draft.status !== "commenting" || !body) return;
    const { range } = draft;
    const [startLine, endLine] = [range.start, range.end].sort((a, b) => a - b);
    const side = props.type === "code" ? null : range.side === "deletions" ? "old" : "new";
    const source = props.type === "code" ? props.content : side === "old" ? props.oldFile?.contents : props.newFile?.contents;
    props.onAdd({
      card: props.card,
      path: props.path,
      side,
      startLine,
      endLine,
      snippet: source?.split("\n").slice(startLine - 1, endLine).join("\n").slice(0, 2000) ?? null,
      body
    });
    setDraft({ status: "idle" });
  }

  // Notes sit right under the last line they refer to. The list of comments is
  // built again on every render, so its text is what tells a change.
  const range = draft.status === "commenting" ? draft.range : null;
  const diffNotes: DiffLineAnnotation<Note>[] = useMemo(
    () => [
      ...props.comments.map((comment) => ({
        side: comment.side === "old" ? ("deletions" as const) : ("additions" as const),
        lineNumber: comment.endLine,
        metadata: { comment }
      })),
      ...(range
        ? [{
            side: (range.endSide ?? range.side ?? "additions") as "additions" | "deletions",
            lineNumber: Math.max(range.start, range.end),
            metadata: { comment: null }
          }]
        : [])
    ],
    [JSON.stringify(props.comments), range]
  );
  const fileNotes: LineAnnotation<Note>[] = useMemo(
    () => diffNotes.map(({ lineNumber, metadata }) => ({ lineNumber, metadata })),
    [diffNotes]
  );

  function renderNote(note: { metadata: Note }) {
    const c = note.metadata.comment;
    if (c) {
      return (
        <div className="diff-comment page-card-comment">
          <span className="page-card-comment-lines">
            {c.author && <strong>{c.author} · </strong>}
            {c.startLine === c.endLine ? `Line ${c.startLine}` : `Lines ${c.startLine}-${c.endLine}`}
            {c.side ? ` (${c.side})` : ""}
          </span>
          <p className="text">{c.body}</p>
          {c.id && (
            <button className="feedback-delete" onClick={() => props.onRemove(c.id)} aria-label="Delete comment" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />
              </svg>
            </button>
          )}
        </div>
      );
    }
    if (draft.status !== "commenting") return null;
    return (
      // The text stays in the textarea until Add. Nothing else needs it, and
      // a card that renders on every key is felt on a long file.
      <form
        className="diff-comment-form"
        onSubmit={(e) => {
          e.preventDefault();
          add(String(new FormData(e.currentTarget).get("body") ?? "").trim());
        }}
      >
        <textarea
          className="input textarea"
          name="body"
          required
          placeholder="Comment on the selected lines..."
          rows={3}
          // autoFocus loses to the gutter click that opened the form, so focus after it settles.
          ref={(el) => {
            if (el) setTimeout(() => el.focus(), 0);
          }}
        />
        <div className="diff-comment-actions">
          <button className="submit-button">Add</button>
          <button type="button" className="slide-btn" onClick={() => setDraft({ status: "idle" })}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  if (props.type === "code") {
    return (
      <File
        file={file}
        options={shared}
        selectedLines={selectedLines}
        lineAnnotations={fileNotes}
        renderAnnotation={renderNote}
      />
    );
  }
  // Full old/new contents let the reader expand the context around each change.
  return props.oldFile && props.newFile ? (
    <MultiFileDiff
      oldFile={props.oldFile}
      newFile={props.newFile}
      options={diffOptions}
      selectedLines={selectedLines}
      lineAnnotations={diffNotes}
      renderAnnotation={renderNote}
    />
  ) : (
    <PatchDiff
      patch={props.content ?? ""}
      options={diffOptions}
      selectedLines={selectedLines}
      lineAnnotations={diffNotes}
      renderAnnotation={renderNote}
    />
  );
}
