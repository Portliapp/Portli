import React from 'react';

interface PortliLogoProps {
  className?: string;
  size?: number;
}

export default function PortliLogo({ className = '', size = 32 }: PortliLogoProps) {
  return (
    <img
      src="/logo.png"
      alt="Portli Logo"
      width={size}
      height={size}
      className={`${className} object-contain`}
      style={{ filter: 'drop-shadow(0 0 12px rgba(134, 59, 255, 0.4))' }}
    />
  );
}
