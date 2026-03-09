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
  { id: "agent", x: 250, y: 10, w: 140, h: 40, label: "Agent", sublabel: "Session Loop", color: COLORS.primary, shape: "rounded" },

  { id: "generate", x: 210, y: 90, w: 220, h: 44, label: "Provider.AI.generate()", sublabel: "Unified interface", color: COLORS.primary, shape: "rect" },

  { id: "transform-in", x: 100, y: 180, w: 180, h: 44, label: "ProviderTransform", sublabel: "Input normalization", color: COLORS.warning, shape: "rect" },
  { id: "transform-out", x: 360, y: 180, w: 180, h: 44, label: "ProviderTransform", sublabel: "Output normalization", color: COLORS.warning, shape: "rect" },

  { id: "sdk", x: 230, y: 270, w: 180, h: 44, label: "AI SDK", sublabel: "Vercel ai package", color: COLORS.primary, shape: "rect" },

  // Providers row
  { id: "anthropic", x: 20, y: 370, w: 110, h: 44, label: "Anthropic", sublabel: "Claude", color: COLORS.secondary, shape: "rect" },
  { id: "openai", x: 150, y: 370, w: 110, h: 44, label: "OpenAI", sublabel: "GPT / o-series", color: COLORS.secondary, shape: "rect" },
  { id: "google", x: 280, y: 370, w: 110, h: 44, label: "Google", sublabel: "Gemini", color: COLORS.secondary, shape: "rect" },
  { id: "other", x: 410, y: 370, w: 110, h: 44, label: "Others", sublabel: "OpenRouter...", color: COLORS.secondary, shape: "rect" },

  { id: "models", x: 540, y: 370, w: 90, h: 44, label: "Models.dev", sublabel: "Metadata", color: COLORS.warning, shape: "rect" },

  { id: "stream", x: 230, y: 440, w: 180, h: 30, label: "Streaming Response", color: COLORS.success, shape: "rounded" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
}

const edges: Edge[] = [
  { from: "agent", to: "generate", path: "M320,50 L320,90" },
  { from: "generate", to: "transform-in", path: "M210,112 L190,180" },
  { from: "generate", to: "transform-out", path: "M430,112 L450,180" },
  { from: "transform-in", to: "sdk", path: "M190,224 L280,270" },
  { from: "transform-out", to: "sdk", path: "M450,224 L360,270" },
  { from: "sdk", to: "anthropic", path: "M230,314 L75,370" },
  { from: "sdk", to: "openai", path: "M280,314 L205,370" },
  { from: "sdk", to: "google", path: "M340,314 L335,370" },
  { from: "sdk", to: "other", path: "M410,314 L465,370" },
  { from: "models", to: "sdk", path: "M585,370 Q600,314 410,292" },
  { from: "anthropic", to: "stream", path: "M75,414 L280,440" },
  { from: "openai", to: "stream", path: "M205,414 L300,440" },
  { from: "google", to: "stream", path: "M335,414 L340,440" },
  { from: "other", to: "stream", path: "M465,414 L380,440" },
];

export default function OpencodeProviderSystem() {
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
      aria-label="OpenCode Provider Abstraction Layer"
    >
      <defs>
        <marker id="oc-ps-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
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
            markerEnd="url(#oc-ps-arrow)"
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
