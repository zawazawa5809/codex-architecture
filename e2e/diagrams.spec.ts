import { test, expect } from "@playwright/test";

const MOBILE_VIEWPORT = { width: 375, height: 812 };
const DIAGRAM_PAGES = [
  "overview",
  "agent-loop",
  "tool-system",
  "sandbox",
  "approval",
];

test.describe("Diagram pages", () => {
  for (const slug of DIAGRAM_PAGES) {
    test(`${slug} page renders diagram`, async ({ page }) => {
      await page.goto(`./codex/${slug}`);
      await page.waitForLoadState("networkidle");

      // Diagram container should exist
      const diagramContainer = page.locator("[class*='overflow-x-auto']").first();
      await expect(diagramContainer).toBeVisible();
    });
  }
});

test.describe("Diagrams mobile viewport", () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  for (const slug of DIAGRAM_PAGES) {
    test(`${slug} diagram does not overflow its container on mobile`, async ({ page }) => {
      await page.goto(`./codex/${slug}`);
      await page.waitForLoadState("networkidle");

      // Check that the diagram SVG fits within its container (no inner overflow)
      const diagramContainer = page.locator("[class*='overflow-x-auto']").first();
      const overflows = await diagramContainer.evaluate((el) => {
        return el.scrollWidth > el.clientWidth;
      });
      expect(overflows).toBe(false);
    });
  }
});
