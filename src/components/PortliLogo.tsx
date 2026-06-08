import React from 'react';

interface PortliLogoProps {
  className?: string;
  size?: number;
}

export default function PortliLogo({ className = '', size = 32 }: PortliLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 16px rgba(0, 229, 160, 0.45))' }}
    >
      <defs>
        {/* Simplified signature Green-Teal to Sky-Blue gradient from the mockup */}
        <linearGradient id="portli-ribbon-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00e5a0" />    {/* Pure Green Teal */}
          <stop offset="50%" stopColor="#00f2ff" />   {/* Electric Cyan */}
          <stop offset="100%" stopColor="#0072ff" />  {/* Tech Royal Blue */}
        </linearGradient>

        <linearGradient id="portli-tail-grad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00c8ff" />
          <stop offset="100%" stopColor="#0072ff" />
        </linearGradient>

        {/* Glowing gradient for the inner business bars */}
        <linearGradient id="portli-bar-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#00e5a0" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#00f2ff" stopOpacity={0.8} />
        </linearGradient>

        {/* Shadow for ribbon overlap crease */}
        <filter id="crease-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-1.5" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* INNER COMPONENT: Mini glowing bar charts inside the loop of the 'P' */}
      <g opacity="0.95">
        {/* Three vertical financial/portfolio bars */}
        <rect x="58" y="52" width="4" height="13" rx="1.5" fill="url(#portli-bar-grad)" />
        <rect x="66" y="44" width="4" height="21" rx="1.5" fill="url(#portli-bar-grad)" />
        <rect x="74" y="34" width="4" height="31" rx="1.5" fill="url(#portli-bar-grad)" />

        {/* Glowing analytical line chart rising through the business bars */}
        <path
          d="M 47 65 L 56 53 L 64 57 L 72 43 L 80 47 L 94 32"
          stroke="#00f2ff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 4px rgba(0, 242, 255, 0.6))' }}
        />
        {/* High-precision arrowhead pointing up-right exactly like the image */}
        <path
          d="M 86 32 H 94 V 40"
          stroke="#00f2ff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 4px rgba(0, 242, 255, 0.6))' }}
        />
      </g>

      {/* Main Ribbon Left Stem, Top Loop & Bottom Loop */}
      <path
        d="M 40 68 V 44 C 40 32, 49 22, 64 22 H 84 C 99 22, 109 32, 109 48 C 109 64, 99 74, 84 74 H 58"
        stroke="url(#portli-ribbon-grad)"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Diagonal Overlapping Tail Flap forming the bottom ribbon fold */}
      <path
        d="M 58 74 L 40 92"
        stroke="url(#portli-tail-grad)"
        strokeWidth="15"
        strokeLinecap="round"
        filter="url(#crease-shadow)"
      />

      {/* Tiny high contrast crease line accentuating the 3D ribbon split/fold */}
      <line
        x1="53"
        y1="69"
        x2="48"
        y2="74"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}
