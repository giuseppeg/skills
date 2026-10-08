import { Component, lazy, Suspense, useMemo, useRef, useState } from "react";
import {
  defineRegistry,
  useBoundProp,
  type ComponentRegistry,
  type ComponentRenderProps,
  type Components
} from "@json-render/react";
import { z } from "zod";
import { catalog } from "./catalog";
import { CodeCard, Page, Prose, stop } from "./page";

// Loaded only when a spec uses them.
const DiagramFlow = lazy(() => import("./diagram-flow").then((m) => ({ default: m.DiagramFlow })));
const StepNavHorizontal = lazy(() => import("./step-nav").then((m) => ({ default: m.StepNavHorizontal })));
const StepNavVertical = lazy(() => import("./step-nav").then((m) => ({ default: m.StepNavVertical })));

// Normalize a string-or-{label,value} option into a {label,value} pair.
function toOption(o: string | { label: string; value: string }) {
  return typeof o === "string" ? { label: o, value: o } : o;
}

// Renders the label + optional helper text shell shared by every field.
function Field(props: {
  label: string;
  help?: string | null;
  required?: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <label className="field" {...stop}>
      <span className="field-label">
        {props.label}
        {props.required ? <span className="req"> *</span> : null}
      </span>
      {props.children}
      {props.help ? <span className="field-help">{props.help}</span> : null}
    </label>
  );
}

const components: Components<typeof catalog> = {
  Page: ({ props, children }) => (
    <Page overview={props.overview} width={props.width}>
      {children}
    </Page>
  ),

  Section: ({ props, children }) => (
    <section className="page-section">
      <h2>
        <Prose text={props.heading} />
      </h2>
      {children}
    </section>
  ),

  Stack: ({ props, children }) => (
    <div className={`stack gap-${props.gap ?? "md"}`}>{children}</div>
  ),

  Columns: ({ props, children }) => (
    <div className={`columns gap-${props.gap ?? "md"}`}>{children}</div>
  ),

  Card: ({ props, children }) => (
    <section className={props.tone ? `card tone ${props.tone}` : "card"}>
      {props.title ? <h2 className="card-title">{props.title}</h2> : null}
      {children}
    </section>
  ),

  Heading: ({ props }) => (
    <h3 className="heading">
      <Prose text={props.text} />
    </h3>
  ),

  Text: ({ props }) => (
    <p className={props.muted ? "text muted" : undefined}>
      <Prose text={props.text} />
    </p>
  ),

  Code: ({ props }) => <CodeCard type="code" {...props} />,

  // create.mjs leaves either one file in the props or the files of a whole change.
  Diff: ({ props }) =>
    props.files ? (
      <div className="page-files">
        {props.note ? (
          <p>
            <Prose text={props.note} />
          </p>
        ) : null}
        {props.files.map((file) => (
          <CodeCard
            key={file.path}
            type="diff"
            {...file}
            comments={props.comments?.filter((c) => c.path === file.path)}
          />
        ))}
        {props.skipped?.length ? <p className="text muted">Not shown: {props.skipped.join(", ")}.</p> : null}
      </div>
    ) : (
      <CodeCard type="diff" {...props} path={props.path ?? ""} />
    ),

  Image: ({ props }) => (
    <figure className="page-image">
      <img src={props.src} alt={props.alt} />
      {props.caption ? <figcaption>{props.caption}</figcaption> : null}
    </figure>
  ),

  Divider: () => <hr className="divider" />,

  TextField: ({ props, bindings }) => {
    const [value, setValue] = useBoundProp<string>(props.value ?? undefined, bindings?.value);
    return (
      <Field label={props.label} help={props.help} required={props.required}>
        <input
          className="input"
          type={props.type ?? "text"}
          value={value ?? ""}
          placeholder={props.placeholder ?? ""}
          onChange={(e) => setValue(e.target.value)}
        />
      </Field>
    );
  },

  Textarea: ({ props, bindings }) => {
    const [value, setValue] = useBoundProp<string>(props.value ?? undefined, bindings?.value);
    return (
      <Field label={props.label} help={props.help} required={props.required}>
        <textarea
          className="input textarea"
          rows={props.rows ?? 4}
          value={value ?? ""}
          placeholder={props.placeholder ?? ""}
          onChange={(e) => setValue(e.target.value)}
        />
      </Field>
    );
  },

  Select: ({ props, bindings }) => {
    const [value, setValue] = useBoundProp<string>(props.value ?? undefined, bindings?.value);
    return (
      <Field label={props.label} help={props.help} required={props.required}>
        <select
          className="input"
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="" disabled>
            {props.placeholder ?? "Select..."}
          </option>
          {props.options.map(toOption).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
    );
  },

  Checkbox: ({ props, bindings }) => {
    const [checked, setChecked] = useBoundProp<boolean>(props.checked ?? undefined, bindings?.checked);
    return (
      <label className="field checkbox-field" {...stop}>
        <input
          type="checkbox"
          checked={checked ?? false}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span className="field-label">{props.label}</span>
        {props.help ? <span className="field-help">{props.help}</span> : null}
      </label>
    );
  },

  RadioGroup: ({ props, bindings }) => {
    const [value, setValue] = useBoundProp<string>(props.value ?? undefined, bindings?.value);
    // Group name keyed off the bound path so multiple groups stay independent.
    const name = bindings?.value ?? props.label;
    // fieldset/legend rather than Field's <label>: nesting the per-option
    // <label>s inside an outer <label> is invalid HTML and breaks a11y.
    return (
      <fieldset className="field fieldset" {...stop}>
        <legend className="field-label">{props.label}</legend>
        <div className="radio-group">
          {props.options.map(toOption).map((o) => (
            <label key={o.value} className="radio-option">
              <input
                type="radio"
                name={name}
                checked={value === o.value}
                onChange={() => setValue(o.value)}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
        {props.help ? <span className="field-help">{props.help}</span> : null}
      </fieldset>
    );
  },

  Slideshow: ({ props }) => {
    const [idx, setIdx] = useState(0);
    const slide = props.slides[idx];
    const total = props.slides.length;
    return (
      <div className="slideshow">
        <div className="slideshow-body">
          <h2 className="heading">{slide.title}</h2>
          {slide.body ? <p className="text muted">{slide.body}</p> : null}
        </div>
        <div className="slideshow-nav">
          <button className="slide-btn" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>←</button>
          <span className="text muted">{idx + 1} / {total}</span>
          <button className="slide-btn" onClick={() => setIdx(i => Math.min(total - 1, i + 1))} disabled={idx === total - 1}>→</button>
        </div>
      </div>
    );
  },

  DiagramFlow: ({ props }) => (
    <Suspense fallback={null}>
      <DiagramFlow {...props} />
    </Suspense>
  ),

  StepNavHorizontal: ({ props }) => (
    <Suspense fallback={null}>
      <StepNavHorizontal {...props} />
    </Suspense>
  ),

  StepNavVertical: ({ props }) => (
    <Suspense fallback={null}>
      <StepNavVertical {...props} />
    </Suspense>
  )
};

// What failed to render. It goes back to the agent in `errors` of the answer.
export const renderErrors: { element: string; message: string }[] = [];

// Shows an error card in place of a block that failed, so the rest of the page
// still works. React only offers error boundaries as classes, this is the one
// class in the viewer.
class BlockBoundary extends Component<{ element: string; children: React.ReactNode }, { message: string | null }> {
  state: { message: string | null } = { message: null };

  static getDerivedStateFromError(error: Error) {
    return { message: error.message };
  }

  componentDidCatch(error: Error) {
    renderErrors.push({ element: this.props.element, message: error.message });
  }

  render() {
    if (this.state.message === null) return this.props.children;
    return (
      <div className="block-error">
        Could not show <code>{this.props.element}</code>: {this.state.message}
      </div>
    );
  }
}

const blocks = defineRegistry(catalog, { components }).registry;

// The project's own components, see references/components.md. create.mjs
// copies them next to this file and lists their names in index.html. One with
// the name of a built-in replaces it. Their props are checked here and not in
// create.mjs, because the files only run in a browser.
type ProjectComponent = {
  props?: z.ZodObject;
  render?: (block: Omit<ComponentRenderProps, "element"> & { props: z.infer<z.ZodObject> }) => React.ReactNode;
};
const names = z.array(z.string()).parse(JSON.parse(document.getElementById("components")?.textContent ?? "[]"));
for (const name of names) {
  const file = new URL(`./_core/components/${encodeURIComponent(name)}.js`, document.baseURI).href;
  // A file that does not load fails like a block that does not render.
  const loaded: ProjectComponent | Error = await import(/* @vite-ignore */ file).catch((err: Error) => err);
  blocks[name] = ({ element, ...rest }) => {
    if (loaded instanceof Error) throw new Error(`could not load components/${name}.js: ${loaded.message}`);
    if (!loaded.props || !loaded.render) throw new Error(`components/${name}.js must export props and render`);
    const schema = loaded.props;
    // Parsed again only when the props change, see `same` below.
    const props = useMemo(() => schema.safeParse(element.props), [schema, element.props]);
    if (!props.success) throw new Error(`bad props: ${z.prettifyError(props.error)}`);
    return loaded.render({ ...rest, props: props.data });
  };
}

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

// Equal by value. Two copies of a spec share their strings, so a big file in
// the props costs nothing to compare.
function same(a: Json, b: Json): boolean {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, i) => same(item, b[i]));
  }
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => key in b && same(a[key], b[key]));
}

// json-render catches a failing component itself and renders nothing, so our
// boundary has to sit inside its one. It does not pass the element id on
// either: main.tsx puts it on each element at load.
//
// It also renders every block again on every change of the state, a keystroke
// in any input included, and each time with a fresh copy of the props. A block
// that hands a prop to a library would make it start over on every key: the
// diff view highlights a whole file again when the file is a new object. So a
// block keeps the props it has until their content changes.
export const registry: ComponentRegistry = Object.fromEntries(
  Object.entries(blocks).map(([type, Block]) => [
    type,
    ({ element, ...rest }: ComponentRenderProps<{ [key: string]: Json }> & { element: { id?: string } }) => {
      const kept = useRef(element.props);
      if (!same(kept.current, element.props)) kept.current = element.props;
      return (
        <BlockBoundary element={element.id ?? type}>
          <Block {...rest} element={{ ...element, props: kept.current }} />
        </BlockBoundary>
      );
    }
  ])
);
