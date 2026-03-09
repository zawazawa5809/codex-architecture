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
  { id: "files", x: 250, y: 10, w: 140, h: 40, label: "Project Files", sublabel: "Source code", color: COLORS.secondary, shape: "rounded" },

  { id: "manager", x: 220, y: 90, w: 200, h: 44, label: "LSP.Manager", sublabel: "Server lifecycle", color: COLORS.primary, shape: "rect" },

  // Language servers row
  { id: "ts", x: 30, y: 185, w: 120, h: 44, label: "TypeScript", sublabel: "tsserver", color: COLORS.success, shape: "rect" },
  { id: "python", x: 170, y: 185, w: 120, h: 44, label: "Python", sublabel: "pyright", color: COLORS.success, shape: "rect" },
  { id: "go", x: 350, y: 185, w: 120, h: 44, label: "Go", sublabel: "gopls", color: COLORS.success, shape: "rect" },
  { id: "others", x: 490, y: 185, w: 120, h: 44, label: "Others", sublabel: "Auto-detect", color: COLORS.success, shape: "rect" },

  // Capabilities
  { id: "diagnostics", x: 40, y: 280, w: 130, h: 40, label: "Diagnostics", sublabel: "Errors / Warnings", color: COLORS.danger, shape: "rect" },
  { id: "formatting", x: 190, y: 280, w: 120, h: 40, label: "Formatting", color: COLORS.warning, shape: "rect" },
  { id: "hover", x: 330, y: 280, w: 120, h: 40, label: "Hover / Refs", color: COLORS.warning, shape: "rect" },

  { id: "bus", x: 220, y: 350, w: 200, h: 40, label: "Event Bus", sublabel: "Bus.subscribe", color: COLORS.warning, shape: "rect" },

  { id: "context", x: 450, y: 350, w: 160, h: 40, label: "Agent Context", sublabel: "System prompt", color: COLORS.primary, shape: "rect" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "files", to: "manager", path: "M320,50 L320,90" },
  { from: "manager", to: "ts", path: "M220,134 L90,185" },
  { from: "manager", to: "python", path: "M280,134 L230,185" },
  { from: "manager", to: "go", path: "M360,134 L410,185" },
  { from: "manager", to: "others", path: "M420,134 L550,185" },
  { from: "ts", to: "diagnostics", path: "M90,229 L105,280" },
  { from: "python", to: "diagnostics", path: "M200,229 L130,280" },
  { from: "go", to: "hover", path: "M410,229 L390,280" },
  { from: "others", to: "hover", path: "M550,229 L430,280" },
  { from: "ts", to: "formatting", path: "M120,229 L220,280" },
  { from: "diagnostics", to: "bus", path: "M105,320 L260,350" },
  { from: "formatting", to: "bus", path: "M250,320 L300,350" },
  { from: "hover", to: "bus", path: "M390,320 L370,350" },
  { from: "bus", to: "context", path: "M420,370 L450,370" },
];

export default function OpencodeLspIntegration() {
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
      viewBox="0 0 640 430"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="OpenCode LSP Integration"
    >
      <defs>
        <marker id="oc-lsp-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
      </defs>

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
            markerEnd="url(#oc-lsp-arrow)"
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
