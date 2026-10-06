import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChatInput({ onSendMessage, isSending, onClearChat, hasMessages }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const { isAuthenticated, guestRemaining, openAuthModal } = useAuth();

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Guest indicator or Quick Hint bar */}
      <div className="flex items-center justify-between text-xs px-2 mb-2 text-slate-500 dark:text-slate-400">
        <div>
          {!isAuthenticated ? (
            <div className="flex items-center space-x-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Guest Mode: <strong>{guestRemaining}/5</strong> free questions remaining</span>
              <button
                onClick={() => openAuthModal('signup')}
                className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center space-x-1"
              >
                <span>Sign up for unlimited</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Logged In • Unlimited AI Queries</span>
            </div>
          )}
        </div>

        {hasMessages && (
          <button
            onClick={onClearChat}
            className="flex items-center space-x-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition"
            title="Clear all messages in chat"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear chat</span>
          </button>
        )}
      </div>

      {/* Main Input Box */}
      <div className="relative flex items-end bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500 transition-all p-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask an academic question, request coding help, or paste a resume bullet... (Enter to send, Shift+Enter for new line)"
          rows={1}
          disabled={isSending}
          className="flex-1 max-h-44 resize-none bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none disabled:opacity-50"
        />

        <div className="flex items-center space-x-2 pl-2">
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isSending}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white shadow-sm transition-all duration-150"
            title="Send Message"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="text-center mt-2 text-[11px] text-slate-400 dark:text-slate-500">
        SmartAssist AI provides academic & career guidance. Always verify critical exam formulas.
      </div>
    </div>
  );
}
