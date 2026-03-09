import { useState, useMemo } from "react";
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
  shape: "rect" | "rounded";
}

const nodes: FlowNode[] = [
  { id: "input", x: 250, y: 10, w: 140, h: 40, label: "User Input", sublabel: "Prompt / Task", color: COLORS.secondary, shape: "rounded" },

  { id: "router", x: 240, y: 90, w: 160, h: 44, label: "Agent Router", sublabel: "Route by intent", color: COLORS.primary, shape: "rect" },

  { id: "plan", x: 30, y: 180, w: 140, h: 44, label: "Plan Agent", sublabel: "o3-mini / thinking", color: COLORS.warning, shape: "rect" },
  { id: "build", x: 250, y: 180, w: 140, h: 44, label: "Build Agent", sublabel: "Implements code", color: COLORS.success, shape: "rect" },
  { id: "general", x: 470, y: 180, w: 140, h: 44, label: "General Agent", sublabel: "Default handler", color: COLORS.primary, shape: "rect" },

  { id: "session", x: 220, y: 280, w: 200, h: 44, label: "Session Prompt Loop", sublabel: "Messages + System", color: COLORS.primary, shape: "rect" },

  { id: "tools", x: 60, y: 370, w: 150, h: 44, label: "Tool Registry", sublabel: "Built-in + MCP", color: COLORS.success, shape: "rect" },
  { id: "context", x: 430, y: 370, w: 160, h: 44, label: "Context / Compaction", sublabel: "Token management", color: COLORS.warning, shape: "rect" },

  { id: "response", x: 240, y: 430, w: 160, h: 40, label: "Response", sublabel: "Text + Artifacts", color: COLORS.secondary, shape: "rounded" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "input", to: "router", path: "M320,50 L320,90" },
  { from: "router", to: "plan", path: "M240,112 L100,180" },
  { from: "router", to: "build", path: "M320,134 L320,180" },
  { from: "router", to: "general", path: "M400,112 L540,180" },
  { from: "plan", to: "session", path: "M100,224 L220,280" },
  { from: "build", to: "session", path: "M320,224 L320,280" },
  { from: "general", to: "session", path: "M540,224 L420,280" },
  { from: "session", to: "tools", path: "M220,302 L135,370" },
  { from: "session", to: "context", path: "M420,302 L510,370" },
  { from: "tools", to: "session", path: "M60,392 Q20,340 220,300" },
  { from: "context", to: "session", path: "M590,392 Q620,340 420,300" },
  { from: "session", to: "response", path: "M320,324 L320,430" },
];

export default function OpencodeAgentSystem() {
  const [hovered, setHovered] = useState<string | null>(null);

  const connectedSet = useMemo(() => {
    if (!hovered) return null;
    const set = new Set([hovered]);
    for (const e of edges) {
      if (e.from === hovered) set.add(e.to);
      if (e.to === hovered) set.add(e.from);
    }
    return set;
  }, [hovered]);

  function isConnected(id: string) {
    return !connectedSet || connectedSet.has(id);
  }

  return (
    <svg
      viewBox="0 0 640 480"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="OpenCode Agent System - Plan/Build Dual Agent"
    >
      <defs>
        <marker id="oc-ag-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
      </defs>

      {/* Loop label */}
      <text x={15} y={350} fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">loop</text>

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
            markerEnd="url(#oc-ag-arrow)"
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
              rx={n.shape === "rounded" ? 18 : 6}
              fill={n.color} fillOpacity={isHov ? 0.25 : 0.1}
              stroke={n.color} strokeWidth={isHov ? 2 : 1}
            />
            <text x={n.x + n.w / 2} y={n.y + (n.sublabel ? 18 : n.h / 2 + 4)} textAnchor="middle" fill={COLORS.text} fontSize="11" fontWeight="600" fontFamily="inherit" className="diagram-label">{n.label}</text>
            {n.sublabel && <text x={n.x + n.w / 2} y={n.y + 33} textAnchor="middle" fill={COLORS.muted} fontSize="9" fontFamily="monospace" className="diagram-label">{n.sublabel}</text>}
          </g>
        );
      })}
    </svg>
  );
}
