import type { SectionMeta } from "./types";
export type { SectionMeta } from "./types";

export const opencodeSections: SectionMeta[] = [
  {
    slug: "overview",
    entryId: "01-overview",
    number: 1,
    accent: "indigo",
    diagram: "OpencodeOverview",
    navKey: "nav.opencode.overview",
  },
  {
    slug: "agent-system",
    entryId: "02-agent-system",
    number: 2,
    accent: "indigo",
    diagram: "OpencodeAgentSystem",
    navKey: "nav.opencode.agentSystem",
  },
  {
    slug: "tool-system",
    entryId: "03-tool-system",
    number: 3,
    accent: "indigo",
    diagram: "OpencodeToolSystem",
    navKey: "nav.opencode.toolSystem",
  },
  {
    slug: "provider-system",
    entryId: "04-provider-system",
    number: 4,
    accent: "rose",
    diagram: "OpencodeProviderSystem",
    badge: { ja: "メインコンテンツ", en: "Main Content" },
    navKey: "nav.opencode.providerSystem",
  },
  {
    slug: "tui-architecture",
    entryId: "05-tui-architecture",
    number: 5,
    accent: "rose",
    diagram: "OpencodeTuiArch",
    badge: { ja: "メインコンテンツ", en: "Main Content" },
    navKey: "nav.opencode.tuiArch",
  },
  {
    slug: "lsp-integration",
    entryId: "06-lsp-integration",
    number: 6,
    accent: "indigo",
    diagram: "OpencodeLspIntegration",
    navKey: "nav.opencode.lspIntegration",
  },
  {
    slug: "session-storage",
    entryId: "07-session-storage",
    number: 7,
    accent: "emerald",
    diagram: "OpencodeSessionStorage",
    navKey: "nav.opencode.sessionStorage",
  },
];

