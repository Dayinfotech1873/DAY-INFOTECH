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
          <linearGradient id="logoRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#FF0000', stopOpacity: 1 }} />
            <stop offset="16.6%" style={{ stopColor: '#FF7F00', stopOpacity: 1 }} />
            <stop offset="33.3%" style={{ stopColor: '#FFFF00', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#00FF00', stopOpacity: 1 }} />
            <stop offset="66.6%" style={{ stopColor: '#0000FF', stopOpacity: 1 }} />
            <stop offset="83.3%" style={{ stopColor: '#4B0082', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#9400D3', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
            <feOffset dx="0" dy="5" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(512, 512)">
          <text 
            textAnchor="middle" 
            dominantBaseline="middle"
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="900" 
            fontSize="380" 
            fill="url(#logoRainbow)" 
            stroke="white"
            strokeWidth="12"
            y="-140"
            textLength="900"
            lengthAdjust="spacingAndGlyphs"
            filter="url(#logoShadow)"
          >DAY</text>
          <text 
            textAnchor="middle" 
            dominantBaseline="middle"
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="900" 
            fontSize="180" 
            fill="url(#logoRainbow)" 
            stroke="white"
            strokeWidth="6"
            y="180"
            textLength="900"
            lengthAdjust="spacingAndGlyphs"
            filter="url(#logoShadow)"
          >INFOTECH</text>
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
