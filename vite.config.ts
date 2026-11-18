import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

// The bundle's own version, compared with the server's (`plan_studio/info`) to tell a stale open tab.
const manifest = JSON.parse(readFileSync("custom_components/plan_studio/manifest.json", "utf-8")) as { version: string };

export default defineConfig({
  define: { __PLAN_STUDIO_VERSION__: JSON.stringify(manifest.version) },
  build: {
    lib: {
      entry: "frontend/src/panel/plan-studio-panel.ts",
      formats: ["es"],
      fileName: () => "plan-studio-panel.js",
    },
    outDir: "custom_components/plan_studio/frontend",
    emptyOutDir: false,
  },
});
