import { useState } from "react";
import { COLORS } from "./colors";

interface MessageDef {
  id: string;
  label: string;
  direction: "right" | "left";
  y: number;
  color: string;
  delay: string;
}

const sqMessages: MessageDef[] = [
  { id: "submit", label: "UserTurn", direction: "right", y: 105, color: COLORS.secondary, delay: "0s" },
  { id: "cancel", label: "Interrupt", direction: "right", y: 140, color: COLORS.danger, delay: "0.6s" },
  { id: "config", label: "OverrideTurnContext", direction: "right", y: 175, color: COLORS.warning, delay: "1.2s" },
  { id: "approval", label: "ExecApproval", direction: "right", y: 210, color: COLORS.success, delay: "1.8s" },
];

const eqMessages: MessageDef[] = [
  { id: "started", label: "TurnStarted", direction: "left", y: 245, color: COLORS.success, delay: "0.3s" },
  { id: "agent-msg", label: "AgentMessage", direction: "left", y: 280, color: COLORS.primary, delay: "0.9s" },
  { id: "tool-call", label: "McpToolCallBegin", direction: "left", y: 315, color: COLORS.warning, delay: "1.5s" },
  { id: "complete", label: "TurnComplete", direction: "left", y: 350, color: COLORS.secondary, delay: "2.1s" },
];

const LEFT_X = 40;
const RIGHT_X = 500;
const LEFT_PANEL_W = 160;
const RIGHT_PANEL_W = 160;
const CHANNEL_LEFT = LEFT_X + LEFT_PANEL_W + 20;
const CHANNEL_RIGHT = RIGHT_X - 20;

export default function SqEqAnimation() {
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);

  return (
    <svg
      viewBox="0 0 700 400"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="SQ/EQ Message Protocol Animation"
    >
      <defs>
        <marker id="sq-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={COLORS.secondary} />
        </marker>
        <marker id="eq-arrow" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
          <polygon points="8 0, 0 3, 8 6" fill={COLORS.primary} />
        </marker>
      </defs>

      {/* Left panel: Frontend */}
      <rect x={LEFT_X} y={20} width={LEFT_PANEL_W} height={360} rx={8} fill={COLORS.secondary} fillOpacity={0.05} stroke={COLORS.secondary} strokeWidth={1} />
      <text x={LEFT_X + LEFT_PANEL_W / 2} y={48} textAnchor="middle" fill={COLORS.text} fontSize="13" fontWeight="700" fontFamily="inherit" className="diagram-label">Frontend</text>
      <text x={LEFT_X + LEFT_PANEL_W / 2} y={65} textAnchor="middle" fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">codex-cli</text>

      {/* Right panel: Backend */}
      <rect x={RIGHT_X} y={20} width={RIGHT_PANEL_W} height={360} rx={8} fill={COLORS.primary} fillOpacity={0.05} stroke={COLORS.primary} strokeWidth={1} />
      <text x={RIGHT_X + RIGHT_PANEL_W / 2} y={48} textAnchor="middle" fill={COLORS.text} fontSize="13" fontWeight="700" fontFamily="inherit" className="diagram-label">Backend</text>
      <text x={RIGHT_X + RIGHT_PANEL_W / 2} y={65} textAnchor="middle" fill={COLORS.muted} fontSize="10" fontFamily="monospace" className="diagram-label">codex-rs core</text>

      {/* Channel labels */}
      <text x={(CHANNEL_LEFT + CHANNEL_RIGHT) / 2} y={90} textAnchor="middle" fill={COLORS.secondary} fontSize="11" fontWeight="600" fontFamily="monospace" className="diagram-label">
        SQ (Submission Queue) →
      </text>

      <text x={(CHANNEL_LEFT + CHANNEL_RIGHT) / 2} y={235} textAnchor="middle" fill={COLORS.primary} fontSize="11" fontWeight="600" fontFamily="monospace" className="diagram-label">
        ← EQ (Event Queue)
      </text>

      {/* SQ messages (right arrows) */}
      {sqMessages.map((msg) => {
        const isHov = hoveredMsg === msg.id;
        return (
          <g
            key={msg.id}
            onMouseEnter={() => setHoveredMsg(msg.id)}
            onMouseLeave={() => setHoveredMsg(null)}
            className="diagram-node"
          >
            {/* Static arrow line */}
            <line
              x1={CHANNEL_LEFT} y1={msg.y}
              x2={CHANNEL_RIGHT} y2={msg.y}
              stroke={msg.color}
              strokeWidth={isHov ? 2 : 1}
              strokeDasharray="8 4"
              opacity={isHov ? 0.9 : 0.3}
              markerEnd="url(#sq-arrow)"
              style={{ animation: "dash-flow 1s linear infinite" }}
            />
            {/* Label on left side */}
            <text
              x={LEFT_X + LEFT_PANEL_W / 2}
              y={msg.y + 4}
              textAnchor="middle"
              fill={isHov ? COLORS.text : COLORS.muted}
              fontSize="10"
              fontFamily="monospace"
              fontWeight={isHov ? "600" : "400"}
              className="diagram-label"
            >
              {msg.label}
            </text>
            {/* Animated dot */}
            <circle r="4" fill={msg.color} opacity={0.8}>
              <animateMotion
                dur="2.5s"
                repeatCount="indefinite"
                begin={msg.delay}
                path={`M${CHANNEL_LEFT},${msg.y} L${CHANNEL_RIGHT},${msg.y}`}
              />
            </circle>
          </g>
        );
      })}

      {/* EQ messages (left arrows) */}
      {eqMessages.map((msg) => {
        const isHov = hoveredMsg === msg.id;
        return (
          <g
            key={msg.id}
            onMouseEnter={() => setHoveredMsg(msg.id)}
            onMouseLeave={() => setHoveredMsg(null)}
            className="diagram-node"
          >
            {/* Static arrow line */}
            <line
              x1={CHANNEL_RIGHT} y1={msg.y}
              x2={CHANNEL_LEFT} y2={msg.y}
              stroke={msg.color}
              strokeWidth={isHov ? 2 : 1}
              strokeDasharray="8 4"
              opacity={isHov ? 0.9 : 0.3}
              markerEnd="url(#eq-arrow)"
              style={{ animation: "dash-flow-reverse 1s linear infinite" }}
            />
            {/* Label on right side */}
            <text
              x={RIGHT_X + RIGHT_PANEL_W / 2}
              y={msg.y + 4}
              textAnchor="middle"
              fill={isHov ? COLORS.text : COLORS.muted}
              fontSize="10"
              fontFamily="monospace"
              fontWeight={isHov ? "600" : "400"}
              className="diagram-label"
            >
              {msg.label}
            </text>
            {/* Animated dot */}
            <circle r="4" fill={msg.color} opacity={0.8}>
              <animateMotion
                dur="2.5s"
                repeatCount="indefinite"
                begin={msg.delay}
                path={`M${CHANNEL_RIGHT},${msg.y} L${CHANNEL_LEFT},${msg.y}`}
              />
            </circle>
          </g>
        );
      })}

      {/* Center divider lines */}
      <line x1={(CHANNEL_LEFT + CHANNEL_RIGHT) / 2} y1={95} x2={(CHANNEL_LEFT + CHANNEL_RIGHT) / 2} y2={225} stroke={COLORS.border} strokeWidth={1} strokeDasharray="3 6" opacity={0.3} />
    </svg>
  );
}
