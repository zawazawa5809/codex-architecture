import { describe, it, expect } from "vitest";
import { getSections, getAdjacentForAgent } from "../sections-registry";
import { codexSections } from "../codex-sections";
import { claudeSections } from "../claude-sections";

describe("getSections", () => {
  it("returns codex sections for 'codex'", () => {
    expect(getSections("codex")).toBe(codexSections);
  });

  it("returns claude sections for 'claude'", () => {
    expect(getSections("claude")).toBe(claudeSections);
  });

  it("returns empty array for unknown agent", () => {
    expect(getSections("unknown")).toEqual([]);
  });
});

describe("getAdjacentForAgent", () => {
  it("returns codex adjacent sections", () => {
    const { prev, next } = getAdjacentForAgent("codex", "agent-loop");
    expect(prev?.slug).toBe("overview");
    expect(next?.slug).toBe("tool-system");
  });

  it("returns claude adjacent sections", () => {
    const { prev, next } = getAdjacentForAgent("claude", "skills");
    expect(prev?.slug).toBe("claude-md");
    expect(next?.slug).toBe("hooks");
  });

  it("returns undefined for unknown agent", () => {
    const { prev, next } = getAdjacentForAgent("unknown", "anything");
    expect(prev).toBeUndefined();
    expect(next).toBeUndefined();
  });

  it("returns undefined for unknown slug on known agent", () => {
    const { prev, next } = getAdjacentForAgent("codex", "nonexistent");
    expect(prev).toBeUndefined();
    expect(next).toBeUndefined();
  });
});
