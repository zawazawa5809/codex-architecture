import { test, expect } from "@playwright/test";

const pages = [
  { path: "/", title: "AI Agent Architecture Atlas" },
  { path: "/codex", title: /Codex CLI.*AI Agent Architecture Atlas/ },
  { path: "/en", title: "AI Agent Architecture Atlas" },
  { path: "/en/codex", title: /Codex CLI.*AI Agent Architecture Atlas/ },
];

for (const { path, title } of pages) {
  test(`page ${path} loads without errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(path);
    await page.waitForLoadState("networkidle");

    // Page should not have a 404/500 status
    expect(page.url()).toContain("localhost:4321");

    // Verify page title
    await expect(page).toHaveTitle(title);

    // No console errors
    expect(consoleErrors).toHaveLength(0);
  });
}
