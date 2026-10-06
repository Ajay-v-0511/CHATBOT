import React, { useState, useEffect } from 'react';
import { X, Users, MessageSquare, MessagesSquare, TrendingUp, BarChart3, Clock, Loader2, ShieldAlert } from 'lucide-react';
import { api } from '../../api/client';
import CategoryBadge from '../Common/CategoryBadge';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAdminStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      } else {
        setError(res.message || 'Failed to load stats');
      }
    } catch (err) {
      setError(err.message || 'Access restricted to administrators.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Analytics Dashboard</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">System metrics, conversation volume, and topic categorization</p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
            <p className="text-sm">Aggregating platform metrics...</p>
          </div>
        ) : error ? (
          <div className="py-12 flex flex-col items-center justify-center text-rose-500 text-center">
            <ShieldAlert className="w-10 h-10 mb-2" />
            <p className="font-semibold text-sm">{error}</p>
            <p className="text-xs text-slate-500 mt-1">Please ensure your account has administrator privileges.</p>
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* 4 Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-1">
                  <Users className="w-4 h-4" />
                  <span>Total Users</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalUsers}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
                <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 text-xs font-semibold mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>Conversations</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalConversations}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1">
                  <MessagesSquare className="w-4 h-4" />
                  <span>Total Messages</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalMessages}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Avg per Chat</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.avgMessagesPerConversation}
                </div>
              </div>
            </div>

            {/* Visual Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Question Categories Distribution */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                  <span>Question Categories Distribution</span>
                  <span className="text-xs font-normal text-slate-400">By Query Frequency</span>
                </h3>

                <div className="space-y-3">
                  {Object.entries(stats.categories || {}).map(([cat, count]) => {
                    const total = Math.max(1, stats.totalMessages);
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                          <span className="text-slate-500 dark:text-slate-400">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Usage Trends */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                    <span>Daily Usage Activity</span>
                    <span className="text-xs font-normal text-slate-400">Messages per Day</span>
                  </h3>

                  <div className="h-44 flex items-end justify-between gap-2 pt-6">
                    {(stats.dailyTrends || []).map((trend, i) => {
                      const maxVal = Math.max(...stats.dailyTrends.map(d => d.messages), 1);
                      const heightPct = Math.round((trend.messages / maxVal) * 100);
                      const dateShort = trend.date.split('-').slice(1).join('/');
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                          <div className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition mb-1 font-semibold">
                            {trend.messages}
                          </div>
                          <div
                            className="w-full max-w-[36px] bg-indigo-500 hover:bg-indigo-600 rounded-t-lg transition-all duration-300"
                            style={{ height: `${Math.max(heightPct, 12)}%` }}
                          />
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 rotate-0 truncate">
                            {dateShort}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 flex items-center justify-between">
                  <span>Tracked Volume:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{stats.totalMessages} interactions</span>
                </div>
              </div>
            </div>

            {/* Recent Conversations */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
                Recent Student Conversations
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase tracking-wider">
                      <th className="py-2 px-3 font-semibold">Conversation Title</th>
                      <th className="py-2 px-3 font-semibold">Messages</th>
                      <th className="py-2 px-3 font-semibold">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(stats.recentConversations || []).map(c => (
                      <tr key={c.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition">
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                          {c.title}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                          {c.messageCount} msgs
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {new Date(c.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
