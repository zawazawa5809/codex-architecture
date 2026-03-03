import { describe, it, expect } from "vitest";
import { COLORS } from "../colors";

describe("COLORS", () => {
  const expectedKeys = [
    "primary",
    "secondary",
    "danger",
    "success",
    "warning",
    "text",
    "muted",
    "border",
  ] as const;

  it("has all expected keys", () => {
    for (const key of expectedKeys) {
      expect(COLORS).toHaveProperty(key);
    }
  });

  it("has no unexpected keys", () => {
    const actualKeys = Object.keys(COLORS).sort();
    const sortedExpected = [...expectedKeys].sort();
    expect(actualKeys).toEqual(sortedExpected);
  });

  it("all values are hex color strings", () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    for (const [key, value] of Object.entries(COLORS)) {
      expect(value, `COLORS.${key} should be a hex color`).toMatch(hexPattern);
    }
  });

  it("has the expected color values", () => {
    expect(COLORS.primary).toBe("#6366f1");
    expect(COLORS.secondary).toBe("#22d3ee");
    expect(COLORS.danger).toBe("#f43f5e");
    expect(COLORS.success).toBe("#10b981");
    expect(COLORS.warning).toBe("#f59e0b");
    expect(COLORS.text).toBe("#e2e8f0");
    expect(COLORS.muted).toBe("#94a3b8");
    expect(COLORS.border).toBe("#1e293b");
  });
});
