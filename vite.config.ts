import { defineConfig } from "vite";

export default defineConfig({
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
