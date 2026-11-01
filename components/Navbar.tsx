'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import {
  Sun,
  Moon,
  Plus,
  ChevronDown,
  Check,
  ExternalLink,
  Menu,
  X,
  LayoutDashboard,
  PhoneCall,
  Radio,
  ShieldCheck,
  UserCheck,
  Sliders,
  Clock,
  Globe,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  viewMode: 'landing' | 'app' | 'privacy' | 'terms';
  setViewMode: (mode: 'landing' | 'app' | 'privacy' | 'terms') => void;
  onOpenAddTeacher?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  viewMode,
  setViewMode,
  onOpenAddTeacher
}) => {
  const { teachers, currentTeacherId, setCurrentTeacherId, currentTeacher } = useApp();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulator', label: 'Simulator', icon: PhoneCall },
    { id: 'voicelab', label: 'Voice Lab', icon: Radio },
    { id: 'contacts', label: 'Whitelist', icon: ShieldCheck },
    { id: 'profile', label: 'Profile & Fees', icon: UserCheck },
    { id: 'settings', label: 'Call Rules', icon: Sliders },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'domain', label: 'Domain', icon: Globe },
    { id: 'mvp', label: 'MVP Voice Demo', icon: Sparkles }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5]/90 dark:bg-[#0C1420]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Mobile Menu Trigger & Mobile Brand */}
        <div className="flex items-center gap-3 lg:hidden">
          {viewMode === 'app' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] text-[#132238] dark:text-[#F8FAFC]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}

          <button
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full border border-[#D9D1C2] dark:border-[#2E4362] bg-[#FAF6ED] dark:bg-[#16243A] flex items-center justify-center text-[#C86D51]">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                Call to Teach
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Left Breadcrumb or Title when on Workspace */}
        <div className="hidden lg:flex items-center gap-3">
          {viewMode === 'app' ? (
            <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
              Educator Console <span className="mx-1.5 text-[#C5A880]">·</span> {currentTeacher.profile.className}
            </span>
          ) : (
            <div className="flex items-center gap-6 text-xs font-medium text-[#475569] dark:text-[#CBD5E1]">
              <a href="#how-it-works" className="hover:text-[#1B365D] dark:hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#protection" className="hover:text-[#1B365D] dark:hover:text-white transition-colors">
                3-Layer Protection
              </a>
              <a href="#scenarios" className="hover:text-[#1B365D] dark:hover:text-white transition-colors">
                Call Scenarios
              </a>
              <a href="#faq" className="hover:text-[#1B365D] dark:hover:text-white transition-colors">
                FAQ
              </a>
            </div>
          )}
        </div>

        {/* Right Actions: Teacher Selector, Theme Switcher, Public Website CTA */}
        <div className="flex items-center gap-3">
          {/* Multi-Tenant Teacher Profile Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-full border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] px-3 py-1.5 text-xs text-[#132238] dark:text-[#F8FAFC] hover:border-[#D5CEBF] transition-colors shadow-2xs"
              title="Switch Active Educator Profile"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1B365D] text-white text-[10px] font-bold">
                {currentTeacher.avatar || currentTeacher.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block max-w-[140px] truncate">
                <span className="font-semibold block truncate leading-tight text-[#132238] dark:text-[#F8FAFC]">
                  {currentTeacher.name}
                </span>
                <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block truncate">
                  {currentTeacher.profile.category}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#64748B] dark:text-[#94A3B8]" />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="px-3.5 py-1.5 border-b border-[#F0ECE3] dark:border-[#1E2E44] text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Switch Educator (Multi-Tenant)
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {teachers.map((t) => {
                    const isSelected = t.id === currentTeacherId;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setCurrentTeacherId(t.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#FAF6ED] dark:bg-[#172740] text-[#132238] dark:text-[#F8FAFC] font-semibold'
                            : 'text-[#475569] hover:bg-[#FBF9F5] dark:text-[#CBD5E1] dark:hover:bg-[#152338]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1B365D] text-white text-[10px] font-bold shrink-0">
                            {t.avatar || t.name.charAt(0)}
                          </span>
                          <div className="truncate">
                            <div className="font-semibold text-[#132238] dark:text-[#F8FAFC] truncate">
                              {t.name}
                            </div>
                            <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] truncate">
                              {t.profile.className} · {t.profile.category}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-[#1B365D] dark:text-[#5BA87B] shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
                {onOpenAddTeacher && (
                  <div className="pt-1.5 mt-1 border-t border-[#F0ECE3] dark:border-[#1E2E44] px-2.5">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenAddTeacher();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#1B365D] dark:text-[#D6BD96] hover:bg-[#FAF6ED] dark:hover:bg-[#16253B] transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add New Educator Profile</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] flex items-center justify-center text-[#475569] hover:text-[#132238] dark:text-[#94A3B8] dark:hover:text-white shadow-2xs transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-[#C5A880]" /> : <Moon className="h-4 w-4 text-[#1B365D]" />}
          </button>

          {/* Primary View Switcher: Public Website or Open Dashboard */}
          {viewMode !== 'app' ? (
            <button
              onClick={() => {
                setViewMode('app');
                setCurrentTab('overview');
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#1B365D] hover:bg-[#152B4A] rounded-full transition-all shadow-xs whitespace-nowrap shrink-0"
            >
              Open Dashboard
            </button>
          ) : (
            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1B365D] hover:bg-[#152B4A] rounded-full transition-all shadow-xs whitespace-nowrap shrink-0"
            >
              <span>Public Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && viewMode === 'app' && (
        <div className="lg:hidden border-t border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-[#132238] text-white dark:bg-[#1B365D]'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:bg-[#F2EFE8] dark:hover:bg-[#162338]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
