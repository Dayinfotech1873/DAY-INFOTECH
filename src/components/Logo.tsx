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
      {/* Real Brand Logo Image */}
      <img
        src="/assets/logo.png?v=20260750"
        alt="DAY INFOTECH"
        width={size}
        height={size}
        className="object-contain select-none pointer-events-none transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />

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
