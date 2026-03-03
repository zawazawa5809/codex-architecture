import { useState } from "react";
import { COLORS } from "./colors";

interface LayerDef {
  id: string;
  label: string;
  sublabel: string;
  color: string;
}

interface ColumnDef {
  id: string;
  label: string;
  icon: string;
  x: number;
  layers: LayerDef[];
}

const columns: ColumnDef[] = [
  {
    id: "linux",
    label: "Linux",
    icon: "\u{1F427}",
    x: 30,
    layers: [
      { id: "bwrap", label: "Bubblewrap", sublabel: "FS namespace isolation", color: COLORS.danger },
      { id: "landlock", label: "Landlock LSM", sublabel: "Path-based access control", color: COLORS.warning },
      { id: "seccomp", label: "seccomp-BPF", sublabel: "Syscall + network filter", color: COLORS.primary },
    ],
  },
  {
    id: "macos",
    label: "macOS",
    icon: "\u{1F34E}",
    x: 230,
    layers: [
      { id: "seatbelt", label: "Seatbelt", sublabel: "sandbox-exec wrapper", color: COLORS.danger },
      { id: "sbpl", label: ".sbpl Profile", sublabel: "Declarative policy rules", color: COLORS.warning },
      { id: "network-mac", label: "Network Policy", sublabel: "Per-process filtering", color: COLORS.primary },
    ],
  },
  {
    id: "windows",
    label: "Windows",
    icon: "\u{1FA9F}",
    x: 430,
    layers: [
      { id: "token", label: "Restricted Token", sublabel: "Reduced privilege SID", color: COLORS.danger },
      { id: "acl", label: "ACL Enforcement", sublabel: "File system permissions", color: COLORS.warning },
      { id: "network-win", label: "Network Rules", sublabel: "Firewall / WFP", color: COLORS.primary },
    ],
  },
];

const COL_W = 170;
const LAYER_H = 52;
const LAYER_GAP = 10;
const TOP_Y = 75;

export default function SandboxFlow() {
  const [hovered, setHovered] = useState<string | null>(null);

  const hoveredCol = hovered
    ? columns.find((c) => c.layers.some((l) => l.id === hovered))?.id
    : null;

  return (
    <svg
      viewBox="0 0 640 380"
      width="100%"
      style={{ fontFamily: "inherit", maxWidth: 800 }}
      role="img"
      aria-label="Sandbox Architecture Comparison"
    >
      {/* Column headers */}
      {columns.map((col) => {
        const active = !hoveredCol || hoveredCol === col.id;
        return (
          <g key={col.id} opacity={active ? 1 : 0.3}>
            <text
              x={col.x + COL_W / 2}
              y={35}
              textAnchor="middle"
              fill={COLORS.text}
              fontSize="14"
              fontWeight="700"
              fontFamily="inherit"
              className="diagram-label"
            >
              {col.label}
            </text>
            <text
              x={col.x + COL_W / 2}
              y={55}
              textAnchor="middle"
              fill={COLORS.muted}
              fontSize="11"
              fontFamily="inherit"
              className="diagram-label"
            >
              Sandbox Stack
            </text>
          </g>
        );
      })}

      {/* Security level labels */}
      <text x={15} y={TOP_Y + 26} fill={COLORS.danger} fontSize="9" fontFamily="monospace" className="diagram-label" transform={`rotate(-90, 15, ${TOP_Y + 26})`}>High</text>
      <text x={15} y={TOP_Y + LAYER_H + LAYER_GAP + 26} fill={COLORS.warning} fontSize="9" fontFamily="monospace" className="diagram-label" transform={`rotate(-90, 15, ${TOP_Y + LAYER_H + LAYER_GAP + 26})`}>Mid</text>
      <text x={15} y={TOP_Y + 2 * (LAYER_H + LAYER_GAP) + 26} fill={COLORS.primary} fontSize="9" fontFamily="monospace" className="diagram-label" transform={`rotate(-90, 15, ${TOP_Y + 2 * (LAYER_H + LAYER_GAP) + 26})`}>Base</text>

      {/* Layer cards */}
      {columns.map((col) => {
        const active = !hoveredCol || hoveredCol === col.id;
        return col.layers.map((layer, li) => {
          const y = TOP_Y + li * (LAYER_H + LAYER_GAP);
          const isHovered = hovered === layer.id;
          return (
            <g
              key={layer.id}
              onMouseEnter={() => setHovered(layer.id)}
              onMouseLeave={() => setHovered(null)}
              className="diagram-node"
              opacity={active ? 1 : 0.2}
            >
              <rect
                x={col.x}
                y={y}
                width={COL_W}
                height={LAYER_H}
                rx={6}
                fill={layer.color}
                fillOpacity={isHovered ? 0.25 : 0.08}
                stroke={layer.color}
                strokeWidth={isHovered ? 2 : 1}
              />
              <text
                x={col.x + COL_W / 2}
                y={y + 22}
                textAnchor="middle"
                fill={COLORS.text}
                fontSize="11"
                fontWeight="600"
                fontFamily="inherit"
                className="diagram-label"
              >
                {layer.label}
              </text>
              <text
                x={col.x + COL_W / 2}
                y={y + 38}
                textAnchor="middle"
                fill={COLORS.muted}
                fontSize="9"
                fontFamily="monospace"
                className="diagram-label"
              >
                {layer.sublabel}
              </text>
            </g>
          );
        });
      })}

      {/* Common bottom layer */}
      <rect
        x={30}
        y={TOP_Y + 3 * (LAYER_H + LAYER_GAP) + 10}
        width={570}
        height={46}
        rx={6}
        fill={COLORS.success}
        fillOpacity={0.08}
        stroke={COLORS.success}
        strokeWidth={1}
      />
      <text
        x={315}
        y={TOP_Y + 3 * (LAYER_H + LAYER_GAP) + 30}
        textAnchor="middle"
        fill={COLORS.text}
        fontSize="12"
        fontWeight="600"
        fontFamily="inherit"
        className="diagram-label"
      >
        Process Hardening (Common)
      </text>
      <text
        x={315}
        y={TOP_Y + 3 * (LAYER_H + LAYER_GAP) + 46}
        textAnchor="middle"
        fill={COLORS.muted}
        fontSize="9"
        fontFamily="monospace"
        className="diagram-label"
      >
        SandboxPolicy: ReadOnly | DangerFullAccess | ExternalSandbox
      </text>

      {/* Connecting lines from layers to common */}
      {columns.map((col) => {
        const lastLayer = col.layers[col.layers.length - 1];
        const lastY = TOP_Y + 2 * (LAYER_H + LAYER_GAP) + LAYER_H;
        const commonY = TOP_Y + 3 * (LAYER_H + LAYER_GAP) + 10;
        const cx = col.x + COL_W / 2;
        const active = !hoveredCol || hoveredCol === col.id;
        return (
          <line
            key={col.id}
            x1={cx} y1={lastY} x2={cx} y2={commonY}
            stroke={active ? lastLayer.color : COLORS.border}
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={active ? 0.5 : 0.15}
            className="diagram-connection"
          />
        );
      })}
    </svg>
  );
}
