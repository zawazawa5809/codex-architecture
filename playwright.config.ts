import { defineConfig, devices } from "@playwright/test";

const BASE = "/codex-architectuer";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: `http://localhost:4321${BASE}/`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command:
      "npx kill-port 4321 2>/dev/null; npm run build && npm run preview -- --port 4321",
    port: 4321,
    reuseExistingServer: false,
    timeout: 60000,
  },
});
