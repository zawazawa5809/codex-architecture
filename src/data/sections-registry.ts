import { codexSections } from "./codex-sections";
import { claudeSections } from "./claude-sections";
import type { SectionMeta } from "./types";

const sectionsMap: Record<string, SectionMeta[]> = {
  codex: codexSections,
  claude: claudeSections,
};

export function getSections(agentName: string): SectionMeta[] {
  return sectionsMap[agentName] ?? [];
}

export function getAdjacentForAgent(
  agentName: string,
  slug: string,
): { prev: SectionMeta | undefined; next: SectionMeta | undefined } {
  const sections = getSections(agentName);
  const idx = sections.findIndex((s) => s.slug === slug);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? sections[idx - 1] : undefined,
    next: idx < sections.length - 1 ? sections[idx + 1] : undefined,
  };
}
