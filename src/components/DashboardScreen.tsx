/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  FolderGit2, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Activity,
  UserCheck,
  FileText
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const { 
    currentUser, 
    projects, 
    tasks, 
    auditLogs, 
    setCurrentTab,
    setSelectedProjectId
  } = useApp();

  // Calculate stats for the logged-in user
  const userTasks = tasks.filter(t => t.assigneeId === currentUser.id);
  const totalTasksCount = userTasks.length;
  const completedTasksCount = userTasks.filter(t => t.status === 'Done').length;
  const pendingTasksCount = totalTasksCount - completedTasksCount;
  
  const completionRate = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 100;

  // Active projects count (where user is a member)
  const userProjects = projects.filter(p => 
    p.members.some(m => m.userId === currentUser.id) && p.status !== 'Archived'
  );

  // System overview for high level metrics
  const systemProjectsCount = projects.filter(p => p.status !== 'Archived').length;
  const systemTasksCount = tasks.length;
  const systemCompletedCount = tasks.filter(t => t.status === 'Done').length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-100 dark:shadow-none relative overflow-hidden">
        {/* Abstract decorative graphic vectors */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -mr-20 -mt-20"></div>
        <div className="absolute right-20 bottom-0 w-60 h-60 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -mr-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              Workspace Active
            </span>
            <h1 className="font-sans font-bold text-2xl md:text-3xl tracking-tight text-white">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
              You are signed in as <span className="text-indigo-200 font-medium">{currentUser.systemRole}</span> under <span className="text-indigo-200 font-medium">{currentUser.department}</span>. Here is how your team productivity metrics look today.
            </p>
          </div>

          {/* Quick Stats Summary circle widget */}
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl shrink-0">
            <div className="relative w-14 h-14 flex items-center justify-center">
              {/* Simple inline circular progress indicator */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" className="stroke-white/10 fill-none" strokeWidth="4" />
                <circle 
                  cx="28" 
                  cy="28" 
                  r="24" 
                  className="stroke-indigo-400 fill-none transition-all duration-500" 
                  strokeWidth="4" 
                  strokeDasharray={`${2 * Math.PI * 24}`} 
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - completionRate / 100)}`}
                />
              </svg>
              <span className="absolute text-xs font-bold text-white">{completionRate}%</span>
            </div>
            <div>
              <p className="text-[11px] font-mono font-bold tracking-wider uppercase text-indigo-300">Today's Progress</p>
              <h4 className="text-lg font-bold text-white mt-0.5">{completedTasksCount} / {totalTasksCount} done</h4>
              <p className="text-xs text-slate-300">Remaining tasks: {pendingTasksCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono tracking-wide uppercase">My Assigned Tasks</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
              <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalTasksCount}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across your joined teams</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono tracking-wide uppercase">Tasks Completed</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{completedTasksCount}</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {completionRate}% success rate
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono tracking-wide uppercase">My Active Projects</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl">
              <FolderGit2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{userProjects.length}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Of {systemProjectsCount} total company initiatives
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono tracking-wide uppercase">System-wide Tasks</span>
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{systemTasksCount}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {systemCompletedCount} marked as done globally
            </p>
          </div>
        </div>
      </div>

      {/* Middle Progress snapshot widget & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Snapshot progress panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">
                Today's Progress Snapshot
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Summary of your assigned objectives and current status.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 py-1 px-2.5 rounded-lg">
              UTC Localized
            </span>
          </div>

          <div className="space-y-4">
            {totalTasksCount === 0 ? (
              <div className="py-6 text-center border-2 border-dashed border-slate-150 dark:border-slate-800 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400">No tasks assigned to you currently.</p>
                <button 
                  onClick={() => setCurrentTab('projects')}
                  className="mt-2 text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                >
                  Explore active projects <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userTasks.slice(0, 4).map(task => {
                  const statusColors = {
                    'Todo': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                    'In Progress': 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
                    'In Review': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
                    'Done': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  };
                  return (
                    <div 
                      key={task.id} 
                      className="p-3 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl flex items-center justify-between gap-4 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Due: {task.dueDate}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                    </div>
                  );
                })}
                {totalTasksCount > 4 && (
                  <button 
                    onClick={() => setCurrentTab('tasks')}
                    className="w-full text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 py-1 hover:underline"
                  >
                    View all {totalTasksCount} tasks
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">
              Quick Operations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perform daily workflow entries in single click.
            </p>
          </div>

          <div className="space-y-2.5 my-6">
            <button
              onClick={() => setCurrentTab('tasks')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-left hover:bg-indigo-50/30 hover:border-indigo-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Manage Tasks</h4>
                  <p className="text-[10px] text-slate-400">Update status, checklists, comments</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setCurrentTab('daily')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-left hover:bg-emerald-50/30 hover:border-emerald-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Work Reporter</h4>
                  <p className="text-[10px] text-slate-400">Validate gathered reports</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setCurrentTab('daily')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Punch Out Now</h4>
                  <p className="text-[10px] text-indigo-100">Review and dispatch daily summary</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-200" />
            </button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-center">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              Role Permissions: Active ({currentUser.systemRole})
            </span>
          </div>
        </div>

      </div>

      {/* Bottom recent activity audit feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">
              Recent Workspace Updates
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live audit trail of activities logged by teammates.
            </p>
          </div>
          <button 
            onClick={() => setCurrentTab('tasks')} 
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Go to Task Board
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {auditLogs.slice(0, 5).map((log, idx) => {
            const formattedTime = new Date(log.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            });
            return (
              <div key={log.id || idx} className="py-3 flex items-start gap-4 text-xs">
                <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg mt-0.5 shrink-0 text-slate-500 dark:text-slate-400">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{log.userName}</span>{' '}
                    {log.action}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formattedTime} · Project Ref: {log.projectId.startsWith('prj') ? 'Active' : 'Global'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
