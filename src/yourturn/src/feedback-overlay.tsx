import { useEffect, useRef, useState } from "react";
import { useStateStore } from "@json-render/react";
import { z } from "zod";
import { commentSchema } from "./page";

const MAX_IMAGES = 10; // uploads and screenshots, text comments are not capped
const MAX_FILE_BYTES = 1_000_000;
const MAX_TOTAL_DATA_URL_BYTES = 3_500_000;
const MAX_SCREENSHOT_EDGE = 1000;
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

export type FeedbackAttachment = {
  id: number;
  kind: "upload" | "screenshot" | "text";
  name: string;
  mime: string;
  dataUrl: string;
  comment: string;
  target?: {
    tag: string;
    id?: string;
    classes: string[];
    selector: string;
    textPreview: string;
    quote?: string; // the text the reader selected, for kind "text"
    rect: { x: number; y: number; width: number; height: number };
    scroll: { x: number; y: number };
    fixed?: boolean;
  };
};

type Draft =
  | { status: "idle" }
  | { status: "picking" }
  | { status: "commenting"; target: HTMLElement; quote?: string; comment: string; error?: string };

type Props = {
  attachments: FeedbackAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<FeedbackAttachment[]>>;
  disabled: boolean;
};

function cssPath(element: HTMLElement) {
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  while (current && current !== document.body && parts.length < 5) {
    let part = current.tagName.toLowerCase();
    if (current.id) {
      part += `#${CSS.escape(current.id)}`;
      parts.unshift(part);
      break;
    }
    const testId = current.getAttribute("data-testid");
    if (testId) part += `[data-testid="${CSS.escape(testId)}"]`;
    else if (current.classList.length) {
      part += "." + Array.from(current.classList).slice(0, 2).map((c) => CSS.escape(c)).join(".");
    }
    parts.unshift(part);
    current = current.parentElement;
  }
  return parts.join(" > ") || element.tagName.toLowerCase();
}

function hasFixedAncestor(element: HTMLElement) {
  for (let el: HTMLElement | null = element; el; el = el.parentElement) {
    if (getComputedStyle(el).position === "fixed") return true;
  }
  return false;
}

function nextId(attachments: FeedbackAttachment[]) {
  return Math.max(0, ...attachments.map((a) => a.id)) + 1;
}

function elementTarget(element: HTMLElement): NonNullable<FeedbackAttachment["target"]> {
  const rect = element.getBoundingClientRect();
  const id = element.id || undefined;
  return {
    tag: element.tagName.toLowerCase(),
    ...(id ? { id } : {}),
    classes: Array.from(element.classList).slice(0, 8),
    selector: cssPath(element),
    textPreview: (element.innerText || element.textContent || "").trim().slice(0, 300),
    rect: {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    },
    scroll: {
      x: Math.round(window.scrollX),
      y: Math.round(window.scrollY)
    },
    // Fixed elements do not move with the page, so their marker must not either.
    ...(hasFixedAncestor(element) ? { fixed: true } : {})
  };
}

function isImageFile(file: File) {
  const lower = file.name.toLowerCase();
  return file.type.startsWith("image/") && ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function basename(name: string) {
  return name.split(/[\\/]/).pop() || "image";
}

function encodedSize(value: string) {
  return new Blob([value]).size;
}

function currentTotalSize(attachments: FeedbackAttachment[]) {
  return attachments.reduce((sum, attachment) => sum + encodedSize(attachment.dataUrl), 0);
}

function elementFromPoint(options: { x: number; y: number }) {
  return document
    .elementsFromPoint(options.x, options.y)
    .find((element): element is HTMLElement =>
      element instanceof HTMLElement &&
      !element.closest("[data-feedback-overlay]") &&
      !element.closest("[data-screenshot-ignore]")
    ) ?? null;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("could not read image"));
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(options: { canvas: HTMLCanvasElement; mime: string; quality: number }) {
  return new Promise<Blob>((resolve, reject) => {
    options.canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("could not encode screenshot")),
      options.mime,
      options.quality
    );
  });
}

async function blobToDataUrl(blob: Blob) {
  return fileToDataUrl(new File([blob], "screenshot.jpg", { type: blob.type }));
}

function downscaleCanvas(canvas: HTMLCanvasElement) {
  const edge = Math.max(canvas.width, canvas.height);
  if (edge <= MAX_SCREENSHOT_EDGE) return canvas;
  const scale = MAX_SCREENSHOT_EDGE / edge;
  const next = document.createElement("canvas");
  next.width = Math.max(1, Math.round(canvas.width * scale));
  next.height = Math.max(1, Math.round(canvas.height * scale));
  const ctx = next.getContext("2d");
  if (!ctx) return canvas;
  ctx.drawImage(canvas, 0, 0, next.width, next.height);
  return next;
}

export function FeedbackOverlay({ attachments, setAttachments, disabled }: Props) {
  const [draft, setDraft] = useState<Draft>({ status: "idle" });
  const [dropActive, setDropActive] = useState(false);
  const [message, setMessage] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  // Text the reader has selected on the page, offered as a comment target.
  const [selection, setSelection] = useState<{ text: string; element: HTMLElement; rect: DOMRect } | null>(null);
  const hoverRef = useRef<HTMLElement | null>(null);
  // The reader's comments on lines of code and diff cards. They are listed
  // with the rest, so the list shows everything that goes to the agent.
  const store = useStateStore();
  const comments = z.array(commentSchema).catch([]).parse(store.get("/comments"));
  const total = attachments.length + comments.length;

  function clearHover() {
    hoverRef.current?.removeAttribute("data-feedback-hover");
    hoverRef.current = null;
  }

  async function addFile(file: File) {
    if (!isImageFile(file)) return;
    if (file.size > MAX_FILE_BYTES) {
      setMessage(`${basename(file.name)} is too large.`);
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setAttachments((prev) => {
      if (prev.filter((a) => a.dataUrl).length >= MAX_IMAGES) {
        setMessage(`Maximum ${MAX_IMAGES} images.`);
        return prev;
      }
      if (currentTotalSize(prev) + encodedSize(dataUrl) > MAX_TOTAL_DATA_URL_BYTES) {
        setMessage("Attachments are too large.");
        return prev;
      }
      return [...prev, {
        id: nextId(prev),
        kind: "upload",
        name: basename(file.name),
        mime: file.type,
        dataUrl,
        comment: ""
      }];
    });
    setReviewOpen(true);
  }

  useEffect(() => {
    if (disabled || draft.status !== "picking") return;

    function updateHover(event: PointerEvent) {
      const element = elementFromPoint({ x: event.clientX, y: event.clientY });
      if (hoverRef.current === element) return;
      clearHover();
      element?.setAttribute("data-feedback-hover", "true");
      hoverRef.current = element;
    }

    function handlePointerMove(event: PointerEvent) {
      updateHover(event);
    }

    function handleClick(event: MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
      const element = elementFromPoint({ x: event.clientX, y: event.clientY });
      clearHover();
      if (!element) {
        setDraft({ status: "idle" });
        return;
      }
      setDraft({ status: "commenting", target: element, comment: "" });
    }

    document.addEventListener("pointermove", handlePointerMove, true);
    document.addEventListener("click", handleClick, true);
    return () => {
      clearHover();
      document.removeEventListener("pointermove", handlePointerMove, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [disabled, draft.status]);

  useEffect(() => {
    if (disabled) return;

    function handleDragOver(event: DragEvent) {
      if (!event.dataTransfer?.types.includes("Files")) return;
      event.preventDefault();
      setDropActive(true);
    }

    function handleDragLeave(event: DragEvent) {
      if (event.relatedTarget) return;
      setDropActive(false);
    }

    async function handleDrop(event: DragEvent) {
      if (!event.dataTransfer?.files.length) return;
      event.preventDefault();
      setDropActive(false);
      const files = Array.from(event.dataTransfer.files).filter(isImageFile);
      if (!files.length) return;
      for (const file of files) {
        await addFile(file);
      }
    }

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);
    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, [disabled, setAttachments]);

  useEffect(() => {
    if (disabled || draft.status !== "idle") {
      setSelection(null);
      return;
    }
    function update() {
      const current = window.getSelection();
      const text = current?.toString().trim() ?? "";
      const node = current?.rangeCount ? current.getRangeAt(0).commonAncestorContainer : null;
      const element = node instanceof HTMLElement ? node : node?.parentElement;
      // Ignore the overlay itself, text typed into fields and code/diff cards (they have line comments).
      if (!text || !element || element.closest("[data-feedback-overlay], textarea, input, diffs-container")) {
        setSelection(null);
        return;
      }
      setSelection({ text, element, rect: current!.getRangeAt(0).getBoundingClientRect() });
    }
    document.addEventListener("mouseup", update);
    document.addEventListener("keyup", update);
    return () => {
      document.removeEventListener("mouseup", update);
      document.removeEventListener("keyup", update);
    };
  }, [disabled, draft.status]);

  async function addComment(options: { includeScreenshot: boolean }) {
    if (draft.status !== "commenting") return;
    const comment = draft.comment.trim();
    if (!comment) return;
    if (options.includeScreenshot && attachments.filter((a) => a.dataUrl).length >= MAX_IMAGES) {
      setDraft({ ...draft, error: `Maximum ${MAX_IMAGES} images.` });
      return;
    }

    const id = nextId(attachments);
    let dataUrl = "";
    let mime = "";
    let name = "Text";

    if (options.includeScreenshot) {
      mime = "image/jpeg";
      name = `screenshot-${id}.jpg`;
      try {
        const { screenshot } = await import("@renoun/screenshot");
        const canvas = await screenshot.canvas(draft.target, {
          scale: 1,
          includeFixed: "intersecting",
          backgroundColor: getComputedStyle(document.body).backgroundColor
        });
        const blob = await canvasToBlob({
          canvas: downscaleCanvas(canvas),
          mime: "image/jpeg",
          quality: 0.6
        });
        dataUrl = await blobToDataUrl(blob);
        mime = blob.type || "image/jpeg";
        if (currentTotalSize(attachments) + encodedSize(dataUrl) > MAX_TOTAL_DATA_URL_BYTES) {
          setDraft({ ...draft, error: "Attachments are too large." });
          return;
        }
      } catch (error) {
        setDraft({ ...draft, error: String(error) });
        return;
      }
    }

    setAttachments((prev) => [...prev, {
      id,
      kind: options.includeScreenshot ? "screenshot" : "text",
      name,
      mime,
      dataUrl,
      comment,
      target: { ...elementTarget(draft.target), ...(draft.quote ? { quote: draft.quote } : {}) }
    }]);
    setDraft({ status: "idle" });
    setReviewOpen(true);
  }

  const rect = draft.status === "commenting" ? draft.target.getBoundingClientRect() : null;

  return (
    <>
      {attachments.map((attachment) => {
        if (!attachment.target) return null;
        const { fixed, rect, scroll } = attachment.target;
        const x = rect.x + (fixed ? 0 : scroll.x);
        const y = rect.y + rect.height + (fixed ? 0 : scroll.y);
        return (
          <button
            key={attachment.id}
            className="feedback-marker"
            data-feedback-overlay
            data-screenshot-ignore
            style={{ left: x, top: y, position: fixed ? "fixed" : "absolute" }}
            onClick={() => setReviewOpen((open) => !open)}
            aria-label={`Show feedback ${attachment.id}`}
            title={`Show feedback ${attachment.id}`}
          >
            {attachment.id}
          </button>
        );
      })}
      {selection ? (
        <button
          className="feedback-selection"
          data-feedback-overlay
          data-screenshot-ignore
          style={{
            left: Math.min(window.innerWidth - 110, Math.max(12, selection.rect.left)),
            top: Math.min(window.innerHeight - 50, selection.rect.bottom + 8)
          }}
          // Keep the text selected while clicking.
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setDraft({ status: "commenting", target: selection.element, quote: selection.text.slice(0, 500), comment: "" });
            setSelection(null);
          }}
        >
          Comment
        </button>
      ) : null}
      {dropActive ? <div className="feedback-drop" data-screenshot-ignore>Drop image</div> : null}
      {message ? (
        <div className="feedback-message" data-feedback-overlay data-screenshot-ignore>
          {message}
          <button onClick={() => setMessage("")} aria-label="Dismiss">x</button>
        </div>
      ) : null}
      {(disabled || reviewOpen) && total > 0 ? (
        <div className="feedback-review" data-feedback-overlay data-screenshot-ignore>
          <div className="feedback-review-title">
            <span>Feedback</span>
            {!disabled ? (
              <button onClick={() => setReviewOpen(false)} aria-label="Close feedback">x</button>
            ) : null}
          </div>
          <ul className="feedback-review-list">
            {attachments.map((attachment) => (
              <li key={attachment.id} className="feedback-review-item">
                <div className="feedback-review-head">
                  <span className="feedback-review-num">{attachment.id}</span>
                  <span>{attachment.kind === "screenshot" ? "Screenshot" : attachment.kind === "text" ? "Comment" : attachment.name}</span>
                  {!disabled ? (
                    <button
                      className="feedback-delete"
                      onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== attachment.id))}
                      aria-label={`Delete feedback ${attachment.id}`}
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />
                      </svg>
                    </button>
                  ) : null}
                </div>
                {attachment.target?.quote ? <p className="feedback-quote">"{attachment.target.quote}"</p> : null}
                {attachment.dataUrl ? (
                  <img src={attachment.dataUrl} alt={`Attachment ${attachment.id}`} />
                ) : null}
                {attachment.comment ? <p>{attachment.comment}</p> : null}
              </li>
            ))}
            {comments.map((comment) => (
              <li key={comment.id} className="feedback-review-item">
                <div className="feedback-review-head">
                  <span title={comment.path}>
                    {comment.path.split("/").pop()},{" "}
                    {comment.startLine === comment.endLine ? `line ${comment.startLine}` : `lines ${comment.startLine}-${comment.endLine}`}
                  </span>
                  {!disabled ? (
                    <button
                      className="feedback-delete"
                      onClick={() => store.set("/comments", comments.filter((c) => c.id !== comment.id))}
                      aria-label="Delete comment"
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />
                      </svg>
                    </button>
                  ) : null}
                </div>
                <p>{comment.body}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {draft.status === "commenting" && rect ? (
        <div
          className="feedback-popover"
          data-feedback-overlay
          data-screenshot-ignore
          style={{
            left: Math.min(window.innerWidth - 280, Math.max(12, rect.left)),
            top: Math.min(window.innerHeight - 180, Math.max(12, rect.bottom + 8))
          }}
        >
          {draft.quote ? <p className="feedback-quote">"{draft.quote.slice(0, 200)}"</p> : null}
          <textarea
            className="input textarea"
            rows={3}
            placeholder="Comment..."
            value={draft.comment}
            autoFocus
            onChange={(event) => setDraft({ ...draft, comment: event.target.value, error: undefined })}
          />
          {draft.error ? <div className="feedback-error">{draft.error}</div> : null}
          <div className="feedback-actions">
            <button
              className="submit-button"
              onClick={() => addComment({ includeScreenshot: false })}
              disabled={!draft.comment.trim()}
            >
              Comment
            </button>
            <button
              className="slide-btn"
              onClick={() => addComment({ includeScreenshot: true })}
              disabled={!draft.comment.trim()}
            >
              Screenshot
            </button>
            <button className="slide-btn" onClick={() => setDraft({ status: "idle" })}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      <div className="feedback-toolbar" data-feedback-overlay data-screenshot-ignore>
        <button
          className={draft.status === "picking" ? "feedback-tool active" : "feedback-tool"}
          onClick={() => setDraft(draft.status === "picking" ? { status: "idle" } : { status: "picking" })}
          disabled={disabled}
          aria-label="Add element comment"
          title="Add element comment"
        >
          +
        </button>
        <label className="feedback-tool" aria-label="Attach image" title="Attach image">
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={disabled}
            onChange={async (event) => {
              const files = Array.from(event.currentTarget.files ?? []);
              event.currentTarget.value = "";
              for (const file of files) {
                await addFile(file);
              }
            }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </label>
        {total ? (
          <button
            className="feedback-count"
            onClick={() => setReviewOpen((open) => !open)}
            aria-label="Show all feedback"
            title="Show all feedback"
          >
            {total}
          </button>
        ) : null}
      </div>
    </>
  );
}
