'use client';

import React from 'react';
import {
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

interface AppSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onNavigateHome?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentTab,
  setCurrentTab,
  onNavigateHome
}) => {
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
    <aside className="w-64 shrink-0 border-r border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] flex flex-col justify-between p-5 min-h-screen">
      {/* Brand Wordmark & Emblem */}
      <div className="space-y-6">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left focus:outline-none group w-full"
        >
          {/* Audio Wave + Phone Emblem */}
          <div className="h-10 w-10 rounded-full border border-[#D9D1C2] dark:border-[#2E4362] bg-[#FAF6ED] dark:bg-[#16243A] flex items-center justify-center text-[#132238] dark:text-[#F8FAFC] shadow-xs group-hover:border-[#C86D51] transition-colors">
            <svg
              className="h-5 w-5 text-[#C86D51]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              <path d="M14 2a8 8 0 0 1 8 8" stroke="#1B365D" />
              <path d="M14 6a4 4 0 0 1 4 4" stroke="#C86D51" />
            </svg>
          </div>
          <div>
            <div className="text-base font-bold text-[#132238] dark:text-[#F8FAFC] tracking-tight leading-tight">
              Call to Teach
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium leading-tight">
              AI Call Management for Educators
            </div>
          </div>
        </button>

        {/* Navigation Menu Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#132238] text-white shadow-xs dark:bg-[#1B365D] dark:text-white font-semibold'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:bg-[#F2EFE8] dark:hover:bg-[#152338] hover:text-[#132238] dark:hover:text-[#F8FAFC]'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-[#64748B] dark:text-[#94A3B8]'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Editorial Illustration & Quote */}
      <div className="pt-6 border-t border-[#EAE5D9] dark:border-[#22334A] space-y-3">
        {/* Botanical Sprig + Bookplate Graphic */}
        <div className="flex items-center justify-center">
          <svg
            className="w-24 h-20 text-[#C86D51]/75 dark:text-[#E28468]/60"
            viewBox="0 0 120 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Olive / laurel sprig */}
            <path d="M20 70 C30 50, 45 35, 60 15" stroke="#C5A880" strokeWidth="1.5" />
            <path d="M35 55 C30 45, 20 45, 25 55 Z" fill="#EAE5D9" />
            <path d="M45 42 C40 32, 32 35, 38 45 Z" fill="#EAE5D9" />
            <path d="M55 28 C50 18, 42 22, 48 30 Z" fill="#EAE5D9" />
            <path d="M60 15 C65 10, 72 15, 62 20 Z" fill="#C5A880" />
            {/* Pen cup & drafting tools */}
            <path d="M72 58 L72 88 C72 90 88 90 88 88 L88 58 Z" fill="#FAF6ED" stroke="#132238" />
            <path d="M74 58 L78 35 L81 58" stroke="#C86D51" strokeWidth="1.5" />
            <path d="M83 58 L85 40 L87 58" stroke="#1B365D" strokeWidth="1.5" />
            {/* Stacked Hardcover Books */}
            <path d="M25 80 L70 80 L68 88 L23 88 Z" fill="#FAF6ED" stroke="#132238" />
            <path d="M20 88 L75 88 L72 96 L17 96 Z" fill="#F2EFE8" stroke="#132238" />
            <line x1="28" y1="84" x2="65" y2="84" stroke="#C86D51" strokeWidth="0.8" />
            <line x1="22" y1="92" x2="70" y2="92" stroke="#1B365D" strokeWidth="0.8" />
          </svg>
        </div>

        <blockquote className="text-center font-editorial italic text-[13px] text-[#475569] dark:text-[#CBD5E1] leading-snug px-2">
          &ldquo;More time for teaching, less time for interruptions.&rdquo;
        </blockquote>
      </div>
    </aside>
  );
};
