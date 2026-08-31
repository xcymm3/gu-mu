import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.SMOKE_BASE_URL;

if (!baseURL) {
  throw new Error("SMOKE_BASE_URL is required for production smoke tests");
}

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "production-smoke.ts",
  outputDir: "./test-results/production-smoke",
  fullyParallel: false,
  workers: 1,
  timeout: 360_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [["line"]],
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
});
