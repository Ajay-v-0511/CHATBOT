import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, RotateCw, Trash2, Bot, User, CornerDownRight } from 'lucide-react';
import CategoryBadge from './Common/CategoryBadge';
import CodeBlock from './Common/CodeBlock';

export default function MessageBubble({
  message,
  isLatestAi,
  onRegenerate,
  onDelete,
  onSelectFollowUp
}) {
  const isAi = message.role === 'ai';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const formattedTime = new Date(message.timestamp || message.createdAt || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`w-full py-4 px-4 sm:px-6 transition-colors ${isAi ? 'bg-slate-100/50 dark:bg-slate-900/40' : 'bg-transparent'}`}>
      <div className="max-w-4xl mx-auto flex items-start space-x-3 sm:space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isAi ? (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-sm ring-2 ring-indigo-500/20">
              <Bot className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-600 to-slate-500 text-white flex items-center justify-center shadow-sm">
              <User className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex-1 min-w-0">
          {/* Header line: Role name, category, time */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2.5">
              <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                {isAi ? 'SmartAssist AI' : 'You'}
              </span>
              {isAi && message.category && (
                <CategoryBadge category={message.category} size="xs" />
              )}
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {formattedTime}
              </span>
            </div>

            {/* Action buttons (Copy, Regenerate, Delete) */}
            <div className="flex items-center space-x-1 opacity-80 hover:opacity-100 transition">
              {isAi && (
                <>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
                    title="Copy full response"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {isLatestAi && onRegenerate && (
                    <button
                      onClick={onRegenerate}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
                      title="Regenerate response"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(message._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-sans prose-headings:font-bold prose-h3:text-base prose-h4:text-sm prose-pre:p-0 prose-pre:bg-transparent">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  if (!inline && match) {
                    return (
                      <CodeBlock
                        language={match[1]}
                        value={codeString}
                      />
                    );
                  }
                  if (!inline && codeString.includes('\n')) {
                    return (
                      <CodeBlock
                        language="text"
                        value={codeString}
                      />
                    );
                  }
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-medium" {...props}>
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-3">
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs border border-slate-200 dark:border-slate-800 rounded-lg">
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className="px-3 py-2 text-left font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/60">
                      {children}
                    </td>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Follow-up question chips */}
          {isAi && message.followUpSuggestions && message.followUpSuggestions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <CornerDownRight className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-medium">Suggested follow-ups:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {message.followUpSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectFollowUp(suggestion)}
                    className="inline-flex items-center text-xs px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 hover:border-indigo-300 dark:hover:border-indigo-700 transition text-left"
                  >
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
