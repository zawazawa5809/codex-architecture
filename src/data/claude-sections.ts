import type { SectionMeta } from "./types";
export type { SectionMeta } from "./types";

export const claudeSections: SectionMeta[] = [
  {
    slug: "overview",
    entryId: "01-overview",
    number: 1,
    accent: "indigo",
    diagram: "ClaudeOverview",
    navKey: "nav.claude.overview",
  },
  {
    slug: "claude-md",
    entryId: "02-claude-md",
    number: 2,
    accent: "indigo",
    diagram: "ClaudeMdFlow",
    navKey: "nav.claude.claudeMd",
  },
  {
    slug: "skills",
    entryId: "03-skills",
    number: 3,
    accent: "indigo",
    diagram: "SkillsFlow",
    navKey: "nav.claude.skills",
  },
  {
    slug: "hooks",
    entryId: "04-hooks",
    number: 4,
    accent: "rose",
    diagram: "HooksFlow",
    navKey: "nav.claude.hooks",
  },
  {
    slug: "mcp",
    entryId: "05-mcp",
    number: 5,
    accent: "indigo",
    diagram: "McpIntegration",
    navKey: "nav.claude.mcp",
  },
  {
    slug: "permissions",
    entryId: "06-permissions",
    number: 6,
    accent: "rose",
    diagram: "PermissionsFlow",
    navKey: "nav.claude.permissions",
  },
];

export function getClaudeSectionBySlug(
  slug: string,
): SectionMeta | undefined {
  return claudeSections.find((s) => s.slug === slug);
}

export function getClaudeAdjacentSections(slug: string): {
  prev: SectionMeta | undefined;
  next: SectionMeta | undefined;
} {
  const idx = claudeSections.findIndex((s) => s.slug === slug);
  return {
    prev: idx > 0 ? claudeSections[idx - 1] : undefined,
    next: idx < claudeSections.length - 1 ? claudeSections[idx + 1] : undefined,
  };
}
