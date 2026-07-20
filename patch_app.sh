sed -i '/{activeView === '\''MESSAGES'\'' && isOwner() && (/i \
\
            {activeView === '"'ONLINE_USERS'"' && isOwner() && (\
              <motion.div\
                key="online_users"\
                initial={{ opacity: 0, y: 15 }}\
                animate={{ opacity: 1, y: 0 }}\
                exit={{ opacity: 0, y: -15 }}\
                transition={{ duration: 0.25 }}\
              >\
                <OnlineUsersView currentUser={currentUser} theme={activeTheme} />\
              </motion.div>\
            )}\
' src/App.tsx
