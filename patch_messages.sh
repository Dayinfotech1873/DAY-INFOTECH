sed -i '17,49c\
  useEffect(() => {\
    if (targetUser) {\
      const targetUserId = targetUser.uid || targetUser.username;\
      setSelectedChat(prev => {\
        if (prev?.userId === targetUserId) return prev;\
        const existingChat = chats.find(c => c.userId === targetUserId);\
        if (existingChat) return existingChat;\
        return {\
          userId: targetUserId,\
          userName: targetUser.username || targetUser.email || "Unknown",\
          userMobile: targetUser.mobile || "",\
          messages: [],\
          lastUpdated: new Date().toISOString(),\
          ownerUnread: 0,\
          userUnread: 0\
        };\
      });\
    }\
  }, [targetUser, chats]);\
\
  useEffect(() => {\
    if (!isOwner()) return;\
    const unsubscribe = subscribeToAllChats((data) => {\
      setChats(data);\
      setSelectedChat(prev => {\
        if (!prev) return prev;\
        const updated = data.find(c => c.userId === prev.userId);\
        return updated || prev;\
      });\
    });\
    return () => unsubscribe();\
  }, [currentUser]);' src/components/MessagesView.tsx
