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
  // Client layer
  { id: "tui", x: 20, y: 20, w: 120, h: 40, label: "TUI", sublabel: "OpenTUI/Solid", color: COLORS.secondary, shape: "rounded" },
  { id: "desktop", x: 170, y: 20, w: 120, h: 40, label: "Desktop", sublabel: "Tauri", color: COLORS.secondary, shape: "rounded" },
  { id: "web", x: 320, y: 20, w: 120, h: 40, label: "Web", sublabel: "Browser", color: COLORS.secondary, shape: "rounded" },
  { id: "ide", x: 470, y: 20, w: 120, h: 40, label: "IDE", sublabel: "VSCode / Neovim", color: COLORS.secondary, shape: "rounded" },

  // Transport
  { id: "transport", x: 220, y: 110, w: 200, h: 44, label: "HTTP / SSE", sublabel: "Client ↔ Server", color: COLORS.muted, shape: "rect" },

  // Server layer
  { id: "hono", x: 220, y: 200, w: 200, h: 44, label: "Hono Server", sublabel: "API Routes", color: COLORS.primary, shape: "rect" },

  // Core
  { id: "agent", x: 220, y: 290, w: 200, h: 50, label: "Agent Loop", sublabel: "Plan / Build / General", color: COLORS.primary, shape: "rect" },

  // LLM & Tools
  { id: "llm", x: 60, y: 390, w: 180, h: 44, label: "LLM Provider", sublabel: "Anthropic, OpenAI...", color: COLORS.warning, shape: "rect" },
  { id: "tools", x: 400, y: 390, w: 180, h: 44, label: "Tools", sublabel: "Bash, Edit, MCP...", color: COLORS.success, shape: "rect" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "tui", to: "transport", path: "M80,60 L280,110" },
  { from: "desktop", to: "transport", path: "M230,60 L300,110" },
  { from: "web", to: "transport", path: "M380,60 L340,110" },
  { from: "ide", to: "transport", path: "M530,60 L360,110" },
  { from: "transport", to: "hono", path: "M320,154 L320,200" },
  { from: "hono", to: "agent", path: "M320,244 L320,290" },
  { from: "agent", to: "llm", path: "M220,315 L150,390" },
  { from: "agent", to: "tools", path: "M420,315 L490,390" },
  { from: "llm", to: "agent", path: "M150,390 Q60,340 220,310" },
  { from: "tools", to: "agent", path: "M490,390 Q580,340 420,310" },
];

export default function OpencodeOverview() {
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
      aria-label="OpenCode Client/Server Architecture Overview"
    >
      <defs>
        <marker id="oc-ov-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
      </defs>

      {/* Layer labels */}
      <text x={20} y={80} fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">Clients</text>
      <text x={20} y={220} fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">Server</text>

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
            markerEnd="url(#oc-ov-arrow)"
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
