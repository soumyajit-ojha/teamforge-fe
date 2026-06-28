/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Briefcase,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2
} from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const { tasks, projects, currentUser } = useApp();

  // Mapped user task variables
  const userTasks = tasks.filter(t => t.assigneeId === currentUser.id);
  const total = userTasks.length;
  const completed = userTasks.filter(t => t.status === 'Done').length;
  const inProgress = userTasks.filter(t => t.status === 'In Progress').length;
  const inReview = userTasks.filter(t => t.status === 'In Review').length;
  const todo = userTasks.filter(t => t.status === 'Todo').length;

  const rate = total > 0 ? Math.round((completed / total) * 100) : 100;

  // 12 Weeks calendar grid simulation
  const months = ['Apr', 'May', 'Jun'];
  // Contribution weights representing daily activity: 0 (none), 1 (light), 2 (medium), 3 (high)
  const activityData = [
    [1, 2, 0, 3, 1, 0, 2], // Week 1
    [0, 1, 2, 1, 0, 3, 2], // Week 2
    [2, 3, 1, 0, 1, 2, 1], // Week 3
    [1, 0, 2, 2, 1, 0, 3], // Week 4
    [3, 1, 0, 2, 1, 2, 0], // Week 5
    [0, 2, 1, 3, 0, 1, 2], // Week 6
    [1, 2, 3, 1, 2, 0, 1], // Week 7
    [2, 0, 1, 2, 3, 1, 0], // Week 8
    [3, 2, 1, 0, 2, 2, 1], // Week 9
    [1, 1, 0, 3, 2, 1, 0], // Week 10
    [2, 3, 1, 2, 0, 1, 2], // Week 11
    [3, 2, 2, 1, 3, 0, 1]  // Week 12
  ];

  const getColorClass = (weight: number) => {
    switch (weight) {
      case 1: return 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200/30';
      case 2: return 'bg-indigo-300 dark:bg-indigo-700 border-indigo-400/30';
      case 3: return 'bg-indigo-600 dark:bg-indigo-500 border-indigo-700/30';
      default: return 'bg-slate-100 dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/80';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
            Personal Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Performance metrics, task completion velocities, and active contribution timelines.
          </p>
        </div>
      </div>

      {/* KPI stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
          <p className="text-[10px] font-mono text-slate-400 uppercase">My Completion Rate</p>
          <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{rate}%</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
          <p className="text-[10px] font-mono text-slate-400 uppercase">Completed Tasks</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">{completed}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
          <p className="text-[10px] font-mono text-slate-400 uppercase">In Progress</p>
          <h3 className="text-2xl font-black text-blue-500 mt-1">{inProgress}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
          <p className="text-[10px] font-mono text-slate-400 uppercase">Lead Time Velocity</p>
          <h3 className="text-2xl font-black text-emerald-500 mt-1">2.4 days</h3>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Weekly Progress Bar Chart (SVG) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Weekly Task Resolution Volumetrics</h3>
            <p className="text-[11px] text-slate-400">Total completed tasks mapped across days of the active week.</p>
          </div>

          {/* Pure SVG Bar Chart */}
          <div className="h-48 flex items-end justify-between px-4 pt-4 border-b border-slate-100 dark:border-slate-800 relative">
            {/* Grid line guidelines */}
            <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-slate-100 dark:border-slate-800/60" />
            <div className="absolute left-0 right-0 top-2/4 border-t border-dashed border-slate-100 dark:border-slate-800/60" />
            <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-slate-100 dark:border-slate-800/60" />

            {[
              { day: 'Mon', value: 3, h: 'h-1/3', color: 'bg-indigo-600' },
              { day: 'Tue', value: 5, h: 'h-1/2', color: 'bg-indigo-600' },
              { day: 'Wed', value: 8, h: 'h-4/5', color: 'bg-teal-500' },
              { day: 'Thu', value: 4, h: 'h-2/5', color: 'bg-indigo-600' },
              { day: 'Fri', value: 9, h: 'h-[95%]', color: 'bg-teal-500' },
              { day: 'Sat', value: 1, h: 'h-1/12', color: 'bg-slate-350' },
              { day: 'Sun', value: 0, h: 'h-[5px]', color: 'bg-slate-350' }
            ].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 w-1/12 z-10">
                <span className="text-[9px] font-mono font-bold text-slate-500">{bar.value}</span>
                <div className={`w-full rounded-t-md ${bar.color} ${bar.h} transition-all duration-500 hover:opacity-80`} />
                <span className="text-[10px] font-mono text-slate-400 mt-1">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Monthly Progress Line Chart (SVG) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Cumulative Task Resolution Curve</h3>
            <p className="text-[11px] text-slate-400">Total accomplishment percentage growth over the last 3 months.</p>
          </div>

          <div className="h-48 pt-4 relative flex items-end">
            {/* SVG line and gradient fill */}
            <svg className="w-full h-full" viewBox="0 0 300 150">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Guides */}
              <line x1="0" y1="110" x2="300" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />

              {/* Area under curve */}
              <path d="M0,150 L20,130 L80,120 L140,85 L200,60 L260,30 L300,20 L300,150 Z" fill="url(#lineGrad)" />
              
              {/* Line path */}
              <path 
                d="M0,150 Q10,135 20,130 T80,120 T140,85 T200,60 T260,30 T300,20" 
                fill="none" 
                stroke="#4f46e5" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* Bullet indicators */}
              <circle cx="140" cy="85" r="4" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="260" cy="30" r="4" fill="#14b8a6" stroke="#ffffff" strokeWidth="1.5" />
            </svg>

            {/* Labels overlay bottom */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-between px-3 text-[10px] font-mono text-slate-400">
              <span>April (Baseline)</span>
              <span>May (+38%)</span>
              <span>June (Active Target)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Calendar Activity View: Grid layout (Screen 11) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">Accomplishments Heatmap Grid</h3>
            <p className="text-xs text-slate-400">Calendar view of Daily Work submissions. Darker shades represent higher accomplished milestones.</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span>Less</span>
            <div className="w-2.5 h-2.5 bg-slate-100 rounded" />
            <div className="w-2.5 h-2.5 bg-indigo-150 rounded" />
            <div className="w-2.5 h-2.5 bg-indigo-300 rounded" />
            <div className="w-2.5 h-2.5 bg-indigo-600 rounded" />
            <span>More</span>
          </div>
        </div>

        {/* Contributions Grid */}
        <div className="flex items-center gap-4 overflow-x-auto py-2">
          {/* Weekday indicators column */}
          <div className="flex flex-col justify-between text-[10px] font-mono text-slate-400 h-28 pr-1 mt-4 shrink-0">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          <div className="space-y-1">
            {/* Months row header */}
            <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1 select-none">
              {months.map((m, idx) => (
                <span key={idx} className="w-1/3 text-left">{m}</span>
              ))}
            </div>

            {/* Matrix box grid */}
            <div className="flex gap-1.5">
              {activityData.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5 shrink-0">
                  {week.map((weight, dIdx) => (
                    <div
                      key={dIdx}
                      className={`w-3.5 h-3.5 rounded border ${getColorClass(weight)} transition-colors cursor-pointer hover:scale-110`}
                      title={`Week ${wIdx + 1}, Day ${dIdx + 1}: ${weight === 0 ? 'No activities' : weight + ' accomplishments logged'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
