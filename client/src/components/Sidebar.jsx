import React, { useState } from 'react';
import {
  Plus, Search, MessageSquare, Pin, Trash2, Edit2, Check, X,
  Settings, Shield, LogIn, User, Sparkles, BookOpen, Layers
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenProfile,
  onOpenAdmin
}) {
  const {
    conversations,
    currentChatId,
    selectConversation,
    createNewChat,
    deleteConversation,
    renameConversation,
    togglePinConversation,
    handleSearch,
    searchQuery
  } = useChat();

  const { isAuthenticated, user, openAuthModal, isAdmin } = useAuth();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartRename = (e, chat) => {
    e.stopPropagation();
    setEditingId(chat._id);
    setEditTitle(chat.title);
  };

  const handleSaveRename = (e, chatId) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      renameConversation(chatId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleSelect = (chatId) => {
    selectConversation(chatId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const pinnedChats = conversations.filter(c => c.isPinned);
  const recentChats = conversations.filter(c => !c.isPinned);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                SmartAssist <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Student Copilot</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              createNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {/* Pinned / Saved Chats */}
          {pinnedChats.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 px-2 mb-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                <Pin className="w-3 h-3 text-indigo-500" />
                <span>Saved Chats</span>
              </div>
              <div className="space-y-1">
                {pinnedChats.map((chat) => (
                  <ChatItem
                    key={chat._id}
                    chat={chat}
                    isActive={currentChatId === chat._id}
                    editingId={editingId}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    onSelect={() => handleSelect(chat._id)}
                    onStartRename={(e) => handleStartRename(e, chat)}
                    onSaveRename={(e) => handleSaveRename(e, chat._id)}
                    onCancelRename={handleCancelRename}
                    onTogglePin={(e) => {
                      e.stopPropagation();
                      togglePinConversation(chat._id, chat.isPinned);
                    }}
                    onDelete={(e) => {
                      e.stopPropagation();
                      deleteConversation(chat._id);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent Chats */}
          <div>
            <div className="flex items-center space-x-1.5 px-2 mb-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              <MessageSquare className="w-3 h-3" />
              <span>Chat History</span>
            </div>
            {recentChats.length === 0 && pinnedChats.length === 0 ? (
              <div className="text-center py-6 px-4">
                <p className="text-xs text-slate-400">No conversations yet.</p>
                <p className="text-[11px] text-slate-400/80 mt-1">Start chatting to save history!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentChats.map((chat) => (
                  <ChatItem
                    key={chat._id}
                    chat={chat}
                    isActive={currentChatId === chat._id}
                    editingId={editingId}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    onSelect={() => handleSelect(chat._id)}
                    onStartRename={(e) => handleStartRename(e, chat)}
                    onSaveRename={(e) => handleSaveRename(e, chat._id)}
                    onCancelRename={handleCancelRename}
                    onTogglePin={(e) => {
                      e.stopPropagation();
                      togglePinConversation(chat._id, chat.isPinned);
                    }}
                    onDelete={(e) => {
                      e.stopPropagation();
                      deleteConversation(chat._id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-1">
          {/* Admin Dashboard button if admin */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </button>

          {/* User Auth Card */}
          {isAuthenticated ? (
            <button
              onClick={onOpenProfile}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                  {user.email[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {user.email}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {user.isAdmin ? 'Admin' : 'Student'}
                  </p>
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium text-xs transition"
            >
              <LogIn className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

function ChatItem({
  chat,
  isActive,
  editingId,
  editTitle,
  setEditTitle,
  onSelect,
  onStartRename,
  onSaveRename,
  onCancelRename,
  onTogglePin,
  onDelete
}) {
  const isEditing = editingId === chat._id;

  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition ${
        isActive
          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-semibold'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
      }`}
    >
      <div className="flex items-center space-x-2 min-w-0 flex-1 pr-2">
        <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />

        {isEditing ? (
          <div className="flex items-center space-x-1 flex-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-white focus:outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveRename(e);
                if (e.key === 'Escape') onCancelRename(e);
              }}
            />
            <button onClick={onSaveRename} className="p-1 text-emerald-500 hover:text-emerald-600">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={onCancelRename} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <span className="truncate block">{chat.title || 'Untitled Chat'}</span>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={onTogglePin}
            className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
              chat.isPinned ? 'text-indigo-600 dark:text-indigo-400 opacity-100' : 'text-slate-400'
            }`}
            title={chat.isPinned ? 'Unpin chat' : 'Pin chat'}
          >
            <Pin className="w-3 h-3" />
          </button>
          <button
            onClick={onStartRename}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Rename chat"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Delete chat"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Message count badge if not hovered */}
      {!isEditing && (
        <span className="text-[10px] text-slate-400 group-hover:hidden ml-1 flex-shrink-0">
          {chat.messageCount || 0}
        </span>
      )}
    </div>
  );
}
