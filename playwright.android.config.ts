import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/android",
  outputDir: "test-results/android",
  timeout: 240_000,
  expect: { timeout: 30_000 },
  workers: 1,
  retries: 0,
  reporter: [["line"], ["json", { outputFile: "test-results/android/report.json" }]],
});
