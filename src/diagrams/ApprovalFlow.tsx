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

interface FlowNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel?: string;
  color: string;
  shape: "rect" | "diamond" | "rounded";
}

const nodes: FlowNode[] = [
  { id: "start", x: 280, y: 15, w: 140, h: 40, label: "Tool Call Request", color: COLORS.primary, shape: "rounded" },

  { id: "auto", x: 275, y: 90, w: 150, h: 50, label: "Auto-approve", sublabel: "list?", color: COLORS.warning, shape: "diamond" },
  { id: "exec-auto", x: 520, y: 98, w: 100, h: 34, label: "Execute", color: COLORS.success, shape: "rounded" },

  { id: "policy", x: 275, y: 185, w: 150, h: 50, label: "ExecPolicy", sublabel: "(Starlark)?", color: COLORS.warning, shape: "diamond" },
  { id: "exec-policy", x: 520, y: 193, w: 100, h: 34, label: "Execute", color: COLORS.success, shape: "rounded" },

  { id: "cached", x: 275, y: 280, w: 150, h: 50, label: "Cached", sublabel: "approval?", color: COLORS.warning, shape: "diamond" },
  { id: "exec-cached", x: 520, y: 288, w: 100, h: 34, label: "Execute", color: COLORS.success, shape: "rounded" },

  { id: "ask", x: 280, y: 370, w: 140, h: 44, label: "Ask User", sublabel: "ExecApproval", color: COLORS.secondary, shape: "rect" },

  { id: "approve", x: 200, y: 450, w: 100, h: 36, label: "Approve", color: COLORS.success, shape: "rounded" },
  { id: "deny", x: 400, y: 450, w: 100, h: 36, label: "Deny", color: COLORS.danger, shape: "rounded" },

  { id: "sandbox", x: 50, y: 270, w: 140, h: 44, label: "SandboxPolicy", sublabel: "Enforcement", color: COLORS.danger, shape: "rect" },
];

interface Edge {
  from: string;
  to: string;
  label?: string;
  path?: string;
}

const edges: Edge[] = [
  { from: "start", to: "auto", path: "M350,55 L350,90" },
  { from: "auto", to: "exec-auto", label: "Yes", path: "M425,115 L520,115" },
  { from: "auto", to: "policy", label: "No", path: "M350,140 L350,185" },
  { from: "policy", to: "exec-policy", label: "Yes", path: "M425,210 L520,210" },
  { from: "policy", to: "cached", label: "No", path: "M350,235 L350,280" },
  { from: "cached", to: "exec-cached", label: "Yes", path: "M425,305 L520,305" },
  { from: "cached", to: "ask", label: "No", path: "M350,330 L350,370" },
  { from: "ask", to: "approve", path: "M280,414 L250,450" },
  { from: "ask", to: "deny", path: "M420,414 L450,450" },
  { from: "sandbox", to: "approve", path: "M120,314 L120,468 L200,468" },
];

export default function ApprovalFlow() {
  const [hovered, setHovered] = useState<string | null>(null);

  function isOnPath(id: string) {
    if (!hovered) return true;
    // Highlight the path from start to the hovered node
    const pathToHovered: string[] = [];
    function findPath(current: string, target: string, visited: string[]): boolean {
      if (current === target) { pathToHovered.push(...visited, current); return true; }
      for (const e of edges) {
        if (e.from === current && !visited.includes(e.to)) {
          if (findPath(e.to, target, [...visited, current])) return true;
        }
      }
      return false;
    }
    findPath("start", hovered, []);
    if (pathToHovered.length === 0) return id === hovered;
    return pathToHovered.includes(id) || id === hovered;
  }

  function renderNode(n: FlowNode) {
    const active = isOnPath(n.id);
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
          {n.sublabel && <text x={cx} y={cy + 13} textAnchor="middle" fill={COLORS.muted} fontSize="9" fontFamily="inherit" className="diagram-label">{n.sublabel}</text>}
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
  }

  return (
    <svg
      viewBox="0 0 660 510"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="Approval Flow Decision Tree"
    >
      <defs>
        <marker id="approval-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.muted} />
        </marker>
        <marker id="approval-arrow-yes" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.success} />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map((e, i) => {
        const isYes = e.label === "Yes";
        const active = hovered && isOnPath(e.from) && isOnPath(e.to);
        return (
          <g key={i}>
            <path
              d={e.path}
              fill="none"
              stroke={active ? (isYes ? COLORS.success : COLORS.primary) : COLORS.border}
              strokeWidth={active ? 2 : 1}
              opacity={hovered && !active ? 0.12 : 0.6}
              markerEnd={isYes ? "url(#approval-arrow-yes)" : "url(#approval-arrow)"}
              className="diagram-connection"
            />
{/* Labels are positioned manually below */}
          </g>
        );
      })}

      {/* Yes/No labels positioned manually */}
      <text x={460} y={112} fill={COLORS.success} fontSize="10" fontWeight="600" fontFamily="monospace" className="diagram-label">Yes</text>
      <text x={356} y={170} fill={COLORS.danger} fontSize="10" fontWeight="600" fontFamily="monospace" className="diagram-label">No</text>
      <text x={460} y={207} fill={COLORS.success} fontSize="10" fontWeight="600" fontFamily="monospace" className="diagram-label">Yes</text>
      <text x={356} y={265} fill={COLORS.danger} fontSize="10" fontWeight="600" fontFamily="monospace" className="diagram-label">No</text>
      <text x={460} y={302} fill={COLORS.success} fontSize="10" fontWeight="600" fontFamily="monospace" className="diagram-label">Yes</text>
      <text x={356} y={360} fill={COLORS.danger} fontSize="10" fontWeight="600" fontFamily="monospace" className="diagram-label">No</text>

      {/* Nodes */}
      {nodes.map(renderNode)}
    </svg>
  );
}
