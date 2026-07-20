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
    bgClass: 'min-h-screen bg-linear-to-b from-slate-50 to-slate-100 text-slate-800 antialiased relative pb-24',
    textClass: 'text-slate-800',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200/80',
    brandBarClass: 'flex flex-col sm:flex-row justify-between items-start sm:items-center bg-indigo-900 p-2 md:p-2.5 rounded-lg text-white border border-slate-200/10 shadow-sm',
    brandBarBorder: 'border-indigo-800/60',
    brandSubtext: 'text-indigo-200',
    badgeBg: 'bg-indigo-950/60',
    badgeBorder: 'border-indigo-500/20',
    badgeText: 'text-indigo-200',
    primaryBtn: 'bg-indigo-600 text-white',
    primaryBtnHover: 'hover:bg-indigo-700',
    primaryBtnBorder: 'border-indigo-500/20',
    accentText: 'text-indigo-600',
    focusRing: 'focus:border-indigo-500 focus:ring-indigo-500',
    tabActive: 'border-indigo-600 text-indigo-600 bg-white',
    tabInactive: 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50',
    statsTotalIconBg: 'bg-indigo-50 border-indigo-100 text-indigo-600',
    statsCompletedIconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    statsDraftsIconBg: 'bg-amber-50 border-amber-100 text-amber-600',
    statsLabelText: 'text-indigo-600',
    statsValueText: 'text-slate-800',
    inputBg: 'bg-slate-50 focus:bg-white',
    inputBorder: 'border-slate-200',
    inputText: 'text-slate-800',
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
