/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project, ProjectStatus } from '../types';
import { 
  Search, 
  Plus, 
  Calendar, 
  Users, 
  ArrowRight, 
  Briefcase, 
  Filter, 
  ShieldAlert,
  FolderArchive,
  MoreVertical,
  Archive,
  LayoutGrid,
  Sparkles
} from 'lucide-react';

export const ProjectsScreen: React.FC = () => {
  const { 
    projects, 
    tasks, 
    currentUser, 
    addProject, 
    archiveProject, 
    setSelectedProjectId,
    setCurrentTab,
    setActiveProjectTab,
    companyPool
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Create Project state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPrjName, setNewPrjName] = useState('');
  const [newPrjDesc, setNewPrjDesc] = useState('');
  const [newPrjStart, setNewPrjStart] = useState('');
  const [newPrjEnd, setNewPrjEnd] = useState('');

  // Check permissions (Admin & HR can create projects, PM can edit them)
  const canCreateProject = currentUser.systemRole === 'Admin' || currentUser.systemRole === 'HR';

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrjName || !newPrjStart || !newPrjEnd) return;
    
    const newId = addProject(newPrjName, newPrjDesc, newPrjStart, newPrjEnd);
    
    // reset form
    setNewPrjName('');
    setNewPrjDesc('');
    setNewPrjStart('');
    setNewPrjEnd('');
    setShowCreateModal(false);

    // Navigate to the newly created project detail view
    setSelectedProjectId(newId);
    setActiveProjectTab('overview');
  };

  const statusBadges: Record<ProjectStatus, string> = {
    'In Progress': 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-100 dark:border-blue-900',
    'On Hold': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100 dark:border-amber-900',
    'Completed': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900',
    'Archived': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
            Company Projects
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View high-level roadmaps, milestones, phases, and active contributors.
          </p>
        </div>

        {/* Create Button with permission awareness */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Create Project
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by name, keyword or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-850">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 focus:outline-none font-medium"
            >
              <option value="all">All Project Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">No projects found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No initiatives match your search term or chosen status filters. Try adjusting them.
            </p>
          </div>
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Clear Search & Filters
          </button>
        </div>
      )}

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          // Calculate tasks for this project
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
          
          return (
            <div 
              key={project.id} 
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Card top elements */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${statusBadges[project.status]}`}>
                    {project.status}
                  </span>
                  
                  {project.status !== 'Archived' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Archive project "${project.name}"?`)) {
                          archiveProject(project.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                      title="Archive Project"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Progress & Meta details */}
              <div className="mt-5 space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 dark:text-slate-400">COMPLETION STATUS</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Team Avatars + Task details */}
                <div className="flex items-center justify-between">
                  {/* Task ratio count */}
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {completedTasks}/{projectTasks.length} Tasks
                  </div>

                  {/* Avatars */}
                  <div className="flex -space-x-2 overflow-hidden">
                    {project.members.slice(0, 4).map((member) => {
                      const userObj = companyPool.find(u => u.id === member.userId);
                      return (
                        <img
                          key={member.userId}
                          src={userObj?.avatar}
                          alt={userObj?.name}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                          title={`${userObj?.name} (${member.projectRole})`}
                        />
                      );
                    })}
                    {project.members.length > 4 && (
                      <span className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                        +{project.members.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Open detail view trigger */}
                <button
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveProjectTab('overview');
                  }}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-transparent hover:border-indigo-100 dark:hover:border-indigo-950 transition-all cursor-pointer"
                >
                  View Workspace Detail
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="font-sans font-bold text-slate-900 dark:text-slate-100">Create New Project</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-5 space-y-4">
              {/* Permission pill */}
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl text-xs text-indigo-800 dark:text-indigo-300 flex items-center gap-2 border border-indigo-100 dark:border-indigo-900/40">
                <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>You are starting this project as the lead **Project Manager** role.</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 block">PROJECT NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Apollo Web Platform"
                  value={newPrjName}
                  onChange={(e) => setNewPrjName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 block">DESCRIPTION</label>
                <textarea
                  placeholder="Briefly describe what this project achieves..."
                  value={newPrjDesc}
                  onChange={(e) => setNewPrjDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 block">START DATE *</label>
                  <input
                    type="date"
                    required
                    value={newPrjStart}
                    onChange={(e) => setNewPrjStart(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 block">END DATE *</label>
                  <input
                    type="date"
                    required
                    value={newPrjEnd}
                    onChange={(e) => setNewPrjEnd(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                >
                  Create & Initialize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
