/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, TaskPriority, ChecklistItem } from '../types';
import { 
  CheckSquare, 
  Clock, 
  MessageSquare, 
  Paperclip, 
  SlidersHorizontal,
  FolderGit2,
  ListTodo,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Trash2,
  Lock,
  Send,
  X
} from 'lucide-react';

export const TasksScreen: React.FC = () => {
  const { 
    tasks, 
    projects, 
    comments,
    auditLogs,
    currentUser,
    updateTask,
    deleteTask,
    toggleChecklistItem,
    addTaskComment
  } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Checklist adding state
  const [newChecklistItemText, setNewChecklistItemText] = useState('');
  // Comment adding state
  const [newCommentText, setNewCommentText] = useState('');

  // Extract only tasks assigned to current user
  const userTasks = currentUser ? tasks.filter(t => t.assigneeId === currentUser.id) : [];

  // Filter tasks
  const filteredTasks = userTasks.filter(t => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  // Kanban boards
  const statuses: TaskStatus[] = ['Todo', 'In Progress', 'In Review', 'Done'];

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newChecklistItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      text: newChecklistItemText.trim(),
      done: false
    };
    
    const updatedChecklist = [...selectedTask.checklist, newItem];
    updateTask(selectedTask.id, { checklist: updatedChecklist });
    setNewChecklistItemText('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newCommentText.trim()) return;
    addTaskComment(selectedTask.id, newCommentText.trim());
    setNewCommentText('');
  };

  const handleAddAttachment = () => {
    if (!selectedTask) return;
    const mockAtt = {
      id: `att-${Date.now()}`,
      name: `Resource_Specs_v${Math.floor(Math.random() * 4) + 1}.pdf`,
      size: `${(Math.random() * 1.5 + 0.2).toFixed(1)} MB`
    };
    const updatedAttachments = [...selectedTask.attachments, mockAtt];
    updateTask(selectedTask.id, { attachments: updatedAttachments });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
            My Assigned Tasks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Personal productivity cockpit pooling all your active responsibilities across all initiatives.
          </p>
        </div>

        {/* Dynamic status pill */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-3 rounded-xl flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">TASKS COMPLETE</span>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              {userTasks.filter(t => t.status === 'Done').length} / {userTasks.length} Done
            </p>
          </div>
          <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
        </div>
      </div>

      {/* Filter and configuration bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-slate-500 font-mono uppercase">FILTERS:</span>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg p-1.5 text-xs focus:outline-none font-medium text-slate-700 dark:text-slate-300"
        >
          <option value="all">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="In Review">In Review</option>
          <option value="Done">Done</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg p-1.5 text-xs focus:outline-none font-medium text-slate-700 dark:text-slate-300"
        >
          <option value="all">All Priorities</option>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
          <option value="Urgent">Urgent Priority</option>
        </select>
      </div>

      {/* Hybrid Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kanban Board Area (2 columns wide) with iOS-style responsive horizontal column scrolling */}
        <div className="lg:col-span-2 overflow-x-auto pb-4 scrollbar-none">
          <div className="flex md:grid md:grid-cols-4 gap-4 min-w-[850px] md:min-w-0 items-start">
          {statuses.map(status => {
            const statusTasks = filteredTasks.filter(t => t.status === status);
            
            const boardHeaders = {
              'Todo': { label: 'To Do', border: 'border-t-slate-400', countBg: 'bg-slate-100 text-slate-600' },
              'In Progress': { label: 'In Progress', border: 'border-t-blue-500', countBg: 'bg-blue-50 text-blue-600' },
              'In Review': { label: 'In Review', border: 'border-t-amber-500', countBg: 'bg-amber-50 text-amber-600' },
              'Done': { label: 'Completed', border: 'border-t-emerald-500', countBg: 'bg-emerald-50 text-emerald-600' }
            };

            return (
              <div 
                key={status} 
                className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-150 dark:border-slate-900 min-h-[350px] space-y-3"
              >
                {/* Board Column Header */}
                <div className={`flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800 border-t-2 ${boardHeaders[status].border} pt-1.5`}>
                  <h3 className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200">
                    {boardHeaders[status].label}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${boardHeaders[status].countBg}`}>
                    {statusTasks.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-0.5">
                  {statusTasks.map(task => {
                    const linkedProj = projects.find(p => p.id === task.projectId);
                    const isSelected = selectedTaskId === task.id;
                    const completedCheck = task.checklist.filter(c => c.done).length;

                    const prioColors = {
                      'Low': 'text-slate-500 bg-slate-100',
                      'Medium': 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20',
                      'High': 'text-amber-600 bg-amber-50 dark:bg-amber-950/20',
                      'Urgent': 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 font-bold'
                    };

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`bg-white dark:bg-slate-900 border ${
                          isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-slate-150 dark:border-slate-800/80'
                        } hover:border-slate-350 dark:hover:border-slate-750 p-3.5 rounded-xl cursor-pointer shadow-sm transition-all space-y-2`}
                      >
                        <span className="text-[9px] font-semibold text-slate-400 font-mono block">
                          {linkedProj?.name || 'Project Team'}
                        </span>
                        
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
                          {task.title}
                        </h4>

                        {/* checklist micro indicators */}
                        {task.checklist.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <ListTodo className="w-3.5 h-3.5" />
                            <span>{completedCheck}/{task.checklist.length} checklist items</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/60">
                          <span className={`text-[9px] font-bold py-0.5 px-1.5 rounded uppercase ${prioColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {task.dueDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {statusTasks.length === 0 && (
                    <p className="text-[10px] text-slate-400 text-center py-6 italic">No tasks</p>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Right side Detail Drawer (1 column wide) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          {selectedTask ? (
            <div className="space-y-6">
              
              {/* Drawer header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-850">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-slate-400">TASK REF: {selectedTask.id}</span>
                  <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">{selectedTask.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedTaskId(null)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">SET STATUS</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => updateTask(selectedTask.id, { status: e.target.value as TaskStatus })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-xs focus:outline-none"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">PRIORITY</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => updateTask(selectedTask.id, { priority: e.target.value as TaskPriority })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-xs focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block">CONTEXT DESCRIPTION</label>
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 leading-relaxed">
                  {selectedTask.description || 'No description provided.'}
                </p>
              </div>

              {/* Checklist subtasks */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-mono text-slate-400 block">SUBTASK CHECKLIST</label>
                
                {selectedTask.checklist.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {selectedTask.checklist.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => toggleChecklistItem(selectedTask.id, item.id)}
                        className="flex items-center gap-2 p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer text-xs"
                      >
                        <input 
                          type="checkbox" 
                          checked={item.done} 
                          readOnly
                          className="accent-indigo-600 h-3.5 w-3.5 rounded"
                        />
                        <span className={item.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleAddChecklistItem} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Add requirement..."
                    value={newChecklistItemText}
                    onChange={(e) => setNewChecklistItemText(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg px-2 py-1.5 text-xs flex-1 focus:outline-none"
                  />
                  <button type="submit" className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs rounded-lg font-bold">
                    Add
                  </button>
                </form>
              </div>

              {/* Attachments Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[10px] font-mono text-slate-400 block">ATTACHED DOCUMENTS ({selectedTask.attachments.length})</label>
                  <button 
                    type="button" 
                    onClick={handleAddAttachment}
                    className="text-[10px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Paperclip className="w-3 h-3" /> Attach File
                  </button>
                </div>
                
                {selectedTask.attachments.length > 0 && (
                  <div className="space-y-1 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-xl border border-slate-200 border-dashed">
                    {selectedTask.attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between text-xs p-1">
                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{att.name}</span>
                        <span className="text-[10px] text-slate-400">{att.size}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments responses */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="text-[10px] font-mono text-slate-400 block">FEEDBACK LOOPS</label>
                
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {comments.filter(c => c.taskId === selectedTask.id).map(cmt => (
                    <div key={cmt.id} className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg text-xs border border-slate-100 dark:border-slate-850">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{cmt.userName}</span>
                        <span className="text-slate-400 font-mono">
                          {new Date(cmt.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{cmt.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Comment & sync..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg px-2 py-1.5 text-xs flex-1 focus:outline-none"
                  />
                  <button type="submit" className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Audit trail snippet */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[9px] font-mono text-slate-400 block">WORKSPACE MODIFICATION LOGS</span>
                {auditLogs.filter(log => log.taskId === selectedTask.id).slice(0, 2).map(log => (
                  <p key={log.id} className="text-[10px] text-slate-500">
                    • {log.action} (by {log.userName})
                  </p>
                ))}
              </div>

            </div>
          ) : (
            <div className="py-24 text-center space-y-3">
              <ListTodo className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">No Task Selected</h4>
              <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto leading-normal">
                Click any task card in your kanban boards to interact with checklists, comment logs, and dynamic trackers.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
