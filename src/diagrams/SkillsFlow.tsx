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
  shape: "rect" | "rounded";
}

const nodes: FlowNode[] = [
  { id: "trigger", x: 230, y: 10, w: 160, h: 40, label: "User Message", sublabel: "/skill or pattern", color: COLORS.secondary, shape: "rounded" },

  { id: "match", x: 230, y: 90, w: 160, h: 44, label: "Skill Matching", sublabel: "Name + Description", color: COLORS.warning, shape: "rect" },

  { id: "file", x: 40, y: 180, w: 150, h: 44, label: "Skill File", sublabel: ".claude/skills/*.md", color: COLORS.muted, shape: "rect" },
  { id: "prompt", x: 230, y: 180, w: 160, h: 44, label: "Prompt Expansion", sublabel: "Template -> Full prompt", color: COLORS.primary, shape: "rect" },
  { id: "builtin", x: 430, y: 180, w: 140, h: 44, label: "Built-in Skills", sublabel: "commit, review...", color: COLORS.primary, shape: "rect" },

  { id: "exec", x: 230, y: 280, w: 160, h: 44, label: "Claude Execution", sublabel: "With skill context", color: COLORS.success, shape: "rect" },

  { id: "result", x: 230, y: 370, w: 160, h: 40, label: "Result", sublabel: "Code + Text output", color: COLORS.secondary, shape: "rounded" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "trigger", to: "match", path: "M310,50 L310,90" },
  { from: "match", to: "file", path: "M230,112 L190,180" },
  { from: "match", to: "prompt", path: "M310,134 L310,180" },
  { from: "match", to: "builtin", path: "M390,112 L430,180" },
  { from: "file", to: "prompt", path: "M190,224 L230,202" },
  { from: "builtin", to: "prompt", path: "M430,224 L390,202" },
  { from: "prompt", to: "exec", path: "M310,224 L310,280" },
  { from: "exec", to: "result", path: "M310,324 L310,370" },
];

export default function SkillsFlow() {
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
      aria-label="Skills Execution Flow"
    >
      <defs>
        <marker id="skill-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
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
            markerEnd="url(#skill-arrow)"
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
