export type { DiagramKey, AccentColor, SectionMeta } from "./types";
import type { SectionMeta } from "./types";

export const codexSections: SectionMeta[] = [
  {
    slug: "overview",
    entryId: "01-overview",
    number: 1,
    accent: "indigo",
    diagram: "ArchitectureOverview",
    extraDiagram: "SqEqAnimation",
    extraDiagramLabel: { ja: "SQ/EQ メッセージフロー", en: "SQ/EQ Message Flow" },
    navKey: "nav.overview",
  },
  {
    slug: "agent-loop",
    entryId: "02-agent-loop",
    number: 2,
    accent: "indigo",
    diagram: "AgentLoop",
    navKey: "nav.agentLoop",
  },
  {
    slug: "tool-system",
    entryId: "03-tool-system",
    number: 3,
    accent: "indigo",
    diagram: "ToolSystem",
    navKey: "nav.toolSystem",
  },
  {
    slug: "sandbox",
    entryId: "04-sandbox",
    number: 4,
    accent: "rose",
    diagram: "SandboxFlow",
    badge: { ja: "メインコンテンツ", en: "Main Content" },
    navKey: "nav.sandbox",
  },
  {
    slug: "approval",
    entryId: "05-approval",
    number: 5,
    accent: "indigo",
    diagram: "ApprovalFlow",
    navKey: "nav.approval",
  },
  {
    slug: "config",
    entryId: "06-config",
    number: 6,
    accent: "indigo",
    navKey: "nav.config",
  },
  {
    slug: "comparison",
    entryId: "07-comparison",
    number: 7,
    accent: "indigo",
    hasComparisonTable: true,
    navKey: "nav.comparison",
  },
  {
    slug: "takeaways",
    entryId: "08-takeaways",
    number: 8,
    accent: "emerald",
    navKey: "nav.takeaways",
  },
];

export function getSectionBySlug(slug: string): SectionMeta | undefined {
  return codexSections.find((s) => s.slug === slug);
}

export function getAdjacentSections(slug: string): {
  prev: SectionMeta | undefined;
  next: SectionMeta | undefined;
} {
  const idx = codexSections.findIndex((s) => s.slug === slug);
  return {
    prev: idx > 0 ? codexSections[idx - 1] : undefined,
    next: idx < codexSections.length - 1 ? codexSections[idx + 1] : undefined,
  };
}
