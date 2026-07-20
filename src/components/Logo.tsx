import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 100, showText = true }) => {
  let currentTheme = 'light';
  try {
    currentTheme = typeof window !== 'undefined' ? localStorage.getItem('dashboard_theme') || 'light' : 'light';
  } catch (e) {}
  const isDark = currentTheme === 'dark';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Real Brand Logo Image */}
      <img
        src="/assets/logo.png?v=20260719"
        alt="DAY INFOTECH"
        width={size}
        height={size}
        className="object-contain select-none pointer-events-none drop-shadow-md transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />

      {/* Brand Text */}
      {showText && (
        <div className="mt-2 font-sans">
          <h2 className="text-lg md:text-xl font-bold tracking-tight uppercase">
            <span className="text-orange-500">DAY</span> <span className={isDark ? "text-white" : "text-indigo-900"}>INFOTECH</span>
          </h2>
          <p className={`${isDark ? "text-amber-400" : "text-indigo-950"} font-bold tracking-widest text-[9px] md:text-xs uppercase mt-0.5 opacity-90`}>
            digital point
          </p>
        </div>
      )}
    </div>
  );
};
