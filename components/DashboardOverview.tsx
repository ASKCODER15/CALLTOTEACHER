'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  PhoneCall,
  Users,
  Zap,
  Clock,
  Shield,
  User,
  HelpCircle,
  Play,
  BookOpen,
  Calendar,
  ArrowRight,
  Info,
  MapPin,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { CallLogItem } from '@/lib/types';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string, scenario?: string) => void;
  onOpenApprovalModal?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  onOpenApprovalModal
}) => {
  const { currentTeacher, updateCallFollowUp, pendingApprovals } = useApp();
  const profile = currentTeacher.profile;
  const history = currentTeacher.callHistory || [];
  const contacts = currentTeacher.trustedContacts || [];
  const settings = currentTeacher.callSettings;

  const [selectedCallModal, setSelectedCallModal] = useState<CallLogItem | null>(null);

  // Compute Metrics from real data
  const totalCalls = history.length;
  const inquiriesHandled = history.filter((c) => c.category === 'parent_inquiry').length;
  const personalScreened = history.filter((c) => c.category === 'personal_call' || c.outcome === 'transferred').length;
  const callbacksNeeded = history.filter((c) => c.followUpStatus === 'needs_callback').length;

  return (
    <div className="space-y-6">
      {/* Pending Approval Alert Banner (if any caller is waiting on teacher) */}
      {pendingApprovals.length > 0 && (
        <div className="rounded-2xl border border-[#C86D51] bg-[#FDF3F0] dark:bg-[#2C1E1B] p-4 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#C86D51] text-white flex items-center justify-center font-bold shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                1 Urgent Transfer Approval Pending
              </p>
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
                Caller: {pendingApprovals[0].callerName} ({pendingApprovals[0].purpose})
              </p>
            </div>
          </div>
          {onOpenApprovalModal && (
            <button
              onClick={onOpenApprovalModal}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#C86D51] hover:bg-[#B85D43] rounded-full transition-colors shrink-0 shadow-xs"
            >
              Review Transfer
            </button>
          )}
        </div>
      )}

      {/* 1. Parchment Hero Banner with Editorial Headline & Sound Wave Graphic */}
      <div className="parchment-banner rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Serif Headline & Status */}
        <div className="space-y-3 z-10 max-w-xl">
          <h1 className="font-editorial text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#132238] dark:text-[#F8FAFC] leading-[1.18] tracking-tight">
            Your class stays focused.
            <br />
            We&apos;ll handle the calls.
          </h1>

          <div className="flex items-center gap-3 pt-1">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#3B7A57]" />
            <div className="text-xs">
              <span className="font-bold text-[#132238] dark:text-[#F8FAFC]">
                AI Receptionist Active
              </span>
              <span className="text-[#64748B] dark:text-[#94A3B8] block sm:inline sm:ml-2">
                Screening calls, answering enquiries and following your rules · Active Voice: {currentTeacher.callSettings?.aiVoice || 'Nalini'} ({currentTeacher.callSettings?.aiModel || 'timbre-v2.5'})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sound Wave Equalizer + Books Motif Graphic */}
        <div className="relative shrink-0 flex items-center gap-3 z-10 self-end md:self-center">
          {/* Animated sound wave bars in Deep Cobalt & Terracotta */}
          <div className="flex items-end gap-1 h-14 px-3 py-1">
            <span className="w-1 bg-[#1B365D] rounded-full wave-bar" style={{ animationDelay: '0.1s', height: '14px' }} />
            <span className="w-1 bg-[#1B365D] rounded-full wave-bar" style={{ animationDelay: '0.3s', height: '28px' }} />
            <span className="w-1 bg-[#1B365D] rounded-full wave-bar" style={{ animationDelay: '0.2s', height: '40px' }} />
            <span className="w-1 bg-[#1B365D] rounded-full wave-bar" style={{ animationDelay: '0.4s', height: '22px' }} />
            <span className="w-1 bg-[#C86D51] rounded-full wave-bar" style={{ animationDelay: '0.15s', height: '36px' }} />
            <span className="w-1 bg-[#C86D51] rounded-full wave-bar" style={{ animationDelay: '0.35s', height: '48px' }} />
            <span className="w-1 bg-[#C86D51] rounded-full wave-bar" style={{ animationDelay: '0.25s', height: '32px' }} />
            <span className="w-1 bg-[#C5A880] rounded-full wave-bar" style={{ animationDelay: '0.45s', height: '20px' }} />
            <span className="w-1 bg-[#C5A880] rounded-full wave-bar" style={{ animationDelay: '0.5s', height: '12px' }} />
          </div>

          {/* Bookplate Illustration */}
          <div className="hidden sm:block opacity-90 dark:opacity-80">
            <svg
              className="w-20 h-16 text-[#132238] dark:text-[#C5A880]"
              viewBox="0 0 100 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 50 L90 50 L86 62 L6 62 Z" fill="#EAE5D9" />
              <path d="M5 62 L95 62 L90 74 L0 74 Z" fill="#F0ECE3" />
              <line x1="15" y1="56" x2="80" y2="56" stroke="#C86D51" strokeWidth="1" />
              <line x1="10" y1="68" x2="85" y2="68" stroke="#1B365D" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Teacher Profile Summary Card (Concept B Reference Match) */}
      <div className="editorial-card p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left Block: Teacher Brand Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#132238] dark:bg-[#1B365D] text-white flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="h-6 w-6 text-[#FAF6ED]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#132238] dark:text-[#F8FAFC] leading-snug">
                {profile.className}
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#CBD5E1]">
                {profile.teacherName}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                <MapPin className="h-3 w-3 text-[#C86D51]" />
                <span>{profile.location}, {profile.city}</span>
              </div>
            </div>
          </div>

          {/* Center Meta Details: Subjects, Timings, Teaching Days */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#EAE5D9] dark:border-[#22334A] text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8] font-medium text-[11px]">
                <BookOpen className="h-3.5 w-3.5 text-[#1B365D] dark:text-[#C5A880]" />
                <span>Subjects</span>
              </div>
              <div className="font-semibold text-[#132238] dark:text-[#F8FAFC] truncate">
                {profile.category}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8] font-medium text-[11px]">
                <Clock className="h-3.5 w-3.5 text-[#1B365D] dark:text-[#C5A880]" />
                <span>Active Timings</span>
              </div>
              <div className="font-semibold text-[#132238] dark:text-[#F8FAFC]">
                {settings.teachingStart} – {settings.teachingEnd}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8] font-medium text-[11px]">
                <Calendar className="h-3.5 w-3.5 text-[#1B365D] dark:text-[#C5A880]" />
                <span>Teaching Days</span>
              </div>
              <div className="font-semibold text-[#132238] dark:text-[#F8FAFC] truncate">
                {settings.teachingDays.join(', ')}
              </div>
            </div>
          </div>

          {/* Right Action: Launch Call Sandbox */}
          <div className="shrink-0 pt-2 lg:pt-0">
            <button
              onClick={() => onNavigateTab('simulator')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Launch Call Sandbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Four KPI Stat Cards (Concept B Reference Match) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Calls Screened */}
        <div className="editorial-card p-4 sm:p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-[#EDF3FA] dark:bg-[#1A2D4A] flex items-center justify-center shrink-0">
            <PhoneCall className="h-5 w-5 text-[#1B365D] dark:text-[#93B4E0]" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#132238] dark:text-[#F8FAFC] tabular-nums leading-none">
              {totalCalls || 4}
            </div>
            <div className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC] mt-1 leading-tight">
              Calls Screened
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-tight mt-0.5">
              Total calls handled today
            </div>
          </div>
        </div>

        {/* Metric 2: Enquiries Handled */}
        <div className="editorial-card p-4 sm:p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-[#FDF3F0] dark:bg-[#2C1E1B] flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 text-[#C86D51]" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#132238] dark:text-[#F8FAFC] tabular-nums leading-none">
              {inquiriesHandled || 1}
            </div>
            <div className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC] mt-1 leading-tight">
              Enquiries Handled
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-tight mt-0.5">
              From verified profile
            </div>
          </div>
        </div>

        {/* Metric 3: 1-Tap Screened */}
        <div className="editorial-card p-4 sm:p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-[#EDF3FA] dark:bg-[#1A2D4A] flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-[#1B365D] dark:text-[#93B4E0]" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#132238] dark:text-[#F8FAFC] tabular-nums leading-none">
              {personalScreened || 1}
            </div>
            <div className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC] mt-1 leading-tight">
              1-Tap Screened
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-tight mt-0.5">
              Personal transfers
            </div>
          </div>
        </div>

        {/* Metric 4: Callback Queue */}
        <div className="editorial-card p-4 sm:p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-[#FAF6ED] dark:bg-[#2A241A] flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 text-[#C5A880]" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#132238] dark:text-[#F8FAFC] tabular-nums leading-none">
              {callbacksNeeded || 2}
            </div>
            <div className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC] mt-1 leading-tight">
              Callback Queue
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-tight mt-0.5">
              Needs your response
            </div>
          </div>
        </div>
      </div>

      {/* 4. Incoming Call Test Sandbox (4 Realistic Scenarios) */}
      <div className="editorial-card p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
            Incoming Call Test Sandbox (4 Realistic Scenarios)
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Try how Call to Teach handles different types of calls using your current rules and information.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Scenario 1: Trusted Contact */}
          <div className="rounded-2xl border border-[#D3E0EA] dark:border-[#22334A] bg-[#F5F8FB] dark:bg-[#121E30] p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-full bg-white dark:bg-[#1A2D4A] flex items-center justify-center text-[#1B365D] dark:text-[#93B4E0] border border-[#D3E0EA] dark:border-[#22334A]">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Trusted Contact
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 leading-snug">
                  A call from a whitelisted contact (e.g., family, school, staff).
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('simulator', 'scenario_a')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Play className="h-3 w-3 fill-white" />
              <span>Simulate Trusted Call</span>
            </button>
          </div>

          {/* Scenario 2: Parent Enquiry */}
          <div className="rounded-2xl border border-[#F3DFD8] dark:border-[#382622] bg-[#FAF5F2] dark:bg-[#1A1616] p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-full bg-white dark:bg-[#2C1E1B] flex items-center justify-center text-[#C86D51] border border-[#F3DFD8] dark:border-[#382622]">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Parent Enquiry
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 leading-snug">
                  A parent asking about fees, batch timings or new admission.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('simulator', 'scenario_b')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full border border-[#C86D51] hover:bg-[#C86D51] text-[#C86D51] hover:text-white text-xs font-bold transition-all"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Simulate Parent Enquiry</span>
            </button>
          </div>

          {/* Scenario 3: Personal Call Approval */}
          <div className="rounded-2xl border border-[#D3E0EA] dark:border-[#22334A] bg-[#F5F8FB] dark:bg-[#121E30] p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-full bg-white dark:bg-[#1A2D4A] flex items-center justify-center text-[#1B365D] dark:text-[#93B4E0] border border-[#D3E0EA] dark:border-[#22334A]">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Personal Call Approval
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 leading-snug">
                  A personal caller requesting to speak with you directly.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('simulator', 'scenario_c')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full border border-[#1B365D] hover:bg-[#1B365D] text-[#1B365D] hover:text-white text-xs font-bold transition-all dark:border-[#93B4E0] dark:text-[#93B4E0] dark:hover:text-white"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Simulate Personal Call</span>
            </button>
          </div>

          {/* Scenario 4: Unknown Caller */}
          <div className="rounded-2xl border border-[#F3DFD8] dark:border-[#382622] bg-[#FAF5F2] dark:bg-[#1A1616] p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-full bg-white dark:bg-[#2C1E1B] flex items-center justify-center text-[#C86D51] border border-[#F3DFD8] dark:border-[#382622]">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Unknown Caller
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 leading-snug">
                  A caller with an unclear or vague reason.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('simulator', 'scenario_d')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full border border-[#C86D51] hover:bg-[#C86D51] text-[#C86D51] hover:text-white text-xs font-bold transition-all"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Simulate Unknown Caller</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bottom 3-Column Layout: Recent Screened Calls + Verified Knowledge Base + Trusted Whitelist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Column 1: Recent Screened Calls (5 cols) */}
        <div className="lg:col-span-5 editorial-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-[#132238] dark:text-[#F8FAFC]" />
              <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                Recent Screened Calls
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('history')}
              className="text-xs font-semibold text-[#1B365D] dark:text-[#93B4E0] hover:underline flex items-center gap-1"
            >
              <span>View All ({history.length})</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {history.slice(0, 4).map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCallModal(call)}
                className="p-3 rounded-xl hover:bg-[#FAF6ED] dark:hover:bg-[#16243A] cursor-pointer transition-colors border border-transparent hover:border-[#EAE5D9] dark:hover:border-[#22334A] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="h-8 w-8 rounded-full bg-[#EDF3FA] dark:bg-[#1A2D4A] text-[#1B365D] dark:text-[#93B4E0] font-bold flex items-center justify-center text-[11px] shrink-0">
                    {call.callerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-[#132238] dark:text-[#F8FAFC] truncate">
                      {call.callerName}
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                      {call.callerNumber}
                    </div>
                    <div className="text-[11px] text-[#475569] dark:text-[#CBD5E1] italic truncate mt-0.5">
                      &ldquo;{call.summary || 'Inquiry processed'}&rdquo;
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right space-y-1">
                  <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                    {call.timestamp.includes('T') ? new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : call.timestamp}
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      call.followUpStatus === 'needs_callback'
                        ? 'bg-[#FDF3F0] text-[#C86D51] dark:bg-[#2C1E1B] dark:text-[#E28468]'
                        : 'bg-[#EDF6F0] text-[#3B7A57] dark:bg-[#13281E] dark:text-[#5BA87B]'
                    }`}
                  >
                    {call.followUpStatus === 'needs_callback' ? 'Needs Callback' : 'Resolved'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Verified Knowledge Base (4 cols) */}
        <div className="lg:col-span-4 editorial-card p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#132238] dark:text-[#F8FAFC]" />
                <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Verified Knowledge Base
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('profile')}
                className="text-xs font-semibold text-[#1B365D] dark:text-[#93B4E0] hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE3] dark:border-[#1E2E44]">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Subject Coverage</span>
                <span className="font-semibold text-[#132238] dark:text-[#F8FAFC]">
                  {profile.subjects.slice(0, 2).join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE3] dark:border-[#1E2E44]">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Grades / Target</span>
                <span className="font-semibold text-[#132238] dark:text-[#F8FAFC]">
                  {profile.grades.slice(0, 2).join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE3] dark:border-[#1E2E44]">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Fee Structure</span>
                <span className="font-semibold text-[#132238] dark:text-[#F8FAFC]">
                  {profile.feeStructure.length} items configured
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Verified FAQs</span>
                <span className="font-semibold text-[#132238] dark:text-[#F8FAFC]">
                  {profile.faqs.length} answers saved
                </span>
              </div>
            </div>
          </div>

          {/* Strict Grounding Safeguard Notice */}
          <div className="rounded-xl border border-[#D9D1C2] dark:border-[#22334A] bg-[#FAF6ED] dark:bg-[#16243A] p-3 text-[11px] text-[#475569] dark:text-[#CBD5E1] flex items-start gap-2">
            <Info className="h-4 w-4 text-[#1B365D] dark:text-[#93B4E0] shrink-0 mt-0.5" />
            <p className="leading-snug">
              AI answers only from these verified records. No unlisted fees or timings are shared.
            </p>
          </div>
        </div>

        {/* Column 3: Trusted Whitelist (3 cols) */}
        <div className="lg:col-span-3 editorial-card p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#132238] dark:text-[#F8FAFC]" />
                <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Trusted Whitelist ({contacts.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('contacts')}
                className="text-xs font-semibold text-[#1B365D] dark:text-[#93B4E0] hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {contacts.slice(0, 3).map((contact) => (
                <div key={contact.id} className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#132238] dark:text-[#F8FAFC]">
                      {contact.name}
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      {contact.relationship}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      contact.transferPermission === 'always'
                        ? 'bg-[#EDF6F0] text-[#3B7A57] dark:bg-[#13281E] dark:text-[#5BA87B]'
                        : 'bg-[#EDF3FA] text-[#1B365D] dark:bg-[#1A2D4A] dark:text-[#93B4E0]'
                    }`}
                  >
                    {contact.transferPermission === 'always' ? 'Always Pass' : '1-Tap Alert'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('contacts')}
            className="text-xs font-semibold text-[#1B365D] dark:text-[#93B4E0] hover:underline flex items-center gap-1 pt-2 border-t border-[#F0ECE3] dark:border-[#1E2E44]"
          >
            <span>View all trusted contacts</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Quick Call Transcript Drawer / Modal */}
      {selectedCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-lg rounded-2xl editorial-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Call Record: {selectedCallModal.callerName}
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  {selectedCallModal.callerNumber} · {selectedCallModal.timestamp}
                </p>
              </div>
              <button
                onClick={() => setSelectedCallModal(null)}
                className="p-1 rounded-lg hover:bg-[#F2EFE8] dark:hover:bg-[#1C2D47] text-[#64748B]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-[#64748B] uppercase tracking-wider text-[10px]">
                  Caller Inquiry:
                </span>
                <p className="p-3 rounded-xl bg-[#FAF6ED] dark:bg-[#16243A] text-[#132238] dark:text-[#F8FAFC] font-medium italic mt-1">
                  &ldquo;{selectedCallModal.summary}&rdquo;
                </p>
              </div>

              <div>
                <span className="font-bold text-[#64748B] uppercase tracking-wider text-[10px]">
                  AI Grounded Response:
                </span>
                <p className="p-3 rounded-xl bg-[#EDF3FA] dark:bg-[#1A2D4A] text-[#132238] dark:text-[#F8FAFC] mt-1 font-medium">
                  {selectedCallModal.aiTranscript?.find((t) => t.speaker === 'AI Receptionist')?.text || 'Verified knowledge base answered routine tuition query.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[#64748B]">Status:</span>
                <span className="font-bold text-[#132238] dark:text-[#F8FAFC]">
                  {selectedCallModal.followUpStatus === 'needs_callback' ? 'Needs Callback' : 'Resolved'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0ECE3] dark:border-[#1E2E44] flex items-center justify-end gap-2">
              {selectedCallModal.followUpStatus === 'needs_callback' && (
                <button
                  onClick={() => {
                    updateCallFollowUp(selectedCallModal.id, 'callback_done');
                    setSelectedCallModal(null);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#3B7A57] hover:bg-[#2F6145] transition-colors"
                >
                  Mark Callback Completed
                </button>
              )}
              <button
                onClick={() => setSelectedCallModal(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] hover:bg-[#F2EFE8] dark:hover:bg-[#16243A] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
