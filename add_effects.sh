sed -i '/return () => unsubscribeMaintenance();/a \
\
  useEffect(() => {\
    if (!sessionStorage.getItem("hasVisited")) {\
      incrementVisitorCount();\
      sessionStorage.setItem("hasVisited", "true");\
    }\
    const unsubscribe = subscribeToVisitorCount((count) => {\
      setVisitorCount(count);\
    });\
    return () => unsubscribe();\
  }, []);\
\
  useEffect(() => {\
    if (currentUser) {\
      updateUserOnlineStatus(currentUser);\
      const handleBeforeUnload = () => {\
        setUserOffline(currentUser);\
      };\
      window.addEventListener("beforeunload", handleBeforeUnload);\
      return () => {\
        window.removeEventListener("beforeunload", handleBeforeUnload);\
        setUserOffline(currentUser);\
      };\
    }\
  }, [currentUser]);' src/App.tsx
