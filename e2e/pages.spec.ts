import { test, expect } from "@playwright/test";

// Paths are relative to Playwright baseURL (http://localhost:4321/codex-architecture)
// Use "./" prefix for baseURL-relative resolution
const pages = [
  { path: "./", title: "AI Agent Architecture Atlas" },
  { path: "./codex", title: /Codex CLI.*AI Agent Architecture Atlas/ },
  { path: "./en", title: "AI Agent Architecture Atlas" },
  { path: "./en/codex", title: /Codex CLI.*AI Agent Architecture Atlas/ },
  // Section pages
  { path: "./codex/overview", title: /.*Codex CLI/ },
  { path: "./codex/sandbox", title: /.*Codex CLI/ },
  { path: "./en/codex/overview", title: /.*Codex CLI/ },
  { path: "./en/codex/takeaways", title: /.*Codex CLI/ },
];

for (const { path, title } of pages) {
  test(`page ${path} loads without errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto(path);

    // Page should return a successful HTTP status
    expect(response?.ok()).toBe(true);

    // Verify page title
    await expect(page).toHaveTitle(title);

    // No console errors
    expect(consoleErrors).toHaveLength(0);
  });
}
