import { readFileSync } from "node:fs";
import { defineConfig } from "vitest/config";

const manifest = JSON.parse(readFileSync("custom_components/plan_studio/manifest.json", "utf-8")) as { version: string };

export default defineConfig({
  define: { __PLAN_STUDIO_VERSION__: JSON.stringify(manifest.version) },
  test: {
    include: ["frontend/src/**/*.test.ts", "frontend/test/**/*.test.ts"],
    passWithNoTests: true,
  },
});
