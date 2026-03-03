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

interface StepDef {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel?: string;
  color: string;
  shape: "rect" | "diamond";
}

const steps: StepDef[] = [
  { id: "input", x: 30, y: 200, w: 110, h: 46, label: "User Input", sublabel: "SQ submit", color: COLORS.secondary, shape: "rect" },
  { id: "prompt", x: 180, y: 50, w: 130, h: 46, label: "Build Prompt", sublabel: "context + history", color: COLORS.primary, shape: "rect" },
  { id: "api", x: 370, y: 50, w: 130, h: 46, label: "API Call", sublabel: "run_sampling", color: COLORS.primary, shape: "rect" },
  { id: "stream", x: 550, y: 50, w: 130, h: 46, label: "Stream Response", sublabel: "AgentMessage", color: COLORS.primary, shape: "rect" },
  { id: "decision", x: 575, y: 195, w: 80, h: 56, label: "Tool", sublabel: "Calls?", color: COLORS.warning, shape: "diamond" },
  { id: "execute", x: 550, y: 330, w: 130, h: 46, label: "Execute Tools", sublabel: "ToolRegistry", color: COLORS.success, shape: "rect" },
  { id: "record", x: 340, y: 330, w: 130, h: 46, label: "Record Results", sublabel: "conversation[]", color: COLORS.primary, shape: "rect" },
  { id: "context", x: 130, y: 330, w: 130, h: 46, label: "Context Check", sublabel: "auto compact", color: COLORS.primary, shape: "rect" },
  { id: "complete", x: 550, y: 440, w: 130, h: 46, label: "Turn Complete", sublabel: "EQ event", color: COLORS.success, shape: "rect" },
];

const edges: { from: string; to: string; label?: string; path?: string }[] = [
  { from: "input", to: "prompt", path: "M140,223 L170,223 L170,73 L180,73" },
  { from: "prompt", to: "api", path: "M310,73 L370,73" },
  { from: "api", to: "stream", path: "M500,73 L550,73" },
  { from: "stream", to: "decision", path: "M615,96 L615,195" },
  { from: "decision", to: "execute", label: "Yes", path: "M615,251 L615,330" },
  { from: "decision", to: "complete", label: "No", path: "M655,223 L720,223 L720,463 L680,463" },
  { from: "execute", to: "record", path: "M550,353 L470,353" },
  { from: "record", to: "context", path: "M340,353 L260,353" },
  { from: "context", to: "prompt", label: "loop", path: "M130,353 L90,353 L90,73 L180,73" },
];

export default function AgentLoop() {
  const [hovered, setHovered] = useState<string | null>(null);

  function isOnPath(id: string) {
    if (!hovered) return false;
    for (const e of edges) {
      if (e.from === hovered || e.to === hovered) {
        if (e.from === id || e.to === id) return true;
      }
    }
    return id === hovered;
  }

  return (
    <svg
      viewBox="0 0 760 510"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="Agent Loop Flow Diagram"
    >
      <defs>
        <marker id="loop-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={COLORS.muted} />
        </marker>
        <marker id="loop-arrow-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={COLORS.primary} />
        </marker>
      </defs>

      {/* Loop background path */}
      <path
        d="M90,73 L170,73 L170,223 L140,223 M310,73 L550,73 M615,96 L615,330 M550,353 L260,353 M130,353 L90,353 L90,73"
        fill="none"
        stroke={COLORS.border}
        strokeWidth={1}
        strokeDasharray="4 4"
        opacity={0.3}
      />

      {/* Edges */}
      {edges.map((e, i) => {
        const active = hovered && (e.from === hovered || e.to === hovered);
        return (
          <g key={i}>
            <path
              d={e.path}
              fill="none"
              stroke={active ? COLORS.primary : COLORS.border}
              strokeWidth={active ? 2.5 : 1.5}
              strokeDasharray="8 4"
              opacity={hovered && !active ? 0.15 : 0.8}
              markerEnd={active ? "url(#loop-arrow-active)" : "url(#loop-arrow)"}
              style={active ? { animation: "dash-flow 1s linear infinite" } : undefined}
              className="diagram-connection"
            />
            {e.label && (
              <text
                x={e.from === "decision" && e.to === "execute" ? 625 : e.from === "decision" && e.to === "complete" ? 700 : 100}
                y={e.from === "decision" && e.to === "execute" ? 295 : e.from === "decision" && e.to === "complete" ? 250 : 370}
                fill={active ? COLORS.warning : COLORS.muted}
                fontSize="10"
                fontFamily="monospace"
                fontWeight="600"
                className="diagram-label"
              >
                {e.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Animated tracer dot on the loop */}
      <circle r="5" fill={COLORS.primary} className="pulse-dot" opacity={0.9}>
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          path="M90,73 L310,73 L500,73 L615,73 L615,195 L615,330 L470,353 L260,353 L90,353 L90,73"
        />
      </circle>

      {/* Step nodes */}
      {steps.map((s) => {
        const active = !hovered || isOnPath(s.id);
        if (s.shape === "diamond") {
          const cx = s.x + s.w / 2;
          const cy = s.y + s.h / 2;
          const rx = s.w / 2;
          const ry = s.h / 2;
          return (
            <g
              key={s.id}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              className="diagram-node"
              opacity={active ? 1 : 0.25}
            >
              <polygon
                points={`${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`}
                fill={s.color}
                fillOpacity={hovered === s.id ? 0.3 : 0.1}
                stroke={s.color}
                strokeWidth={hovered === s.id ? 2 : 1}
              />
              <text x={cx} y={cy - 3} textAnchor="middle" fill={COLORS.text} fontSize="11" fontWeight="600" fontFamily="inherit" className="diagram-label">{s.label}</text>
              {s.sublabel && (
                <text x={cx} y={cy + 12} textAnchor="middle" fill={COLORS.muted} fontSize="9" fontFamily="inherit" className="diagram-label">{s.sublabel}</text>
              )}
            </g>
          );
        }
        return (
          <g
            key={s.id}
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            className="diagram-node"
            opacity={active ? 1 : 0.25}
          >
            <rect
              x={s.x} y={s.y} width={s.w} height={s.h}
              rx={10}
              fill={s.color}
              fillOpacity={hovered === s.id ? 0.25 : 0.1}
              stroke={s.color}
              strokeWidth={hovered === s.id ? 2 : 1}
            />
            <text x={s.x + s.w / 2} y={s.y + 20} textAnchor="middle" fill={COLORS.text} fontSize="11" fontWeight="600" fontFamily="inherit" className="diagram-label">{s.label}</text>
            {s.sublabel && (
              <text x={s.x + s.w / 2} y={s.y + 34} textAnchor="middle" fill={COLORS.muted} fontSize="9" fontFamily="monospace" className="diagram-label">{s.sublabel}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
