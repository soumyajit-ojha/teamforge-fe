/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  Clock, 
  FileCheck2, 
  CheckCircle, 
  ChevronRight, 
  Mail, 
  AlertCircle,
  FileText,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export const DailyWorkScreen: React.FC = () => {
  const { 
    dailyWork, 
    toggleDailyWorkItem, 
    removeDailyWorkItem, 
    addDailyWorkItem, 
    submitPunchOut, 
    reports,
    currentUser
  } = useApp();

  const [manualText, setManualText] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [activePunchOutReport, setActivePunchOutReport] = useState<any | null>(null);

  const handleAddManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    addDailyWorkItem(manualText.trim(), 'manual');
    setManualText('');
  };

  const handlePunchOutTrigger = () => {
    // Generate the report
    const report = submitPunchOut(reportNotes);
    setActivePunchOutReport(report);
    setReportNotes('');
  };

  const getIconClass = (type: string) => {
    switch (type) {
      case 'task_update': return 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400';
      case 'status_change': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400';
      case 'comment': return 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400';
      default: return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'task_update': return 'Task Update';
      case 'status_change': return 'Status Change';
      case 'comment': return 'Feedback Loop';
      default: return 'Manual Entry';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
            Daily Work & Punch-Out Reporter
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Automatically collects your workspace accomplishments today. Review, prune, and submit your report to end your shift.
          </p>
        </div>
      </div>

      {/* Main Core Layout: Screen 9 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Work items list area (2 columns wide) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">
                  Today's Accomplishments
                </h3>
                <p className="text-xs text-slate-400">
                  Select items to include in the final report, or delete irrelevant actions.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase py-1 px-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
                Auto-Gather Engine Active
              </span>
            </div>

            {/* Manual Task insertion */}
            <form onSubmit={handleAddManualItem} className="flex gap-2.5 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 dark:border-slate-850">
              <input
                type="text"
                required
                placeholder="Add manual/untracked daily accomplishment (e.g., Standup meeting, user call)..."
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs flex-1 focus:outline-none"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" />
                Add Item
              </button>
            </form>

            {/* List of auto-gathered work */}
            <div className="space-y-3">
              {dailyWork.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between gap-4 p-3.5 rounded-xl border transition-all ${
                    item.completed 
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' 
                      : 'bg-slate-50/50 dark:bg-slate-950/20 border-transparent opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Checkbox trigger */}
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleDailyWorkItem(item.id)}
                      className="accent-indigo-600 h-4 w-4 rounded border-slate-300 mt-1 shrink-0 cursor-pointer"
                    />

                    <div className="min-w-0">
                      <span className={`inline-block text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded mb-1.5 ${getIconClass(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                      <p className={`text-xs text-slate-700 dark:text-slate-300 leading-relaxed ${item.completed ? 'font-semibold' : 'line-through text-slate-400'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Remove trigger */}
                  <button
                    onClick={() => removeDailyWorkItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                    title="Exclude item from today's report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {dailyWork.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-slate-150 dark:border-slate-800 rounded-2xl max-w-md mx-auto space-y-3">
                  <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">All Captured Goals Cleared</h4>
                  <p className="text-[10px] text-slate-400 leading-normal max-w-[250px] mx-auto">
                    You have cleared or submitted all gathered updates. Add manual records or update tasks to recreate listings.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Notes & Punch-Out submission drawer (1 column wide) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">
                Final Review
              </h3>
              <p className="text-xs text-slate-400">
                Provide overall feedback regarding your blockages or accomplishments.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 block font-bold uppercase">SUPERVISOR NOTES / COMMENTS</label>
              <textarea
                placeholder="e.g., Completed core tasks successfully. Ran into autoscaler latency blockages on Kubernetes during replication tests which will resolve tomorrow morning..."
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {/* Summary statistics */}
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Report Date:</span>
                <span className="font-bold font-mono">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Bullet Items:</span>
                <span className="font-bold text-indigo-600 font-mono">{dailyWork.filter(item => item.completed).length} items</span>
              </div>
            </div>

            {/* Punch out button */}
            <button
              onClick={handlePunchOutTrigger}
              disabled={dailyWork.filter(item => item.completed).length === 0}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              Complete Shift & Punch Out
            </button>
            
            {dailyWork.filter(item => item.completed).length === 0 && (
              <p className="text-[10px] text-amber-500 text-center italic">
                Include at least 1 completed accomplishment bullet to compile report.
              </p>
            )}
          </div>

          {/* Past Shift Logs summary */}
          {reports.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
              <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wide">PAST SHIFT REPORTS HISTORY</h4>
              
              <div className="space-y-3.5 divide-y divide-slate-100">
                {reports.slice(0, 3).map((rep) => (
                  <div key={rep.id} className="pt-2 text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className="font-bold">{rep.date}</span>
                      <span className="font-mono bg-emerald-50 text-emerald-700 py-0.5 px-1 rounded font-bold">SENT</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                      {rep.workItems.slice(0, 2).map((w, idx) => (
                        <li key={idx} className="truncate">{w}</li>
                      ))}
                      {rep.workItems.length > 2 && <li className="text-[9px] text-slate-400">+{rep.workItems.length - 2} more...</li>}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* PUNCH OUT SUCCESS OVERLAY MODAL: Screen 10 */}
      {activePunchOutReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in text-center relative p-8 space-y-6">
            
            {/* Ambient visual floating confetti SVGs simulated */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
            <div className="absolute top-1/2 right-10 w-3 h-3 bg-indigo-400 rounded-lg animate-pulse" />
            <div className="absolute bottom-10 left-1/4 w-3 h-3 bg-teal-400 rounded-full animate-bounce" />

            {/* Circular Success Badge */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border-2 border-emerald-100 dark:border-emerald-900 shadow-lg animate-pulse">
              <CheckCircle className="w-10 h-10" />
            </div>

            {/* Primary message */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-extrabold tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-100">
                PUNCH-OUT DISPATCH SUCCESSFUL
              </span>
              <h2 className="font-sans font-extrabold text-2xl text-slate-950 dark:text-slate-100">
                Spectacular Job Today!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-normal">
                Your company-wide productivity summary has been compiled and dispatched to supervisors and HR managers automatically.
              </p>
            </div>

            {/* Detailed summary breakdown inside modal */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl p-4 text-left space-y-3.5 max-h-56 overflow-y-auto">
              <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-200/50 dark:border-slate-800 font-mono">
                <span>REPORTER: {currentUser.name}</span>
                <span>TIME: {activePunchOutReport.punchOutTime}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">SUBMITTED ITEMS:</span>
                <ul className="space-y-1.5">
                  {activePunchOutReport.workItems.map((item: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {activePunchOutReport.notes && (
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase font-mono">YOUR REMARKS:</span>
                  <p className="text-xs text-slate-500 italic leading-relaxed">{activePunchOutReport.notes}</p>
                </div>
              )}
            </div>

            {/* Dispatch details block */}
            <div className="flex justify-around items-center py-2.5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-left text-xs text-indigo-900 dark:text-indigo-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <h4 className="font-bold">Email Dispatch Complete</h4>
                  <p className="text-[9px] text-indigo-400 leading-tight">Dispatched to people-ops@teamforge.com</p>
                </div>
              </div>
            </div>

            {/* Close actions */}
            <div className="space-y-2">
              <button
                onClick={() => setActivePunchOutReport(null)}
                className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              >
                Return to Dashboard
              </button>
              
              <p className="font-sans font-bold text-xs text-indigo-600 dark:text-indigo-400 animate-pulse pt-1">
                See You Tomorrow!
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
