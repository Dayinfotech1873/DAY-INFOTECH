import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { Sparkles, Shield, Cpu } from 'lucide-react';
import { useLanguage } from '../utils/language';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    // Progress bar animation reaches 100% in ~500ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 8; // 100 / 8 = 12.5 intervals of 40ms = 500ms
      });
    }, 40);

    // Call onComplete after 600ms
    const timeout = setTimeout(() => {
      onComplete();
    }, 600);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        filter: 'blur(4px)',
        transition: { duration: 0.35, ease: 'easeOut' } 
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-radial from-slate-900 via-slate-950 to-black select-none"
      id="splash-screen"
    >
      {/* Decorative Ambient Background Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{
            scale: 1,
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{
            scale: 1,
            opacity: [0.15, 0.35, 0.15],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[160px]" />
      </div>

      {/* Main Interactive Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut" 
        }}
        className="flex flex-col items-center justify-center text-center px-6 relative z-10 max-w-xl"
      >
        {/* Pulsing Outer Glowing Halo for the Logo */}
        <div className="relative mb-8">
          <motion.div
            animate={{
              scale: 1,
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-linear-to-r from-amber-500/20 via-rose-500/25 to-sky-500/20 rounded-full blur-2xl -m-4"
          />
          
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative bg-white/5 p-4 rounded-full border border-white/10 backdrop-blur-md shadow-2xl"
          >
            <Logo size={80} showText={false} className="drop-shadow-[0_10px_15px_rgba(244,63,94,0.15)]" />
          </motion.div>
        </div>

        {/* Subtitle / Welcome Text with elegant letters animation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="h-1 w-6 bg-linear-to-r from-transparent to-amber-400 rounded-full" />
            <span className="text-[11px] font-black tracking-[0.3em] text-amber-400/90 uppercase font-sans flex items-center gap-1">
              <Sparkles className="h-3 w-3 animate-pulse text-amber-300" /> {language === 'gu' ? 'આપનું સ્વાગત છે' : 'Welcome To'}
            </span>
            <span className="h-1 w-6 bg-linear-to-l from-transparent to-amber-400 rounded-full" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase font-display bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            DAY INFOTECH
          </h1>

          {/* Elegant Gujarati Tagline with glowing underline */}
          <p className="text-slate-300 text-xs md:text-sm font-semibold tracking-wide max-w-sm mx-auto font-sans leading-relaxed">
            {language === 'gu' ? 'ડિજિટલ સર્વિસ પોઈન્ટ અને ઓનલાઈન ફોર્મ સહાયક' : 'Digital Service Point & Online Form Assistant'}
          </p>
        </motion.div>

        {/* Dynamic Loading/Progress Indicators */}
        <div className="mt-12 w-64 relative">
          {/* Progress Bar Container */}
          <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <motion.div 
              className="h-full rounded-full bg-linear-to-r from-amber-400 via-rose-500 to-sky-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
          
          {/* Percentage & Security Text */}
          <div className="flex justify-between items-center mt-2 px-1 text-[9px] text-slate-400 font-bold font-mono">
            <span className="flex items-center gap-1 uppercase tracking-wider text-rose-400/80">
              <Shield className="h-2.5 w-2.5" /> {language === 'gu' ? 'સુરક્ષિત સત્ર' : 'SECURE SESSION'}
            </span>
            <span className="text-sky-400">{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>
      </motion.div>
      
      {/* Subtle Footer brand statement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1.0 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[10px] text-slate-500 font-bold tracking-widest uppercase flex items-center gap-1"
      >
        <Cpu className="h-3 w-3 text-slate-600 animate-pulse" /> {language === 'gu' ? 'ડે ઇન્ફોટેક પોર્ટલ એન્જિન દ્વારા સંચાલિત' : 'POWERED BY DAY INFOTECH PORTAL ENGINE'}
      </motion.div>
    </motion.div>
  );
};
