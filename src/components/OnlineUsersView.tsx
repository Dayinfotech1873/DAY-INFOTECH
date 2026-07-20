import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Mail, User, Circle } from 'lucide-react';
import { subscribeToAllUsers, isOwner } from '../utils/db';
import { THEMES } from '../utils/theme';

export const OnlineUsersView = ({ currentUser, theme, onMessageUser }: { currentUser: any, theme: typeof THEMES[keyof typeof THEMES], onMessageUser?: (user: any) => void }) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!isOwner()) return;
    const unsubscribe = subscribeToAllUsers((data) => {
      // Sort by online status first, then by last active
      data.sort((a, b) => {
        if (a.isOnline === b.isOnline) {
          return new Date(b.lastActive || 0).getTime() - new Date(a.lastActive || 0).getTime();
        }
        return a.isOnline ? -1 : 1;
      });
      setUsers(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className={`${theme.cardBg} rounded-3xl border ${theme.cardBorder} shadow-xl p-6 mb-8`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-500/10 rounded-xl">
          <Users className="h-6 w-6 text-indigo-500" />
        </div>
        <div>
          <h2 className={`text-xl font-black text-slate-800 dark:text-white`}>
            ઓનલાઈન યુઝર્સ (Online Users)
          </h2>
          <p className="text-xs text-slate-500 mt-1">વેબસાઇટ પર લોગીન થયેલ યુઝર્સની માહિતી</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">સ્ટેટસ</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">લોગીન પ્રકાર</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">યુઝરનેમ / ઇમેઇલ</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">પાસવર્ડ (Password)</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">વિગતો (Details)</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">છેલ્લે એક્ટિવ</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">એક્શન</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.uid || idx} className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {user.isOnline ? (
                      <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded-md">
                        <Circle className="h-2 w-2 fill-emerald-500" /> ઓનલાઈન
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 bg-slate-500/10 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-2 py-1 rounded-md">
                        <Circle className="h-2 w-2 fill-slate-500 dark:fill-slate-400" /> ઓફલાઈન
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {user.loginType === 'gmail' ? (
                    <span className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold bg-rose-500/10 px-2 py-1 rounded-md w-fit">
                      <Mail className="h-3 w-3" /> Gmail
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-blue-500 font-semibold bg-blue-500/10 px-2 py-1 rounded-md w-fit">
                      <User className="h-3 w-3" /> Username
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {user.loginType === 'gmail' ? user.email : user.username || user.uid?.replace('custom_', '')}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {user.loginType === 'gmail' ? (
                    <span className="text-[11px] text-slate-400 italic">Google Auth</span>
                  ) : (
                    <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30">
                      {user.password || 'N/A'}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5">
                    {user.mobile && <p><b>મોબાઈલ:</b> {user.mobile}</p>}
                    {user.email && <p><b>ઇમેઇલ:</b> {user.email}</p>}
                    {user.dob && <p><b>જન્મતારીખ:</b> {user.dob}</p>}
                  </div>
                </td>
                <td className="py-3 px-4 text-xs text-slate-500">
                  {user.lastActive ? new Date(user.lastActive).toLocaleString() : 'N/A'}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onMessageUser && onMessageUser(user)}
                    className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" /> મેસેજ
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                  કોઈ યુઝર મળ્યા નથી.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
