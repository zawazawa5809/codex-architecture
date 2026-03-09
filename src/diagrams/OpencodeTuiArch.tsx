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
  { id: "terminal", x: 250, y: 10, w: 140, h: 40, label: "Terminal", sublabel: "stdin / stdout", color: COLORS.secondary, shape: "rounded" },

  { id: "opentui", x: 210, y: 90, w: 220, h: 44, label: "OpenTUI", sublabel: "@opentui/solid", color: COLORS.primary, shape: "rect" },

  // SolidJS components row
  { id: "timeline", x: 30, y: 190, w: 120, h: 44, label: "Timeline", sublabel: "Message list", color: COLORS.success, shape: "rect" },
  { id: "prompt", x: 170, y: 190, w: 120, h: 44, label: "Prompt", sublabel: "User input", color: COLORS.success, shape: "rect" },
  { id: "review", x: 350, y: 190, w: 120, h: 44, label: "Review", sublabel: "Diff viewer", color: COLORS.success, shape: "rect" },
  { id: "diff", x: 490, y: 190, w: 120, h: 44, label: "Diff", sublabel: "File changes", color: COLORS.success, shape: "rect" },

  { id: "bus", x: 210, y: 290, w: 220, h: 50, label: "Event Bus", sublabel: "Bus.emit / subscribe", color: COLORS.warning, shape: "rect" },

  { id: "sse", x: 230, y: 390, w: 180, h: 40, label: "Server SSE", sublabel: "Real-time stream", color: COLORS.secondary, shape: "rounded" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "terminal", to: "opentui", path: "M320,50 L320,90" },
  { from: "opentui", to: "timeline", path: "M210,134 L90,190" },
  { from: "opentui", to: "prompt", path: "M280,134 L230,190" },
  { from: "opentui", to: "review", path: "M360,134 L410,190" },
  { from: "opentui", to: "diff", path: "M430,134 L550,190" },
  { from: "timeline", to: "bus", path: "M90,234 L210,290" },
  { from: "prompt", to: "bus", path: "M230,234 L280,290" },
  { from: "review", to: "bus", path: "M410,234 L360,290" },
  { from: "diff", to: "bus", path: "M550,234 L430,290" },
  { from: "bus", to: "sse", path: "M320,340 L320,390" },
  { from: "sse", to: "bus", path: "M410,410 Q500,360 430,315" },
  { from: "bus", to: "opentui", path: "M210,310 Q100,220 210,120" },
];

export default function OpencodeTuiArch() {
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
      aria-label="OpenCode TUI Architecture"
    >
      <defs>
        <marker id="oc-tui-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
      </defs>

      {/* Reactivity label */}
      <text x={90} y={260} fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">reactivity</text>
      <text x={490} y={370} fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">stream</text>

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
            markerEnd="url(#oc-tui-arrow)"
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
