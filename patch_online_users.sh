sed -i '/<th className="py-3 px-4 font-semibold uppercase tracking-wider">છેલ્લે એક્ટિવ<\/th>/a \              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">એક્શન<\/th>' src/components/OnlineUsersView.tsx
sed -i '/{user.lastActive ? new Date(user.lastActive).toLocaleString() : '\''N\/A'\''}/a \                <\/td>\
                <td className="py-3 px-4 text-right">\
                  <button\
                    onClick={() => onMessageUser && onMessageUser(user)}\
                    className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"\
                  >\
                    <Mail className="h-3.5 w-3.5" /> મેસેજ\
                  <\/button>' src/components/OnlineUsersView.tsx
