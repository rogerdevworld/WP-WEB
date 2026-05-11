import React from 'react';
import { motion } from 'framer-motion';

interface RadarChartProps {
  data: {
    label: string;
    actual: number; // 0 to 100
    target: number; // 0 to 100
  }[];
}

export default function RadarChart({ data }: RadarChartProps) {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.35;
  const angleStep = (Math.PI * 2) / data.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const actualPoints = data.map((d, i) => getCoordinates(i, d.actual));
  const targetPoints = data.map((d, i) => getCoordinates(i, d.target));

  const actualPath = `M ${actualPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
  const targetPath = `M ${targetPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <path
            key={i}
            d={`M ${data.map((_, idx) => {
              const p = getCoordinates(idx, scale * 100);
              return `${p.x},${p.y}`;
            }).join(' L ')} Z`}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {data.map((_, i) => {
          const p = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          );
        })}

        {/* Target Area (Static Ghost) */}
        <motion.path
          d={targetPath}
          fill="rgba(255, 215, 0, 0.05)"
          stroke="rgba(255, 215, 0, 0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Actual Area (Animated) */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d={actualPath}
          fill="rgba(255, 215, 0, 0.3)"
          stroke="#FFD700"
          strokeWidth="3"
          className="drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]"
        />

        {/* Labels */}
        {data.map((d, i) => {
          const p = getCoordinates(i, 115);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              className="fill-gray-500 font-mono text-[8px] uppercase font-black"
              dominantBaseline="middle"
            >
              {d.label}
            </text>
          );
        })}

        {/* Data Points */}
        {actualPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#FFD700"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
            className="drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
          />
        ))}
      </svg>

      {/* Center Glow */}
      <div className="absolute w-2 h-2 bg-primary rounded-full blur-sm" />
    </div>
  );
}
