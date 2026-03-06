import { describe, it, expect } from "vitest";
import {
  claudeSections,
  getClaudeSectionBySlug,
  getClaudeAdjacentSections,
} from "../claude-sections";

describe("claudeSections", () => {
  it("has 6 sections", () => {
    expect(claudeSections).toHaveLength(6);
  });

  it("has unique slugs", () => {
    const slugs = claudeSections.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique entryIds", () => {
    const ids = claudeSections.map((s) => s.entryId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has sequential numbers starting from 1", () => {
    claudeSections.forEach((s, i) => {
      expect(s.number).toBe(i + 1);
    });
  });

  it("all sections have navKey prefixed with nav.claude.", () => {
    claudeSections.forEach((s) => {
      expect(s.navKey).toMatch(/^nav\.claude\./);
    });
  });

  it("all sections have a diagram key", () => {
    claudeSections.forEach((s) => {
      expect(s.diagram).toBeDefined();
    });
  });
});

describe("getClaudeSectionBySlug", () => {
  it("returns section for valid slug", () => {
    const section = getClaudeSectionBySlug("overview");
    expect(section).toBeDefined();
    expect(section?.entryId).toBe("01-overview");
  });

  it("returns undefined for invalid slug", () => {
    expect(getClaudeSectionBySlug("nonexistent")).toBeUndefined();
  });
});

describe("getClaudeAdjacentSections", () => {
  it("returns no prev for first section", () => {
    const { prev, next } = getClaudeAdjacentSections("overview");
    expect(prev).toBeUndefined();
    expect(next?.slug).toBe("claude-md");
  });

  it("returns no next for last section", () => {
    const { prev, next } = getClaudeAdjacentSections("permissions");
    expect(prev?.slug).toBe("mcp");
    expect(next).toBeUndefined();
  });

  it("returns both prev and next for middle section", () => {
    const { prev, next } = getClaudeAdjacentSections("hooks");
    expect(prev?.slug).toBe("skills");
    expect(next?.slug).toBe("mcp");
  });
});
