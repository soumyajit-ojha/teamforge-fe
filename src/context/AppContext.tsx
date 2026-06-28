/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Project, Phase, Task, TaskComment, AuditLog, 
  DailyWorkItem, PunchOutReport, SystemRole, ProjectRole,
  ProjectStatus, PhaseStatus, TaskStatus, TaskPriority, ChecklistItem,
  SystemRolePermission
} from '../types';
import { mockUsers, mockProjects, mockPhases, mockTasks, mockComments, mockAuditLogs, companyEmployeePool } from '../mockData';

interface AppContextType {
  currentUser: User | null;
  systemUsers: User[];
  systemRoles: SystemRolePermission[];
  companyPool: User[];
  projects: Project[];
  phases: Phase[];
  tasks: Task[];
  comments: TaskComment[];
  auditLogs: AuditLog[];
  dailyWork: DailyWorkItem[];
  reports: PunchOutReport[];
  theme: 'light' | 'dark';
  currentTab: string;
  selectedProjectId: string | null;
  activeProjectTab: 'overview' | 'phases' | 'tasks' | 'members';
  
  // State Mutators
  setCurrentUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentTab: (tab: string) => void;
  setSelectedProjectId: (id: string | null) => void;
  setActiveProjectTab: (tab: 'overview' | 'phases' | 'tasks' | 'members') => void;
  
  // Business logic methods
  addProject: (name: string, description: string, startDate: string, endDate: string) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  archiveProject: (id: string) => void;
  assignProjectMember: (projectId: string, userId: string, projectRole: ProjectRole) => void;
  removeProjectMember: (projectId: string, userId: string) => void;
  
  addPhase: (projectId: string, name: string, startDate: string, endDate: string, milestoneName?: string, dependencyId?: string) => void;
  updatePhaseStatus: (id: string, status: PhaseStatus, progress: number) => void;
  
  addTask: (projectId: string, phaseId: string, title: string, description: string, assigneeId: string, priority: TaskPriority, dueDate: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  addTaskComment: (taskId: string, text: string) => void;
  
  addDailyWorkItem: (description: string, type: 'manual' | 'ad_hoc') => void;
  toggleDailyWorkItem: (id: string) => void;
  removeDailyWorkItem: (id: string) => void;
  submitPunchOut: (notes: string) => PunchOutReport;
  
  addAuditLog: (action: string, projectId: string, taskId?: string) => void;
  resetAllData: () => void;

  // Admin and Login System Methods
  addSystemUser: (user: Omit<User, 'id'>) => void;
  updateSystemUser: (id: string, updates: Partial<User>) => void;
  deleteSystemUser: (id: string) => void;
  addSystemRole: (role: SystemRolePermission) => void;
  updateSystemRole: (id: string, updates: Partial<SystemRolePermission>) => void;
  deleteSystemRole: (id: string) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from local storage or mock files
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem('tf_currentUser');
    if (saved === 'null') return null;
    return saved ? JSON.parse(saved) : null; // Force show login by default if nothing saved
  });

  const [systemUsers, setSystemUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tf_systemUsers');
    if (saved) return JSON.parse(saved);
    return mockUsers.map(u => ({ ...u, password: 'password' }));
  });

  const [systemRoles, setSystemRoles] = useState<SystemRolePermission[]>(() => {
    const saved = localStorage.getItem('tf_systemRoles');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'role-admin',
        name: 'Admin',
        description: 'Full platform administrator & access controls.',
        permissions: {
          canCreateProjects: true,
          canManagePhases: true,
          canManageTasks: true,
          canManageUsersAndRoles: true,
          canViewAnalytics: true
        }
      },
      {
        id: 'role-hr',
        name: 'HR',
        description: 'HR and Team operations supervisor.',
        permissions: {
          canCreateProjects: false,
          canManagePhases: false,
          canManageTasks: false,
          canManageUsersAndRoles: false,
          canViewAnalytics: true
        }
      },
      {
        id: 'role-employee',
        name: 'Employee',
        description: 'Standard product engineering contributor.',
        permissions: {
          canCreateProjects: false,
          canManagePhases: false,
          canManageTasks: true,
          canManageUsersAndRoles: false,
          canViewAnalytics: false
        }
      }
    ];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('tf_projects');
    return saved ? JSON.parse(saved) : mockProjects;
  });

  const [phases, setPhases] = useState<Phase[]>(() => {
    const saved = localStorage.getItem('tf_phases');
    return saved ? JSON.parse(saved) : mockPhases;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tf_tasks');
    return saved ? JSON.parse(saved) : mockTasks;
  });

  const [comments, setComments] = useState<TaskComment[]>(() => {
    const saved = localStorage.getItem('tf_comments');
    return saved ? JSON.parse(saved) : mockComments;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('tf_auditLogs');
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  const [dailyWork, setDailyWork] = useState<DailyWorkItem[]>(() => {
    const saved = localStorage.getItem('tf_dailyWork');
    if (saved) return JSON.parse(saved);
    
    // Default initial auto-gathered daily work items to look active on first boot
    return [
      { id: 'dw-1', type: 'task_update', description: 'Updated Kubernetes load balancer configuration and checked security rules', completed: true, taskId: 'tsk-2-2' },
      { id: 'dw-2', type: 'comment', description: 'Left technical feedback about responsiveness on Dialog Portal Drawer component', completed: true, taskId: 'tsk-1-2' },
      { id: 'dw-3', type: 'manual', description: 'Attended the TeamForge standard engineering standup and synced milestone boards', completed: true }
    ];
  });

  const [reports, setReports] = useState<PunchOutReport[]>(() => {
    const saved = localStorage.getItem('tf_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('tf_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState<'overview' | 'phases' | 'tasks' | 'members'>('overview');

  // Keep localStorage up to date
  useEffect(() => {
    localStorage.setItem('tf_currentUser', currentUser ? JSON.stringify(currentUser) : 'null');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tf_systemUsers', JSON.stringify(systemUsers));
  }, [systemUsers]);

  useEffect(() => {
    localStorage.setItem('tf_systemRoles', JSON.stringify(systemRoles));
  }, [systemRoles]);

  useEffect(() => {
    localStorage.setItem('tf_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tf_phases', JSON.stringify(phases));
  }, [phases]);

  useEffect(() => {
    localStorage.setItem('tf_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tf_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('tf_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('tf_dailyWork', JSON.stringify(dailyWork));
  }, [dailyWork]);

  useEffect(() => {
    localStorage.setItem('tf_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('tf_theme', theme);
    // Apply class for dark mode styling
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync state mutations
  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      addAuditLog(`User logged in / context switched: ${user.name} (${user.systemRole})`, 'global');
    }
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
  };

  // Helper helper to log actions
  const addAuditLog = (action: string, projectId: string, taskId?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      taskId,
      projectId,
      userId: currentUser?.id || 'system',
      userName: currentUser?.name || 'Unauthenticated User',
      action,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Automated Task Activity Gatherer for Daily Work Feed
  const autoGatherWorkItem = (description: string, taskId?: string, type: 'task_update' | 'status_change' | 'comment' = 'task_update') => {
    // Avoid double logging identical tasks in the active daily checklist
    const exists = dailyWork.some(item => item.description === description && item.completed);
    if (!exists) {
      const newItem: DailyWorkItem = {
        id: `dw-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type,
        description,
        completed: true,
        taskId
      };
      setDailyWork(prev => [newItem, ...prev]);
    }
  };

  // Admin custom creation system
  const addSystemUser = (newUserFields: Omit<User, 'id'>) => {
    const newId = `usr-${Date.now()}`;
    const newUser: User = {
      ...newUserFields,
      id: newId,
      password: newUserFields.password || 'password'
    };
    setSystemUsers(prev => [...prev, newUser]);
    addAuditLog(`Admin created system user context: ${newUser.name} (${newUser.systemRole})`, 'global');
  };

  const deleteSystemUser = (id: string) => {
    setSystemUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog(`Admin deleted user account index ID: ${id}`, 'global');
  };

  const updateSystemUser = (id: string, updates: Partial<User>) => {
    setSystemUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    addAuditLog(`Admin updated system user account: ${updates.name || id}`, 'global');
    if (currentUser && currentUser.id === id) {
      setCurrentUserState(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addSystemRole = (newRole: SystemRolePermission) => {
    setSystemRoles(prev => [...prev, newRole]);
    addAuditLog(`Admin registered new System Role: ${newRole.name}`, 'global');
  };

  const updateSystemRole = (id: string, updates: Partial<SystemRolePermission>) => {
    setSystemRoles(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    addAuditLog(`Admin updated system role configuration: ${updates.name || id}`, 'global');
  };

  const deleteSystemRole = (id: string) => {
    setSystemRoles(prev => prev.filter(r => r.id !== id));
    addAuditLog(`Admin deleted System Role ID: ${id}`, 'global');
  };

  const logoutUser = () => {
    if (currentUser) {
      addAuditLog(`User logged out: ${currentUser.name}`, 'global');
    }
    setCurrentUserState(null);
  };

  // PROJECTS crud
  const addProject = (name: string, description: string, startDate: string, endDate: string) => {
    const newId = `prj-${Date.now()}`;
    const newPrj: Project = {
      id: newId,
      name,
      description,
      status: 'In Progress',
      progress: 0,
      startDate,
      endDate,
      members: [
        { userId: currentUser.id, projectRole: 'Project Manager' }
      ]
    };
    setProjects(prev => [...prev, newPrj]);
    addAuditLog(`Created project "${name}"`, newId);
    
    // Create initial baseline phase automatically
    const defaultPhaseId = `phs-${Date.now()}-init`;
    const defaultPhase: Phase = {
      id: defaultPhaseId,
      projectId: newId,
      name: 'Phase 1: Kickoff & Scoping',
      startDate,
      endDate: new Date(new Date(startDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks out
      status: 'In Progress',
      progress: 10,
      milestoneName: 'Project Scope Defined'
    };
    setPhases(prev => [...prev, defaultPhase]);
    return newId;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        addAuditLog(`Updated project properties: ${Object.keys(updates).join(', ')}`, id);
        return { ...p, ...updates };
      }
      return p;
    }));
  };

  const archiveProject = (id: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        addAuditLog(`Archived project "${p.name}"`, id);
        return { ...p, status: 'Archived' as ProjectStatus };
      }
      return p;
    }));
  };

  const assignProjectMember = (projectId: string, userId: string, projectRole: ProjectRole) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const alreadyMember = p.members.some(m => m.userId === userId);
        const updatedMembers = alreadyMember 
          ? p.members.map(m => m.userId === userId ? { ...m, projectRole } : m)
          : [...p.members, { userId, projectRole }];
        
        const userObj = companyEmployeePool.find(u => u.id === userId);
        addAuditLog(`Assigned ${userObj?.name || userId} as project ${projectRole}`, projectId);
        return { ...p, members: updatedMembers };
      }
      return p;
    }));
  };

  const removeProjectMember = (projectId: string, userId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const userObj = companyEmployeePool.find(u => u.id === userId);
        addAuditLog(`Removed ${userObj?.name || userId} from project team`, projectId);
        return { ...p, members: p.members.filter(m => m.userId !== userId) };
      }
      return p;
    }));
  };

  // PHASES
  const addPhase = (projectId: string, name: string, startDate: string, endDate: string, milestoneName?: string, dependencyId?: string) => {
    const newPhase: Phase = {
      id: `phs-${Date.now()}`,
      projectId,
      name,
      startDate,
      endDate,
      milestoneName: milestoneName || undefined,
      dependencyPhaseId: dependencyId || undefined,
      status: 'Not Started',
      progress: 0
    };
    setPhases(prev => [...prev, newPhase]);
    addAuditLog(`Added project phase "${name}"`, projectId);
  };

  const updatePhaseStatus = (id: string, status: PhaseStatus, progress: number) => {
    setPhases(prev => prev.map(phs => {
      if (phs.id === id) {
        addAuditLog(`Updated Phase "${phs.name}" status to ${status} (${progress}%)`, phs.projectId);
        return { ...phs, status, progress };
      }
      return phs;
    }));
  };

  // TASKS
  const addTask = (projectId: string, phaseId: string, title: string, description: string, assigneeId: string, priority: TaskPriority, dueDate: string) => {
    const newId = `tsk-${Date.now()}`;
    const newTask: Task = {
      id: newId,
      projectId,
      phaseId,
      title,
      description,
      assigneeId,
      status: 'Todo',
      priority,
      dueDate,
      checklist: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: currentUser.name
    };
    setTasks(prev => [...prev, newTask]);
    addAuditLog(`Created task "${title}"`, projectId, newId);
    
    // Automatically auto-gather daily work
    autoGatherWorkItem(`Created new task: "${title}"`, newId, 'task_update');
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedTask = { 
          ...t, 
          ...updates, 
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: currentUser.name
        };
        
        // Log auditing & auto-gather work items
        if (updates.status && updates.status !== t.status) {
          addAuditLog(`Moved task "${t.title}" status from "${t.status}" to "${updates.status}"`, t.projectId, taskId);
          autoGatherWorkItem(`Updated task "${t.title}" status to [${updates.status}]`, taskId, 'status_change');
        } else {
          addAuditLog(`Updated task "${t.title}" properties`, t.projectId, taskId);
        }

        // recalculate overall project progress based on completed tasks
        setTimeout(() => {
          recalculateProjectProgress(t.projectId);
        }, 100);

        return updatedTask;
      }
      return t;
    }));
  };

  const deleteTask = (taskId: string) => {
    const taskObj = tasks.find(t => t.id === taskId);
    if (taskObj) {
      addAuditLog(`Deleted task "${taskObj.title}"`, taskObj.projectId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setComments(prev => prev.filter(c => c.taskId !== taskId));
    }
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const item = t.checklist.find(i => i.id === itemId);
        const actionStr = item ? (item.done ? 'uncompleted' : 'completed') : '';
        const updatedChecklist = t.checklist.map(i => i.id === itemId ? { ...i, done: !i.done } : i);
        
        addAuditLog(`Checklist item "${item?.text}" marked as ${actionStr}`, t.projectId, taskId);
        autoGatherWorkItem(`Checked off checklist item "${item?.text}" on task "${t.title}"`, taskId, 'task_update');

        return {
          ...t,
          checklist: updatedChecklist,
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: currentUser.name
        };
      }
      return t;
    }));
  };

  const addTaskComment = (taskId: string, text: string) => {
    const newComment: TaskComment = {
      id: `cmt-${Date.now()}`,
      taskId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
    
    const taskObj = tasks.find(t => t.id === taskId);
    if (taskObj) {
      addAuditLog(`Commented on task "${taskObj.title}": "${text.substring(0, 30)}..."`, taskObj.projectId, taskId);
      autoGatherWorkItem(`Left response/comment on: "${taskObj.title}"`, taskId, 'comment');
    }
  };

  const recalculateProjectProgress = (projId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        const projectTasks = tasks.filter(t => t.projectId === projId);
        if (projectTasks.length === 0) return p;
        const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
        const computedProgress = Math.round((completedTasks / projectTasks.length) * 100);
        return { ...p, progress: computedProgress };
      }
      return p;
    }));
  };

  // DAILY WORK Tracker list
  const addDailyWorkItem = (description: string, type: 'manual' | 'ad_hoc' = 'manual') => {
    const newItem: DailyWorkItem = {
      id: `dw-${Date.now()}`,
      type,
      description,
      completed: true
    };
    setDailyWork(prev => [newItem, ...prev]);
  };

  const toggleDailyWorkItem = (id: string) => {
    setDailyWork(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeDailyWorkItem = (id: string) => {
    setDailyWork(prev => prev.filter(item => item.id !== id));
  };

  const submitPunchOut = (notes: string) => {
    const activeCompletedItems = dailyWork
      .filter(item => item.completed)
      .map(item => item.description);
    
    const newReport: PunchOutReport = {
      id: `rep-${Date.now()}`,
      userId: currentUser.id,
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      workItems: activeCompletedItems.length > 0 ? activeCompletedItems : ['Continued standard operational tasks'],
      notes,
      punchOutTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      emailSent: true
    };

    setReports(prev => [newReport, ...prev]);
    // Clear the daily work items list that were processed (or keep them but reset completed)
    setDailyWork([]);
    addAuditLog(`Successfully PUNCHED OUT for the day and dispatched report`, 'global');
    return newReport;
  };

  const resetAllData = () => {
    localStorage.removeItem('tf_currentUser');
    localStorage.removeItem('tf_projects');
    localStorage.removeItem('tf_phases');
    localStorage.removeItem('tf_tasks');
    localStorage.removeItem('tf_comments');
    localStorage.removeItem('tf_auditLogs');
    localStorage.removeItem('tf_dailyWork');
    localStorage.removeItem('tf_reports');
    localStorage.removeItem('tf_systemUsers');
    localStorage.removeItem('tf_systemRoles');
    
    setCurrentUserState(null);
    setSystemUsers(mockUsers.map(u => ({ ...u, password: 'password' })));
    setSystemRoles([
      {
        id: 'role-admin',
        name: 'Admin',
        description: 'Full platform administrator & access controls.',
        permissions: {
          canCreateProjects: true,
          canManagePhases: true,
          canManageTasks: true,
          canManageUsersAndRoles: true,
          canViewAnalytics: true
        }
      },
      {
        id: 'role-hr',
        name: 'HR',
        description: 'HR and Team operations supervisor.',
        permissions: {
          canCreateProjects: false,
          canManagePhases: false,
          canManageTasks: false,
          canManageUsersAndRoles: false,
          canViewAnalytics: true
        }
      },
      {
        id: 'role-employee',
        name: 'Employee',
        description: 'Standard product engineering contributor.',
        permissions: {
          canCreateProjects: false,
          canManagePhases: false,
          canManageTasks: true,
          canManageUsersAndRoles: false,
          canViewAnalytics: false
        }
      }
    ]);
    setProjects(mockProjects);
    setPhases(mockPhases);
    setTasks(mockTasks);
    setComments(mockComments);
    setAuditLogs(mockAuditLogs);
    setDailyWork([
      { id: 'dw-1', type: 'task_update', description: 'Updated Kubernetes load balancer configuration and checked security rules', completed: true, taskId: 'tsk-2-2' },
      { id: 'dw-2', type: 'comment', description: 'Left technical feedback about responsiveness on Dialog Portal Drawer component', completed: true, taskId: 'tsk-1-2' },
      { id: 'dw-3', type: 'manual', description: 'Attended the TeamForge standard engineering standup and synced milestone boards', completed: true }
    ]);
    setReports([]);
    setThemeState('light');
    setCurrentTab('dashboard');
    setSelectedProjectId(null);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      systemUsers,
      systemRoles,
      companyPool: companyEmployeePool,
      projects,
      phases,
      tasks,
      comments,
      auditLogs,
      dailyWork,
      reports,
      theme,
      currentTab,
      selectedProjectId,
      activeProjectTab,
      
      setCurrentUser,
      setTheme,
      setCurrentTab,
      setSelectedProjectId,
      setActiveProjectTab,
      
      addProject,
      updateProject,
      archiveProject,
      assignProjectMember,
      removeProjectMember,
      
      addPhase,
      updatePhaseStatus,
      
      addTask,
      updateTask,
      deleteTask,
      toggleChecklistItem,
      addTaskComment,
      
      addDailyWorkItem,
      toggleDailyWorkItem,
      removeDailyWorkItem,
      submitPunchOut,
      
      addAuditLog,
      resetAllData,

      addSystemUser,
      updateSystemUser,
      deleteSystemUser,
      addSystemRole,
      updateSystemRole,
      deleteSystemRole,
      logoutUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
