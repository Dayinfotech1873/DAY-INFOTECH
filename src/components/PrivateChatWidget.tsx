import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToChat, sendMessage, markChatRead, ChatThread, isOwner } from '../utils/db';
import { THEMES } from '../utils/theme';

export const PrivateChatWidget = ({ currentUser, theme }: { currentUser: any, theme: typeof THEMES[keyof typeof THEMES] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState<ChatThread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const userId = currentUser.uid || currentUser.username;
  const userName = currentUser.displayName || currentUser.name || currentUser.username;
  const userMobile = currentUser.mobile || '';

  // Owner doesn't use the widget, they use the full view.
  if (isOwner()) return null;

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToChat(userId, (data) => {
      setChat(data);
      if (data && data.userUnread > 0) {
        // Auto open if unread message comes in? Let's just show badge or auto open
        setIsOpen(prev => prev ? prev : true);
      }
    });
    return () => unsubscribe();
  }, [currentUser, userId]);

  useEffect(() => {
    if (isOpen && chat && chat.userUnread > 0) {
      markChatRead(userId, false);
    }
  }, [isOpen, chat, userId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const text = newMessage.trim();
    setNewMessage('');
    try {
      await sendMessage(userId, userName, userMobile, userId, userName, text);
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = chat?.userUnread || 0;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl transition-transform hover:scale-110 active:scale-95"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-slate-200 overflow-hidden"
            style={{ height: '500px', maxHeight: '70vh' }}
          >
            <div className="bg-indigo-600 text-white p-4 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">DAY INFOTECH સપોર્ટ</h3>
                  <p className="text-[10px] text-indigo-100">ખાનગી ચેટ (Private Chat)</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              {chat?.messages.map((msg) => {
                const isMe = msg.senderId === userId;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              {(!chat?.messages || chat.messages.length === 0) && (
                <div className="text-center text-slate-400 text-xs py-10">
                  કોઈ સંદેશ નથી. કોઈ પ્રશ્ન હોય તો અહીં પૂછી શકો છો.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="અહીં લખો (Type a message)..."
                className="flex-1 px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
