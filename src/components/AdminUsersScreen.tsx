/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, ShieldCheck, Plus, Trash2, UserPlus, 
  Lock, Mail, Building, Check, Eye, EyeOff, 
  ShieldAlert, Edit2, Search, X, AlertTriangle, 
  Sparkles, CheckCircle, ChevronRight, HelpCircle
} from 'lucide-react';
import { SystemRolePermission, User } from '../types';

export const AdminUsersScreen: React.FC = () => {
  const { 
    systemUsers, 
    systemRoles, 
    currentUser, 
    addSystemUser, 
    updateSystemUser,
    deleteSystemUser, 
    addSystemRole, 
    updateSystemRole,
    deleteSystemRole 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  // ==========================================
  // USERS TAB STATE & LOGIC
  // ==========================================
  const [userSearch, setUserSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  // Add User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newUserDept, setNewUserDept] = useState('');
  const [newUserRole, setNewUserRole] = useState('Employee');
  const [newUserDesc, setNewUserDesc] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState('');
  const [userSuccessMsg, setUserSuccessMsg] = useState('');

  // Edit User Form State
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editUserDept, setEditUserDept] = useState('');
  const [editUserRole, setEditUserRole] = useState('');
  const [editUserDesc, setEditUserDesc] = useState('');
  const [editUserAvatar, setEditUserAvatar] = useState('');

  // Auto-select first matched user if selected user becomes invalid or on load
  const filteredUsers = systemUsers.filter(user => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.department.toLowerCase().includes(q) ||
      user.systemRole.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (filteredUsers.length > 0) {
      if (!selectedUserId || !filteredUsers.some(u => u.id === selectedUserId)) {
        setSelectedUserId(filteredUsers[0].id);
        setIsEditingUser(false);
      }
    } else {
      setSelectedUserId(null);
      setIsEditingUser(false);
    }
  }, [userSearch, systemUsers]);

  const selectedUser = systemUsers.find(u => u.id === selectedUserId) || null;

  // Initialize edit fields when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setEditUserName(selectedUser.name);
      setEditUserEmail(selectedUser.email);
      setEditUserPassword(selectedUser.password || 'password');
      setEditUserDept(selectedUser.department);
      setEditUserRole(selectedUser.systemRole);
      setEditUserDesc(selectedUser.roleDescription || '');
      setEditUserAvatar(selectedUser.avatar || '');
      setIsEditingUser(false);
    }
  }, [selectedUserId]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword || !newUserDept) return;

    // Default stock avatar if none provided
    const avatarToUse = newUserAvatar.trim() || `https://images.unsplash.com/photo-${[
      '1534528741775-53994a69daeb',
      '1507003211169-0a1dd7228f2d',
      '1500648767791-00dcc994a43e',
      '1494790108377-be9c29b29330',
      '1438761681033-6461ffad8d80',
      '1519085360753-af0119f7cbe7'
    ][Math.floor(Math.random() * 6)]}?auto=format&fit=crop&q=80&w=150`;

    addSystemUser({
      name: newUserName,
      email: newUserEmail.trim(),
      password: newUserPassword,
      department: newUserDept,
      systemRole: newUserRole,
      roleDescription: newUserDesc.trim() || `${newUserRole} in ${newUserDept} department.`,
      avatar: avatarToUse
    });

    setUserSuccessMsg(`User "${newUserName}" successfully registered.`);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserDept('');
    setNewUserDesc('');
    setNewUserAvatar('');
    setShowAddUserModal(false);
    setTimeout(() => setUserSuccessMsg(''), 4000);
  };

  const handleUpdateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !editUserName || !editUserEmail || !editUserDept || !editUserRole) return;

    updateSystemUser(selectedUserId, {
      name: editUserName,
      email: editUserEmail.trim(),
      password: editUserPassword,
      department: editUserDept,
      systemRole: editUserRole,
      roleDescription: editUserDesc.trim() || `${editUserRole} in ${editUserDept} department.`,
      avatar: editUserAvatar.trim() || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`
    });

    setIsEditingUser(false);
    setUserSuccessMsg(`User profile for "${editUserName}" updated successfully.`);
    setTimeout(() => setUserSuccessMsg(''), 4000);
  };

  // ==========================================
  // ROLES TAB STATE & LOGIC
  // ==========================================
  const [roleSearch, setRoleSearch] = useState('');
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isEditingRole, setIsEditingRole] = useState(false);

  // Add Role Form State
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newPermCreateProjects, setNewPermCreateProjects] = useState(false);
  const [newPermManagePhases, setNewPermManagePhases] = useState(false);
  const [newPermManageTasks, setNewPermManageTasks] = useState(true);
  const [newPermManageUsers, setNewPermManageUsers] = useState(false);
  const [newPermViewAnalytics, setNewPermViewAnalytics] = useState(false);
  const [roleSuccessMsg, setRoleSuccessMsg] = useState('');

  // Edit Role Form State
  const [editRoleName, setEditRoleName] = useState('');
  const [editRoleDesc, setEditRoleDesc] = useState('');
  const [editPermCreateProjects, setEditPermCreateProjects] = useState(false);
  const [editPermManagePhases, setEditPermManagePhases] = useState(false);
  const [editPermManageTasks, setEditPermManageTasks] = useState(false);
  const [editPermManageUsers, setEditPermManageUsers] = useState(false);
  const [editPermViewAnalytics, setEditPermViewAnalytics] = useState(false);

  const filteredRoles = systemRoles.filter(role => {
    const q = roleSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      role.name.toLowerCase().includes(q) ||
      role.description.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (filteredRoles.length > 0) {
      if (!selectedRoleId || !filteredRoles.some(r => r.id === selectedRoleId)) {
        setSelectedRoleId(filteredRoles[0].id);
        setIsEditingRole(false);
      }
    } else {
      setSelectedRoleId(null);
      setIsEditingRole(false);
    }
  }, [roleSearch, systemRoles]);

  const selectedRole = systemRoles.find(r => r.id === selectedRoleId) || null;

  // Initialize edit fields when selectedRole changes
  useEffect(() => {
    if (selectedRole) {
      setEditRoleName(selectedRole.name);
      setEditRoleDesc(selectedRole.description);
      setEditPermCreateProjects(selectedRole.permissions.canCreateProjects);
      setEditPermManagePhases(selectedRole.permissions.canManagePhases);
      setEditPermManageTasks(selectedRole.permissions.canManageTasks);
      setEditPermManageUsers(selectedRole.permissions.canManageUsersAndRoles);
      setEditPermViewAnalytics(selectedRole.permissions.canViewAnalytics);
      setIsEditingRole(false);
    }
  }, [selectedRoleId]);

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;

    const newId = `role-${newRoleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
    const newRoleObj: SystemRolePermission = {
      id: newId,
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || `Custom system role for ${newRoleName}.`,
      permissions: {
        canCreateProjects: newPermCreateProjects,
        canManagePhases: newPermManagePhases,
        canManageTasks: newPermManageTasks,
        canManageUsersAndRoles: newPermManageUsers,
        canViewAnalytics: newPermViewAnalytics
      }
    };

    addSystemRole(newRoleObj);
    setRoleSuccessMsg(`System Role "${newRoleName}" successfully configured.`);
    setNewRoleName('');
    setNewRoleDesc('');
    setNewPermCreateProjects(false);
    setNewPermManagePhases(false);
    setNewPermManageTasks(true);
    setNewPermManageUsers(false);
    setNewPermViewAnalytics(false);
    setShowAddRoleModal(false);
    setTimeout(() => setRoleSuccessMsg(''), 4000);
  };

  const handleUpdateRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId || !editRoleName) return;

    updateSystemRole(selectedRoleId, {
      name: editRoleName,
      description: editRoleDesc,
      permissions: {
        canCreateProjects: editPermCreateProjects,
        canManagePhases: editPermManagePhases,
        canManageTasks: editPermManageTasks,
        canManageUsersAndRoles: editPermManageUsers,
        canViewAnalytics: editPermViewAnalytics
      }
    });

    setIsEditingRole(false);
    setRoleSuccessMsg(`Role "${editRoleName}" configuration has been updated successfully.`);
    setTimeout(() => setRoleSuccessMsg(''), 4000);
  };

  const isBaseRole = (roleNameStr: string) => {
    return ['Admin', 'HR', 'Employee'].includes(roleNameStr);
  };

  return (
    <div id="admin-users-roles" className="h-full flex flex-col space-y-6 overflow-hidden pb-6 pr-1">
      {/* Upper Navigation / Segmented tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 dark:border-zinc-800 pb-5 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>System Administration</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Configure system accounts, map operational groups, and provision custom access permission matrices.
          </p>
        </div>

        {/* Segmented Controller */}
        <div className="flex p-0.5 bg-slate-100 dark:bg-zinc-950 rounded-xl border border-slate-200/40 dark:border-zinc-800/80 w-fit shrink-0 shadow-inner">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'users'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Users ({systemUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'roles'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Roles & Permissions ({systemRoles.length})</span>
          </button>
        </div>
      </div>

      {/* Global Toast Messages */}
      {(userSuccessMsg || roleSuccessMsg) && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium flex items-center gap-2 shadow-sm shrink-0">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{userSuccessMsg || roleSuccessMsg}</span>
        </div>
      )}

      {/* ==========================================
          TAB 1: USERS WORKSPACE
          ========================================== */}
      {activeTab === 'users' ? (
        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* USER TOOLBAR */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-150 dark:border-zinc-800/60 shadow-xs shrink-0">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search users by name, email, department or role..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/70 dark:border-zinc-800/80 rounded-xl py-2 pl-9 pr-8 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              {userSearch && (
                <button 
                  onClick={() => setUserSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Create Trigger */}
            <button
              onClick={() => setShowAddUserModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add System User</span>
            </button>
          </div>

          {/* MAIN TWO-COLUMN MASTER-DETAIL SPLIT */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
            {/* LEFT COLUMN: ACTIVE USERS LIST (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800/70 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-zinc-850 shrink-0">
                <h3 className="font-sans font-bold text-xs text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Active Users ({filteredUsers.length})
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => {
                    const isSelected = selectedUserId === user.id;
                    const isSelf = currentUser?.id === user.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setIsEditingUser(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-blue-50/75 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/60'
                            : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200/50 dark:bg-zinc-950 dark:hover:bg-zinc-900/60 dark:border-zinc-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-zinc-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {user.name}
                              </span>
                              {isSelf && (
                                <span className="px-1 py-0.5 text-[8px] font-mono font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded">
                                  Me
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate leading-tight mt-0.5 font-mono">
                              {user.email}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 truncate">
                              <span className="font-medium">{user.department}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                          <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold bg-slate-200/75 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded uppercase">
                            {user.systemRole}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-12 px-4 space-y-2">
                    <Users className="w-8 h-8 text-slate-300 dark:text-zinc-700 mx-auto" />
                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">No users match your query</p>
                    <p className="text-[10px] text-slate-400">Try adjusting your filters or search keywords.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: USER DETAIL & EDIT VIEWS (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800/70 rounded-2xl shadow-xs overflow-hidden flex flex-col">
              {selectedUser ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* DETAIL / EDIT HEADER */}
                  <div className="p-4 border-b border-slate-100 dark:border-zinc-850 flex items-center justify-between shrink-0 bg-slate-50/55 dark:bg-zinc-950/35">
                    <h3 className="font-sans font-bold text-xs text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                      {isEditingUser ? 'Edit System Account' : 'User Security Credentials'}
                    </h3>
                    <div className="flex items-center gap-2">
                      {!isEditingUser ? (
                        <>
                          <button
                            onClick={() => setIsEditingUser(true)}
                            className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-250 text-[11px] font-semibold rounded-lg transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit Account</span>
                          </button>

                          {currentUser?.id !== selectedUser.id ? (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to permanently delete user account: ${selectedUser.name}? This removes their active platform session.`)) {
                                  deleteSystemUser(selectedUser.id);
                                  setSelectedUserId(null);
                                }
                              }}
                              className="flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[11px] font-semibold rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          ) : (
                            <span className="text-[9px] font-mono text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded-md font-semibold">
                              Protected (Active User)
                            </span>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditingUser(false)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-250 text-[11px] font-semibold rounded-lg transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* DETAIL / EDIT SCROLLABLE AREA */}
                  <div className="flex-1 overflow-y-auto p-5">
                    {!isEditingUser ? (
                      /* PROFILE DETAILS SCREEN */
                      <div className="space-y-6">
                        {/* Avatar block */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-100 dark:border-zinc-850 pb-5">
                          <img
                            src={selectedUser.avatar}
                            alt={selectedUser.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 dark:border-zinc-800 shadow-md"
                          />
                          <div className="text-center sm:text-left space-y-1">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                              {selectedUser.name}
                            </h2>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold tracking-wider uppercase">
                              {selectedUser.systemRole}
                            </p>
                            <span className="inline-block px-2 py-0.5 text-[9px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-100 dark:border-emerald-900/10 uppercase">
                              Platform Active
                            </span>
                          </div>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl space-y-1">
                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">EMAIL ADDRESS</span>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-zinc-200">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{selectedUser.email}</span>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl space-y-1">
                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">ORGANIZATIONAL DEPARTMENT</span>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-zinc-200">
                              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{selectedUser.department}</span>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl space-y-1">
                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">USER PASSWORD HASH</span>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-zinc-200">
                              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-mono">{selectedUser.password || 'password'}</span>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl space-y-1">
                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">DATABASE INDEX KEY</span>
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 dark:text-zinc-400">
                              <span>{selectedUser.id}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bio / Bio block */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">ROLE SUMMARY & RESPONSIBILITIES</span>
                          <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                            {selectedUser.roleDescription || `${selectedUser.name} is configured as a ${selectedUser.systemRole} in the ${selectedUser.department} department.`}
                          </div>
                        </div>

                        {/* Check capabilities block based on mapped role */}
                        <div className="space-y-2 border-t border-slate-100 dark:border-zinc-850 pt-4">
                          <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">MAPPED SYSTEM CAPABILITIES</span>
                          
                          {(() => {
                            const matchedRole = systemRoles.find(r => r.name.toLowerCase() === selectedUser.systemRole.toLowerCase());
                            if (!matchedRole) return <p className="text-[11px] text-slate-400">No capabilities mapped for this custom role name.</p>;
                            
                            return (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {matchedRole.permissions.canCreateProjects ? (
                                  <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold rounded-lg flex items-center gap-1 border border-indigo-100/30">
                                    <Check className="w-3 h-3" /> Project Creator
                                  </span>
                                ) : null}
                                {matchedRole.permissions.canManagePhases ? (
                                  <span className="px-2 py-1 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 text-[10px] font-semibold rounded-lg flex items-center gap-1 border border-sky-100/30">
                                    <Check className="w-3 h-3" /> Timeline Manager
                                  </span>
                                ) : null}
                                {matchedRole.permissions.canManageTasks ? (
                                  <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold rounded-lg flex items-center gap-1 border border-emerald-100/30">
                                    <Check className="w-3 h-3" /> Task Manager
                                  </span>
                                ) : null}
                                {matchedRole.permissions.canManageUsersAndRoles ? (
                                  <span className="px-2 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-[10px] font-semibold rounded-lg flex items-center gap-1 border border-amber-100/30">
                                    <Check className="w-3 h-3" /> Administrative Powers
                                  </span>
                                ) : null}
                                {matchedRole.permissions.canViewAnalytics ? (
                                  <span className="px-2 py-1 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 text-[10px] font-semibold rounded-lg flex items-center gap-1 border border-teal-100/30">
                                    <Check className="w-3 h-3" /> Analytics Auditor
                                  </span>
                                ) : null}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      /* EDIT USER PROFILE FORM */
                      <form onSubmit={handleUpdateUserSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Name */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">FULL NAME *</label>
                            <input
                              type="text"
                              required
                              value={editUserName}
                              onChange={e => setEditUserName(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Email */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">EMAIL ADDRESS *</label>
                            <input
                              type="email"
                              required
                              value={editUserEmail}
                              onChange={e => setEditUserEmail(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Password */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">SYSTEM PASSWORD *</label>
                            <div className="relative">
                              <input
                                type={showEditPassword ? 'text' : 'password'}
                                required
                                value={editUserPassword}
                                onChange={e => setEditUserPassword(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl pl-3 pr-10 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowEditPassword(!showEditPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                              >
                                {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Department */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">DEPARTMENT *</label>
                            <input
                              type="text"
                              required
                              value={editUserDept}
                              onChange={e => setEditUserDept(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Role Selection */}
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">SYSTEM PRIVILEGE ROLE *</label>
                            <select
                              value={editUserRole}
                              onChange={e => setEditUserRole(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                            >
                              {systemRoles.map(role => (
                                <option key={role.id} value={role.name}>{role.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* Avatar Url */}
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">PROFILE IMAGE URL (HTTPS)</label>
                            <input
                              type="url"
                              value={editUserAvatar}
                              onChange={e => setEditUserAvatar(e.target.value)}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Bio */}
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">ROLE SUMMARY & RESPONSIBILITIES</label>
                            <textarea
                              rows={3}
                              value={editUserDesc}
                              onChange={e => setEditUserDesc(e.target.value)}
                              placeholder="List key team deliverables..."
                              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors mt-3"
                        >
                          Save Account Credentials
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-800/80 rounded-2xl">
                    <Users className="w-8 h-8 text-slate-400 dark:text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">No Selected User</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                      Choose an active system user from the directory sidebar panel to review credentials, customize configurations, or delete accounts.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ==========================================
            TAB 2: ROLES WORKSPACE
            ========================================== */
        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* ROLE TOOLBAR */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-150 dark:border-zinc-800/60 shadow-xs shrink-0">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search system roles by name, capabilities or keyword..."
                value={roleSearch}
                onChange={e => setRoleSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/70 dark:border-zinc-800/80 rounded-xl py-2 pl-9 pr-8 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              {roleSearch && (
                <button 
                  onClick={() => setRoleSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Create Trigger */}
            <button
              onClick={() => setShowAddRoleModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Model System Role</span>
            </button>
          </div>

          {/* TWO-COLUMN SPLIT */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
            {/* LEFT COLUMN: ROLES LIST */}
            <div className="lg:col-span-5 flex flex-col bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800/70 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-zinc-850 shrink-0">
                <h3 className="font-sans font-bold text-xs text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Configured Roles ({filteredRoles.length})
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredRoles.length > 0 ? (
                  filteredRoles.map(role => {
                    const isSelected = selectedRoleId === role.id;
                    const isBase = isBaseRole(role.name);
                    return (
                      <button
                        key={role.id}
                        onClick={() => {
                          setSelectedRoleId(role.id);
                          setIsEditingRole(false);
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all space-y-2 ${
                          isSelected
                            ? 'bg-indigo-50/75 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/60'
                            : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200/50 dark:bg-zinc-950 dark:hover:bg-zinc-900/60 dark:border-zinc-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                            <span>{role.name}</span>
                          </h4>
                          {isBase && (
                            <span className="px-1.5 py-0.5 text-[8px] font-semibold bg-slate-200/85 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 rounded shrink-0">
                              System Base
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {role.description}
                        </p>

                        {/* Privileges summary dots/pills */}
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(role.permissions).filter(([_, val]) => !!val).map(([key]) => (
                            <span key={key} className="text-[7.5px] px-1 py-0.2 bg-indigo-100/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded font-mono font-bold uppercase">
                              {key.replace('can', '').replace('AndRoles', '')}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-12 px-4 space-y-2">
                    <ShieldCheck className="w-8 h-8 text-slate-300 dark:text-zinc-700 mx-auto" />
                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">No matching system roles</p>
                    <p className="text-[10px] text-slate-400">Refine your search or create a custom role card.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ROLE PROFILE DETAIL / EDIT FORMS */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800/70 rounded-2xl shadow-xs overflow-hidden flex flex-col">
              {selectedRole ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* HEADER */}
                  <div className="p-4 border-b border-slate-100 dark:border-zinc-850 flex items-center justify-between shrink-0 bg-slate-50/55 dark:bg-zinc-950/35">
                    <h3 className="font-sans font-bold text-xs text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                      {isEditingRole ? 'Configure Permissions Matrix' : 'System Role Scope Definitions'}
                    </h3>
                    <div className="flex items-center gap-2">
                      {!isEditingRole ? (
                        <>
                          <button
                            onClick={() => setIsEditingRole(true)}
                            className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-250 text-[11px] font-semibold rounded-lg transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit Scope</span>
                          </button>

                          {!isBaseRole(selectedRole.name) ? (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to permanently delete custom system role: "${selectedRole.name}"? Active users mapped to this role may lose operational permissions.`)) {
                                  deleteSystemRole(selectedRole.id);
                                  setSelectedRoleId(null);
                                }
                              }}
                              className="flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[11px] font-semibold rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Role</span>
                            </button>
                          ) : (
                            <span className="text-[9px] font-mono text-slate-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md font-medium">
                              Locked System Base
                            </span>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditingRole(false)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-250 text-[11px] font-semibold rounded-lg transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SCROLLABLE CONTENT AREA */}
                  <div className="flex-1 overflow-y-auto p-5">
                    {!isEditingRole ? (
                      /* VIEW ROLE DETAILS */
                      <div className="space-y-6">
                        {/* Title block */}
                        <div className="space-y-1.5 border-b border-slate-100 dark:border-zinc-850 pb-4">
                          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>{selectedRole.name} Role Matrix</span>
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">
                            {selectedRole.description}
                          </p>
                        </div>

                        {/* Visual capability checklists */}
                        <div className="space-y-3">
                          <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">ENTERPRISE FUNCTIONAL PRIVILEGES</span>
                          
                          <div className="space-y-2.5">
                            {/* Project Creation */}
                            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                              selectedRole.permissions.canCreateProjects 
                                ? 'bg-indigo-50/30 border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-900/30' 
                                : 'bg-slate-50/50 border-slate-100 dark:bg-zinc-950/20 dark:border-zinc-850/30 opacity-70'
                            }`}>
                              <span className={`p-1 rounded-md mt-0.5 shrink-0 ${
                                selectedRole.permissions.canCreateProjects
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-slate-200 text-slate-400 dark:bg-zinc-850'
                              }`}>
                                <Check className="w-3.5 h-3.5" />
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Create Workspaces & Projects</h4>
                                <p className="text-[10px] text-slate-400 dark:text-zinc-500">Allows initiating brand new enterprise projects, adding milestones, and configuring project metadata variables.</p>
                              </div>
                            </div>

                            {/* Phase Management */}
                            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                              selectedRole.permissions.canManagePhases 
                                ? 'bg-indigo-50/30 border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-900/30' 
                                : 'bg-slate-50/50 border-slate-100 dark:bg-zinc-950/20 dark:border-zinc-850/30 opacity-70'
                            }`}>
                              <span className={`p-1 rounded-md mt-0.5 shrink-0 ${
                                selectedRole.permissions.canManagePhases
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-slate-200 text-slate-400 dark:bg-zinc-850'
                              }`}>
                                <Check className="w-3.5 h-3.5" />
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Manage Timeline Milestones</h4>
                                <p className="text-[10px] text-slate-400 dark:text-zinc-500">Grants administrative oversight to configure Gantt deadlines, schedule design reviews, or archive inactive phases.</p>
                              </div>
                            </div>

                            {/* Task Management */}
                            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                              selectedRole.permissions.canManageTasks 
                                ? 'bg-indigo-50/30 border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-900/30' 
                                : 'bg-slate-50/50 border-slate-100 dark:bg-zinc-950/20 dark:border-zinc-850/30 opacity-70'
                            }`}>
                              <span className={`p-1 rounded-md mt-0.5 shrink-0 ${
                                selectedRole.permissions.canManageTasks
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-slate-200 text-slate-400 dark:bg-zinc-850'
                              }`}>
                                <Check className="w-3.5 h-3.5" />
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Manage Task Logs & Boards</h4>
                                <p className="text-[10px] text-slate-400 dark:text-zinc-500">Grants permission to assign, review, modify checklists, and comment on task-items across interactive boards.</p>
                              </div>
                            </div>

                            {/* Administrative control */}
                            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                              selectedRole.permissions.canManageUsersAndRoles 
                                ? 'bg-indigo-50/30 border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-900/30' 
                                : 'bg-slate-50/50 border-slate-100 dark:bg-zinc-950/20 dark:border-zinc-850/30 opacity-70'
                            }`}>
                              <span className={`p-1 rounded-md mt-0.5 shrink-0 ${
                                selectedRole.permissions.canManageUsersAndRoles
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-slate-200 text-slate-400 dark:bg-zinc-850'
                              }`}>
                                <Check className="w-3.5 h-3.5" />
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">System Security & User Registration</h4>
                                <p className="text-[10px] text-slate-400 dark:text-zinc-500">Grants administrative access to user directories, security password audits, and configuration of role matrices.</p>
                              </div>
                            </div>

                            {/* View analytics */}
                            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                              selectedRole.permissions.canViewAnalytics 
                                ? 'bg-indigo-50/30 border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-900/30' 
                                : 'bg-slate-50/50 border-slate-100 dark:bg-zinc-950/20 dark:border-zinc-850/30 opacity-70'
                            }`}>
                              <span className={`p-1 rounded-md mt-0.5 shrink-0 ${
                                selectedRole.permissions.canViewAnalytics
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-slate-200 text-slate-400 dark:bg-zinc-850'
                              }`}>
                                <Check className="w-3.5 h-3.5" />
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">View Productivity Analytics & Financials</h4>
                                <p className="text-[10px] text-slate-400 dark:text-zinc-500">Grants privilege to inspect enterprise performance, read productivity graphs, and query daily work registers.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* EDIT ROLE CONFIGURATION */
                      <form onSubmit={handleUpdateRoleSubmit} className="space-y-5">
                        <div className="space-y-3">
                          {/* Role Title Name */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">ROLE TITLE NAME *</label>
                            <input
                              type="text"
                              required
                              disabled={isBaseRole(selectedRole.name)}
                              value={editRoleName}
                              onChange={e => setEditRoleName(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            {isBaseRole(selectedRole.name) && (
                              <p className="text-[9px] text-amber-600 font-mono">System base role names cannot be renamed to protect routing tables.</p>
                            )}
                          </div>

                          {/* Role Description */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">ROLE DESCRIPTION</label>
                            <textarea
                              rows={3}
                              value={editRoleDesc}
                              onChange={e => setEditRoleDesc(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                            />
                          </div>

                          {/* Permissions Checkboxes */}
                          <div className="space-y-2 border-t border-slate-100 dark:border-zinc-850 pt-3">
                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-2">CONFIGURE PRIVILEGE TOKENS</span>

                            {/* canCreateProjects */}
                            <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/30 dark:border-zinc-800/40 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={editPermCreateProjects}
                                onChange={e => setEditPermCreateProjects(e.target.checked)}
                                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                              />
                              <div>
                                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Create Projects</p>
                                <p className="text-[9px] text-slate-400">Can initiate new company-wide workspaces & kickoff defaults.</p>
                              </div>
                            </label>

                            {/* canManagePhases */}
                            <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/30 dark:border-zinc-800/40 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={editPermManagePhases}
                                onChange={e => setEditPermManagePhases(e.target.checked)}
                                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                              />
                              <div>
                                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Manage Phase Timelines</p>
                                <p className="text-[9px] text-slate-400">Can create project timeline milestones and schedule reviews.</p>
                              </div>
                            </label>

                            {/* canManageTasks */}
                            <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/30 dark:border-zinc-800/40 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={editPermManageTasks}
                                onChange={e => setEditPermManageTasks(e.target.checked)}
                                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                              />
                              <div>
                                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Manage Task Logs</p>
                                <p className="text-[9px] text-slate-400">Can assign, update, and resolve work-items across boards.</p>
                              </div>
                            </label>

                            {/* canManageUsersAndRoles */}
                            <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/30 dark:border-zinc-800/40 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={editPermManageUsers}
                                onChange={e => setEditPermManageUsers(e.target.checked)}
                                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                              />
                              <div>
                                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Administrative Powers</p>
                                <p className="text-[9px] text-slate-400">Can access system administration panel, create users, modify roles.</p>
                              </div>
                            </label>

                            {/* canViewAnalytics */}
                            <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/30 dark:border-zinc-800/40 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={editPermViewAnalytics}
                                onChange={e => setEditPermViewAnalytics(e.target.checked)}
                                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                              />
                              <div>
                                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Access Analytics & Reports</p>
                                <p className="text-[9px] text-slate-400">Can inspect company financial dashboards and daily audit logs.</p>
                              </div>
                            </label>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors mt-3"
                        >
                          Save Role Configuration
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-800/80 rounded-2xl">
                    <ShieldCheck className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">No Selected Role</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                      Pick a customized system role template from the sidebar to modify security privileges, alter credentials, or delete configurations.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL A: REGISTER NEW SYSTEM USER
          ========================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all duration-150 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
                    Register New System User
                  </h3>
                  <p className="text-[10px] text-slate-400">Configure new operational security credentials</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-805 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Cooper"
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan.c@teamforge.com"
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">PASSWORD *</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Set credentials password"
                      value={newUserPassword}
                      onChange={e => setNewUserPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl pl-3 pr-10 py-2 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">DEPARTMENT *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Core Product Team"
                    value={newUserDept}
                    onChange={e => setNewUserDept(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* System Role */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">SYSTEM ROLE *</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    {systemRoles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>

                {/* Avatar URL */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">AVATAR IMAGE URL (OPTIONAL)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or blank for random"
                    value={newUserAvatar}
                    onChange={e => setNewUserAvatar(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">ROLE SUMMARY & BIO</label>
                  <textarea
                    placeholder="Describe their daily team activities..."
                    value={newUserDesc}
                    onChange={e => setNewUserDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 rounded-xl hover:bg-slate-200 hover:text-slate-750 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm transition-colors"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL B: CONFIGURING SYSTEM ROLE
          ========================================== */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all duration-150 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
                    Model Custom System Role
                  </h3>
                  <p className="text-[10px] text-slate-400">Map security permission limits</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddRoleModal(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-805 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div className="space-y-3">
                {/* Role Title Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">ROLE TITLE NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Design Lead"
                    value={newRoleName}
                    onChange={e => setNewRoleName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Role Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">ROLE DESCRIPTION</label>
                  <textarea
                    placeholder="Brief definition of custom activities..."
                    value={newRoleDesc}
                    onChange={e => setNewRoleDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Permissions Checkboxes */}
                <div className="space-y-2 border-t border-slate-100 dark:border-zinc-800 pt-3">
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                    ASSIGN PRIVILEGE CREDENTIALS
                  </span>

                  {/* canCreateProjects */}
                  <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/30 dark:border-zinc-800/40 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newPermCreateProjects}
                      onChange={e => setNewPermCreateProjects(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Create Projects</p>
                      <p className="text-[9px] text-slate-400">Can initiate new company-wide workspaces & kickoff defaults.</p>
                    </div>
                  </label>

                  {/* canManagePhases */}
                  <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/30 dark:border-zinc-800/40 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newPermManagePhases}
                      onChange={e => setNewPermManagePhases(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Manage Phase Timelines</p>
                      <p className="text-[9px] text-slate-400">Can create project timeline milestones and schedule reviews.</p>
                    </div>
                  </label>

                  {/* canManageTasks */}
                  <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/30 dark:border-zinc-800/40 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newPermManageTasks}
                      onChange={e => setNewPermManageTasks(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Manage Task Logs</p>
                      <p className="text-[9px] text-slate-400">Can assign, update, and resolve work-items across boards.</p>
                    </div>
                  </label>

                  {/* canManageUsersAndRoles */}
                  <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/30 dark:border-zinc-800/40 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newPermManageUsers}
                      onChange={e => setNewPermManageUsers(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Administrative Powers</p>
                      <p className="text-[9px] text-slate-400">Can access system administration panel, create users, modify roles.</p>
                    </div>
                  </label>

                  {/* canViewAnalytics */}
                  <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/30 dark:border-zinc-800/40 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newPermViewAnalytics}
                      onChange={e => setNewPermViewAnalytics(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Access Analytics & Reports</p>
                      <p className="text-[9px] text-slate-400">Can inspect company financial dashboards and daily audit logs.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 rounded-xl hover:bg-slate-200 hover:text-slate-750 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-colors"
                >
                  Model Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
