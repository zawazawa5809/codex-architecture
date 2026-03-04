import { test, expect } from "@playwright/test";

const BASE = "/codex-architecture";

test.describe("Language toggle navigation", () => {
  test("language toggle on index navigates to /en", async ({ page }) => {
    await page.goto("./");
    await page.waitForLoadState("networkidle");

    const langToggle = page.getByRole("button", { name: /JP \/ EN/i });
    await langToggle.click();

    await page.waitForURL("**/en**");
    expect(page.url()).toContain("/en");
  });

  test("language toggle on /en navigates back", async ({ page }) => {
    await page.goto("./en");
    await page.waitForLoadState("networkidle");

    const langToggle = page.getByRole("button", { name: /JP \/ EN/i });
    await langToggle.click();

    await page.waitForURL((url) => !url.pathname.includes("/en"));
    expect(page.url()).not.toContain("/en");
  });
});

test.describe("Index page card links", () => {
  test("Codex CLI card navigates to /codex", async ({ page }) => {
    await page.goto("./");
    await page.waitForLoadState("networkidle");

    // Find the Codex CLI link card
    const codexLink = page.locator(`a[href="${BASE}/codex"]`).first();
    await codexLink.click();

    await page.waitForURL("**/codex");
    expect(page.url()).toContain("/codex");
    expect(page.url()).not.toContain("/en/codex");
  });

  test("Codex CLI card on /en navigates to /en/codex", async ({ page }) => {
    await page.goto("./en");
    await page.waitForLoadState("networkidle");

    const codexLink = page.locator(`a[href="${BASE}/en/codex"]`).first();
    await codexLink.click();

    await page.waitForURL("**/en/codex");
    expect(page.url()).toContain("/en/codex");
  });
});
