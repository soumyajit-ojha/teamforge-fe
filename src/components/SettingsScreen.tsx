/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Settings, 
  UserCheck, 
  Mail, 
  Bell, 
  Key, 
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { currentUser, setCurrentUser, systemUsers } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  // Forms states
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  
  // Notification states
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySlack, setNotifySlack] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      email,
      department
    });
    setShowSavedNotification(true);
    setTimeout(() => {
      setShowSavedNotification(false);
    }, 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Security Settings: Password change simulation complete! Credentials updated in workspace context.');
    setCurrentPass('');
    setNewPass('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Customize notification matrices, reset keys, and review security access permissions.
          </p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile details & Role information left column (1/3 wide) */}
        <div className="space-y-6">
          
          {/* Avatar and system role badge */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="relative inline-block">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-950 shadow-md object-cover mx-auto"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
            </div>

            <div className="space-y-1">
              <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-slate-100">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
            </div>

            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400 uppercase">SYSTEM ROLE</span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{currentUser.systemRole}</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                {currentUser.roleDescription || 'Standard employee profile permissions.'}
              </p>
            </div>
          </div>

          {/* Quick Sandbox Warning */}
          <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 p-5 rounded-2xl space-y-2 text-amber-900 dark:text-amber-400">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider">SANDBOX EMULATOR</h4>
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-normal">
              To test alternative layout permissions (e.g., viewing as Admin, HR coordinator, or Developer), expand the **"Role Sandbox"** at the bottom-left sidebar.
            </p>
          </div>

        </div>

        {/* Dynamic Forms right columns (2/3 wide) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Form 1: General profile */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">
              Personal Profile Configuration
            </h3>

            {showSavedNotification && (
              <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Workspace profile updated successfully.
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 block">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 block">DEPARTMENT</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 block">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                >
                  Save Profile Modifications
                </button>
              </div>
            </form>
          </div>

          {/* Form 2: Password reset */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Key className="w-5 h-5 text-slate-400" />
              Credentials Management
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 block">CURRENT PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 block">NEW PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      placeholder="Enter new pass..."
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Update Credentials
                </button>
              </div>
            </form>
          </div>

          {/* Form 3: Notification matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-400" />
              Notification Dispatch Preferences
            </h3>

            <div className="space-y-3 text-xs">
              <div 
                onClick={() => setNotifyEmail(!notifyEmail)}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  checked={notifyEmail} 
                  readOnly
                  className="accent-indigo-600 h-4 w-4 rounded"
                />
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-200">Email Shift Summaries</h4>
                  <p className="text-[10px] text-slate-400">Dispatch copies of daily work sheets immediately upon punching out.</p>
                </div>
              </div>

              <div 
                onClick={() => setNotifySlack(!notifySlack)}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  checked={notifySlack} 
                  readOnly
                  className="accent-indigo-600 h-4 w-4 rounded"
                />
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-200">Slack Slackbot Syncing</h4>
                  <p className="text-[10px] text-slate-400">Push status modifications on active milestones directly to your slack workspace.</p>
                </div>
              </div>

              <div 
                onClick={() => setNotifyPush(!notifyPush)}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  checked={notifyPush} 
                  readOnly
                  className="accent-indigo-600 h-4 w-4 rounded"
                />
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-200">Browser Push Alerts</h4>
                  <p className="text-[10px] text-slate-400">Get alerts when teammates post comment responses inside your tasks drawers.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
