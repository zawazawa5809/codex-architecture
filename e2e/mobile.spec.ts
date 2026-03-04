import { test, expect } from "@playwright/test";

const MOBILE_VIEWPORT = { width: 375, height: 812 };

test.use({ viewport: MOBILE_VIEWPORT });

test.describe("Mobile responsive layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./codex");
    await page.waitForLoadState("networkidle");
  });

  test("hamburger menu button is visible on mobile", async ({ page }) => {
    const hamburgerBtn = page.locator("#mobile-menu-btn");
    await expect(hamburgerBtn).toBeVisible();
  });

  test("desktop nav links are hidden on mobile", async ({ page }) => {
    const desktopNav = page.locator("nav .hidden.items-center.gap-1.lg\\:flex");
    await expect(desktopNav).toBeHidden();
  });

  test("clicking hamburger opens mobile menu", async ({ page }) => {
    const hamburgerBtn = page.locator("#mobile-menu-btn");
    const mobileMenu = page.locator("#mobile-menu");

    await expect(mobileMenu).toBeHidden();
    await hamburgerBtn.click();
    await expect(mobileMenu).toBeVisible();
    await expect(hamburgerBtn).toHaveAttribute("aria-expanded", "true");
  });

  test("clicking a link in mobile menu navigates to section page", async ({ page }) => {
    const hamburgerBtn = page.locator("#mobile-menu-btn");
    const mobileMenu = page.locator("#mobile-menu");

    await hamburgerBtn.click();
    await expect(mobileMenu).toBeVisible();

    const mobileNavLink = page.locator(".mobile-nav-link").first();
    await mobileNavLink.click();

    // Should navigate to a section page
    await page.waitForURL("**/codex/**");
    expect(page.url()).toContain("/codex/");
  });

  test("sidebar is hidden on mobile", async ({ page }) => {
    await page.goto("./codex/overview");
    await page.waitForLoadState("networkidle");

    const sidebar = page.locator("aside");
    await expect(sidebar).toBeHidden();
  });

  test("content has no horizontal overflow on mobile", async ({ page }) => {
    await page.goto("./codex/overview");
    await page.waitForLoadState("networkidle");

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});

test.describe("Tablet responsive layout (768px)", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("sidebar is hidden on tablet", async ({ page }) => {
    await page.goto("./codex/overview");
    await page.waitForLoadState("networkidle");

    const sidebar = page.locator("aside");
    await expect(sidebar).toBeHidden();
  });

  test("hamburger menu works on tablet", async ({ page }) => {
    await page.goto("./codex/overview");
    await page.waitForLoadState("networkidle");

    const hamburgerBtn = page.locator("#mobile-menu-btn");
    await expect(hamburgerBtn).toBeVisible();

    await hamburgerBtn.click();
    const mobileMenu = page.locator("#mobile-menu");
    // Menu should become visible (check it's not hidden)
    await expect(mobileMenu).toBeVisible();
  });
});
