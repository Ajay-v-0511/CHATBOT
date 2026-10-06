import React from 'react';
import { BookOpen, Code, Rocket, FileText, Target, Calendar, Sparkles } from 'lucide-react';

const CATEGORY_CONFIG = {
  Academic: {
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    icon: BookOpen
  },
  Programming: {
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    icon: Code
  },
  Project: {
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    icon: Rocket
  },
  Resume: {
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    icon: FileText
  },
  Interview: {
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    icon: Target
  },
  Career: {
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    icon: Calendar
  },
  General: {
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    icon: Sparkles
  }
};

export default function CategoryBadge({ category = 'General', size = 'sm' }) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.General;
  const Icon = config.icon;

  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-1.5 py-0.5 space-x-1'
    : 'text-xs px-2.5 py-1 space-x-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${config.color} transition-all`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{category}</span>
    </span>
  );
}
