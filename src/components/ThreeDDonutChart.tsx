import React, { useState, useMemo } from 'react';

interface ChartDataItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface ThreeDDonutChartProps {
  data: ChartDataItem[];
  totalValue: number;
  assetsLength: number;
  onHoverSegment?: (label: string | null) => void;
}

// Helper to darken colors for 3D extrusion side-walls
function getWallColor(hex: string, factor: number = 0.65): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return hex;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  const nr = Math.min(255, Math.max(0, Math.round(r * factor)));
  const ng = Math.min(255, Math.max(0, Math.round(g * factor)));
  const nb = Math.min(255, Math.max(0, Math.round(b * factor)));

  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

export default function ThreeDDonutChart({
  data,
  totalValue,
  assetsLength,
  onHoverSegment
}: ThreeDDonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 340;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2 - 5; // offset slightly for bottom shadows

  // Isometric Projection constants
  const tilt = 0.52;        // Vertical squish factor (represents the 3D tilt perspective)
  const thickness = 26;     // The depth of extrusion (3D height)
  const rOut = 90;         // Outer radius
  const rIn = 58;          // Inner radius
  const baseExplode = 6;    // Base spacing between segments for that segmented block feel
  const hoverExplode = 16;  // Exaggerated explosion on hover for active slice

  // Compute angles and render paths
  const slices = useMemo(() => {
    let currentAngle = -Math.PI / 2; // Start at 12 o'clock (-90 degrees)

    return data.map((item, idx) => {
      const percentage = Math.max(0.1, item.percentage);
      const angleSpan = (percentage / 100) * 2 * Math.PI;
      const a1 = currentAngle;
      const a2 = currentAngle + angleSpan;
      currentAngle = a2;

      const aMid = (a1 + a2) / 2;

      // Adjust angles slightly for small gaps
      const pad = angleSpan > 0.15 ? 0.03 : angleSpan * 0.15;
      const a1Active = a1 + pad;
      const a2Active = a2 - pad;

      return {
        item,
        idx,
        a1: a1Active,
        a2: a2Active,
        aMid,
        largeArc: angleSpan - 2 * pad > Math.PI ? 1 : 0,
      };
    });
  }, [data]);

  // Painter's algorithm: sort slices so background ones (pointing up/higher y in 3D) 
  // are rendered first, and foreground ones (pointing down/closer to viewer) on top.
  // In isometric projection with tilt, y goes down on page as angle's sin goes positive.
  // Therefore, sort by aMid's sin in ascending order (front-most slices have sin ~ 1).
  const sortedSlices = useMemo(() => {
    return [...slices].sort((a, b) => Math.sin(a.aMid) - Math.sin(b.aMid));
  }, [slices]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      
      {/* 2. Glassmorphic Central Disk Overlay */}
      <div 
        className="absolute w-[116px] h-[64px] rounded-full pointer-events-none z-10 select-none flex flex-col items-center justify-center text-center backdrop-blur-md bg-[#07090f]/80 border border-slate-700/50 shadow-2xl"
        style={{
          top: `${cy - 30}px`,
          left: `${cx - 58}px`,
          boxShadow: 'inset 0 0 12px rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.8)'
        }}
      >
        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">Patrimonio</span>
        <span className="text-sm font-black text-white font-mono leading-none mt-0.5">
          €{totalValue >= 1000000 ? (totalValue / 1000000).toFixed(1) + 'M' : totalValue >= 1000 ? (totalValue / 1000).toFixed(1) + 'k' : Math.round(totalValue)}
        </span>
        <span className="text-[7.5px] font-mono text-gray-400 mt-0.5">
          {hoveredIndex !== null ? `${data[hoveredIndex].name} (${data[hoveredIndex].percentage.toFixed(0)}%)` : `${assetsLength} assets`}
        </span>
      </div>

      {/* SVG Canvas */}
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible select-none"
      >
        <defs>
          {/* Radial glow filter for lights */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Blur filter for realistic 3D shadow cast under segments */}
          <filter id="shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>

          {/* Beautiful Glass Shimmer Gradient for Top Faces */}
          {data.map((item, idx) => (
            <linearGradient key={`grad-${idx}`} id={`glass-grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffffff0" stopOpacity={0.8} />
              <stop offset="25%" stopColor={item.color} stopOpacity={0.65} />
              <stop offset="70%" stopColor={item.color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={getWallColor(item.color, 0.5)} stopOpacity={0.6} />
            </linearGradient>
          ))}
        </defs>

        {/* ==================== LAYER 1: DROP SHADOW CAST (Rendered first at depth Offset) ==================== */}
        <g filter="url(#shadow-blur)" opacity="0.65">
          {slices.map(({ a1, a2, aMid, largeArc, idx }) => {
            const isHovered = hoveredIndex === idx;
            const currentExplode = isHovered ? hoverExplode : baseExplode;

            // Explode offset vectors
            const ex = currentExplode * Math.cos(aMid);
            const ey = currentExplode * Math.sin(aMid) * tilt;

            // Shadow points at bottom layer (no height offset, shifted offset slightly downwards for depth)
            const sx = cx + ex;
            const sy = cy + ey + 18; // offset on the floor

            const p1_out = {
              x: sx + rOut * Math.cos(a1),
              y: sy + rOut * Math.sin(a1) * tilt
            };
            const p2_out = {
              x: sx + rOut * Math.cos(a2),
              y: sy + rOut * Math.sin(a2) * tilt
            };
            const p1_in = {
              x: sx + rIn * Math.cos(a1),
              y: sy + rIn * Math.sin(a1) * tilt
            };
            const p2_in = {
              x: sx + rIn * Math.cos(a2),
              y: sy + rIn * Math.sin(a2) * tilt
            };

            const shadowPath = `
              M ${p1_out.x} ${p1_out.y}
              A ${rOut} ${rOut * tilt} 0 ${largeArc} 1 ${p2_out.x} ${p2_out.y}
              L ${p2_in.x} ${p2_in.y}
              A ${rIn} ${rIn * tilt} 0 ${largeArc} 0 ${p1_in.x} ${p1_in.y}
              Z
            `;

            return (
              <path
                key={`shadow-${idx}`}
                d={shadowPath}
                fill="#000000"
                className="transition-all duration-300 ease-out"
              />
            );
          })}
        </g>

        {/* ==================== LAYER 2: 3D EXTRUDED SEGMENTS (Painter's Ordered) ==================== */}
        {sortedSlices.map(({ a1, a2, aMid, largeArc, idx, item }) => {
          const isHovered = hoveredIndex === idx;
          const currentExplode = isHovered ? hoverExplode : baseExplode;

          // Trigonometric offset vector
          const ex = currentExplode * Math.cos(aMid);
          const ey = currentExplode * Math.sin(aMid) * tilt;

          // Coordinates on Top Floor (Height offset = thickness)
          const tx = cx + ex;
          const ty = cy + ey;

          const p1_out_top = { x: tx + rOut * Math.cos(a1), y: ty + rOut * Math.sin(a1) * tilt - thickness };
          const p2_out_top = { x: tx + rOut * Math.cos(a2), y: ty + rOut * Math.sin(a2) * tilt - thickness };
          const p1_in_top  = { x: tx + rIn * Math.cos(a1),  y: ty + rIn * Math.sin(a1) * tilt - thickness };
          const p2_in_top  = { x: tx + rIn * Math.cos(a2),  y: ty + rIn * Math.sin(a2) * tilt - thickness };

          // Coordinates on Bottom Floor (Height offset = 0)
          const p1_out_bot = { x: tx + rOut * Math.cos(a1), y: ty + rOut * Math.sin(a1) * tilt };
          const p2_out_bot = { x: tx + rOut * Math.cos(a2), y: ty + rOut * Math.sin(a2) * tilt };
          const p1_in_bot  = { x: tx + rIn * Math.cos(a1),  y: ty + rIn * Math.sin(a1) * tilt };
          const p2_in_bot  = { x: tx + rIn * Math.cos(a2),  y: ty + rIn * Math.sin(a2) * tilt };

          // Construct 3D elements
          const outerWallPath = `
            M ${p1_out_bot.x} ${p1_out_bot.y}
            A ${rOut} ${rOut * tilt} 0 ${largeArc} 1 ${p2_out_bot.x} ${p2_out_bot.y}
            L ${p2_out_top.x} ${p2_out_top.y}
            A ${rOut} ${rOut * tilt} 0 ${largeArc} 0 ${p1_out_top.x} ${p1_out_top.y}
            Z
          `;

          const innerWallPath = `
            M ${p1_in_bot.x} ${p1_in_bot.y}
            A ${rIn} ${rIn * tilt} 0 ${largeArc} 1 ${p2_in_bot.x} ${p2_in_bot.y}
            L ${p2_in_top.x} ${p2_in_top.y}
            A ${rIn} ${rIn * tilt} 0 ${largeArc} 0 ${p1_in_top.x} ${p1_in_top.y}
            Z
          `;

          const capStartPath = `
            M ${p1_in_bot.x} ${p1_in_bot.y}
            L ${p1_in_top.x} ${p1_in_top.y}
            L ${p1_out_top.x} ${p1_out_top.y}
            L ${p1_out_bot.x} ${p1_out_bot.y}
            Z
          `;

          const capEndPath = `
            M ${p2_in_bot.x} ${p2_in_bot.y}
            L ${p2_in_top.x} ${p2_in_top.y}
            L ${p2_out_top.x} ${p2_out_top.y}
            L ${p2_out_bot.x} ${p2_out_bot.y}
            Z
          `;

          const topFacePath = `
            M ${p1_out_top.x} ${p1_out_top.y}
            A ${rOut} ${rOut * tilt} 0 ${largeArc} 1 ${p2_out_top.x} ${p2_out_top.y}
            L ${p2_in_top.x} ${p2_in_top.y}
            A ${rIn} ${rIn * tilt} 0 ${largeArc} 0 ${p1_in_top.x} ${p1_in_top.y}
            Z
          `;

          // Colors
          const baseColor = item.color;
          const darkWallColor = getWallColor(baseColor, 0.44);
          const midWallColor = getWallColor(baseColor, 0.72);

          // Interactive handlers
          const triggerHover = () => {
            setHoveredIndex(idx);
            if (onHoverSegment) {
              onHoverSegment(`${item.name} (${item.percentage.toFixed(0)}%)`);
            }
          };

          const clearHover = () => {
            setHoveredIndex(null);
            if (onHoverSegment) {
              onHoverSegment(null);
            }
          };

          return (
            <g
              key={`slice-3d-${idx}`}
              className="group/slice cursor-pointer select-none"
              onMouseEnter={triggerHover}
              onMouseLeave={clearHover}
            >
              {/* Vertical Side Extrusions - Drawn Back to Front for crisp rendering */}

              {/* 1. Outer Wall (Shows on outside curved parts) */}
              <path
                d={outerWallPath}
                fill={midWallColor}
                fillOpacity={0.8}
                stroke={getWallColor(baseColor, 0.85)}
                strokeWidth={1.2}
                strokeOpacity={0.5}
                className="transition-all duration-300 ease-out"
              />

              {/* 2. Inner Wall (Inside hollow ring) */}
              <path
                d={innerWallPath}
                fill={darkWallColor}
                fillOpacity={0.9}
                stroke={getWallColor(baseColor, 0.5)}
                strokeWidth={1}
                strokeOpacity={0.4}
                className="transition-all duration-300 ease-out"
              />

              {/* 3. Radial Start Cut-cap (Left edge) */}
              <path
                d={capStartPath}
                fill={darkWallColor}
                fillOpacity={0.88}
                stroke={getWallColor(baseColor, 0.8)}
                strokeWidth={1}
                className="transition-all duration-300 ease-out"
              />

              {/* 4. Radial End Cut-cap (Right edge) */}
              <path
                d={capEndPath}
                fill={darkWallColor}
                fillOpacity={0.88}
                stroke={getWallColor(baseColor, 0.8)}
                strokeWidth={1}
                className="transition-all duration-300 ease-out"
              />

              {/* 5. TOP FACE (Glass lid layer with high gloss and neon borders) */}
              <path
                d={topFacePath}
                fill={`url(#glass-grad-${idx})`}
                stroke={baseColor}
                strokeWidth={1.8}
                strokeOpacity={isHovered ? 1.0 : 0.85}
                style={{
                  filter: isHovered ? `drop-shadow(0 0 6px ${baseColor}88)` : 'none',
                }}
                className="transition-all duration-300 ease-out"
              />

              {/* 6. High-Contrast Inner Glow Shimmer Effect */}
              <path
                d={`
                  M ${p1_out_top.x} ${p1_out_top.y}
                  A ${rOut} ${rOut * tilt} 0 ${largeArc} 1 ${p2_out_top.x} ${p2_out_top.y}
                `}
                fill="none"
                stroke="#ffffff"
                strokeWidth={1.4}
                strokeOpacity={0.55}
                className="pointer-events-none transition-all duration-300"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
