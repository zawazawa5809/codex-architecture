import { useState } from "react";

const COLORS = {
  primary: "#6366f1",
  secondary: "#22d3ee",
  danger: "#f43f5e",
  success: "#10b981",
  warning: "#f59e0b",
  text: "#e2e8f0",
  muted: "#94a3b8",
  border: "#1e293b",
};

interface ToolNode {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  tier: number;
}

const toolNodes: ToolNode[] = [
  // Tier 0: Router
  { id: "dispatch", label: "ToolRegistry.dispatch()", sublabel: "name -> handler lookup", x: 200, y: 20, w: 220, h: 50, color: COLORS.primary, tier: 0 },

  // Tier 1: Handler types
  { id: "function", label: "FunctionHandler", sublabel: "ToolKind::Function", x: 80, y: 130, w: 160, h: 46, color: COLORS.success, tier: 1 },
  { id: "mcphandler", label: "McpHandler", sublabel: "ToolKind::Mcp", x: 380, y: 130, w: 160, h: 46, color: COLORS.secondary, tier: 1 },

  // Tier 2: Individual tools (Function)
  { id: "shell", label: "Shell", sublabel: "local_shell", x: 10, y: 250, w: 100, h: 42, color: COLORS.danger, tier: 2 },
  { id: "patch", label: "ApplyPatch", sublabel: "apply_patch", x: 120, y: 250, w: 100, h: 42, color: COLORS.warning, tier: 2 },
  { id: "readfile", label: "ReadFile", sublabel: "read_file", x: 230, y: 250, w: 100, h: 42, color: COLORS.primary, tier: 2 },
  { id: "listdir", label: "ListDir", sublabel: "list_dir", x: 10, y: 310, w: 100, h: 42, color: COLORS.primary, tier: 2 },
  { id: "grep", label: "Grep", sublabel: "grep_search", x: 120, y: 310, w: 100, h: 42, color: COLORS.primary, tier: 2 },

  // Tier 2: MCP tools
  { id: "mcptool", label: "MCP Tools", sublabel: "external servers", x: 370, y: 250, w: 120, h: 42, color: COLORS.secondary, tier: 2 },
  { id: "dynamic", label: "Dynamic", sublabel: "runtime registered", x: 500, y: 250, w: 110, h: 42, color: COLORS.secondary, tier: 2 },
];

const edges: { from: string; to: string }[] = [
  { from: "dispatch", to: "function" },
  { from: "dispatch", to: "mcphandler" },
  { from: "function", to: "shell" },
  { from: "function", to: "patch" },
  { from: "function", to: "readfile" },
  { from: "function", to: "listdir" },
  { from: "function", to: "grep" },
  { from: "mcphandler", to: "mcptool" },
  { from: "mcphandler", to: "dynamic" },
];

function center(n: ToolNode) {
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
}

function getAncestors(id: string): Set<string> {
  const result = new Set<string>();
  result.add(id);
  for (const e of edges) {
    if (e.to === id) {
      for (const a of getAncestors(e.from)) result.add(a);
    }
  }
  return result;
}

function getDescendants(id: string): Set<string> {
  const result = new Set<string>();
  result.add(id);
  for (const e of edges) {
    if (e.from === id) {
      for (const d of getDescendants(e.to)) result.add(d);
    }
  }
  return result;
}

export default function ToolSystem() {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodeMap = Object.fromEntries(toolNodes.map((n) => [n.id, n]));

  const highlightSet = hovered
    ? new Set([...getAncestors(hovered), ...getDescendants(hovered)])
    : null;

  function isActive(id: string) {
    if (!highlightSet) return true;
    return highlightSet.has(id);
  }

  return (
    <svg
      viewBox="0 0 640 380"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="Tool System Hierarchy"
    >
      <defs>
        <marker id="tool-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
        <marker id="tool-arrow-active" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.primary} />
        </marker>
      </defs>

      {/* Tier labels */}
      <text x="620" y="48" fill={COLORS.muted} fontSize="10" fontFamily="monospace" textAnchor="end" className="diagram-label">Router</text>
      <text x="620" y="156" fill={COLORS.muted} fontSize="10" fontFamily="monospace" textAnchor="end" className="diagram-label">Handlers</text>
      <text x="620" y="274" fill={COLORS.muted} fontSize="10" fontFamily="monospace" textAnchor="end" className="diagram-label">Tools</text>

      {/* Trait info box */}
      <rect x={340} y={310} width={270} height={52} rx={6} fill={COLORS.primary} fillOpacity={0.05} stroke={COLORS.border} strokeWidth={1} />
      <text x={355} y={330} fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">trait ToolHandler: Send + Sync</text>
      <text x={365} y={346} fill={COLORS.muted} fontSize="9" fontFamily="monospace" className="diagram-label">fn handle(invocation) -&gt; ToolOutput</text>

      {/* Edges */}
      {edges.map((e, i) => {
        const from = nodeMap[e.from];
        const to = nodeMap[e.to];
        if (!from || !to) return null;
        const f = center(from);
        const t = center(to);
        const active = highlightSet && highlightSet.has(e.from) && highlightSet.has(e.to);
        return (
          <line
            key={i}
            x1={f.x}
            y1={from.y + from.h}
            x2={t.x}
            y2={to.y}
            stroke={active ? COLORS.primary : COLORS.border}
            strokeWidth={active ? 2 : 1}
            opacity={highlightSet && !active ? 0.15 : 0.6}
            markerEnd={active ? "url(#tool-arrow-active)" : "url(#tool-arrow)"}
            className="diagram-connection"
          />
        );
      })}

      {/* Nodes */}
      {toolNodes.map((n) => {
        const active = isActive(n.id);
        return (
          <g
            key={n.id}
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            className="diagram-node"
            opacity={active ? 1 : 0.2}
          >
            <rect
              x={n.x} y={n.y} width={n.w} height={n.h}
              rx={6}
              fill={n.color}
              fillOpacity={hovered === n.id ? 0.25 : 0.1}
              stroke={n.color}
              strokeWidth={hovered === n.id ? 2 : 1}
            />
            <text x={n.x + n.w / 2} y={n.y + (n.sublabel ? 18 : n.h / 2 + 4)} textAnchor="middle" fill={COLORS.text} fontSize="11" fontWeight="600" fontFamily="inherit" className="diagram-label">{n.label}</text>
            {n.sublabel && (
              <text x={n.x + n.w / 2} y={n.y + 33} textAnchor="middle" fill={COLORS.muted} fontSize="9" fontFamily="monospace" className="diagram-label">{n.sublabel}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
