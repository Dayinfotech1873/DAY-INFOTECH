sed -i '/<MessageSquare className="h-3 w-3" \/> મેસેજીસ (Messages)/a \
                      </button>\
                      <button\
                        onClick={() => setActiveView("ONLINE_USERS")}\
                        className={`flex items-center gap-1 text-[10px] transition-colors cursor-pointer border px-2.5 py-1 rounded-md ${\
                          activeView === "ONLINE_USERS"\
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/30"\
                            : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"\
                        }`}\
                      >\
                        <UserCheck className="h-3 w-3" /> ઓનલાઈન યુઝર્સ (Online Users)' src/components/Header.tsx
