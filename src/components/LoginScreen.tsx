/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, ChevronRight, CheckCircle } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { systemUsers, setCurrentUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const matchedUser = systemUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!matchedUser) {
      setError('No user found with this email address.');
      return;
    }

    // Default mock passwords to 'password' if not present
    const userPassword = matchedUser.password || 'password';
    if (password !== userPassword) {
      setError('Incorrect password. Please try again.');
      return;
    }

    setCurrentUser(matchedUser);
  };

  const handleQuickLogin = (user: any) => {
    setCurrentUser(user);
  };

  return (
    <div id="login-container" className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4 sm:p-6 transition-colors duration-200">
      {/* Decorative blurred backdrops reminiscent of iOS ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/25 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-400/25 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-none">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans mt-3">
            Welcome to TeamForge
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Enterprise project & engineering collaboration
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-zinc-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="sarah.j@teamforge.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-100/60 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              PASSWORD
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-100/60 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors duration-150 flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/15"
          >
            <span>Sign In</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-800/60">
          <p className="text-[11px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider text-center">
            OR SWITCH ACCOUNTS INSTANTLY
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {systemUsers.map(user => (
              <button
                key={user.id}
                onClick={() => handleQuickLogin(user)}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200/50 dark:border-zinc-800/80 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-950 dark:hover:bg-zinc-900/60 text-left transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-zinc-800"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate leading-none mb-0.5">
                    {user.name}
                  </p>
                  <p className="text-[9px] text-slate-400 dark:text-zinc-500 truncate leading-none">
                    {user.systemRole} · {user.department}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
