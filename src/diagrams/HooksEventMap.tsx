import { useState } from "react";
import { COLORS } from "./colors";

interface MapNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel?: string;
  color: string;
  group: "goal" | "event" | "handler";
}

const goals: MapNode[] = [
  { id: "g-block", x: 10, y: 30, w: 150, h: 36, label: "Block dangerous ops", color: COLORS.danger, group: "goal" },
  { id: "g-validate", x: 10, y: 80, w: 150, h: 36, label: "Validate output", color: COLORS.warning, group: "goal" },
  { id: "g-automate", x: 10, y: 130, w: 150, h: 36, label: "Auto-format / lint", color: COLORS.primary, group: "goal" },
  { id: "g-audit", x: 10, y: 180, w: 150, h: 36, label: "Audit & logging", color: COLORS.muted, group: "goal" },
  { id: "g-notify", x: 10, y: 230, w: 150, h: 36, label: "External notify", color: COLORS.secondary, group: "goal" },
  { id: "g-lifecycle", x: 10, y: 280, w: 150, h: 36, label: "Session lifecycle", color: COLORS.success, group: "goal" },
  { id: "g-agent", x: 10, y: 330, w: 150, h: 36, label: "Agent monitoring", color: COLORS.primary, group: "goal" },
  { id: "g-context", x: 10, y: 380, w: 150, h: 36, label: "Context control", color: COLORS.warning, group: "goal" },
];

const events: MapNode[] = [
  { id: "e-pre", x: 240, y: 20, w: 170, h: 32, label: "PreToolUse", sublabel: "all 4 types", color: COLORS.danger, group: "event" },
  { id: "e-post", x: 240, y: 62, w: 170, h: 32, label: "PostToolUse", sublabel: "all 4 types", color: COLORS.primary, group: "event" },
  { id: "e-fail", x: 240, y: 104, w: 170, h: 32, label: "PostToolUseFailure", sublabel: "all 4 types", color: COLORS.warning, group: "event" },
  { id: "e-perm", x: 240, y: 146, w: 170, h: 32, label: "PermissionRequest", sublabel: "all 4 types", color: COLORS.danger, group: "event" },
  { id: "e-stop", x: 240, y: 188, w: 170, h: 32, label: "Stop", sublabel: "all 4 types", color: COLORS.muted, group: "event" },
  { id: "e-prompt", x: 240, y: 230, w: 170, h: 32, label: "UserPromptSubmit", sublabel: "all 4 types", color: COLORS.secondary, group: "event" },
  { id: "e-notif", x: 240, y: 272, w: 170, h: 32, label: "Notification", sublabel: "command only", color: COLORS.secondary, group: "event" },
  { id: "e-sess-s", x: 240, y: 314, w: 170, h: 32, label: "SessionStart", sublabel: "command only", color: COLORS.success, group: "event" },
  { id: "e-sess-e", x: 240, y: 356, w: 170, h: 32, label: "SessionEnd", sublabel: "command only", color: COLORS.success, group: "event" },
  { id: "e-sub-s", x: 240, y: 398, w: 170, h: 32, label: "SubagentStart/Stop", sublabel: "mixed", color: COLORS.primary, group: "event" },
  { id: "e-compact", x: 240, y: 440, w: 170, h: 32, label: "PreCompact", sublabel: "command only", color: COLORS.warning, group: "event" },
];

const handlers: MapNode[] = [
  { id: "h-cmd", x: 500, y: 80, w: 130, h: 40, label: "command", sublabel: "Shell script", color: COLORS.warning, group: "handler" },
  { id: "h-http", x: 500, y: 150, w: 130, h: 40, label: "http", sublabel: "Webhook", color: COLORS.secondary, group: "handler" },
  { id: "h-prompt", x: 500, y: 220, w: 130, h: 40, label: "prompt", sublabel: "LLM judge", color: COLORS.primary, group: "handler" },
  { id: "h-agent", x: 500, y: 290, w: 130, h: 40, label: "agent", sublabel: "Sub-agent", color: COLORS.success, group: "handler" },
];

interface Edge {
  from: string;
  to: string;
}

const goalToEvent: Edge[] = [
  { from: "g-block", to: "e-pre" },
  { from: "g-block", to: "e-perm" },
  { from: "g-validate", to: "e-post" },
  { from: "g-validate", to: "e-fail" },
  { from: "g-automate", to: "e-post" },
  { from: "g-audit", to: "e-post" },
  { from: "g-audit", to: "e-stop" },
  { from: "g-notify", to: "e-notif" },
  { from: "g-notify", to: "e-prompt" },
  { from: "g-lifecycle", to: "e-sess-s" },
  { from: "g-lifecycle", to: "e-sess-e" },
  { from: "g-agent", to: "e-sub-s" },
  { from: "g-agent", to: "e-stop" },
  { from: "g-context", to: "e-compact" },
  { from: "g-context", to: "e-prompt" },
];

const eventToHandler: Edge[] = [
  { from: "e-pre", to: "h-cmd" }, { from: "e-pre", to: "h-http" }, { from: "e-pre", to: "h-prompt" }, { from: "e-pre", to: "h-agent" },
  { from: "e-post", to: "h-cmd" }, { from: "e-post", to: "h-http" }, { from: "e-post", to: "h-prompt" }, { from: "e-post", to: "h-agent" },
  { from: "e-fail", to: "h-cmd" }, { from: "e-fail", to: "h-http" }, { from: "e-fail", to: "h-prompt" }, { from: "e-fail", to: "h-agent" },
  { from: "e-perm", to: "h-cmd" }, { from: "e-perm", to: "h-http" }, { from: "e-perm", to: "h-prompt" }, { from: "e-perm", to: "h-agent" },
  { from: "e-stop", to: "h-cmd" }, { from: "e-stop", to: "h-http" }, { from: "e-stop", to: "h-prompt" }, { from: "e-stop", to: "h-agent" },
  { from: "e-prompt", to: "h-cmd" }, { from: "e-prompt", to: "h-http" }, { from: "e-prompt", to: "h-prompt" }, { from: "e-prompt", to: "h-agent" },
  { from: "e-notif", to: "h-cmd" },
  { from: "e-sess-s", to: "h-cmd" },
  { from: "e-sess-e", to: "h-cmd" },
  { from: "e-sub-s", to: "h-cmd" },
  { from: "e-compact", to: "h-cmd" },
];

const allEdges = [...goalToEvent, ...eventToHandler];
const allNodes = [...goals, ...events, ...handlers];
const nodeById = new Map(allNodes.map((n) => [n.id, n]));

function getConnected(id: string): Set<string> {
  const connected = new Set<string>();
  connected.add(id);
  for (const e of allEdges) {
    if (e.from === id) connected.add(e.to);
    if (e.to === id) connected.add(e.from);
  }
  return connected;
}

function edgePath(from: MapNode, to: MapNode): string {
  const x1 = from.x + from.w;
  const y1 = from.y + from.h / 2;
  const x2 = to.x;
  const y2 = to.y + to.h / 2;
  const cx = (x1 + x2) / 2;
  return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
}

export default function HooksEventMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const connected = hovered ? getConnected(hovered) : null;

  function isActive(id: string) {
    if (!connected) return true;
    return connected.has(id);
  }

  const labels = [
    { x: 60, y: 12, text: "Goal" },
    { x: 300, y: 12, text: "Event" },
    { x: 545, y: 12, text: "Handler" },
  ];

  return (
    <svg
      viewBox="0 0 660 485"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 900 }}
      role="img"
      aria-label="Hooks Event Decision Map"
    >
      <defs>
        <marker id="hemap-arrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={COLORS.muted} />
        </marker>
      </defs>

      {labels.map((l) => (
        <text key={l.text} x={l.x} y={l.y} textAnchor="middle" fill={COLORS.muted} fontSize="10" fontWeight="700" letterSpacing="1" fontFamily="inherit">
          {l.text.toUpperCase()}
        </text>
      ))}

      {allEdges.map((e, i) => {
        const from = nodeById.get(e.from)!;
        const to = nodeById.get(e.to)!;
        const active = isActive(e.from) && isActive(e.to);
        return (
          <path
            key={i}
            d={edgePath(from, to)}
            fill="none"
            stroke={active ? COLORS.primary : COLORS.border}
            strokeWidth={active ? 1.2 : 0.5}
            opacity={hovered && !active ? 0.08 : 0.35}
            markerEnd="url(#hemap-arrow)"
          />
        );
      })}

      {allNodes.map((n) => {
        const active = isActive(n.id);
        const isHov = hovered === n.id;
        return (
          <g
            key={n.id}
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}
            opacity={active ? 1 : 0.15}
          >
            <rect
              x={n.x} y={n.y} width={n.w} height={n.h}
              rx={6}
              fill={n.color} fillOpacity={isHov ? 0.25 : 0.08}
              stroke={n.color} strokeWidth={isHov ? 2 : 1} strokeOpacity={isHov ? 1 : 0.4}
            />
            <text
              x={n.x + n.w / 2}
              y={n.y + (n.sublabel ? n.h / 2 - 2 : n.h / 2 + 4)}
              textAnchor="middle"
              fill={COLORS.text}
              fontSize={n.group === "goal" ? "10" : "11"}
              fontWeight="600"
              fontFamily={n.group === "event" ? "monospace" : "inherit"}
            >
              {n.label}
            </text>
            {n.sublabel && (
              <text
                x={n.x + n.w / 2}
                y={n.y + n.h / 2 + 10}
                textAnchor="middle"
                fill={COLORS.muted}
                fontSize="8"
                fontFamily="inherit"
              >
                {n.sublabel}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
