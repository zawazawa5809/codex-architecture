import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES_TO_TEST = [
  { path: "./", name: "Home" },
  { path: "./codex/overview", name: "Codex Overview" },
  { path: "./codex/agent-loop", name: "Agent Loop" },
];

test.describe("Accessibility", () => {
  for (const { path, name } of PAGES_TO_TEST) {
    test(`${name} page has no critical a11y violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .disableRules(["color-contrast"]) // skip color contrast for dark theme
        .analyze();

      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      expect(critical).toEqual([]);
    });
  }
});
