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
  { id: "request", x: 250, y: 10, w: 140, h: 40, label: "Agent Request", sublabel: "tool_use call", color: COLORS.secondary, shape: "rounded" },

  { id: "permission", x: 220, y: 90, w: 200, h: 50, label: "Permission Gate", sublabel: "allow / deny / ask", color: COLORS.danger, shape: "rect" },

  // Built-in tools row
  { id: "bash", x: 20, y: 200, w: 90, h: 40, label: "bash", color: COLORS.success, shape: "rect" },
  { id: "read", x: 120, y: 200, w: 80, h: 40, label: "read", color: COLORS.success, shape: "rect" },
  { id: "write", x: 210, y: 200, w: 80, h: 40, label: "write", color: COLORS.success, shape: "rect" },
  { id: "edit", x: 300, y: 200, w: 80, h: 40, label: "edit", color: COLORS.success, shape: "rect" },
  { id: "grep", x: 390, y: 200, w: 80, h: 40, label: "grep", color: COLORS.success, shape: "rect" },
  { id: "glob", x: 480, y: 200, w: 80, h: 40, label: "glob", color: COLORS.success, shape: "rect" },

  // MCP tools
  { id: "mcp", x: 440, y: 90, w: 160, h: 50, label: "MCP Tools", sublabel: "External servers", color: COLORS.primary, shape: "rect" },

  { id: "registry", x: 220, y: 300, w: 200, h: 44, label: "Tool Registry", sublabel: "Schema + Execution", color: COLORS.primary, shape: "rect" },

  { id: "result", x: 250, y: 390, w: 140, h: 40, label: "Result", sublabel: "tool_result", color: COLORS.secondary, shape: "rounded" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "request", to: "permission", path: "M320,50 L320,90" },
  { from: "permission", to: "bash", path: "M220,115 L65,200" },
  { from: "permission", to: "read", path: "M240,140 L160,200" },
  { from: "permission", to: "write", path: "M270,140 L250,200" },
  { from: "permission", to: "edit", path: "M320,140 L340,200" },
  { from: "permission", to: "grep", path: "M370,140 L430,200" },
  { from: "permission", to: "glob", path: "M400,140 L520,200" },
  { from: "permission", to: "mcp", path: "M420,115 L440,115" },
  { from: "bash", to: "registry", path: "M65,240 L220,300" },
  { from: "read", to: "registry", path: "M160,240 L260,300" },
  { from: "write", to: "registry", path: "M250,240 L290,300" },
  { from: "edit", to: "registry", path: "M340,240 L330,300" },
  { from: "grep", to: "registry", path: "M430,240 L380,300" },
  { from: "glob", to: "registry", path: "M520,240 L420,300" },
  { from: "mcp", to: "registry", path: "M520,140 Q580,260 420,320" },
  { from: "registry", to: "result", path: "M320,344 L320,390" },
];

export default function OpencodeToolSystem() {
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
      viewBox="0 0 640 450"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="OpenCode Tool System with Permission Gate"
    >
      <defs>
        <marker id="oc-ts-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
      </defs>

      {/* Built-in label */}
      <text x={20} y={195} fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">built-in</text>

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
            markerEnd="url(#oc-ts-arrow)"
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
