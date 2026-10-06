import React from 'react';
import { X, User, Mail, Shield, LogOut, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Active Student';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-indigo-500/20 text-2xl font-bold uppercase">
            {user.email ? user.email[0] : 'S'}
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {user.email}
          </h2>
          <div className="inline-flex items-center space-x-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active Student Account</span>
          </div>
        </div>

        <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{user.email}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Role</span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {user.isAdmin ? (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">Administrator</span>
              ) : (
                'Student'
              )}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Member Since</span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{joinDate}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:text-slate-300 dark:hover:text-red-400 rounded-xl font-medium text-sm transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
