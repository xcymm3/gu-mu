import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/desktop",
  outputDir: "./test-results/desktop",
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 15_000 },
  reporter: [["line"], ["json", { outputFile: "test-results/desktop/report.json" }]],
});
