import React, { useRef, useEffect } from 'react';
import { Bot, AlertCircle, RotateCcw } from 'lucide-react';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';
import ChatInput from './ChatInput';
import { useChat } from '../context/ChatContext';

export default function ChatWindow() {
  const {
    messages,
    isSending,
    errorBanner,
    lastFailedMessage,
    sendMessage,
    regenerateResponse,
    deleteMessage,
    clearChat,
    retryLastMessage
  } = useChat();

  const messagesEndRef = useRef(null);

  // Auto-scroll when messages update or during generation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50 dark:bg-slate-950">
      {/* Scrollable Message List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {!hasMessages ? (
          <div className="min-h-full flex flex-col justify-center">
            <QuickActions onSelectAction={(prompt) => sendMessage(prompt)} />
          </div>
        ) : (
          <div className="py-4 space-y-1">
            {messages.map((msg, index) => {
              const isLatestAi = msg.role === 'ai' && index === messages.length - 1;
              return (
                <MessageBubble
                  key={msg._id || index}
                  message={msg}
                  isLatestAi={isLatestAi}
                  onRegenerate={regenerateResponse}
                  onDelete={deleteMessage}
                  onSelectFollowUp={(prompt) => sendMessage(prompt)}
                />
              );
            })}

            {/* Typing / Loading Animation indicator */}
            {isSending && (
              <div className="w-full py-4 px-4 sm:px-6 bg-slate-100/50 dark:bg-slate-900/40">
                <div className="max-w-4xl mx-auto flex items-center space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-sm ring-2 ring-indigo-500/20">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                    </div>
                    <span className="text-xs font-medium">SmartAssist is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error / Retry Banner */}
      {errorBanner && (
        <div className="max-w-4xl mx-auto px-4 py-2 w-full">
          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorBanner}</span>
            </div>
            {lastFailedMessage && (
              <button
                onClick={retryLastMessage}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/70 hover:bg-rose-200 text-rose-800 dark:text-rose-200 font-medium transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <ChatInput
        onSendMessage={sendMessage}
        isSending={isSending}
        onClearChat={clearChat}
        hasMessages={hasMessages}
      />
    </div>
  );
}
