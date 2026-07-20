sed -i '/return () => unsubscribeMaintenance();/a \  }, []);\
' src/App.tsx
sed -i '94d' src/App.tsx
