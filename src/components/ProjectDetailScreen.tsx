/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectRole, PhaseStatus, TaskStatus, TaskPriority, ChecklistItem, Task } from '../types';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Clock, 
  ListTodo, 
  Eye, 
  Paperclip, 
  MessageSquare, 
  SlidersHorizontal,
  PlusCircle,
  TrendingUp,
  UserPlus,
  Trash2,
  Lock,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  History,
  CornerDownRight,
  Send,
  X
} from 'lucide-react';

export const ProjectDetailScreen: React.FC = () => {
  const { 
    selectedProjectId, 
    setSelectedProjectId, 
    projects, 
    phases, 
    tasks, 
    comments,
    auditLogs,
    currentUser,
    companyPool,
    activeProjectTab,
    setActiveProjectTab,
    addPhase,
    updatePhaseStatus,
    addTask,
    updateTask,
    deleteTask,
    assignProjectMember,
    removeProjectMember,
    toggleChecklistItem,
    addTaskComment
  } = useApp();

  const project = projects.find(p => p.id === selectedProjectId);

  // If no project selected, return error view
  if (!project) {
    return (
      <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400">Project workspace not found.</p>
        <button onClick={() => setSelectedProjectId(null)} className="mt-4 text-indigo-600 hover:underline">
          Go back to Project list
        </button>
      </div>
    );
  }

  // Find users in this project
  const projectMembers = project.members.map(m => {
    const user = companyPool.find(u => u.id === m.userId);
    return {
      ...user,
      projectRole: m.projectRole
    };
  });

  // Check current user's role on this project
  const currentUserProjectMember = project.members.find(m => m.userId === currentUser.id);
  const currentUserProjectRole: ProjectRole = currentUserProjectMember?.projectRole || 'Viewer';
  const hasWritingPermissions = currentUser.systemRole === 'Admin' || 
                                 currentUserProjectRole === 'Project Manager' || 
                                 currentUserProjectRole === 'Task Maker';

  // State fields
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Phase Form State
  const [showAddPhaseForm, setShowAddPhaseForm] = useState(false);
  const [phaseName, setPhaseName] = useState('');
  const [phaseStart, setPhaseStart] = useState('');
  const [phaseEnd, setPhaseEnd] = useState('');
  const [phaseMilestone, setPhaseMilestone] = useState('');
  const [phaseDep, setPhaseDep] = useState('');

  // Task Form State
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskPhase, setTaskPhase] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [taskDue, setTaskDue] = useState('');

  // Task Filter state
  const [taskSearch, setTaskSearch] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('all');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<string>('all');
  const [taskAssigneeFilter, setTaskAssigneeFilter] = useState<string>('all');

  // Member Management Invite state
  const [inviteUserId, setInviteUserId] = useState('');
  const [inviteRole, setInviteRole] = useState<ProjectRole>('Contributor');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');

  // Checklist adding state
  const [newChecklistItemText, setNewChecklistItemText] = useState('');
  // Comment adding state
  const [newCommentText, setNewCommentText] = useState('');

  const projectPhases = phases.filter(phs => phs.projectId === project.id);
  const projectTasks = tasks.filter(t => t.projectId === project.id);

  // Filter tasks based on filters state
  const filteredProjectTasks = projectTasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(taskSearch.toLowerCase()) || 
                          t.description.toLowerCase().includes(taskSearch.toLowerCase());
    const matchesStatus = taskStatusFilter === 'all' || t.status === taskStatusFilter;
    const matchesPriority = taskPriorityFilter === 'all' || t.priority === taskPriorityFilter;
    const matchesAssignee = taskAssigneeFilter === 'all' || t.assigneeId === taskAssigneeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  // Handlers
  const handleCreatePhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseName || !phaseStart || !phaseEnd) return;
    addPhase(project.id, phaseName, phaseStart, phaseEnd, phaseMilestone, phaseDep);
    setPhaseName('');
    setPhaseStart('');
    setPhaseEnd('');
    setPhaseMilestone('');
    setPhaseDep('');
    setShowAddPhaseForm(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskAssignee || !taskPhase) return;
    addTask(project.id, taskPhase, taskTitle, taskDesc, taskAssignee, taskPriority, taskDue || '2026-08-01');
    setTaskTitle('');
    setTaskDesc('');
    setTaskAssignee('');
    setTaskPhase('');
    setTaskDue('');
    setShowAddTaskForm(false);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteUserId) return;
    assignProjectMember(project.id, inviteUserId, inviteRole);
    setInviteUserId('');
  };

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
      name: `Design_Brief_v${Math.floor(Math.random() * 5) + 1}.png`,
      size: `${(Math.random() * 2 + 0.1).toFixed(1)} MB`
    };
    const updatedAttachments = [...selectedTask.attachments, mockAtt];
    updateTask(selectedTask.id, { attachments: updatedAttachments });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Navigation Row */}
      <button 
        onClick={() => setSelectedProjectId(null)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to projects
      </button>

      {/* Project Header section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md text-slate-500">
                PROJ-REF: {project.id}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 px-2 py-0.5 rounded-md">
                Your Project Role: {currentUserProjectRole}
              </span>
            </div>
            
            <h1 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
              {project.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0 gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">PROJECT END:</span>
              <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {project.endDate}
              </span>
            </div>

            {/* Custom high contrast status label */}
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase py-0.5 px-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-100 dark:border-blue-900">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              {project.status}
            </span>
          </div>
        </div>

        {/* Project progress status slider bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-50 dark:border-slate-850">
          <div className="md:col-span-3 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400">PROJECT COMPLETION INDEX</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{project.progress}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300" 
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Quick micro stats cards */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 justify-around">
            <div className="text-center">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Phases</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{projectPhases.length}</h4>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-center">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Tasks</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{projectTasks.length}</h4>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-center">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Team Size</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{projectMembers.length}</h4>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto gap-4 pt-2">
          {[
            { id: 'overview', label: 'Overview', icon: Briefcase },
            { id: 'phases', label: 'Phases & Milestones', icon: SlidersHorizontal },
            { id: 'tasks', label: 'Tasks Workspace', icon: CheckSquare },
            { id: 'members', label: 'Project Members', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeProjectTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveProjectTab(tab.id as any)}
                className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all duration-150 inline-flex items-center gap-2 whitespace-nowrap ${
                  isActive 
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* TAB 1: OVERVIEW */}
      {activeProjectTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Executive brief card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">Project Mission Summary</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                This project integrates company-wide standard processes. Led by our Project Management team, it connects various engineering, design, and product modules. Contributions mapped across specific phases guarantee milestones are met on deadline timelines.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">KICKOFF DATE</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{project.startDate}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">TARGET COMPLETION</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{project.endDate}</p>
                </div>
              </div>
            </div>

            {/* Micro roadmaps view */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">Project Phase Timeline</h3>
                <button 
                  onClick={() => setActiveProjectTab('phases')} 
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Manage Phases
                </button>
              </div>

              <div className="space-y-4 relative pl-4 border-l border-indigo-100 dark:border-slate-800">
                {projectPhases.map((phase) => {
                  const statusDots = {
                    'Completed': 'bg-emerald-500',
                    'In Progress': 'bg-indigo-500 animate-pulse',
                    'Not Started': 'bg-slate-350 dark:bg-slate-700'
                  };
                  return (
                    <div 
                      key={phase.id} 
                      onClick={() => setActiveProjectTab('tasks')}
                      className="relative space-y-1 cursor-pointer group hover:bg-slate-100/50 dark:hover:bg-zinc-850/40 p-2 -mx-2 rounded-xl transition-all"
                      title="Click to view tasks workspace for this phase"
                    >
                      {/* Timeline dot badge */}
                      <span className={`absolute -left-[21px] top-3 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${statusDots[phase.status]}`} />
                      
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{phase.name}</h4>
                        <span className="text-[10px] font-mono font-bold text-slate-400">{phase.startDate} - {phase.endDate}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${phase.progress}%` }} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500">{phase.progress}%</span>
                      </div>
                      {phase.milestoneName && (
                        <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1 mt-1">
                          <Bookmark className="w-3 h-3" />
                          Milestone: {phase.milestoneName}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right sidebar info */}
          <div className="space-y-6">
            {/* Quick list of members */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">Project Members</h3>
                <button 
                  onClick={() => setActiveProjectTab('members')} 
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Edit List
                </button>
              </div>

              <div className="space-y-3">
                {projectMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between gap-3 p-2 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{member.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{member.department}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 py-0.5 px-2 rounded-md">
                      {member.projectRole}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action guidelines */}
            <div className="bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 p-5 rounded-2xl space-y-2.5">
              <h3 className="text-xs font-bold font-mono text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">PROJECT GOALS & COMPLIANCE</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                To fulfill productivity reports, complete assigned tasks and check off checklists. Your completed actions are gathered on Daily Work panel before PUNCH-OUT!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHASES (Screen 5: Phase Management) */}
      {activeProjectTab === 'phases' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Phase creation form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">Add New Phase</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Introduce a milestone phase for this specific project.</p>
            </div>

            {hasWritingPermissions ? (
              <form onSubmit={handleCreatePhase} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 block">PHASE TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Phase 4: Production Dry-Run"
                    value={phaseName}
                    onChange={(e) => setPhaseName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 block">START DATE *</label>
                  <input
                    type="date"
                    required
                    value={phaseStart}
                    onChange={(e) => setPhaseStart(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 block">END DATE *</label>
                  <input
                    type="date"
                    required
                    value={phaseEnd}
                    onChange={(e) => setPhaseEnd(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 block">PHASE MILESTONE NAME</label>
                  <input
                    type="text"
                    placeholder="e.g., Load Balancer Verified"
                    value={phaseMilestone}
                    onChange={(e) => setPhaseMilestone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 block">DEPENDENCY ON EXISTING PHASE</label>
                  <select
                    value={phaseDep}
                    onChange={(e) => setPhaseDep(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="">No dependency phase</option>
                    {projectPhases.map(phs => (
                      <option key={phs.id} value={phs.id}>{phs.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Phase to Project
                </button>
              </form>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-250 text-center space-y-2">
                <Lock className="w-6 h-6 text-slate-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Access Restricted</h4>
                <p className="text-[10px] text-slate-500">Only Admins or Project Managers can append new project milestones.</p>
              </div>
            )}
          </div>

          {/* Phase list & milestones display */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">Milestone Roadmap</h3>
            
            <div className="space-y-4">
              {projectPhases.map((phase) => {
                const depPhase = projectPhases.find(p => p.id === phase.dependencyPhaseId);
                return (
                  <div 
                    key={phase.id} 
                    className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850 hover:border-slate-200 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{phase.name}</h4>
                        <p className="text-xs text-slate-400 font-mono">Duration: {phase.startDate} to {phase.endDate}</p>
                      </div>

                      {/* Dropdown status modifier */}
                      {hasWritingPermissions ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={phase.status}
                            onChange={(e) => updatePhaseStatus(phase.id, e.target.value as PhaseStatus, phase.progress)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 text-[11px] font-bold focus:outline-none"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={phase.progress}
                            onChange={(e) => updatePhaseStatus(phase.id, phase.status, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 w-14 text-center text-[11px] font-bold focus:outline-none"
                            title="Phase progress percentage"
                          />
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono font-bold bg-slate-200 text-slate-700 py-0.5 px-2 rounded">
                          Status: {phase.status}
                        </span>
                      )}
                    </div>

                    {/* Progress Slider bar */}
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 rounded-full transition-all duration-300" 
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-right text-slate-400 font-mono">Completed: {phase.progress}%</p>
                    </div>

                    {/* Milestone and Dependency info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                      {phase.milestoneName && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 font-mono">
                          <Bookmark className="w-3.5 h-3.5" />
                          Milestone target: {phase.milestoneName}
                        </span>
                      )}
                      {depPhase && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-mono">
                          <CornerDownRight className="w-3 h-3" />
                          Depends on phase: "{depPhase.name}"
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: TASKS WORKSPACE (Screen 6, 7 & 8: Hybrid Layout with table & Right drawer) */}
      {activeProjectTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Area: left & middle list of tasks (Screen 6) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            
            {/* Filter and action tools */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-150 dark:border-slate-850">
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">Tasks Matrix</h3>
                <p className="text-xs text-slate-400">Select any task to review checklists, logs, and post responses.</p>
              </div>

              {/* Add Task Trigger */}
              {hasWritingPermissions ? (
                <button
                  onClick={() => setShowAddTaskForm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Task
                </button>
              ) : (
                <div className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> View-only workspace
                </div>
              )}
            </div>

            {/* Hybrid Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                placeholder="Search tasks..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl p-2 text-xs focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
              </select>

              <select
                value={taskAssigneeFilter}
                onChange={(e) => setTaskAssigneeFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl p-2 text-xs focus:outline-none"
              >
                <option value="all">All Assignees</option>
                {projectMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Task Table List */}
            {filteredProjectTasks.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <p className="text-xs text-slate-500">No matching tasks found.</p>
                <button onClick={() => { setTaskSearch(''); setTaskStatusFilter('all'); setTaskAssigneeFilter('all'); }} className="text-xs text-indigo-600 font-semibold">
                  Reset Search Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-850 text-[10px] font-mono text-slate-400 tracking-wide uppercase">
                      <th className="pb-2 font-bold">TASK TITLE</th>
                      <th className="pb-2 font-bold">ASSIGNEE</th>
                      <th className="pb-2 font-bold">STATUS</th>
                      <th className="pb-2 font-bold">PRIORITY</th>
                      <th className="pb-2 font-bold text-right">DUE DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                    {filteredProjectTasks.map(task => {
                      const assigneeUser = companyPool.find(u => u.id === task.assigneeId);
                      const isCurrentlySelected = selectedTaskId === task.id;
                      
                      const statusColors = {
                        'Todo': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                        'In Progress': 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
                        'In Review': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
                        'Done': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      };

                      const prioColors = {
                        'Low': 'text-slate-500 bg-slate-50 dark:bg-slate-900',
                        'Medium': 'text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20',
                        'High': 'text-amber-600 bg-amber-50 dark:bg-amber-950/20',
                        'Urgent': 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 font-extrabold animate-pulse'
                      };

                      return (
                        <tr 
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/20 cursor-pointer transition-colors text-xs ${
                            isCurrentlySelected ? 'bg-indigo-50/40 dark:bg-indigo-950/30 font-semibold' : ''
                          }`}
                        >
                          <td className="py-3 pr-2 font-medium">
                            <div className="min-w-0 max-w-[180px] sm:max-w-[260px]">
                              <p className="text-slate-800 dark:text-slate-200 truncate">{task.title}</p>
                              {task.checklist.length > 0 && (
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  Checklist: {task.checklist.filter(c => c.done).length}/{task.checklist.length}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 pr-2">
                            <div className="flex items-center gap-2">
                              <img src={assigneeUser?.avatar} className="w-5 h-5 rounded-full object-cover" />
                              <span className="text-slate-600 dark:text-slate-300 truncate max-w-[80px]">{assigneeUser?.name}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColors[task.status]}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-3 pr-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${prioColors[task.priority]}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3 text-right font-mono text-slate-500">
                            {task.dueDate}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Side Panel: Task Details / Drawer (Screen 7 & Screen 8 Audit Trail) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            {selectedTask ? (
              <div className="space-y-6">
                
                {/* Drawer header actions */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-slate-400">TASK IDENTIFIER: {selectedTask.id}</span>
                    <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">{selectedTask.title}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedTaskId(null)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                    title="Deselect task"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Info block layout */}
                <div className="space-y-4">
                  {/* Status & Priority setters */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">TASK STATUS</label>
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

                  {/* Description paragraph */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block">DESCRIPTION</label>
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850 leading-relaxed">
                      {selectedTask.description || "No description provided."}
                    </p>
                  </div>

                  {/* Checklist Section (Screen 7) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-400 block">SUBTASK CHECKLIST</label>
                    
                    {selectedTask.checklist.length > 0 && (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {selectedTask.checklist.map(item => (
                          <div 
                            key={item.id} 
                            onClick={() => toggleChecklistItem(selectedTask.id, item.id)}
                            className="flex items-center gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-950 rounded cursor-pointer text-xs"
                          >
                            <input 
                              type="checkbox" 
                              checked={item.done} 
                              readOnly
                              className="accent-indigo-600 h-3.5 w-3.5 rounded border-slate-300"
                            />
                            <span className={item.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline input to append checklist item */}
                    <form onSubmit={handleAddChecklistItem} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Add subtask requirement..."
                        value={newChecklistItemText}
                        onChange={(e) => setNewChecklistItemText(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1.5 text-xs flex-1 focus:outline-none"
                      />
                      <button 
                        type="submit" 
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold"
                      >
                        Add
                      </button>
                    </form>
                  </div>

                  {/* Attachments listing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-slate-400 block">ATTACHMENTS ({selectedTask.attachments.length})</label>
                      <button 
                        type="button" 
                        onClick={handleAddAttachment}
                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Paperclip className="w-3 h-3" />
                        Attach Mock File
                      </button>
                    </div>

                    {selectedTask.attachments.length > 0 && (
                      <div className="space-y-1 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-xl border border-slate-150 border-dashed">
                        {selectedTask.attachments.map(att => (
                          <div key={att.id} className="flex items-center justify-between text-xs p-1">
                            <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]" title={att.name}>{att.name}</span>
                            <span className="text-[10px] text-slate-400">{att.size}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Task Comments / Logs area */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                    <label className="text-[10px] font-mono text-slate-400 block">COMMENTS & RESPONSES</label>
                    
                    {/* List of comments */}
                    <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                      {comments.filter(c => c.taskId === selectedTask.id).map(cmt => (
                        <div key={cmt.id} className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-850 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-slate-700 dark:text-slate-200">{cmt.userName}</span>
                            <span className="text-slate-400 font-mono">
                              {new Date(cmt.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-normal">{cmt.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={handlePostComment} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Type response, press Send..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1.5 text-xs flex-1 focus:outline-none"
                      />
                      <button 
                        type="submit"
                        className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        title="Send comment"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                  {/* Lightweight Audit Trail (Screen 8) */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">AUDIT ACTION HISTORY</span>
                      <span className="text-[9px] font-mono text-slate-400">By Alex, Sarah, etc</span>
                    </div>
                    <div className="space-y-1">
                      {auditLogs.filter(log => log.taskId === selectedTask.id).slice(0, 3).map(log => (
                        <p key={log.id} className="text-[10px] text-slate-500 leading-tight">
                          • {log.userName} {log.action} ({new Date(log.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })})
                        </p>
                      ))}
                      {auditLogs.filter(log => log.taskId === selectedTask.id).length === 0 && (
                        <p className="text-[10px] text-slate-400 italic">No modifications logged yet today.</p>
                      )}
                    </div>
                  </div>

                  {/* Danger Delete Action */}
                  {hasWritingPermissions && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to permanently delete task "${selectedTask.title}"?`)) {
                          deleteTask(selectedTask.id);
                          setSelectedTaskId(null);
                        }
                      }}
                      className="w-full text-center py-2 text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Delete Task
                    </button>
                  )}

                </div>

              </div>
            ) : (
              <div className="py-24 text-center space-y-3">
                <ListTodo className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">No Task Selected</h4>
                <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto leading-normal">
                  Click any row in the tasks matrix on the left to reveal checklist controls, attachments, and logs.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 4: MEMBERS TABLE (Screen 4: Member Management) */}
      {activeProjectTab === 'members' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">Project Staffing Roles</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">View project-specific permissions. Only staffed members can read database records.</p>
            </div>

            {/* Invite Controls */}
            {currentUserProjectRole === 'Project Manager' || currentUser.systemRole === 'Admin' ? (
              <form onSubmit={handleAddMember} className="flex flex-wrap items-center gap-2">
                <select
                  required
                  value={inviteUserId}
                  onChange={(e) => setInviteUserId(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs focus:outline-none"
                >
                  <option value="">Choose Employee...</option>
                  {companyPool
                    .filter(u => !project.members.some(m => m.userId === u.id))
                    .map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                    ))}
                </select>

                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as ProjectRole)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs focus:outline-none"
                >
                  <option value="Contributor">Contributor</option>
                  <option value="Task Maker">Task Maker</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Viewer">Viewer</option>
                </select>

                <button
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Staff Member
                </button>
              </form>
            ) : (
              <div className="text-[11px] font-mono text-amber-500 font-bold flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 py-1 px-3 rounded border border-amber-100">
                <Lock className="w-3.5 h-3.5" />
                Invite Locked (Managers Only)
              </div>
            )}
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-[10px] font-mono text-slate-400 tracking-wide uppercase">
                  <th className="pb-3 font-bold">EMPLOYEE</th>
                  <th className="pb-3 font-bold">DEPARTMENT</th>
                  <th className="pb-3 font-bold">PROJECT ROLE</th>
                  <th className="pb-3 font-bold">STATUS</th>
                  {(currentUserProjectRole === 'Project Manager' || currentUser.systemRole === 'Admin') && <th className="pb-3 text-right font-bold">ACTIONS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-xs">
                {projectMembers.map(member => {
                  if (!member) return null;
                  return (
                    <tr key={member.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20">
                      <td className="py-4 font-semibold">
                        <div className="flex items-center gap-3">
                          <img src={member.avatar} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-slate-800 dark:text-slate-200">{member.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-slate-600 dark:text-slate-350">{member.department}</td>
                      <td className="py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                          {member.projectRole}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ACTIVE STAFF
                        </span>
                      </td>
                      {(currentUserProjectRole === 'Project Manager' || currentUser.systemRole === 'Admin') && (
                        <td className="py-4 text-right">
                          <button
                            onClick={() => removeProjectMember(project.id, member.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Remove Member from project staffing"
                            disabled={member.id === currentUser.id} // Don't allow self remove
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showAddTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-sans font-bold text-slate-900 dark:text-slate-100">Create Project Task</h3>
              <button onClick={() => setShowAddTaskForm(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Close</button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-500">TASK NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Code Button stories in Storybook"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-500">DESCRIPTION</label>
                <textarea
                  placeholder="Add specific details for context..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-500">MAP TO PROJECT PHASE *</label>
                <select
                  required
                  value={taskPhase}
                  onChange={(e) => setTaskPhase(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none"
                >
                  <option value="">Choose Phase...</option>
                  {projectPhases.map(phs => (
                    <option key={phs.id} value={phs.id}>{phs.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500">ASSIGNEE *</label>
                  <select
                    required
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none"
                  >
                    <option value="">Assign Employee...</option>
                    {projectMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500">DUE DATE</label>
                  <input
                    type="date"
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-500 block mb-1">TASK PRIORITY</label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High', 'Urgent'] as TaskPriority[]).map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      onClick={() => setTaskPriority(prio)}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all border ${
                        taskPriority === prio 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddTaskForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
