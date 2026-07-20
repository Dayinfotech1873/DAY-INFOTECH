sed -i '/<p className={`${activeTheme.brandSubtext} text-xs mt-0.5 font-medium`}>ડિજિટલ સર્વિસ સેન્ટર અને ઓનલાઈન ફોર્મ સહાયક<\/p>/a \
            <div className="flex items-center gap-1.5 mt-2 bg-slate-900/40 w-fit px-2 py-0.5 rounded-full border border-slate-700/50">\
              <Users className="h-3 w-3 text-emerald-400" />\
              <span className="text-[10px] text-emerald-100 font-medium tracking-wide">મુલાકાતીઓ (Visitors): {visitorCount}</span>\
            </div>' src/components/Header.tsx
