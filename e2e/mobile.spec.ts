import { test, expect } from "@playwright/test";

const MOBILE_VIEWPORT = { width: 375, height: 812 };

test.use({ viewport: MOBILE_VIEWPORT });

test.describe("Mobile responsive layout", () => {
  test.beforeEach(async ({ page }) => {
    // Use /codex page which has the full nav with section links
    await page.goto("/codex");
    await page.waitForLoadState("networkidle");
  });

  test("hamburger menu button is visible on mobile", async ({ page }) => {
    const hamburgerBtn = page.locator("#mobile-menu-btn");
    await expect(hamburgerBtn).toBeVisible();
  });

  test("desktop nav links are hidden on mobile", async ({ page }) => {
    // The desktop nav links container uses `hidden lg:flex` - invisible on mobile
    const desktopNav = page.locator("nav .hidden.items-center.gap-1.lg\\:flex");
    await expect(desktopNav).toBeHidden();
  });

  test("clicking hamburger opens mobile menu", async ({ page }) => {
    const hamburgerBtn = page.locator("#mobile-menu-btn");
    const mobileMenu = page.locator("#mobile-menu");

    // Menu should start hidden
    await expect(mobileMenu).toBeHidden();

    // Click hamburger
    await hamburgerBtn.click();

    // Menu should now be visible
    await expect(mobileMenu).toBeVisible();

    // aria-expanded should be true
    await expect(hamburgerBtn).toHaveAttribute("aria-expanded", "true");
  });

  test("clicking a link in mobile menu closes the menu", async ({ page }) => {
    const hamburgerBtn = page.locator("#mobile-menu-btn");
    const mobileMenu = page.locator("#mobile-menu");

    // Open the menu
    await hamburgerBtn.click();
    await expect(mobileMenu).toBeVisible();

    // Click a mobile nav link
    const mobileNavLink = page.locator(".mobile-nav-link").first();
    await mobileNavLink.click();

    // Menu should be closed after clicking a link
    await expect(mobileMenu).toBeHidden();

    // aria-expanded should be false
    await expect(hamburgerBtn).toHaveAttribute("aria-expanded", "false");
  });
});
