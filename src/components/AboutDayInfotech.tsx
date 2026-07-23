import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../utils/language';
import { 
  Clock, MapPin, CheckCircle, Smartphone, Globe, 
  BookOpen, Layers, Shield, FileText, Camera, Ticket, Award,
  Sparkles, PhoneCall, Zap
} from 'lucide-react';

export const AboutDayInfotech: React.FC = () => {
  const { language } = useLanguage();

  const services = [
    { 
      name: 'Xerox Copy', 
      guj: 'ઝેરોક્ષ નકલ', 
      desc_gu: 'કલર અને B&W ઝેરોક્ષ', 
      desc_en: 'Color & B/W Copies',
      icon: Layers, 
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100' 
    },
    { 
      name: 'Passport Photo', 
      guj: 'પાસપોર્ટ સાઇઝ ફોટો', 
      desc_gu: 'તુરંત ઇન્સ્ટન્ટ ફોટોગ્રાફ્સ', 
      desc_en: 'Instant Photo Printing',
      icon: Camera, 
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100' 
    },
    { 
      name: 'GSRTC Ticket', 
      guj: 'GSRTC બસ ટિકિટ', 
      desc_gu: 'સરકારી એસ.ટી. બુકિંગ', 
      desc_en: 'GSRTC Bus Booking',
      icon: Ticket, 
      color: 'bg-amber-50 text-amber-600 border-amber-100' 
    },
    { 
      name: 'PASSPORT Apply', 
      guj: 'નવો પાસપોર્ટ રિન્યુ', 
      desc_gu: 'ઓનલાઇન ફોર્મ સબમિશન', 
      desc_en: 'Online Application Process',
      icon: Globe, 
      color: 'bg-blue-50 text-blue-600 border-blue-100' 
    },
    { 
      name: 'Admission & Scholarship', 
      guj: 'એડમિશન & શિષ્યવૃત્તિ', 
      desc_gu: 'પ્રવેશ અને સ્કોલરશિપ ફોર્મ', 
      desc_en: 'Admission & Forms',
      icon: BookOpen, 
      color: 'bg-purple-50 text-purple-600 border-purple-100' 
    },
    { 
      name: '7-12, 8A Land Records', 
      guj: '૭-૧૨, ૮-અ જમીન નકલો', 
      desc_gu: 'ડિજિટલ સાઇન જમીન નકલો', 
      desc_en: 'Digitally Signed Copies',
      icon: FileText, 
      color: 'bg-lime-50 text-lime-700 border-lime-100' 
    },
    { 
      name: 'Ration Card', 
      guj: 'રેશન કાર્ડ સેવાઓ', 
      desc_gu: 'નવું કાર્ડ, નામ સુધારો/ઉમેરો', 
      desc_en: 'New & Changes Process',
      icon: Award, 
      color: 'bg-rose-50 text-rose-600 border-rose-100' 
    },
    { 
      name: 'Lamination', 
      guj: 'લેમિનેશન સેવાઓ', 
      desc_gu: 'દસ્તાવેજ સુરક્ષા કવર', 
      desc_en: 'Document Protection',
      icon: Shield, 
      color: 'bg-teal-50 text-teal-600 border-teal-100' 
    },
  ];

  const officeHours = [
    { days_gu: 'સોમ - શુક્ર', days_en: 'Mon - Fri', hours: '8:30 AM - 7:30 PM' },
    { days_gu: 'શનિવાર', days_en: 'Saturday', hours: '8:30 AM - 4:30 PM' },
    { days_gu: 'રવિવાર', days_en: 'Sunday', hours: '8:30 AM - 12:30 PM' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="space-y-3 font-sans max-w-full"
    >
      {/* Ultra-Compact Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-3.5 md:p-4 text-white shadow-md border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 rounded-xl font-black shadow-md shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl md:text-2xl font-black tracking-tight font-display bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  DAY INFOTECH
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-[10px] font-black text-amber-300 border border-amber-400/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  {language === 'gu' ? 'ડિજિટલ સેવા કેન્દ્ર' : 'Digital Service Center'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-snug">
                {language === 'gu' 
                  ? 'તમામ પ્રકારની સરકારી અને ડિજિટલ ઓનલાઇન સેવાઓનું વિશ્વાસપાત્ર સેન્ટર' 
                  : 'Your trusted center for all government and digital online services'}
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/917600361873"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0 border border-emerald-400/30"
          >
            <Smartphone className="h-4 w-4" />
            <span>{language === 'gu' ? 'વોટ્સએપ સંપર્ક (+91 76003 61873)' : 'WhatsApp (+91 76003 61873)'}</span>
          </a>
        </div>
      </div>

      {/* Single Screen Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Left Section: 8 Main Services in 4x2 / 2x4 Compact Grid */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>{language === 'gu' ? 'મુખ્ય સેવાઓ (Our Key Services)' : 'Key Services'}</span>
            </h3>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
              8 SERVICES
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {services.map((srv, index) => {
              const IconComp = srv.icon;
              return (
                <div 
                  key={index} 
                  className="p-2 rounded-xl border border-slate-150 hover:border-indigo-300 hover:shadow-xs transition-all bg-slate-50/70 hover:bg-white flex flex-col justify-between space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-1.5 rounded-lg border ${srv.color} shrink-0`}>
                      <IconComp className="h-4 w-4" />
                    </div>
                    <span className="text-[9px] font-extrabold text-slate-300 font-mono">0{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 leading-tight group-hover:text-indigo-900 transition-colors">
                      {language === 'gu' ? srv.guj : srv.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold leading-tight mt-0.5">
                      {language === 'gu' ? srv.desc_gu : srv.desc_en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Notice Banner inside Services */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2 text-amber-900 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-[10px] md:text-xs font-bold leading-tight">
              {language === 'gu' 
                ? 'નોંધ: તમામ સેવાઓ માટે જરૂરી અસલ દસ્તાવેજો (Original Documents) સાથે લાવવા.' 
                : 'Note: Please carry all necessary original documents for service applications.'}
            </p>
          </div>
        </div>

        {/* Right Section: Office Hours & Address in Compact Layout */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          
          {/* Office Hours */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>{language === 'gu' ? 'કચેરીનો સમય (Office Hours)' : 'Office Hours'}</span>
              </h3>
              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                OPEN TODAY
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {officeHours.map((oh, i) => (
                <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs font-extrabold text-slate-800">
                    {language === 'gu' ? oh.days_gu : oh.days_en}
                  </span>
                  <span className="text-xs font-black text-indigo-700 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    {oh.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Office Address & Direct Call */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-rose-500" />
                <span>{language === 'gu' ? 'ઓફિસ સરનામું (Address)' : 'Office Location'}</span>
              </h3>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
              <MapPin className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-slate-800 leading-snug">
                  {language === 'gu' 
                    ? 'મેઈન બજાર રોડ, BAPS સ્વામિનારાયણ મંદિરની સામે, ધૂળકોટ, મોરબી - ૩૬૩૬૫૫' 
                    : 'Main Bazar Road, Opp. BAPS Swaminarayan Temple, Dhulkot, Morbi - 363655'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium font-mono mt-0.5">
                  Dhulkot, Morbi, Gujarat - 363655
                </p>
              </div>
            </div>

            <a
              href="tel:+917600361873"
              className="w-full inline-flex items-center justify-center gap-2 py-2 bg-indigo-950 hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer border border-white/10 active:scale-95"
            >
              <PhoneCall className="h-3.5 w-3.5 text-amber-400" />
              <span>{language === 'gu' ? 'કોલ કરો: +91 76003 61873' : 'Call: +91 76003 61873'}</span>
            </a>
          </div>

        </div>

      </div>
    </motion.div>
  );
};
