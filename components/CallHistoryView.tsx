'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Clock,
  PhoneCall,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ArrowRight,
  PhoneForwarded,
  ShieldCheck,
  Check
} from 'lucide-react';
import { CallLogItem, FollowUpStatus } from '@/lib/types';

export const CallHistoryView: React.FC = () => {
  const { currentTeacher, updateCallFollowUp } = useApp();
  const history = currentTeacher.callHistory || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'parent_inquiry' | 'trusted_contact' | 'personal_call' | 'needs_callback'>('all');
  const [selectedCall, setSelectedCall] = useState<CallLogItem | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.callerNumber.includes(searchQuery) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'needs_callback') return item.followUpStatus === 'needs_callback';
    return item.category === activeFilter;
  });

  const getOutcomeTag = (outcome: CallLogItem['outcome']) => {
    switch (outcome) {
      case 'answered_by_ai':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDF3FA] text-[#1B365D] dark:bg-[#1A2D4A] dark:text-[#93B4E0] border border-[#D3E0EA] dark:border-[#22334A]">
            Answered by AI
          </span>
        );
      case 'transferred':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDF6F0] text-[#3B7A57] dark:bg-[#13281E] dark:text-[#5BA87B] border border-[#C4E1CC] dark:border-[#23354C]">
            Transferred
          </span>
        );
      case 'message_taken':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF6ED] text-[#C5A880] dark:bg-[#2A241A] dark:text-[#D6BD96] border border-[#EAE5D9] dark:border-[#22334A]">
            Message Taken
          </span>
        );
      case 'declined':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDF3F0] text-[#C86D51] dark:bg-[#2C1E1B] dark:text-[#E28468] border border-[#F3DFD8] dark:border-[#382622]">
            Declined
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF6ED] text-[#64748B]">
            Awaiting Callback
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="parchment-banner rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] uppercase tracking-wider">
            <Clock className="h-3.5 w-3.5 text-[#C86D51]" />
            <span>Audited Call Ledger</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Call History &amp; Screening Transcripts
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] max-w-2xl leading-relaxed">
            Every call screened by Call to Teach is permanently logged with timestamps, caller identity, AI transcripts, and callback resolution status.
          </p>
        </div>

        <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
          Total Logged: <strong className="text-[#132238] dark:text-[#F8FAFC]">{history.length} calls</strong>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="editorial-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search by caller name, phone number, or inquiry keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] pl-10 pr-4 py-2 text-xs text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'all', label: 'All Calls' },
            { id: 'parent_inquiry', label: 'Parent Enquiries' },
            { id: 'trusted_contact', label: 'Trusted' },
            { id: 'personal_call', label: 'Transfers' },
            { id: 'needs_callback', label: 'Needs Callback' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#132238] text-white dark:bg-[#1B365D]'
                  : 'bg-[#F2EFE8] dark:bg-[#162338] text-[#475569] dark:text-[#CBD5E1] hover:bg-[#EAE5D9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Ledger Table */}
      <div className="editorial-card overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 p-6 space-y-2">
            <Clock className="h-8 w-8 text-[#C5A880] mx-auto opacity-70" />
            <p className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
              No matching call records found
            </p>
            <p className="text-xs text-[#64748B]">
              Try adjusting your search criteria or switch the active filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0ECE3] dark:divide-[#1E2E44]">
            {filteredHistory.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className="p-4 sm:p-5 hover:bg-[#FAF9F6] dark:hover:bg-[#152338] cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                {/* Caller & Summary */}
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-full bg-[#EDF3FA] dark:bg-[#1A2D4A] text-[#1B365D] dark:text-[#93B4E0] font-bold flex items-center justify-center text-xs shrink-0">
                    {call.callerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#132238] dark:text-[#F8FAFC]">
                        {call.callerName}
                      </span>
                      <span className="font-mono text-[#64748B] text-[11px]">
                        {call.callerNumber}
                      </span>
                    </div>
                    <p className="text-[#475569] dark:text-[#CBD5E1] mt-1 leading-snug">
                      &ldquo;{call.summary}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Outcome & Timestamp */}
                <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                  <div className="text-right space-y-1">
                    <div>{getOutcomeTag(call.outcome)}</div>
                    <div className="text-[10px] text-[#64748B]">
                      {call.timestamp}
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      call.followUpStatus === 'needs_callback'
                        ? 'bg-[#FDF3F0] text-[#C86D51]'
                        : 'bg-[#EDF6F0] text-[#3B7A57]'
                    }`}
                  >
                    {call.followUpStatus === 'needs_callback' ? 'Needs Callback' : 'Resolved'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transcript Modal */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-lg rounded-2xl editorial-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Call Record: {selectedCall.callerName}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {selectedCall.callerNumber} · {selectedCall.timestamp}
                </p>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="p-1 rounded-lg hover:bg-[#F2EFE8] text-[#64748B]"
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
                  &ldquo;{selectedCall.summary}&rdquo;
                </p>
              </div>

              <div>
                <span className="font-bold text-[#64748B] uppercase tracking-wider text-[10px]">
                  AI Spoken Response:
                </span>
                <p className="p-3 rounded-xl bg-[#EDF3FA] dark:bg-[#1A2D4A] text-[#132238] dark:text-[#F8FAFC] mt-1 font-medium">
                  {selectedCall.aiTranscript?.find((t) => t.speaker === 'AI Receptionist')?.text || 'Verified knowledge base answered routine tuition query.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[#64748B]">Resolution State:</span>
                <span className="font-bold text-[#132238] dark:text-[#F8FAFC]">
                  {selectedCall.followUpStatus === 'needs_callback' ? 'Needs Callback' : 'Resolved'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0ECE3] dark:border-[#1E2E44] flex items-center justify-end gap-2">
              {selectedCall.followUpStatus === 'needs_callback' && (
                <button
                  onClick={() => {
                    updateCallFollowUp(selectedCall.id, 'callback_done');
                    setSelectedCall(null);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#3B7A57] hover:bg-[#2F6145] transition-colors"
                >
                  Mark Callback Completed
                </button>
              )}
              <button
                onClick={() => setSelectedCall(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] hover:bg-[#F2EFE8] transition-colors"
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
