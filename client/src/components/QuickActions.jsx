import React from 'react';
import { BookOpen, Code, Rocket, FileText, Target, Calendar } from 'lucide-react';

const ACTIONS = [
  {
    title: 'Ask Academic Question',
    icon: BookOpen,
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
    description: 'Calculus, Physics, Algorithms, Science & Formulas',
    prompt: 'Explain the fundamental theorem of calculus and how derivatives and integrals connect with a simple physical example.'
  },
  {
    title: 'Coding Help',
    icon: Code,
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    description: 'React, Node, Python, Debugging & Algorithms',
    prompt: 'How do I handle asynchronous state updates and clean up side effects in React useEffect? Provide code examples.'
  },
  {
    title: 'Project Ideas',
    icon: Rocket,
    color: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
    description: 'Standout portfolio projects for tech internships',
    prompt: 'Suggest 3 impressive, full-stack student portfolio project ideas with modern tech stacks that will stand out to recruiters.'
  },
  {
    title: 'Resume Help',
    icon: FileText,
    color: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400',
    description: 'ATS optimization & Google X-Y-Z bullet points',
    prompt: 'How can I rewrite my software engineering project bullet points to make them high-impact and ATS-optimized using the Google X-Y-Z formula?'
  },
  {
    title: 'Interview Preparation',
    icon: Target,
    color: 'from-rose-500/10 to-orange-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
    description: 'STAR behavioral answers & technical rounds',
    prompt: 'Guide me on how to ace the behavioral question "Tell me about a time you solved a tough bug" using the STAR method.'
  },
  {
    title: 'Study Plan',
    icon: Calendar,
    color: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
    description: 'Spaced repetition, Pomodoro & exam timetables',
    prompt: 'Help me design an intensive 2-week exam revision study plan utilizing active recall and spaced repetition.'
  }
];

export default function QuickActions({ onSelectAction }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-4 ring-1 ring-indigo-500/20 shadow-sm">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          SmartAssist AI
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Your personal academic, coding, and career mentor. Select a topic below to jump straight in.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACTIONS.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectAction(action.prompt)}
              className="group relative flex flex-col items-start p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-left"
            >
              <div className={`p-2.5 rounded-xl border mb-3 bg-gradient-to-br ${action.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mb-1 text-sm">
                {action.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
