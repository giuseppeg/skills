import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

// The build bundles this file into dist/catalog.mjs for the Node scripts. They
// take zod and the spec check from it, so the skill runs with no install.
export { z };
export { resolveElementProps, validateSpec } from "@json-render/core";

// Shared option shape for Select / RadioGroup. Either a bare string (label and
// value are the same) or an explicit { label, value } pair.
const option = z.union([
  z.string(),
  z.object({ label: z.string(), value: z.string() })
]);

// A tone tells groups apart and means nothing by itself, see the theme in styles.css.
const tone = z.enum(["blue", "green", "orange", "violet"]);

const stepNavStep = z.object({
  title: z.string().min(1),
  detail: z.string().nullish(),
  status: z.enum(["complete", "current", "upcoming"]).nullish()
});

// The component catalog the agent draws from when authoring a spec. Kept
// deliberately small: layout/display primitives plus the common input controls
// needed to collect structured answers. Every input binds its value via
// { "$bindState": "/some/path" } so submitted state is just the state model.
// Comments the agent leaves under the lines of a code or diff card. Same as the
// reader's comments, the card already knows the path.
const cardComment = z.object({
  author: z.string().min(1).optional(), // shown as the label
  side: z.enum(["old", "new"]).optional(), // diff cards only, default "new"
  startLine: z.number().int().positive(),
  endLine: z.number().int().positive().optional(),
  body: z.string().min(1)
});

const fileSchema = z.object({ name: z.string(), contents: z.string() });

// Which change of the git repo a Diff shows. changes.mjs takes the same.
const paths = z.array(z.string().trim().min(1)).min(1).optional();
export const diffSourceSchema = z.discriminatedUnion("mode", [
  z.strictObject({ mode: z.enum(["unstaged", "staged", "dirty-tree"]), paths }),
  z.strictObject({ mode: z.literal("merge-base-range"), base: z.string().trim().min(1), head: z.string().trim().min(1), paths })
]);

export const catalog = defineCatalog(schema, {
  components: {
    Page: {
      description:
        "The root of every spec. Its children are Section elements. It adds the big picture box, the section outline, the read-aloud player, the 'Anything to add?' box and the submit bar itself.",
      props: z.object({
        overview: z.string().nullish(),
        // "wide" gives code and diff cards the width of the window. Text keeps its reading width.
        width: z.enum(["base", "wide"]).nullish()
      })
    },
    Section: {
      description:
        "One idea of the page, with a heading that says the point. Only allowed as a child of the Page. Its children are blocks: any other component.",
      props: z.object({
        heading: z.string().min(1)
      })
    },
    Stack: {
      description: "Vertical layout container. Wrap form fields in this.",
      props: z.object({
        gap: z.enum(["sm", "md", "lg"]).nullish()
      })
    },
    Columns: {
      description:
        "Responsive two-column layout. Use for paired form sections or content that benefits from side-by-side layout on wide screens.",
      props: z.object({
        gap: z.enum(["sm", "md", "lg"]).nullish()
      })
    },
    Card: {
      description: "Bordered container with an optional title. A tone marks it as part of a group, like the nodes of a diagram with the same tone.",
      props: z.object({
        title: z.string().nullish(),
        tone: tone.nullish()
      })
    },
    Heading: {
      description: "Sub-heading inside a section. Use **word** to highlight keywords.",
      props: z.object({
        text: z.string()
      })
    },
    Text: {
      description: "One paragraph, read aloud by the player. Use **word** to highlight keywords.",
      props: z.object({
        text: z.string(),
        muted: z.boolean().nullish()
      })
    },
    Code: {
      description:
        "Card with a short piece of code. The reader can comment on its lines. The player announces it and pauses.",
      props: z.object({
        path: z.string().min(1),
        content: z.string().min(1),
        note: z.string().nullish(),
        comments: z.array(cardComment).optional()
      })
    },
    Diff: {
      description:
        "Card with the changes of one file. Give either content (a pasted unified diff) or source (the real change from git, with expandable context). With source and no path it shows the whole change, one card per file.",
      props: z.object({
        path: z.string().min(1).optional(),
        oldPath: z.string().min(1).optional(), // previous name, for renamed files
        // Text from the change to show (one string or several). Other changes in the file stay as plain code.
        contains: z.union([z.string().min(1), z.array(z.string().min(1))]).optional(),
        content: z.string().min(1).optional(),
        source: diffSourceSchema.optional(),
        note: z.string().nullish(),
        // On the whole change a comment names its file.
        comments: z.array(cardComment.extend({ path: z.string().min(1).optional() })).optional(),
        // Filled in by create.mjs from source, so the reader can expand context.
        oldFile: fileSchema.optional(),
        newFile: fileSchema.optional(),
        // The whole change: one card per file. A file too large to carry whole only has its patch.
        files: z.array(z.object({
          path: z.string(),
          oldFile: fileSchema.optional(),
          newFile: fileSchema.optional(),
          content: z.string().optional()
        })).optional(),
        // Changed files with no lines to show, like a binary, each with the reason.
        skipped: z.array(z.string()).optional()
      })
    },
    Image: {
      description: "Image from the artifact's assets folder, with an optional caption.",
      props: z.object({
        // Relative and inside assets/, so a spec never makes the page load a remote address.
        src: z.string().regex(/^assets\/(?!.*\.\.)[^\\:]+$/, "must be a relative path inside assets/, like assets/before.png"),
        alt: z.string(),
        caption: z.string().nullish()
      })
    },
    Divider: {
      description: "Horizontal rule separator.",
      props: z.object({})
    },
    TextField: {
      description:
        "Single-line text input. Bind value with $bindState. Supports text/email/number/url types.",
      props: z.object({
        label: z.string(),
        value: z.string().nullish(),
        type: z.enum(["text", "email", "number", "url"]).nullish(),
        placeholder: z.string().nullish(),
        help: z.string().nullish(),
        required: z.boolean().nullish()
      })
    },
    Textarea: {
      description: "Multi-line text input. Bind value with $bindState.",
      props: z.object({
        label: z.string(),
        value: z.string().nullish(),
        placeholder: z.string().nullish(),
        rows: z.number().nullish(),
        help: z.string().nullish(),
        required: z.boolean().nullish()
      })
    },
    Select: {
      description: "Dropdown select. Bind value with $bindState.",
      props: z.object({
        label: z.string(),
        value: z.string().nullish(),
        options: z.array(option),
        placeholder: z.string().nullish(),
        help: z.string().nullish(),
        required: z.boolean().nullish()
      })
    },
    Checkbox: {
      description: "Single boolean checkbox. Bind checked with $bindState.",
      props: z.object({
        label: z.string(),
        checked: z.boolean().nullish(),
        help: z.string().nullish()
      })
    },
    RadioGroup: {
      description: "Mutually exclusive option group. Bind value with $bindState.",
      props: z.object({
        label: z.string(),
        value: z.string().nullish(),
        options: z.array(option),
        help: z.string().nullish()
      })
    },
    Slideshow: {
      description:
        "Displays a sequence of slides with prev/next navigation. Display-only.",
      props: z.object({
        slides: z.array(z.object({ title: z.string(), body: z.string().nullish() }))
      })
    },
    DiagramFlow: {
      description:
        "Simple relationship diagram for data flow, lifecycle, architecture boundaries, or before/after structure. Use only when a visual makes relationships clearer. A node can take a tone to tell groups apart, like client and server.",
      props: z.object({
        title: z.string().nullish(),
        nodes: z.array(z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          detail: z.string().nullish(),
          tone: tone.nullish()
        })).min(1),
        edges: z.array(z.object({
          from: z.string().min(1),
          to: z.string().min(1),
          label: z.string().nullish()
        }))
      })
    },
    StepNavHorizontal: {
      description:
        "Display-only horizontal step navigation. Use for short flows where persistent progress context helps without spending sidebar space.",
      props: z.object({
        steps: z.array(stepNavStep).min(1)
      })
    },
    StepNavVertical: {
      description:
        "Display-only vertical step navigation. Use for longer walkthroughs or dense wide layouts where a side rail is worth the space.",
      props: z.object({
        steps: z.array(stepNavStep).min(1)
      })
    }
  },
  actions: {}
});
