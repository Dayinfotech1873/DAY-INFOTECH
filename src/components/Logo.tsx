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
      {/* High-Performance Pre-compiled Logo Asset - 100% Reliable in WebViews & Browsers */}
      <img
        src="/logo.png"
        alt="DAY INFOTECH"
        width={size}
        height={size}
        className="select-none pointer-events-none transition-transform duration-500 hover:scale-105 filter drop-shadow-md rounded-2xl object-contain"
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback if logo.png cannot be resolved (renders a stylized icon container)
          const target = e.target as HTMLImageElement;
          target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%231e1b4b'><rect width='100' height='100' rx='20' fill='%231e1b4b'/><text x='50' y='60' font-family='sans-serif' font-weight='bold' font-size='40' fill='%23fbbf24' text-anchor='middle'>DI</text></svg>";
        }}
      />

      {/* Brand Text */}
      {showText && (
        <div className="mt-3.5 font-sans">
          <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase bg-gradient-to-r from-rose-500 via-orange-500 via-amber-500 via-emerald-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-xs">
            DAY INFOTECH
          </h2>
          <p className={`${isDark ? "text-amber-400" : "text-indigo-950"} font-black tracking-[0.25em] text-[10px] md:text-xs uppercase mt-1 opacity-90`}>
            digital point
          </p>
        </div>
      )}
    </div>
  );
};
