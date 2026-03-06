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
  { id: "user", x: 250, y: 10, w: 140, h: 40, label: "User Input", sublabel: "CLI / IDE", color: COLORS.secondary, shape: "rounded" },

  { id: "system", x: 80, y: 90, w: 160, h: 44, label: "System Prompt", sublabel: "CLAUDE.md + Memory", color: COLORS.warning, shape: "rect" },
  { id: "context", x: 400, y: 90, w: 150, h: 44, label: "Context", sublabel: "Files, MCP Tools", color: COLORS.muted, shape: "rect" },

  { id: "llm", x: 220, y: 180, w: 200, h: 50, label: "Claude LLM", sublabel: "Agentic Reasoning", color: COLORS.primary, shape: "rect" },

  { id: "tools", x: 70, y: 290, w: 150, h: 44, label: "Tool Execution", sublabel: "Read, Edit, Bash...", color: COLORS.success, shape: "rect" },
  { id: "skills", x: 260, y: 290, w: 120, h: 44, label: "Skills", sublabel: "Custom Prompts", color: COLORS.primary, shape: "rect" },
  { id: "hooks", x: 420, y: 290, w: 120, h: 44, label: "Hooks", sublabel: "Guardrails", color: COLORS.danger, shape: "rect" },

  { id: "result", x: 220, y: 380, w: 200, h: 44, label: "Result Processing", sublabel: "Loop or Output", color: COLORS.secondary, shape: "rect" },

  { id: "output", x: 250, y: 470, w: 140, h: 40, label: "Response", sublabel: "Text + Artifacts", color: COLORS.success, shape: "rounded" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "user", to: "system", path: "M250,50 L160,90" },
  { from: "user", to: "context", path: "M390,50 L475,90" },
  { from: "user", to: "llm", path: "M320,50 L320,180" },
  { from: "system", to: "llm", path: "M160,134 L220,180" },
  { from: "context", to: "llm", path: "M475,134 L420,180" },
  { from: "llm", to: "tools", path: "M220,230 L145,290" },
  { from: "llm", to: "skills", path: "M320,230 L320,290" },
  { from: "llm", to: "hooks", path: "M420,230 L480,290" },
  { from: "tools", to: "result", path: "M145,334 L220,380" },
  { from: "skills", to: "result", path: "M320,334 L320,380" },
  { from: "hooks", to: "result", path: "M480,334 L420,380" },
  { from: "result", to: "output", path: "M320,424 L320,470" },
  { from: "result", to: "llm", path: "M420,402 Q540,300 420,205" },
];

export default function ClaudeOverview() {
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
      viewBox="0 0 640 530"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="Claude Code Overview Architecture"
    >
      <defs>
        <marker id="claude-ov-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
      </defs>

      {/* Loop label */}
      <text x={530} y={310} fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">loop</text>

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
            markerEnd="url(#claude-ov-arrow)"
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
