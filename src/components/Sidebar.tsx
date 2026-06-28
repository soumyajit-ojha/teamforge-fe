/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon,
  Users,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    systemUsers, 
    setCurrentUser, 
    theme, 
    setTheme, 
    currentTab, 
    setCurrentTab,
    setSelectedProjectId,
    resetAllData,
    logoutUser
  } = useApp();

  const [collapsed, setCollapsed] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);

  const baseNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'daily', label: 'Daily Work', icon: FileText, highlight: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isAdmin = currentUser?.systemRole === 'Admin';
  const navItems = isAdmin 
    ? [
        ...baseNavItems.slice(0, 5), 
        { id: 'admin_users', label: 'Admin Panel', icon: ShieldAlert },
        ...baseNavItems.slice(5)
      ]
    : baseNavItems;

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (tabId !== 'projects') {
      setSelectedProjectId(null); // clear detail state
    }
  };

  return (
    <aside 
      className={`relative h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-indigo-100 dark:shadow-none">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-sans font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              TeamForge
            </span>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Info Bar */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} bg-slate-50 dark:bg-slate-950 p-2 rounded-xl`}>
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
            alt={currentUser?.name || 'User'} 
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-zinc-800 object-cover"
          />
          {!collapsed && (
            <div className="overflow-hidden min-w-0">
              <h4 className="font-sans font-semibold text-sm text-slate-800 dark:text-slate-200 truncate leading-tight">
                {currentUser?.name || 'Guest User'}
              </h4>
              <p className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase mt-0.5">
                {currentUser?.systemRole || 'Guest'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center rounded-xl p-3 text-sm font-medium transition-all duration-150 relative ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
              } ${collapsed ? 'justify-center' : 'gap-3'}`}
              title={item.label}
            >
              <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              
              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {/* Accent dot for Daily Work reminder */}
              {item.highlight && !collapsed && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Role Sandbox Emulator & Theme Switcher Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
        
        {/* Sandbox toggle */}
        {!collapsed && (
          <button
            onClick={() => setShowSandbox(!showSandbox)}
            className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 text-amber-800 dark:text-amber-400 hover:bg-amber-100/50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Role Sandbox
            </span>
            <span className="text-[10px] text-amber-500">{showSandbox ? 'Hide' : 'Show'}</span>
          </button>
        )}

        {/* Sandbox Content */}
        {!collapsed && showSandbox && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl shadow-inner space-y-2 max-h-48 overflow-y-auto">
            <p className="font-sans text-[11px] text-slate-500 leading-normal">
              Simulate enterprise profiles to inspect specific layouts & task creation permissions:
            </p>
            <div className="space-y-1">
              {systemUsers.map(user => {
                const isSelected = currentUser?.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => setCurrentUser(user)}
                    className={`w-full text-left p-1.5 rounded-lg text-xs flex items-center gap-2 border transition-colors ${
                      isSelected 
                        ? 'border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/40 font-medium' 
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <img src={user.avatar} className="w-5 h-5 rounded-full object-cover" />
                    <div className="truncate flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.name}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">{user.systemRole} · {user.department}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => {
                if(confirm("Are you sure you want to restore the environment default values? All custom edits will be cleared.")) {
                  resetAllData();
                }
              }}
              className="w-full text-center py-1 rounded text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-900/30 dark:text-rose-400 font-medium flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              Reset All Sandbox Data
            </button>
          </div>
        )}

        {/* Theme + Sandbox Collapsed Controls */}
        <div className={`flex items-center ${collapsed ? 'flex-col gap-3 justify-center' : 'justify-between'} pt-1`}>
          {/* Light/Dark Toggle and Logout controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'light' ? 'Enable Dark Mode' : 'Enable Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              onClick={() => logoutUser()}
              className="p-2 rounded-xl text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/25 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {!collapsed && (
            <span className="font-mono text-[9px] text-slate-400">
              v1.5.0-release
            </span>
          )}
        </div>

      </div>
    </aside>
  );
};
