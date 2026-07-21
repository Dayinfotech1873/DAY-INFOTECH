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
      {/* Premium Inline SVG Vector Logo - 100% Reliable, Crisp & High-Contrast across all WebViews */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="select-none pointer-events-none transition-transform duration-500 hover:scale-105 rounded-2xl"
        style={{ width: size, height: size }}
      >
        <defs>
          {/* Unique, non-conflicting Gradient IDs */}
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#080711" />
            <stop offset="50%" stopColor="#121324" />
            <stop offset="100%" stopColor="#1b1736" />
          </linearGradient>

          <linearGradient id="logoDayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff1a66" />
            <stop offset="60%" stopColor="#ff5500" />
            <stop offset="100%" stopColor="#ffaa00" />
          </linearGradient>

          <linearGradient id="logoTechGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#7f00ff" />
          </linearGradient>

          <linearGradient id="logoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff007f" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>
        </defs>

        {/* 1. Base Squircle Container */}
        <rect width="1024" height="1024" rx="240" fill="url(#logoBgGrad)" />

        {/* 2. Cyber Orbit Rings (Outer Branding) */}
        <circle cx="512" cy="512" r="425" stroke="url(#logoRingGrad)" strokeWidth="10" strokeDasharray="24 18" opacity="0.35" />
        <circle cx="512" cy="512" r="375" stroke="#ffffff" strokeWidth="3" strokeDasharray="6 8" opacity="0.15" />

        {/* 3. Tech Horizon Waves */}
        <path d="M 142 512 A 370 370 0 0 1 882 512" fill="none" stroke="url(#logoTechGrad)" strokeWidth="4" opacity="0.2" />
        <path d="M 172 512 A 340 340 0 0 0 852 512" fill="none" stroke="url(#logoDayGrad)" strokeWidth="2" opacity="0.15" />

        {/* 4. Ambient Glowing Center Aura (Layered Opacity instead of buggy SVG filters) */}
        <circle cx="512" cy="512" r="260" fill="url(#logoDayGrad)" opacity="0.06" />
        <circle cx="512" cy="512" r="180" fill="url(#logoTechGrad)" opacity="0.06" />

        {/* 5. Center Monogram Group (DI Interlocking Masterpiece) */}
        <g transform="translate(512, 512)">
          {/* Active Orbit Halves */}
          <path d="M -310 0 A 310 310 0 0 1 310 0" fill="none" stroke="url(#logoTechGrad)" strokeWidth="18" strokeLinecap="round" strokeDasharray="40 30" opacity="0.8" />
          <path d="M 310 0 A 310 310 0 0 1 -310 0" fill="none" stroke="url(#logoDayGrad)" strokeWidth="18" strokeLinecap="round" strokeDasharray="60 35" opacity="0.8" />

          {/* Vertical Column for "I" in Tech Blue */}
          {/* Base Shadow/Glow under "I" */}
          <rect x="-155" y="-190" width="80" height="380" rx="40" fill="url(#logoTechGrad)" opacity="0.25" />
          {/* Main "I" Pill */}
          <rect x="-145" y="-180" width="60" height="360" rx="30" fill="url(#logoTechGrad)" />
          {/* High-Contrast Core for Glassmorphic Glow */}
          <rect x="-133" y="-165" width="36" height="330" rx="18" fill="#ffffff" opacity="0.2" />
          
          {/* Cyber Dot/Sun representing "DAY" */}
          <circle cx="-115" cy="-250" r="45" fill="url(#logoDayGrad)" opacity="0.3" />
          <circle cx="-115" cy="-250" r="32" fill="url(#logoDayGrad)" />
          <circle cx="-115" cy="-250" r="12" fill="#ffffff" opacity="0.4" />

          {/* Sweeping Bold Loop for "D" in Day Red-Gold */}
          {/* Base Glow Layer */}
          <path d="M -80 -140 C 25 -140 170 -80 170 0 C 170 80 25 140 -80 140" fill="none" stroke="url(#logoDayGrad)" strokeWidth="90" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
          {/* Main "D" Stroke */}
          <path d="M -80 -140 C 25 -140 170 -80 170 0 C 170 80 25 140 -80 140" fill="none" stroke="url(#logoDayGrad)" strokeWidth="70" strokeLinecap="round" strokeLinejoin="round" />
          {/* High-Contrast Core Inner Stroke */}
          <path d="M -80 -140 C 25 -140 170 -80 170 0 C 170 80 25 140 -80 140" fill="none" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />

          {/* Connecting Data Nodes */}
          <circle cx="0" cy="-140" r="24" fill="url(#logoTechGrad)" opacity="0.3" />
          <circle cx="0" cy="-140" r="14" fill="#ffffff" />
          
          <circle cx="170" cy="0" r="28" fill="url(#logoDayGrad)" opacity="0.3" />
          <circle cx="170" cy="0" r="16" fill="#ffffff" />
          
          <circle cx="0" cy="140" r="24" fill="url(#logoTechGrad)" opacity="0.3" />
          <circle cx="0" cy="140" r="14" fill="#ffffff" />
        </g>
      </svg>

      {/* Brand Text with Robust Cross-Browser WebKit Linear Gradients */}
      {showText && (
        <div className="mt-3.5 font-sans">
          <h2 
            className="text-xl md:text-2xl font-black tracking-tight uppercase bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-amber-500"
            style={{
              background: 'linear-gradient(to right, #f59e0b, #f97316, #f43f5e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block'
            }}
          >
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

