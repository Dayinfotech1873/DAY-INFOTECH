sed -i 's/unsubscribeMaintenance = subscribeToMaintenanceStatus, incrementVisitorCount, subscribeToVisitorCount, updateUserOnlineStatus, setUserOffline((status)/unsubscribeMaintenance = subscribeToMaintenanceStatus((status)/g' src/App.tsx
sed -i '70d' src/App.tsx
