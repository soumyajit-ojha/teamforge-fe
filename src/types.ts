/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SystemRole = 'Admin' | 'HR' | 'Employee' | string;
export type ProjectRole = 'Project Manager' | 'Task Maker' | 'Contributor' | 'Viewer';

export interface SystemRolePermission {
  id: string;
  name: string;
  description: string;
  permissions: {
    canCreateProjects: boolean;
    canManagePhases: boolean;
    canManageTasks: boolean;
    canManageUsersAndRoles: boolean;
    canViewAnalytics: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  systemRole: SystemRole;
  department: string;
  roleDescription?: string;
  password?: string;
}

export type ProjectStatus = 'In Progress' | 'On Hold' | 'Completed' | 'Archived';

export interface ProjectMember {
  userId: string;
  projectRole: ProjectRole;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number; // 0 to 100
  members: ProjectMember[];
  startDate: string;
  endDate: string;
}

export type PhaseStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface Phase {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  dependencyPhaseId?: string; // Links to another phase in same project
  status: PhaseStatus;
  progress: number; // 0 to 100
  milestoneName?: string;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  url?: string;
}

export interface Task {
  id: string;
  projectId: string;
  phaseId: string;
  title: string;
  description: string;
  assigneeId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  checklist: ChecklistItem[];
  attachments: TaskAttachment[];
  createdAt: string;
  lastUpdated: string;
  lastUpdatedBy: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  taskId?: string;
  projectId: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}

export type DailyWorkItemType = 'task_update' | 'status_change' | 'comment' | 'ad_hoc' | 'manual';

export interface DailyWorkItem {
  id: string;
  type: DailyWorkItemType;
  description: string;
  completed: boolean;
  taskId?: string; // if associated
}

export interface PunchOutReport {
  id: string;
  userId: string;
  date: string;
  workItems: string[];
  notes: string;
  punchOutTime: string;
  emailSent: boolean;
}
