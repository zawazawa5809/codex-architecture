// Keep in sync with CSS custom properties in src/styles/global.css @theme block.
// SVG fill attributes require hex values; CSS var() cannot be used in inline SVG.
export const COLORS = {
  primary: "#6366f1", // --color-accent-indigo
  secondary: "#22d3ee", // --color-accent-cyan
  danger: "#f43f5e", // --color-accent-rose
  success: "#10b981", // --color-accent-emerald
  warning: "#f59e0b", // --color-accent-amber
  text: "#e2e8f0", // --color-text-primary
  muted: "#94a3b8", // --color-text-secondary
  border: "#1e293b", // --color-border
} as const;
