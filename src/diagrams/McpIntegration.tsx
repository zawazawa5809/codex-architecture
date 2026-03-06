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
  { id: "claude", x: 230, y: 10, w: 160, h: 40, label: "Claude Code", sublabel: "MCP Client", color: COLORS.primary, shape: "rounded" },

  { id: "config", x: 230, y: 90, w: 160, h: 44, label: "MCP Config", sublabel: ".claude/settings.json", color: COLORS.warning, shape: "rect" },

  { id: "stdio", x: 80, y: 190, w: 130, h: 44, label: "stdio Transport", sublabel: "Local process", color: COLORS.secondary, shape: "rect" },
  { id: "sse", x: 260, y: 190, w: 130, h: 44, label: "SSE Transport", sublabel: "HTTP streaming", color: COLORS.secondary, shape: "rect" },
  { id: "streamhttp", x: 440, y: 190, w: 130, h: 44, label: "Streamable HTTP", sublabel: "Bidirectional", color: COLORS.secondary, shape: "rect" },

  { id: "server1", x: 60, y: 290, w: 170, h: 44, label: "MCP Server", sublabel: "filesystem, git...", color: COLORS.success, shape: "rect" },
  { id: "server2", x: 260, y: 290, w: 130, h: 44, label: "MCP Server", sublabel: "Custom tools", color: COLORS.success, shape: "rect" },
  { id: "server3", x: 420, y: 290, w: 170, h: 44, label: "MCP Server", sublabel: "Context7, Playwright...", color: COLORS.success, shape: "rect" },

  { id: "tools", x: 180, y: 380, w: 260, h: 44, label: "Tool Discovery & Execution", sublabel: "Registered as Claude tools", color: COLORS.primary, shape: "rect" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "claude", to: "config", path: "M310,50 L310,90" },
  { from: "config", to: "stdio", path: "M230,134 L145,190" },
  { from: "config", to: "sse", path: "M310,134 L325,190" },
  { from: "config", to: "streamhttp", path: "M390,134 L505,190" },
  { from: "stdio", to: "server1", path: "M145,234 L145,290" },
  { from: "sse", to: "server2", path: "M325,234 L325,290" },
  { from: "streamhttp", to: "server3", path: "M505,234 L505,290" },
  { from: "server1", to: "tools", path: "M145,334 L250,380" },
  { from: "server2", to: "tools", path: "M325,334 L310,380" },
  { from: "server3", to: "tools", path: "M505,334 L380,380" },
  { from: "tools", to: "claude", path: "M440,402 Q580,250 390,30" },
];

export default function McpIntegration() {
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
      viewBox="0 0 640 450"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="MCP Integration Architecture"
    >
      <defs>
        <marker id="mcp-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
      </defs>

      {/* Loop label */}
      <text x={555} y={230} fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">feedback</text>

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
            markerEnd="url(#mcp-arrow)"
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
