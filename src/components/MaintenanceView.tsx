import React from 'react';
import { motion } from 'motion/react';
import { Settings, LogOut, ShieldAlert } from 'lucide-react';
import { THEMES } from '../utils/theme';
import { Logo } from './Logo';

interface MaintenanceViewProps {
  theme: typeof THEMES[keyof typeof THEMES];
  onLogout: () => void;
}

export function MaintenanceView({ theme, onLogout }: MaintenanceViewProps) {
  return (
    <div className={`${theme.bgClass} flex flex-col justify-between py-6 md:py-10 px-4 md:px-8 min-h-screen`} style={theme.bgStyle}>
      <div className="max-w-md mx-auto w-full my-auto space-y-6">
        
        {/* Main Logo */}
        <div className="flex justify-center mb-8">
          <Logo size={120} showText={false} />
        </div>

        {/* Maintenance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.cardBg} p-8 rounded-3xl border ${theme.cardBorder} shadow-xl text-center space-y-6`}
        >
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping"></div>
              <div className="relative bg-amber-100 p-4 rounded-full border border-amber-200">
                <Settings className="h-10 w-10 text-amber-600 animate-spin-slow" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className={`text-xl font-black ${theme.tabActive.includes('text-white') || theme.bgClass.includes('slate-950') ? 'text-white' : 'text-slate-900'} font-sans`}>
              સાઇટ મેન્ટેનન્સ હેઠળ છે
              <br/>
              (Site Under Maintenance)
            </h1>
            <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-sm mx-auto">
              અમે પોર્ટલમાં કેટલાક નવા સુધારા કરી રહ્યા છીએ. પોર્ટલ ટૂંક સમયમાં ફરીથી શરૂ કરવામાં આવશે. અસુવિધા માટે ખેદ છે.
            </p>
            <p className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 py-2 px-3 rounded-lg inline-block">
              We are upgrading our systems. Please check back later.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200/50 space-y-4">
            <a
              href="https://wa.me/917600361873"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>કોઈ તાત્કાલિક કામ હોય તો WhatsApp કરો</span>
            </a>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>લોગઆઉટ કરો (Logout)</span>
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center text-[11px] text-slate-400 font-sans space-y-1 mt-8">
          <p>© 2026 DAY INFOTECH - Digital Point.</p>
        </footer>
      </div>
    </div>
  );
}
