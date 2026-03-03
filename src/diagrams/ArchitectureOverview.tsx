import { useState } from "react";
import { COLORS } from "./colors";

interface NodeDef {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel?: string;
  color: string;
  layer: string;
}

interface ConnectionDef {
  from: string;
  to: string;
  label?: string;
  highlight?: string;
}

const nodes: NodeDef[] = [
  // CLI layer (Node.js)
  { id: "cli", x: 60, y: 30, w: 160, h: 50, label: "codex-cli", sublabel: "Node.js / Ink", color: COLORS.secondary, layer: "frontend" },
  { id: "config", x: 280, y: 30, w: 120, h: 50, label: "Config", sublabel: "TOML / JSON", color: COLORS.warning, layer: "frontend" },

  // Protocol layer
  { id: "sq", x: 100, y: 140, w: 100, h: 44, label: "SQ", sublabel: "Submission", color: COLORS.primary, layer: "protocol" },
  { id: "eq", x: 280, y: 140, w: 100, h: 44, label: "EQ", sublabel: "Events", color: COLORS.primary, layer: "protocol" },

  // Core layer (Rust)
  { id: "session", x: 60, y: 250, w: 120, h: 44, label: "Session", sublabel: "State mgmt", color: COLORS.success, layer: "core" },
  { id: "turn", x: 210, y: 250, w: 100, h: 44, label: "Turn", sublabel: "Agent loop", color: COLORS.success, layer: "core" },
  { id: "task", x: 340, y: 250, w: 100, h: 44, label: "Task", sublabel: "Execution", color: COLORS.success, layer: "core" },

  // Tools layer
  { id: "tools", x: 60, y: 350, w: 140, h: 44, label: "ToolRegistry", sublabel: "Dispatch", color: COLORS.primary, layer: "tools" },
  { id: "mcp", x: 240, y: 350, w: 100, h: 44, label: "MCP", sublabel: "External", color: COLORS.secondary, layer: "tools" },

  // Sandbox layer
  { id: "sandbox", x: 380, y: 350, w: 120, h: 44, label: "Sandbox", sublabel: "Isolation", color: COLORS.danger, layer: "sandbox" },
];

const connections: ConnectionDef[] = [
  { from: "cli", to: "sq", label: "submit", highlight: "protocol" },
  { from: "eq", to: "cli", label: "events", highlight: "protocol" },
  { from: "config", to: "cli" },
  { from: "sq", to: "session", highlight: "core" },
  { from: "session", to: "eq", highlight: "core" },
  { from: "session", to: "turn" },
  { from: "turn", to: "task" },
  { from: "task", to: "tools" },
  { from: "task", to: "mcp" },
  { from: "task", to: "sandbox" },
];

function getNodeCenter(n: NodeDef) {
  return { cx: n.x + n.w / 2, cy: n.y + n.h / 2 };
}

export default function ArchitectureOverview() {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  function isHighlighted(nodeId: string) {
    if (!hovered) return false;
    const h = nodeMap[hovered];
    const n = nodeMap[nodeId];
    if (!h || !n) return false;
    return h.layer === n.layer || nodeId === hovered;
  }

  function connHighlighted(c: ConnectionDef) {
    if (!hovered) return false;
    return c.from === hovered || c.to === hovered;
  }

  return (
    <svg
      viewBox="0 0 560 430"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="Codex CLI Architecture Overview"
    >
      {/* Layer backgrounds */}
      <rect x="30" y="15" width="430" height="75" rx="8" fill={COLORS.secondary} fillOpacity={0.04} stroke={COLORS.border} strokeWidth={1} />
      <text x="470" y="55" fill={COLORS.muted} fontSize="11" fontFamily="inherit">Frontend</text>

      <rect x="70" y="120" width="340" height="80" rx="8" fill={COLORS.primary} fillOpacity={0.04} stroke={COLORS.border} strokeWidth={1} />
      <text x="420" y="165" fill={COLORS.muted} fontSize="11" fontFamily="inherit">Protocol</text>

      <rect x="30" y="230" width="430" height="80" rx="8" fill={COLORS.success} fillOpacity={0.04} stroke={COLORS.border} strokeWidth={1} />
      <text x="470" y="275" fill={COLORS.muted} fontSize="11" fontFamily="inherit">Core (Rust)</text>

      <rect x="30" y="330" width="490" height="80" rx="8" fill={COLORS.danger} fillOpacity={0.04} stroke={COLORS.border} strokeWidth={1} />
      <text x="470" y="345" fill={COLORS.muted} fontSize="11" fontFamily="inherit">Tools &amp; Sandbox</text>

      {/* Connections */}
      {connections.map((c, i) => {
        const from = nodeMap[c.from];
        const to = nodeMap[c.to];
        if (!from || !to) return null;
        const f = getNodeCenter(from);
        const t = getNodeCenter(to);
        const active = connHighlighted(c);
        return (
          <g key={i}>
            <line
              x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy}
              stroke={active ? COLORS.primary : COLORS.border}
              strokeWidth={active ? 2 : 1}
              opacity={hovered && !active ? 0.2 : 0.7}
              className="diagram-connection"
              markerEnd="url(#arrowhead)"
            />
            {c.label && (
              <text
                x={(f.cx + t.cx) / 2 + 8}
                y={(f.cy + t.cy) / 2 - 6}
                fill={active ? COLORS.text : COLORS.muted}
                fontSize="9"
                fontFamily="monospace"
                className="diagram-label"
              >
                {c.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const active = !hovered || isHighlighted(n.id);
        return (
          <g
            key={n.id}
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            className="diagram-node"
            opacity={active ? 1 : 0.3}
          >
            <rect
              x={n.x} y={n.y} width={n.w} height={n.h}
              rx={6}
              fill={n.color}
              fillOpacity={hovered === n.id ? 0.25 : 0.1}
              stroke={n.color}
              strokeWidth={hovered === n.id ? 2 : 1}
            />
            <text
              x={n.x + n.w / 2} y={n.y + (n.sublabel ? 20 : n.h / 2 + 4)}
              textAnchor="middle"
              fill={COLORS.text}
              fontSize="12"
              fontWeight="600"
              fontFamily="inherit"
              className="diagram-label"
            >
              {n.label}
            </text>
            {n.sublabel && (
              <text
                x={n.x + n.w / 2} y={n.y + 35}
                textAnchor="middle"
                fill={COLORS.muted}
                fontSize="9"
                fontFamily="monospace"
                className="diagram-label"
              >
                {n.sublabel}
              </text>
            )}
          </g>
        );
      })}

      {/* Arrow marker */}
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={COLORS.muted} />
        </marker>
      </defs>
    </svg>
  );
}
