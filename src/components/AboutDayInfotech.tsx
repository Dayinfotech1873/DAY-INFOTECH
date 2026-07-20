import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../utils/language';
import { 
  Briefcase, Clock, MapPin, CheckCircle, Smartphone, Globe, 
  BookOpen, Layers, Shield, FileText, Camera, Ticket, Award
} from 'lucide-react';

export const AboutDayInfotech: React.FC = () => {
  const { language } = useLanguage();

  const services = [
    { 
      name: 'Xerox Copy', 
      guj: 'ઝેરોક્ષ નકલ', 
      desc_gu: 'ઉચ્ચ ગુણવત્તાવાળી બ્લેક એન્ડ વ્હાઇટ અને કલર ઝેરોક્ષ નકલ', 
      desc_en: 'High-quality black & white and color photocopying service',
      icon: Layers, 
      color: 'bg-indigo-50 text-indigo-600' 
    },
    { 
      name: 'Passport Size Photo', 
      guj: 'પાસપોર્ટ સાઇઝ ફોટો', 
      desc_gu: 'તુરંત સુંદર અને આકર્ષક પાસપોર્ટ સાઇઝ ફોટોગ્રાફ્સ', 
      desc_en: 'Instant professional passport size photographs',
      icon: Camera, 
      color: 'bg-emerald-50 text-emerald-600' 
    },
    { 
      name: 'GSRTC Ticket Booking', 
      guj: 'GSRTC બસ ટિકિટ બુકિંગ', 
      desc_gu: 'સરકારી એસ.ટી. બસની ટિકિટનું સરળ ઓનલાઇન બુકિંગ', 
      desc_en: 'Easy online booking for GSRTC government bus tickets',
      icon: Ticket, 
      color: 'bg-amber-50 text-amber-600' 
    },
    { 
      name: 'PASSPORT Apply', 
      guj: 'નવો પાસપોર્ટ / રિન્યુ એપ્લાય', 
      desc_gu: 'નવા પાસપોર્ટ અને રિન્યુઅલ માટે ઓનલાઇન ફોર્મ સબમિશન પ્રોસેસ', 
      desc_en: 'Form submission process for new passports and renewals',
      icon: Globe, 
      color: 'bg-blue-50 text-blue-600' 
    },
    { 
      name: 'Admission & Scholarship Form', 
      guj: 'એડમિશન અને સ્કોલરશિપ ફોર્મ', 
      desc_gu: 'શાળા-કોલેજ પ્રવેશ અને સરકારી શિષ્યવૃત્તિ ફોર્મ માટે સંપૂર્ણ સહાય', 
      desc_en: 'Complete assistance for school/college admissions and government scholarship forms',
      icon: BookOpen, 
      color: 'bg-purple-50 text-purple-600' 
    },
    { 
      name: '7-12, 8A Land Records', 
      guj: '૭-૧૨ અને ૮-અ જમીન નકલો', 
      desc_gu: 'જમીનની ડિજિટલી સાઇન કરેલી નકલો સચોટ રીતે મેળવો', 
      desc_en: 'Retrieve digitally signed copies of official land records',
      icon: FileText, 
      color: 'bg-lime-50 text-lime-700' 
    },
    { 
      name: 'Ration Card Services', 
      guj: 'રેશન કાર્ડ સેવાઓ', 
      desc_gu: 'નવું રેશન કાર્ડ બનાવવું, નામ ઉમેરવું અથવા કમી કરવા માટેની સેવાઓ', 
      desc_en: 'Services for new ration card issuance, name additions, or deletions',
      icon: Award, 
      color: 'bg-rose-50 text-rose-600' 
    },
    { 
      name: 'Lamination', 
      guj: 'લેમિનેશન', 
      desc_gu: 'દસ્તાવેજોને લાંબા સમય સુધી સુરક્ષિત રાખવા માટે શ્રેષ્ઠ લેમિનેશન', 
      desc_en: 'Premium lamination services to safeguard your important documents',
      icon: Shield, 
      color: 'bg-teal-50 text-teal-600' 
    },
  ];

  const officeHours = [
    { days_gu: 'સોમવાર થી શુક્રવાર', days_en: 'Monday to Friday', hours: '8:30 AM to 7:30 PM' },
    { days_gu: 'શનિવાર', days_en: 'Saturday', hours: '8:30 AM to 4:30 PM' },
    { days_gu: 'રવિવાર', days_en: 'Sunday', hours: '8:30 AM to 12:30 PM' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 font-sans"
    >
      {/* Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative space-y-4 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-black tracking-wider uppercase text-yellow-300 border border-white/10">
            <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
            {language === 'gu' ? 'ડિજિટલ સેવા કેન્દ્ર' : 'Digital Service Center'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            DAY INFOTECH
          </h2>
          <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
            {language === 'gu' 
              ? 'અમારો ઉદ્દેશ્ય લોકોને તમામ પ્રકારની સરકારી અને ડિજિટલ ઓનલાઇન સેવાઓ ખૂબ જ સરળ અને ઝડપી રીતે પૂરી પાડવાનો છે. અમે તમારા કિંમતી સમયની બચત અને સચોટ માર્ગદર્શનની ખાતરી આપીએ છીએ.' 
              : 'Our mission is to provide all kinds of government and digital online services in a highly simplified and prompt manner. We guarantee to save your valuable time and provide accurate guidance.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Our Services */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                {language === 'gu' ? 'અમારી સેવાઓ' : 'Our Services'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'gu' ? 'અમારા સેન્ટર પર પૂરી પાડવામાં આવતી મુખ્ય સેવાઓ' : 'Key services provided at our center'}
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {language === 'gu' ? `${services.length} સેવાઓ કાર્યરત` : `${services.length} Services Active`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((srv, index) => {
              const IconComp = srv.icon;
              return (
                <div 
                  key={index} 
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xs transition-all flex items-start gap-3 bg-slate-50/50 hover:bg-white group"
                >
                  <div className={`p-2.5 rounded-xl ${srv.color} group-hover:scale-105 transition-transform shrink-0`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-800 leading-tight group-hover:text-indigo-950 transition-colors">
                      {language === 'gu' ? srv.guj : srv.name}
                    </p>
                    {language === 'gu' && (
                      <p className="text-[10px] font-bold text-slate-400 font-mono tracking-wide">
                        {srv.name}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-500 leading-normal font-medium">
                      {language === 'gu' ? srv.desc_gu : srv.desc_en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Office Hours & Location */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Office Hours */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                {language === 'gu' ? 'કચેરીનો સમય' : 'Office Hours'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'gu' ? 'ગ્રાહક સેવા માટેનું સમયપત્રક' : 'Service operational hours'}
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {officeHours.map((oh, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/80">
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-slate-800 leading-none">
                      {language === 'gu' ? oh.days_gu : oh.days_en}
                    </p>
                    {language === 'gu' && (
                      <p className="text-[10px] font-bold text-slate-400 font-mono tracking-wide">
                        {oh.days_en}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100 font-mono">
                      {oh.hours}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Address */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-500" />
                {language === 'gu' ? 'અમારું સરનામું' : 'Our Address'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'gu' ? 'સેન્ટર પર રૂબરૂ મુલાકાત લેવા માટે' : 'Locate us easily'}
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 relative overflow-hidden flex items-start gap-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1.5 z-10">
                  <p className="text-xs font-extrabold text-slate-800 leading-relaxed font-sans">
                    {language === 'gu' 
                      ? <>મેઈન બજાર રોડ, BAPS સ્વામિનારાયણ મંદિરની સામે,<br />ધૂળકોટ, મોરબી, ગુજરાત - ૩૬૩૬૫૫</>
                      : <>Main Bazar Road, Opp. BAPS Swaminarayan Temple,<br />Dhulkot, Morbi, Gujarat - 363655</>}
                  </p>
                  {language === 'gu' && (
                    <p className="text-[10px] text-slate-500 font-semibold tracking-wide leading-relaxed font-mono">
                      Main Bajar Road, Opp. BAPS Swaminarayan Temple, Dhulkot, Morbi, Gujarat - 363655
                    </p>
                  )}
                </div>
              </div>

              {/* Notice Card */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-emerald-900 flex items-start gap-2.5">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed font-medium">
                  {language === 'gu' 
                    ? 'તમામ પ્રકારના ઓનલાઇન ફોર્મ સબમિટ કરવા માટે જરૂરી અસલ દસ્તાવેજો (Original Documents) સાથે લાવવા વિનંતી.' 
                    : 'Please bring your original documents required for submitting online application forms.'}
                </p>
              </div>

              {/* Contact Button */}
              <a
                href="https://wa.me/917600361873"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer border border-emerald-500/20"
              >
                <Smartphone className="h-4.5 w-4.5" />
                <span>
                  {language === 'gu' ? 'સંપર્ક કરો' : 'Contact Day Infotech'}
                </span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};
