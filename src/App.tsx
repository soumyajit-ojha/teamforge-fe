/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { DashboardScreen } from './components/DashboardScreen';
import { ProjectsScreen } from './components/ProjectsScreen';
import { ProjectDetailScreen } from './components/ProjectDetailScreen';
import { TasksScreen } from './components/TasksScreen';
import { DailyWorkScreen } from './components/DailyWorkScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { LoginScreen } from './components/LoginScreen';
import { AdminUsersScreen } from './components/AdminUsersScreen';
import { 
  Menu, 
  X, 
  Bell, 
  Sparkles, 
  HelpCircle,
  CalendarDays,
  UserCheck
} from 'lucide-react';

function AppContent() {
  const { currentTab, selectedProjectId, currentUser, theme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) {
    return <LoginScreen />;
  }

  const getTabLabel = () => {
    switch (currentTab) {
      case 'dashboard': return 'Dashboard';
      case 'projects': return selectedProjectId ? 'Project Workspace' : 'Projects Directory';
      case 'tasks': return 'My Tasks Board';
      case 'daily': return 'Daily Work Reporter';
      case 'analytics': return 'Productivity Analytics';
      case 'settings': return 'Account Settings';
      case 'admin_users': return 'System Administration';
      default: return 'TeamForge';
    }
  };

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'projects':
        return selectedProjectId ? <ProjectDetailScreen /> : <ProjectsScreen />;
      case 'tasks':
        return <TasksScreen />;
      case 'daily':
        return <DailyWorkScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'admin_users':
        return <AdminUsersScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      
      {/* Desktop left sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/60 backdrop-blur-sm">
          <div className="w-64 h-full bg-white dark:bg-slate-950 flex flex-col relative animate-slide-in">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 overflow-y-auto" onClick={() => setMobileMenuOpen(false)}>
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Primary content portal wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top universal Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <h2 className="font-sans font-bold text-sm md:text-base text-slate-800 dark:text-slate-100 tracking-tight">
              {getTabLabel()}
            </h2>
          </div>

          {/* Right utility items */}
          <div className="flex items-center gap-4">
            
            {/* Dynamic system indicator */}
            <span className="hidden lg:inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-400">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              {formattedDate}
            </span>

            {/* Notifications icon button */}
            <div className="relative">
              <button 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="System notifications"
              >
                <Bell className="w-4.5 h-4.5" />
              </button>
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Compact logged-in User profile indicator */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'Guest'} ({currentUser?.systemRole || 'Guest'})
              </span>
            </div>

          </div>
        </header>

        {/* Main interactive screen workspace container */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="max-w-7xl mx-auto h-full">
            {renderActiveScreen()}
          </div>
        </main>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
