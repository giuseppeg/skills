import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Builds the viewer into dist/_core/ of the skill, the only thing of this
// folder that ships: boot.js starts the page and yourturn.js
// holds what components share, like Prose. Libraries are not bundled. The page
// loads them by name through the import map in public/index.html, so the
// viewer, the project's components and the diff library share one React. The
// views that need a heavy library stay behind dynamic imports, as small chunks.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../../skills/yourturn/dist",
    emptyOutDir: true,
    target: "es2022",
    cssCodeSplit: false,
    // Agents read the theme block of the built stylesheet, comments included,
    // see "Visual rules" in references/components.md.
    cssMinify: false,
    modulePreload: false,
    rollupOptions: {
      input: { boot: "src/main.tsx", yourturn: "src/page.tsx" },
      external: [/^react(-dom)?(\/|$)/, /^@json-render\//, "zod", /^@pierre\/diffs(\/|$)/, "@renoun/screenshot"],
      // boot.js imports the shared code from yourturn.js instead of a third chunk.
      preserveEntrySignatures: "allow-extension",
      output: {
        entryFileNames: "_core/[name].js",
        chunkFileNames: "_core/[name].js",
        assetFileNames: "_core/[name][extname]"
      }
    }
  }
});
