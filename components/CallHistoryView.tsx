'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Clock,
  Search,
  X
} from 'lucide-react';
import { CallLogItem, CallCategory, FollowUpStatus } from '@/lib/types';

interface CallHistoryViewProps {
  selectedCallForModal?: CallLogItem | null;
  onClearSelectedCall?: () => void;
}

export const CallHistoryView: React.FC<CallHistoryViewProps> = ({
  selectedCallForModal,
  onClearSelectedCall
}) => {
  const { currentTeacher, updateCallFollowUp } = useApp();
  const history = currentTeacher.callHistory;

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeModalCall, setActiveModalCall] = useState<CallLogItem | null>(selectedCallForModal || null);

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.callerName.toLowerCase().includes(search.toLowerCase()) ||
      item.callerNumber.includes(search) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.reason.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.followUpStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryBadge = (cat: CallCategory) => {
    switch (cat) {
      case 'parent_inquiry':
        return (
          <span className="rounded bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-300">
            Parent Inquiry
          </span>
        );
      case 'trusted_contact':
        return (
          <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            Trusted Contact
          </span>
        );
      case 'personal_call':
        return (
          <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Personal / Delivery
          </span>
        );
      default:
        return (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Filtered Call
          </span>
        );
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'answered_by_ai':
        return (
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Answered by AI
          </span>
        );
      case 'transferred':
        return (
          <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            Transferred to Teacher
          </span>
        );
      case 'message_taken':
        return (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Message Taken
          </span>
        );
      case 'callback_scheduled':
        return (
          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Callback Scheduled
          </span>
        );
      default:
        return (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            {outcome}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Call History &amp; Follow-Up Logs
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Complete audit trail of parent inquiries, trusted transfers, and messages logged during class hours.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span>{history.length} Total Calls Logged</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by caller, phone, inquiry reason..."
            className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">All Categories</option>
            <option value="parent_inquiry">Parent Inquiries</option>
            <option value="trusted_contact">Trusted Contacts</option>
            <option value="personal_call">Personal / Delivery</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">All Follow-up Status</option>
            <option value="needs_callback">Pending Callback</option>
            <option value="form_sent">Admission Form Sent</option>
            <option value="callback_done">Callback Done</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Calls Table List */}
      <div className="pro-card rounded-xl overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Clock className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No matching call logs
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Try adjusting your search filter or simulate an incoming call from the Simulator tab.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Caller & Reason info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {item.callerName}
                    </h3>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold tabular-nums">
                      {item.callerNumber} (Demo)
                    </span>
                    {getCategoryBadge(item.category)}
                    {getOutcomeBadge(item.outcome)}
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">Reason:</span> {item.reason}
                  </p>

                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                    <span className="font-bold text-indigo-700 dark:text-indigo-400">AI Summary:</span> {item.summary}
                  </p>
                </div>

                {/* Right Metadata & Action */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
                  <div className="text-left md:text-right text-[11px] space-y-1">
                    <span className="text-slate-600 dark:text-slate-400 font-bold block">{item.timestamp}</span>
                    <button
                      onClick={() => {
                        const next: FollowUpStatus =
                          item.followUpStatus === 'needs_callback'
                            ? 'callback_done'
                            : item.followUpStatus === 'callback_done'
                            ? 'resolved'
                            : 'needs_callback';
                        updateCallFollowUp(item.id, next);
                      }}
                      className={`font-semibold hover:underline ${
                        item.followUpStatus === 'needs_callback'
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {item.followUpStatus === 'needs_callback'
                        ? 'Pending Callback'
                        : item.followUpStatus === 'form_sent'
                        ? 'Admission Sent'
                        : 'Resolved'}
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveModalCall(item)}
                    className="btn-secondary rounded-lg px-3 py-1.5 text-xs font-bold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Transcript Modal */}
      {activeModalCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="pro-card w-full max-w-xl rounded-xl p-6 space-y-4 shadow-xl max-h-[85vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500">
                  {activeModalCall.timestamp} · {activeModalCall.callerNumber} (Demo)
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeModalCall.callerName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveModalCall(null);
                  if (onClearSelectedCall) onClearSelectedCall();
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* AI Summary Card */}
            <div className="rounded-lg bg-indigo-50/70 p-3 text-xs text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200">
              <p className="font-bold mb-0.5">CallSetu Summary:</p>
              <p>{activeModalCall.summary}</p>
            </div>

            {/* Transcript Area */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">
                Recorded Dialog Transcript
              </h4>

              {(!activeModalCall.aiTranscript || activeModalCall.aiTranscript.length === 0) ? (
                <p className="text-slate-400 italic">No verbal transcript recorded for this call.</p>
              ) : (
                activeModalCall.aiTranscript.map((line, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg p-2.5 ${
                      line.speaker === 'Caller'
                        ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        : line.speaker === 'CallSetu AI'
                        ? 'bg-indigo-700 text-white'
                        : 'bg-amber-50 text-amber-900 font-semibold border border-amber-200 dark:bg-amber-950/60 dark:text-amber-200'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] opacity-80 mb-0.5">
                      <span>{line.speaker}</span>
                      <span>{line.time}</span>
                    </div>
                    <p>{line.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Outcome: <strong>{activeModalCall.outcome}</strong>
              </span>

              <button
                onClick={() => {
                  setActiveModalCall(null);
                  if (onClearSelectedCall) onClearSelectedCall();
                }}
                className="btn-primary rounded-lg px-4 py-1.5 text-xs font-bold"
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
