import React from 'react';
import { Menu, Moon, Sun, Download, Sparkles, User, LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export default function Header({
  onToggleSidebar,
  onOpenExport,
  onOpenProfile
}) {
  const { theme, toggleTheme } = useTheme();
  const { currentChat, messages } = useChat();
  const { isAuthenticated, user, openAuthModal } = useAuth();

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      {/* Left section: Hamburger button & Chat Title */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition lg:hidden"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {currentChat?.title || 'SmartAssist AI'}
            </h2>
            {currentChat && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium hidden sm:inline-block">
                {messages.length} messages
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 truncate hidden sm:block">
            College Academic & Career Assistant
          </p>
        </div>
      </div>

      {/* Right section: Export, Theme Toggle, Auth */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Export Button (only if there are messages) */}
        {messages.length > 0 && (
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
            title="Export conversation"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span className="hidden md:inline">Export</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* User Profile or Login CTA */}
        {isAuthenticated ? (
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-xs uppercase flex items-center justify-center shadow-sm ring-2 ring-indigo-500/20 hover:opacity-90 transition"
            title={user.email}
          >
            {user.email[0]}
          </button>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm hover:shadow transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
