'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import {
  PhoneCall,
  ShieldCheck,
  UserCheck,
  Settings,
  BookOpen,
  Clock,
  ChevronDown,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
  viewMode: 'landing' | 'app' | 'privacy' | 'terms';
  setViewMode: (mode: 'landing' | 'app' | 'privacy' | 'terms') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openSimulator,
  viewMode,
  setViewMode
}) => {
  const { currentTeacher, teachers, setCurrentTeacherId, pendingApprovals } = useApp();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm transition-colors dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Clean Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setViewMode('landing')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-white shadow-sm transition-colors group-hover:bg-indigo-800">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  TalktoTeach
                </span>
                <span className="hidden rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200 sm:inline-block">
                  CallSetu
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Call Management for Indian Educators
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {viewMode === 'app' ? (
            <>
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'simulator', label: 'Call Simulator', icon: PhoneCall },
                { id: 'contacts', label: 'Trusted Contacts', icon: ShieldCheck },
                { id: 'profile', label: 'Class Profile', icon: UserCheck },
                { id: 'settings', label: 'Call Rules', icon: Settings },
                { id: 'domain', label: 'Custom Domain', icon: Globe },
                { id: 'history', label: 'Call History', icon: Clock }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.label}</span>
                    {item.id === 'simulator' && pendingApprovals.filter(a => a.status === 'pending').length > 0 && (
                      <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </>
          ) : (
            <div className="flex items-center gap-6 text-xs font-bold text-slate-700 dark:text-slate-200">
              <a href="#problem" className="hover:text-indigo-600 transition-colors">Class Distraction</a>
              <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">Routing Engine</a>
              <a href="#scenarios" className="hover:text-indigo-600 transition-colors">3 Caller Scenarios</a>
              <button onClick={() => setViewMode('privacy')} className="hover:text-indigo-600 transition-colors font-bold">
                Privacy
              </button>
              <button onClick={() => setViewMode('terms')} className="hover:text-indigo-600 transition-colors font-bold">
                Terms
              </button>
            </div>
          )}
        </nav>

        {/* Zone 3: Actions & Teacher Profile Selector */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
            suppressHydrationWarning
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>

          {viewMode !== 'app' ? (
            <>
              <button
                onClick={() => setViewMode('app')}
                className="btn-secondary rounded-lg px-3.5 py-2 text-xs font-bold"
              >
                Teacher Dashboard
              </button>
              <button
                onClick={() => {
                  setViewMode('app');
                  setCurrentTab('simulator');
                  openSimulator();
                }}
                className="btn-primary flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>Test Call Simulator</span>
              </button>
            </>
          ) : (
            <>
              {/* Teacher Account Selector */}
              <div className="relative group">
                <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs shadow-xs dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-100 text-[10px] font-bold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {currentTeacher.avatar}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-bold text-slate-900 leading-none dark:text-white truncate max-w-[120px]">
                      {currentTeacher.name}
                    </p>
                    <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                      {currentTeacher.profile.className}
                    </p>
                  </div>
                  <select
                    value={currentTeacher.id}
                    onChange={(e) => setCurrentTeacherId(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    aria-label="Select Teacher Account"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.profile.className})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </div>
              </div>

              {/* View Landing Mode button */}
              <button
                onClick={() => setViewMode('landing')}
                className="hidden lg:inline-flex rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Public Site
              </button>

              {/* Instant Call Simulation Trigger */}
              <button
                onClick={openSimulator}
                className="btn-accent flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Simulate Incoming Call</span>
                <span className="sm:hidden">Simulate</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      {viewMode === 'app' && (
        <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 no-scrollbar gap-1.5">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'simulator', label: 'Simulator' },
            { id: 'contacts', label: 'Contacts' },
            { id: 'profile', label: 'Profile' },
            { id: 'settings', label: 'Rules' },
            { id: 'domain', label: 'Domain' },
            { id: 'history', label: 'History' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap shrink-0 ${
                currentTab === item.id
                  ? 'bg-indigo-700 text-white'
                  : 'bg-white text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
