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
  shape: "rect" | "rounded" | "diamond";
}

const nodes: FlowNode[] = [
  { id: "event", x: 230, y: 10, w: 160, h: 40, label: "Tool Call Event", color: COLORS.secondary, shape: "rounded" },

  { id: "pre", x: 60, y: 90, w: 140, h: 44, label: "PreToolUse", sublabel: "Before execution", color: COLORS.warning, shape: "rect" },
  { id: "post", x: 240, y: 90, w: 140, h: 44, label: "PostToolUse", sublabel: "After execution", color: COLORS.primary, shape: "rect" },
  { id: "notif", x: 420, y: 90, w: 140, h: 44, label: "Notification", sublabel: "On events", color: COLORS.muted, shape: "rect" },

  { id: "matcher", x: 200, y: 180, w: 220, h: 44, label: "Tool Name Matcher", sublabel: "Glob pattern: Edit, Bash, *", color: COLORS.primary, shape: "rect" },

  { id: "command", x: 200, y: 270, w: 220, h: 44, label: "Shell Command", sublabel: "User-defined script", color: COLORS.warning, shape: "rect" },

  { id: "allow", x: 60, y: 370, w: 100, h: 36, label: "Allow", color: COLORS.success, shape: "rounded" },
  { id: "block", x: 200, y: 370, w: 100, h: 36, label: "Block", color: COLORS.danger, shape: "rounded" },
  { id: "modify", x: 340, y: 370, w: 100, h: 36, label: "Modify", color: COLORS.warning, shape: "rounded" },
  { id: "message", x: 480, y: 370, w: 100, h: 36, label: "Message", color: COLORS.muted, shape: "rounded" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "event", to: "pre", path: "M230,50 L130,90" },
  { from: "event", to: "post", path: "M310,50 L310,90" },
  { from: "event", to: "notif", path: "M390,50 L490,90" },
  { from: "pre", to: "matcher", path: "M130,134 L260,180" },
  { from: "post", to: "matcher", path: "M310,134 L310,180" },
  { from: "notif", to: "matcher", path: "M490,134 L370,180" },
  { from: "matcher", to: "command", path: "M310,224 L310,270" },
  { from: "command", to: "allow", path: "M200,314 L110,370" },
  { from: "command", to: "block", path: "M260,314 L250,370" },
  { from: "command", to: "modify", path: "M360,314 L390,370" },
  { from: "command", to: "message", path: "M420,314 L530,370" },
];

export default function HooksFlow() {
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
      viewBox="0 0 620 430"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="Hooks Lifecycle Flow"
    >
      <defs>
        <marker id="hooks-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
      </defs>

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
            markerEnd="url(#hooks-arrow)"
            className="diagram-connection"
          />
        );
      })}

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
