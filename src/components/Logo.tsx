import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 80, showText = true }) => {
  let currentTheme = 'light';
  try {
    currentTheme = typeof window !== 'undefined' ? localStorage.getItem('dashboard_theme') || 'light' : 'light';
  } catch (e) {}
  const isDark = currentTheme === 'dark';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Inline SVG Brand Logo - Guaranteed to load in any environment */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="select-none pointer-events-none transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <defs>
          <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
            <feOffset dx="0" dy="6" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.6" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* White rounded background rect like an app icon */}
        <rect width="1024" height="1024" fill="white" rx="160" />

        <g transform="translate(512, 512)">
          <text 
            textAnchor="middle" 
            dominantBaseline="middle"
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="950" 
            fontSize="280" 
            stroke="#1e1b4b"
            strokeWidth="3"
            y="-90"
            textLength="580"
            lengthAdjust="spacingAndGlyphs"
            filter="url(#logoShadow)"
          >
            <tspan fill="#ef4444">D</tspan>
            <tspan fill="#f59e0b">A</tspan>
            <tspan fill="#10b981">Y</tspan>
          </text>
          <text 
            textAnchor="middle" 
            dominantBaseline="middle"
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="950" 
            fontSize="120" 
            stroke="#1e1b4b"
            strokeWidth="1.5"
            y="150"
            textLength="600"
            lengthAdjust="spacingAndGlyphs"
            filter="url(#logoShadow)"
          >
            <tspan fill="#3b82f6">I</tspan>
            <tspan fill="#6366f1">N</tspan>
            <tspan fill="#8b5cf6">F</tspan>
            <tspan fill="#ec4899">O</tspan>
            <tspan fill="#06b6d4">T</tspan>
            <tspan fill="#14b8a6">E</tspan>
            <tspan fill="#f43f5e">C</tspan>
            <tspan fill="#f97316">H</tspan>
          </text>
        </g>
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className="mt-2 font-sans">
          <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            DAY INFOTECH
          </h2>
          <p className={`${isDark ? "text-amber-400" : "text-indigo-950"} font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mt-0.5 opacity-90`}>
            digital point
          </p>
        </div>
      )}
    </div>
  );
};
