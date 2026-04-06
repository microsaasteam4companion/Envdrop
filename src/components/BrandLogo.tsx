import React from "react";

interface BrandLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function BrandLogo({ size = 32, className = "", showText = false }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 4px 12px rgba(99, 102, 241, 0.4))" }}
      >
        <defs>
          <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        
        {/* Hex Shield Path */}
        <path
          d="M50 5L90 25V55C90 75 75 90 50 95C25 90 10 75 10 55V25L50 5Z"
          fill="url(#brand-grad)"
        />
        
        {/* Droplet Shape (Intersection) */}
        <path
          d="M50 30C38 30 30 42 30 55C30 68 39 76 50 76C61 76 70 68 70 55C70 42 62 30 50 30ZM50 35C50 35 60 48 60 55C60 62 55 68 50 68C45 68 40 62 40 55C40 48 50 35 50 35Z"
          fill="white"
          fillOpacity="0.8"
        />
        
        {/* Secondary Shine */}
        <circle cx="45" cy="45" r="3" fill="white" fillOpacity="0.6" />
      </svg>
      {showText && (
        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--foreground)', letterSpacing: '-0.03em' }}>
          envdrop
        </span>
      )}
    </div>
  );
}
