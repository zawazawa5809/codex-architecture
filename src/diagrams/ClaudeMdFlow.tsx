import { useState } from "react";
import { COLORS } from "./colors";

interface FlowNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel?: string;
  color: string;
}

const nodes: FlowNode[] = [
  // Source files (left column)
  { id: "global", x: 30, y: 20, w: 180, h: 44, label: "~/.claude/CLAUDE.md", sublabel: "Global instructions", color: COLORS.warning },
  { id: "project", x: 30, y: 100, w: 180, h: 44, label: "./CLAUDE.md", sublabel: "Project instructions", color: COLORS.primary },
  { id: "local", x: 30, y: 180, w: 180, h: 44, label: ".claude/settings.json", sublabel: "Local overrides", color: COLORS.secondary },

  // Merge
  { id: "merge", x: 300, y: 100, w: 140, h: 44, label: "Merge & Resolve", sublabel: "Priority cascade", color: COLORS.success },

  // Output
  { id: "system-prompt", x: 300, y: 210, w: 140, h: 44, label: "System Prompt", sublabel: "Final context", color: COLORS.primary },

  // Memory system (right)
  { id: "memory", x: 500, y: 20, w: 140, h: 44, label: "Auto Memory", sublabel: "~/.claude/memory/", color: COLORS.warning },
  { id: "persist", x: 500, y: 100, w: 140, h: 44, label: "Persist", sublabel: "Cross-session", color: COLORS.muted },

  // Priority legend
  { id: "p1", x: 30, y: 290, w: 60, h: 28, label: "Low", sublabel: undefined, color: COLORS.warning },
  { id: "p2", x: 110, y: 290, w: 80, h: 28, label: "Medium", sublabel: undefined, color: COLORS.primary },
  { id: "p3", x: 210, y: 290, w: 60, h: 28, label: "High", sublabel: undefined, color: COLORS.secondary },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "global", to: "merge", path: "M210,42 L300,122" },
  { from: "project", to: "merge", path: "M210,122 L300,122" },
  { from: "local", to: "merge", path: "M210,202 L300,122" },
  { from: "merge", to: "system-prompt", path: "M370,144 L370,210" },
  { from: "memory", to: "merge", path: "M500,42 Q440,70 440,100" },
  { from: "memory", to: "persist", path: "M570,64 L570,100" },
];

export default function ClaudeMdFlow() {
  const [hovered, setHovered] = useState<string | null>(null);

  function isConnected(id: string) {
    if (!hovered) return true;
    if (id === hovered) return true;
    return edges.some(
      (e) =>
        (e.from === hovered && e.to === id) ||
        (e.to === hovered && e.from === id),
    );
  }

  return (
    <svg
      viewBox="0 0 680 340"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="CLAUDE.md Configuration Hierarchy"
    >
      <defs>
        <marker id="cmd-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
      </defs>

      {/* Priority label */}
      <text x={30} y={278} fill={COLORS.muted} fontSize="10" fontWeight="600" fontFamily="monospace" className="diagram-label">Priority:</text>

      {/* Edges */}
      {edges.map((e, i) => {
        const active = isConnected(e.from) && isConnected(e.to);
        return (
          <path
            key={i}
            d={e.path}
            fill="none"
            stroke={active ? COLORS.primary : COLORS.border}
            strokeWidth={active ? 1.5 : 1}
            opacity={hovered && !active ? 0.12 : 0.5}
            markerEnd="url(#cmd-arrow)"
            className="diagram-connection"
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const active = isConnected(n.id);
        const isHov = hovered === n.id;
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
              fill={n.color} fillOpacity={isHov ? 0.25 : 0.1}
              stroke={n.color} strokeWidth={isHov ? 2 : 1}
            />
            <text x={n.x + n.w / 2} y={n.y + (n.sublabel ? 17 : n.h / 2 + 4)} textAnchor="middle" fill={COLORS.text} fontSize="11" fontWeight="600" fontFamily="inherit" className="diagram-label">{n.label}</text>
            {n.sublabel && <text x={n.x + n.w / 2} y={n.y + 32} textAnchor="middle" fill={COLORS.muted} fontSize="9" fontFamily="monospace" className="diagram-label">{n.sublabel}</text>}
          </g>
        );
      })}
    </svg>
  );
}
