import React from 'react';

export interface Theme {
  id: string;
  name: string;      // Gujarati name
  nameEn: string;    // English name
  
  // Base App Theme Colors
  bgClass: string;          // Page background
  textClass: string;        // Default text color
  cardBg: string;           // Card background
  cardBorder: string;       // Card border
  
  // Header / Brand Bar
  brandBarClass: string;    // Top brand bar background
  brandBarBorder: string;   // Top brand bar border
  brandSubtext: string;     // Brand subtext color
  
  // Accents & Badges
  badgeBg: string;          // Status/User badge bg
  badgeBorder: string;      // Status/User badge border
  badgeText: string;        // Status/User badge text
  
  // Buttons & Controls
  primaryBtn: string;       // Primary button bg & text
  primaryBtnHover: string;  // Primary button hover state
  primaryBtnBorder: string; // Primary button border
  accentText: string;       // Accent links or icons
  focusRing: string;        // Input focus ring
  
  // Other interactive states
  tabActive: string;        // Active login/nav tab
  tabInactive: string;      // Inactive login/nav tab

  // Stats Card Specifics
  statsTotalIconBg: string;
  statsCompletedIconBg: string;
  statsDraftsIconBg: string;
  statsLabelText: string;
  statsValueText: string;

  // Form Fields
  inputBg: string;
  inputBorder: string;
  inputText: string;

  // Optional styles (e.g., custom background images or styles)
  bgStyle?: React.CSSProperties;
}

export const THEMES: Record<string, Theme> = {
  light: {
    id: 'light',
    name: 'લાઇટ થીમ (Light Theme)',
    nameEn: 'Light Theme',
    bgClass: 'min-h-screen bg-[#F4F7FC] text-[#111827] antialiased relative pb-24 font-sans',
    textClass: 'text-[#111827]',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200/90',
    brandBarClass: 'flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-[#0D47A1] via-[#0F4CFF] to-[#0A2540] p-3 md:p-4 rounded-2xl text-white border border-white/10 shadow-lg',
    brandBarBorder: 'border-[#0D47A1]/60',
    brandSubtext: 'text-blue-100',
    badgeBg: 'bg-[#0D47A1]/80',
    badgeBorder: 'border-white/20',
    badgeText: 'text-blue-100',
    primaryBtn: 'bg-[#0F4CFF] text-white',
    primaryBtnHover: 'hover:bg-[#0D47A1]',
    primaryBtnBorder: 'border-[#0F4CFF]/20',
    accentText: 'text-[#0F4CFF]',
    focusRing: 'focus:border-[#0F4CFF] focus:ring-[#0F4CFF]/20',
    tabActive: 'border-[#0F4CFF] text-[#0F4CFF] bg-white font-black',
    tabInactive: 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60',
    statsTotalIconBg: 'bg-blue-50 border-blue-100 text-[#0F4CFF]',
    statsCompletedIconBg: 'bg-emerald-50 border-emerald-100 text-[#10B981]',
    statsDraftsIconBg: 'bg-amber-50 border-amber-100 text-[#FF7A00]',
    statsLabelText: 'text-[#0D47A1]',
    statsValueText: 'text-[#111827]',
    inputBg: 'bg-slate-50/70 focus:bg-white',
    inputBorder: 'border-slate-300',
    inputText: 'text-[#111827]',
  },
  dark: {
    id: 'dark',
    name: 'ડાર્ક થીમ (Dark Theme)',
    nameEn: 'Dark Theme',
    bgClass: 'min-h-screen bg-linear-to-b from-zinc-900 to-zinc-950 text-zinc-100 antialiased relative pb-24',
    textClass: 'text-zinc-100',
    cardBg: 'bg-zinc-900/90',
    cardBorder: 'border-zinc-800/80',
    brandBarClass: 'flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-950 p-2 md:p-2.5 rounded-lg text-white border border-purple-500/15 shadow-md',
    brandBarBorder: 'border-purple-900/60',
    brandSubtext: 'text-purple-300',
    badgeBg: 'bg-zinc-950/80',
    badgeBorder: 'border-purple-500/20',
    badgeText: 'text-purple-200',
    primaryBtn: 'bg-purple-600 text-white',
    primaryBtnHover: 'hover:bg-purple-700',
    primaryBtnBorder: 'border-purple-500/20',
    accentText: 'text-purple-400',
    focusRing: 'focus:border-purple-500 focus:ring-purple-500',
    tabActive: 'border-purple-500 text-purple-400 bg-zinc-900',
    tabInactive: 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
    statsTotalIconBg: 'bg-purple-950/80 border-purple-800/40 text-purple-400',
    statsCompletedIconBg: 'bg-emerald-950/80 border-emerald-800/40 text-emerald-400',
    statsDraftsIconBg: 'bg-amber-950/80 border-amber-800/40 text-amber-400',
    statsLabelText: 'text-purple-400',
    statsValueText: 'text-zinc-100',
    inputBg: 'bg-zinc-950/50 focus:bg-zinc-950',
    inputBorder: 'border-zinc-800',
    inputText: 'text-zinc-100',
  }
};

export function getActiveTheme(): Theme {
  let saved = 'light';
  try {
    saved = localStorage.getItem('dashboard_theme') || 'light';
  } catch (e) {}
  return THEMES[saved] || THEMES.light;
}
