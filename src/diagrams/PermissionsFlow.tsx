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
  { id: "call", x: 230, y: 10, w: 160, h: 40, label: "Tool Call", sublabel: "Read, Edit, Bash...", color: COLORS.secondary, shape: "rounded" },

  { id: "mode", x: 215, y: 90, w: 190, h: 50, label: "Permission Mode", sublabel: "Check setting", color: COLORS.warning, shape: "diamond" },

  { id: "auto", x: 40, y: 180, w: 140, h: 44, label: "Full Auto", sublabel: "No prompts", color: COLORS.success, shape: "rect" },
  { id: "edit", x: 240, y: 180, w: 140, h: 44, label: "Auto-Edit", sublabel: "Edits auto-approved", color: COLORS.primary, shape: "rect" },
  { id: "ask", x: 440, y: 180, w: 140, h: 44, label: "Default", sublabel: "Always ask", color: COLORS.danger, shape: "rect" },

  { id: "allowlist", x: 200, y: 280, w: 220, h: 44, label: "Allowlist / Denylist", sublabel: "Per-tool overrides", color: COLORS.warning, shape: "rect" },

  { id: "prompt", x: 40, y: 380, w: 140, h: 36, label: "Prompt User", color: COLORS.secondary, shape: "rounded" },
  { id: "execute", x: 240, y: 380, w: 140, h: 36, label: "Execute", color: COLORS.success, shape: "rounded" },
  { id: "deny", x: 440, y: 380, w: 140, h: 36, label: "Deny", color: COLORS.danger, shape: "rounded" },
];

interface Edge {
  from: string;
  to: string;
  path: string;
  label?: string;
}

const edges: Edge[] = [
  { from: "call", to: "mode", path: "M310,50 L310,90" },
  { from: "mode", to: "auto", path: "M215,115 L110,180", label: "full-auto" },
  { from: "mode", to: "edit", path: "M310,140 L310,180", label: "auto-edit" },
  { from: "mode", to: "ask", path: "M405,115 L510,180", label: "default" },
  { from: "auto", to: "allowlist", path: "M110,224 L260,280" },
  { from: "edit", to: "allowlist", path: "M310,224 L310,280" },
  { from: "ask", to: "allowlist", path: "M510,224 L370,280" },
  { from: "allowlist", to: "prompt", path: "M200,324 L110,380" },
  { from: "allowlist", to: "execute", path: "M310,324 L310,380" },
  { from: "allowlist", to: "deny", path: "M420,324 L510,380" },
];

export default function PermissionsFlow() {
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
      viewBox="0 0 640 440"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="Permissions Decision Flow"
    >
      <defs>
        <marker id="perm-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
      </defs>

      {/* Mode labels */}
      <text x={120} y={158} fill={COLORS.success} fontSize="9" fontWeight="600" fontFamily="monospace" className="diagram-label">full-auto</text>
      <text x={285} y={168} fill={COLORS.primary} fontSize="9" fontWeight="600" fontFamily="monospace" className="diagram-label">auto-edit</text>
      <text x={450} y={158} fill={COLORS.danger} fontSize="9" fontWeight="600" fontFamily="monospace" className="diagram-label">default</text>

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
            markerEnd="url(#perm-arrow)"
            className="diagram-connection"
          />
        );
      })}

      {nodes.map((n) => {
        const active = isConnected(n.id);
        const isHov = hovered === n.id;

        if (n.shape === "diamond") {
          const cx = n.x + n.w / 2;
          const cy = n.y + n.h / 2;
          const rx = n.w / 2;
          const ry = n.h / 2;
          return (
            <g
              key={n.id}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              className="diagram-node"
              opacity={active ? 1 : 0.2}
            >
              <polygon
                points={`${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`}
                fill={n.color} fillOpacity={isHov ? 0.3 : 0.1}
                stroke={n.color} strokeWidth={isHov ? 2 : 1}
              />
              <text x={cx} y={cy - 2} textAnchor="middle" fill={COLORS.text} fontSize="11" fontWeight="600" fontFamily="inherit" className="diagram-label">{n.label}</text>
              {n.sublabel && <text x={cx} y={cy + 13} textAnchor="middle" fill={COLORS.muted} fontSize="9" fontFamily="monospace" className="diagram-label">{n.sublabel}</text>}
            </g>
          );
        }

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
