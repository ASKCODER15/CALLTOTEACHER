'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  UserCheck,
  PhoneForwarded,
  AlertCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { CallLogItem } from '@/lib/types';

interface DashboardOverviewProps {
  onOpenSimulator: (scenario?: 'scenario_a' | 'scenario_b' | 'scenario_c') => void;
  onNavigateTab: (tab: string) => void;
  onViewCallDetails: (call: CallLogItem) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenSimulator,
  onNavigateTab,
  onViewCallDetails
}) => {
  const { currentTeacher, pendingApprovals, resetDemoData, updateCallFollowUp } = useApp();
  const profile = currentTeacher.profile;
  const history = currentTeacher.callHistory;

  // Calculate metrics
  const totalCalls = history.length;
  const parentInquiries = history.filter((c) => c.category === 'parent_inquiry').length;
  const answeredByAi = history.filter((c) => c.outcome === 'answered_by_ai').length;
  const transferredCalls = history.filter((c) => c.outcome === 'transferred').length;
  const activeApprovals = pendingApprovals.filter((a) => a.status === 'pending').length;
  const needsCallback = history.filter((c) => c.followUpStatus === 'needs_callback').length;

  return (
    <div className="space-y-6">
      {/* Sample Data Disclaimer & Teaching Hours Active Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Sample Demo Data:</strong> All phone numbers and caller interactions are synthetic simulations for coaching demonstrations. No real telephony or charges incurred.
          </span>
        </div>
        <button
          onClick={resetDemoData}
          className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline shrink-0 dark:text-amber-300"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Demo</span>
        </button>
      </div>

      {/* Teaching Mode Status Header Card */}
      <div className="pro-card rounded-xl p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                CallSetu Active · Teaching Protection ON
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {profile.className}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Teacher: <strong className="text-slate-900 dark:text-white">{profile.teacherName}</strong> · Active Teaching Hours: <span className="font-semibold text-indigo-700 dark:text-indigo-400">{profile.teachingHours.start} - {profile.teachingHours.end}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenSimulator('scenario_b')}
              className="btn-primary flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Simulate Parent Call</span>
            </button>
            <button
              onClick={() => onNavigateTab('settings')}
              className="btn-secondary rounded-lg px-4 py-2.5 text-xs font-semibold"
            >
              Configure Hours
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="pro-card rounded-xl p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Inquiries</span>
            <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <PhoneCall className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums dark:text-white">
            {totalCalls}
          </p>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <span className="text-indigo-700 font-bold">{parentInquiries}</span> from prospective parents
          </div>
        </div>

        {/* Metric 2 */}
        <div className="pro-card rounded-xl p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Answered by AI</span>
            <div className="flex h-7 w-7 items-center justify-center rounded bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-violet-700 tabular-nums dark:text-violet-400">
            {answeredByAi}
          </p>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            Zero class disturbance
          </div>
        </div>

        {/* Metric 3 */}
        <div className="pro-card rounded-xl p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Transfers</span>
            <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <PhoneForwarded className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 tabular-nums dark:text-emerald-400">
            {transferredCalls}
          </p>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            Approved trusted contacts
          </div>
        </div>

        {/* Metric 4 */}
        <div className="pro-card rounded-xl p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Pending Approvals</span>
            <div className={`flex h-7 w-7 items-center justify-center rounded ${
              activeApprovals > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
            }`}>
              <AlertCircle className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className={`text-2xl font-extrabold tabular-nums ${activeApprovals > 0 ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
            {activeApprovals}
          </p>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            {needsCallback > 0 ? (
              <span className="text-amber-700 font-bold">{needsCallback} follow-ups pending</span>
            ) : (
              'All calls resolved'
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Hub: Quick Test Scenarios & Recent Call Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Simulator Triggers */}
        <div className="lg:col-span-5 space-y-4">
          <div className="pro-card rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Interactive Call Scenarios
              </h3>
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400">Click to Test</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Test how CallSetu handles real classroom caller situations in real time:
            </p>

            <div className="space-y-2.5">
              {/* Scenario A Card */}
              <button
                onClick={() => onOpenSimulator('scenario_a')}
                className="w-full text-left rounded-lg border border-slate-300 bg-white p-3.5 transition hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    Scenario A
                  </span>
                  <Play className="h-3 w-3 text-indigo-700 dark:text-indigo-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1 dark:text-white">
                  Trusted Family / Principal Call
                </h4>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-normal leading-relaxed">
                  Number matches approved contact list. Evaluates &quot;During teaching hours&quot; rule and triggers silent teacher approval card.
                </p>
              </button>

              {/* Scenario B Card */}
              <button
                onClick={() => onOpenSimulator('scenario_b')}
                className="w-full text-left rounded-lg border border-indigo-500 bg-indigo-50/40 p-3.5 transition hover:border-indigo-600 dark:border-indigo-600 dark:bg-indigo-950/30"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-900 dark:bg-violet-950 dark:text-violet-300">
                    Scenario B · Standard
                  </span>
                  <Play className="h-3 w-3 text-violet-700 dark:text-violet-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1 dark:text-white">
                  Parent Inquires: Fees, Batches &amp; Demo
                </h4>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-normal leading-relaxed">
                  Parent asks in natural Hinglish. CallSetu answers with exact fees ({profile.feeStructure[1]?.amount || 'Rs 2,800'}), location, and books trial demo.
                </p>
              </button>

              {/* Scenario C Card */}
              <button
                onClick={() => onOpenSimulator('scenario_c')}
                className="w-full text-left rounded-lg border border-slate-300 bg-white p-3.5 transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                    Scenario C · Security Screen
                  </span>
                  <Play className="h-3 w-3 text-amber-700 dark:text-amber-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1 dark:text-white">
                  Personal / Unknown Caller (Courier / Relative)
                </h4>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-normal leading-relaxed">
                  Identity not auto-trusted. CallSetu screens purpose, holds caller, and seeks teacher 1-tap approval.
                </p>
              </button>
            </div>
          </div>

          {/* Quick Class Summary Box */}
          <div className="pro-card rounded-xl p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Active Verified Profile</h4>
              <button
                onClick={() => onNavigateTab('profile')}
                className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 hover:underline"
              >
                Edit Details
              </button>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Subjects:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{profile.subjects.slice(0, 3).join(', ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Class 10 Board Fee:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400 tabular-nums">
                  {profile.feeStructure[1]?.amount || 'Rs 2,800'} / month
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Center Location:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] text-right">
                  {profile.location}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Trusted Directory:</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-400">
                  {currentTeacher.trustedContacts.length} approved numbers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Today's Calls & Follow-up Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="pro-card rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today&apos;s Call History &amp; Follow-ups
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Recorded and screened by CallSetu during active hours
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('history')}
                className="flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline"
              >
                <span>View Full Log</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {history.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center space-y-2 dark:border-slate-800">
                <PhoneCall className="h-8 w-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No calls recorded yet</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Click any scenario on the left to simulate an incoming call.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {history.slice(0, 5).map((call) => (
                  <div
                    key={call.id}
                    className="rounded-lg border border-slate-300 bg-white p-3.5 transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {call.callerName}
                          </p>
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold tabular-nums">
                            {call.callerNumber} (Demo)
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-normal leading-relaxed line-clamp-2">
                          {call.summary}
                        </p>
                      </div>

                      <div className="text-right shrink-0 space-y-1">
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium block">
                          {call.timestamp}
                        </span>
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            call.outcome === 'answered_by_ai'
                              ? 'bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-300'
                              : call.outcome === 'transferred'
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {call.outcome === 'answered_by_ai'
                            ? 'Answered by AI'
                            : call.outcome === 'transferred'
                            ? 'Transferred'
                            : 'Message Taken'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Status:</span>
                        <button
                          onClick={() => {
                            const next = call.followUpStatus === 'needs_callback' ? 'callback_done' : 'needs_callback';
                            updateCallFollowUp(call.id, next);
                          }}
                          className={`font-bold hover:underline ${
                            call.followUpStatus === 'needs_callback'
                              ? 'text-amber-800 dark:text-amber-400'
                              : 'text-emerald-800 dark:text-emerald-400'
                          }`}
                        >
                          {call.followUpStatus === 'needs_callback' ? 'Pending Callback' : 'Resolved'}
                        </button>
                      </div>

                      <button
                        onClick={() => onViewCallDetails(call)}
                        className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 hover:underline"
                      >
                        Read Transcript
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
