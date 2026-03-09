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
  { id: "session", x: 240, y: 10, w: 160, h: 40, label: "Session.create()", sublabel: "New session", color: COLORS.secondary, shape: "rounded" },

  { id: "sqlite", x: 220, y: 90, w: 200, h: 50, label: "SQLite", sublabel: "Drizzle ORM", color: COLORS.primary, shape: "rect" },

  { id: "messages", x: 60, y: 190, w: 160, h: 44, label: "Messages", sublabel: "MessageV2 schema", color: COLORS.primary, shape: "rect" },
  { id: "sessions", x: 420, y: 190, w: 160, h: 44, label: "Sessions Table", sublabel: "Metadata + State", color: COLORS.primary, shape: "rect" },

  { id: "compaction", x: 60, y: 290, w: 160, h: 44, label: "Compaction", sublabel: "Token reduction", color: COLORS.warning, shape: "rect" },

  { id: "summary", x: 60, y: 370, w: 160, h: 40, label: "Summary", sublabel: "Compressed context", color: COLORS.success, shape: "rounded" },

  // Git snapshots branch
  { id: "git", x: 400, y: 290, w: 180, h: 50, label: "Git Snapshots", sublabel: "Undo / Redo", color: COLORS.danger, shape: "rect" },
  { id: "restore", x: 430, y: 370, w: 120, h: 40, label: "Restore", sublabel: "Checkout commit", color: COLORS.danger, shape: "rounded" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "session", to: "sqlite", path: "M320,50 L320,90" },
  { from: "sqlite", to: "messages", path: "M220,115 L140,190" },
  { from: "sqlite", to: "sessions", path: "M420,115 L500,190" },
  { from: "messages", to: "compaction", path: "M140,234 L140,290" },
  { from: "compaction", to: "summary", path: "M140,334 L140,370" },
  { from: "sessions", to: "git", path: "M500,234 L490,290" },
  { from: "git", to: "restore", path: "M490,340 L490,370" },
  { from: "summary", to: "sqlite", path: "M60,390 Q20,250 220,120" },
  { from: "restore", to: "messages", path: "M430,390 Q300,350 200,234" },
];

export default function OpencodeSessionStorage() {
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
      aria-label="OpenCode Session and Storage Architecture"
    >
      <defs>
        <marker id="oc-ss-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
      </defs>

      {/* Feedback label */}
      <text x={15} y={300} fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">feedback</text>

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
            markerEnd="url(#oc-ss-arrow)"
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
