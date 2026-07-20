sed -i 's/if (data && data.userUnread > 0 && !isOpen) {/if (data \&\& data.userUnread > 0) {/' src/components/PrivateChatWidget.tsx
sed -i 's/setIsOpen(true);/setIsOpen(prev => prev ? prev : true);/' src/components/PrivateChatWidget.tsx
