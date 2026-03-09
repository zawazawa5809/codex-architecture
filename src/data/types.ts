export type DiagramKey =
  // Codex
  | "ArchitectureOverview"
  | "SqEqAnimation"
  | "AgentLoop"
  | "ToolSystem"
  | "SandboxFlow"
  | "ApprovalFlow"
  // Claude Code
  | "ClaudeOverview"
  | "ClaudeMdFlow"
  | "SkillsFlow"
  | "HooksFlow"
  | "HooksEventMap"
  | "McpIntegration"
  | "PermissionsFlow"
  // OpenCode
  | "OpencodeOverview"
  | "OpencodeAgentSystem"
  | "OpencodeToolSystem"
  | "OpencodeProviderSystem"
  | "OpencodeTuiArch"
  | "OpencodeLspIntegration"
  | "OpencodeSessionStorage";

export type AccentColor = "indigo" | "rose" | "emerald";

export interface SectionMeta {
  /** URL slug (without number prefix) */
  slug: string;
  /** Content collection entry ID (filename without .mdx) */
  entryId: string;
  /** Section number displayed in the badge */
  number: number;
  /** Accent color for the section badge */
  accent: AccentColor;
  /** Primary diagram component key */
  diagram?: DiagramKey;
  /** Secondary diagram (e.g., SqEqAnimation in overview) */
  extraDiagram?: DiagramKey;
  /** Extra diagram label */
  extraDiagramLabel?: Record<string, string>;
  /** Badge text (e.g., "メインコンテンツ" for sandbox) */
  badge?: Record<string, string>;
  /** Whether this section has a ComparisonTable */
  hasComparisonTable?: boolean;
  /** i18n nav key for the section label */
  navKey: string;
}
