import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 48, 
  showText = true,
  layout = 'horizontal'
}) => {
  let currentTheme = 'light';
  try {
    currentTheme = typeof window !== 'undefined' ? localStorage.getItem('dashboard_theme') || 'light' : 'light';
  } catch (e) {}
  const isDark = currentTheme === 'dark';

  // SVG dimensions proportional to the specified size
  const svgSize = size;

  const renderIcon = () => (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none pointer-events-none transition-transform duration-300 hover:scale-105"
      style={{ width: svgSize, height: svgSize }}
    >
      <defs>
        <linearGradient id="logoDGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" /> {/* Deep Blue */}
          <stop offset="60%" stopColor="#2563EB" /> {/* Royal Blue */}
          <stop offset="100%" stopColor="#3B82F6" /> {/* Light Blue */}
        </linearGradient>
        <linearGradient id="logoDotBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="logoDotOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>

      {/* Outer subtle glow circle */}
      <circle cx="50" cy="50" r="44" stroke="#EFF6FF" strokeWidth="2" strokeDasharray="3 3" opacity="0.5" />

      {/* Stylized Tech D Shape */}
      <path
        d="M 28 22 
           C 28 22, 48 16, 64 22 
           C 80 28, 84 44, 84 50
           C 84 56, 80 72, 64 78
           C 48 84, 28 78, 28 78
           Z"
        fill="none"
        stroke="url(#logoDGrad)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner curve of D */}
      <path
        d="M 40 34 
           C 48 30, 58 32, 64 38
           C 70 44, 70 56, 64 62
           C 58 68, 48 70, 40 66"
        fill="none"
        stroke="url(#logoDGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Vertical connection spine */}
      <line x1="32" y1="28" x2="32" y2="72" stroke="url(#logoDGrad)" strokeWidth="10" strokeLinecap="round" />

      {/* Smart digital/tech nodes (dots/squares of different colors in upper right & center as shown in the reference logo) */}
      
      {/* Node 1: Cyan dot inside */}
      <circle cx="48" cy="50" r="4.5" fill="url(#logoDotBlue)" />
      
      {/* Node 2: Orange block in the upper section */}
      <rect x="62" y="24" width="7" height="7" rx="2" fill="url(#logoDotOrange)" transform="rotate(15 62 24)" />
      
      {/* Node 3: Bright blue node */}
      <circle cx="74" cy="38" r="4" fill="url(#logoDotBlue)" />

      {/* Node 4: Small orange node on the bottom side */}
      <circle cx="70" cy="66" r="3.5" fill="url(#logoDotOrange)" />
      
      {/* Node 5: Tech connect accent lines */}
      <line x1="48" y1="50" x2="58" y2="50" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx="58" cy="50" r="2" fill="#3B82F6" />
    </svg>
  );

  const renderText = () => {
    return (
      <div className={`font-sans tracking-tight text-left select-none ${layout === 'vertical' ? 'mt-2 text-center' : 'ml-3'}`}>
        <div className="flex items-center justify-start font-black text-lg md:text-xl leading-none">
          <span className="text-[#0D47A1] dark:text-blue-400">DAY</span>
          <span className="text-[#FF6D00] ml-1.5">INFOTECH</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Smart Digital Services
          </span>
          <div className="h-[2px] w-4 bg-[#FF6D00] rounded-full"></div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col items-center justify-center' : 'flex-row items-center justify-start'} ${className}`}>
      {renderIcon()}
      {showText && renderText()}
    </div>
  );
};
