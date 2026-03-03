import { test, expect } from "@playwright/test";

test.describe("Language toggle navigation", () => {
  test("language toggle on / navigates to /en", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const langToggle = page.getByRole("button", { name: /toggle language/i });
    await langToggle.click();

    await page.waitForURL("**/en**");
    expect(page.url()).toContain("/en");
  });

  test("language toggle on /en navigates back to /", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    const langToggle = page.getByRole("button", { name: /toggle language/i });
    await langToggle.click();

    await page.waitForURL((url) => !url.pathname.startsWith("/en"));
    expect(page.url()).not.toContain("/en");
  });
});

test.describe("Index page card links", () => {
  test("Codex CLI card on / navigates to /codex", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find the Codex CLI link card (href contains /codex)
    const codexLink = page.locator('a[href="/codex"]').first();
    await codexLink.click();

    await page.waitForURL("**/codex");
    expect(page.url()).toContain("/codex");
    // Should not be the EN version
    expect(page.url()).not.toContain("/en/codex");
  });

  test("Codex CLI card on /en navigates to /en/codex", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    // Find the Codex CLI link card (href contains /en/codex)
    const codexLink = page.locator('a[href="/en/codex"]').first();
    await codexLink.click();

    await page.waitForURL("**/en/codex");
    expect(page.url()).toContain("/en/codex");
  });
});
