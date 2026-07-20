import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Send, Search, MessageSquare, ChevronRight, ArrowLeft } from 'lucide-react';
import { subscribeToAllChats, sendMessage, markChatRead, ChatThread, isOwner } from '../utils/db';
import { THEMES } from '../utils/theme';

export const MessagesView = ({ currentUser, theme, targetUser }: { currentUser: any, theme: typeof THEMES[keyof typeof THEMES], targetUser?: any }) => {
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatThread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ownerId = currentUser.uid || currentUser.username;
  const ownerName = currentUser.displayName || currentUser.name || currentUser.username || 'Owner';

  useEffect(() => {
    if (targetUser) {
      const targetUserId = targetUser.uid || targetUser.username;
      setSelectedChat(prev => {
        if (prev?.userId === targetUserId) return prev;
        const existingChat = chats.find(c => c.userId === targetUserId);
        if (existingChat) return existingChat;
        return {
          userId: targetUserId,
          userName: targetUser.name || targetUser.username || targetUser.email || "Unknown",
          userMobile: targetUser.mobile || "",
          messages: [],
          lastUpdated: new Date().toISOString(),
          ownerUnread: 0,
          userUnread: 0
        };
      });
    }
  }, [targetUser, chats]);

  useEffect(() => {
    if (!isOwner()) return;
    const unsubscribe = subscribeToAllChats((data) => {
      setChats(data);
      setSelectedChat(prev => {
        if (!prev) return prev;
        const updated = data.find(c => c.userId === prev.userId);
        return updated || prev;
      });
    });
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (selectedChat && selectedChat.ownerUnread > 0) {
      markChatRead(selectedChat.userId, true);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    const text = newMessage.trim();
    setNewMessage('');
    try {
      await sendMessage(
        selectedChat.userId,
        selectedChat.userName || selectedChat.userId,
        selectedChat.userMobile,
        ownerId,
        ownerName,
        text
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredChats = chats.filter(c => {
    const name = (c.userName || c.userId || '').toLowerCase();
    const mobile = (c.userMobile || '');
    const term = searchTerm.toLowerCase();
    return name.includes(term) || mobile.includes(term);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className={`${theme.cardBg} rounded-2xl md:rounded-3xl border ${theme.cardBorder} shadow-xl overflow-hidden flex h-[580px] md:h-[680px] max-h-[78vh] md:max-h-[85vh]`}
    >
      {/* Sidebar: Chat List */}
      <div className={`w-full md:w-1/3 border-r border-slate-200/20 flex flex-col bg-white/50 dark:bg-slate-900/50 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200/20">
          <h2 className={`text-base md:text-lg font-black text-slate-800 dark:text-white mb-3 md:mb-4 flex items-center gap-2`}>
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            મેસેજીસ (Messages)
          </h2>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="નામ અથવા નંબર શોધો..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.userId}
              onClick={() => setSelectedChat(chat)}
              className={`w-full text-left p-3.5 md:p-4 border-b border-slate-200/10 flex items-center gap-3 transition-colors ${selectedChat?.userId === chat.userId ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full shrink-0">
                <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="font-black text-xs md:text-sm truncate dark:text-white">
                    {chat.userName || chat.userId || 'અજ્ઞાત સભ્ય'}
                  </h3>
                  <span className="text-[9px] md:text-[10px] text-slate-400 shrink-0">
                    {new Date(chat.lastUpdated).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 truncate pr-2">
                    {chat.messages && chat.messages.length > 0 
                      ? chat.messages[chat.messages.length - 1].text 
                      : 'No messages yet'}
                  </p>
                  {chat.ownerUnread > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                      {chat.ownerUnread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
          {filteredChats.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs md:text-sm">
              કોઈ ચેટ મળ્યા નથી.
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
          <div className="p-3 md:p-4 border-b border-slate-200/20 bg-white/50 dark:bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              {/* Back Button for Mobile */}
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5 text-indigo-600" />
              </button>
              
              <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full">
                <User className="h-4.5 w-4.5 md:h-5 md:w-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <h3 className="font-black text-xs md:text-sm dark:text-white">
                  {selectedChat.userName || selectedChat.userId || 'અજ્ઞાત સભ્ય'}
                </h3>
                {selectedChat.userMobile && (
                  <p className="text-[10px] md:text-xs text-slate-500 font-mono">{selectedChat.userMobile}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {selectedChat.messages.map((msg) => {
              const isOwnerMsg = msg.senderId === ownerId;
              return (
                <div key={msg.id} className={`flex flex-col ${isOwnerMsg ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3.5 py-2 text-xs md:text-sm shadow-xs ${isOwnerMsg ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] md:text-[9px] text-slate-400 mt-1 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            {(!selectedChat.messages || selectedChat.messages.length === 0) && (
              <div className="text-center text-slate-400 text-xs py-10">
                કોઈ संदेश નથી. સંદેશ મોકલીને શરૂઆત કરો.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 md:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/20 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="સંદેશ ટાઇપ કરો..."
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2.5 md:p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center cursor-pointer"
            >
              <Send className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 p-6">
          <MessageSquare className="h-12 w-12 md:h-16 md:w-16 mb-4 opacity-25 text-indigo-500" />
          <p className="text-xs md:text-sm text-slate-500 font-extrabold text-center">વાતચીત જોવા માટે ડાબી બાજુથી ચેટ પસંદ કરો (Select a chat to begin)</p>
        </div>
      )}
    </motion.div>
  );
};
