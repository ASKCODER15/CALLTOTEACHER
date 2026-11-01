'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Clock,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  User,
  AlertTriangle,
  X
} from 'lucide-react';
import { PendingApproval } from '@/lib/types';

interface ApprovalModalProps {
  approval: PendingApproval;
  onApprove: (id: string) => void;
  onDecline: (id: string, reason?: string) => void;
  onTimeout: (id: string) => void;
  onClose: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  approval,
  onApprove,
  onDecline,
  onTimeout,
  onClose
}) => {
  const [secondsLeft, setSecondsLeft] = useState(approval.secondsRemaining || 15);
  const [status, setStatus] = useState<'pending' | 'approved' | 'declined' | 'timed_out'>('pending');

  useEffect(() => {
    if (status !== 'pending') return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('timed_out');
          onTimeout(approval.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, approval.id, onTimeout]);

  const handleApproveClick = () => {
    setStatus('approved');
    onApprove(approval.id);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleDeclineClick = (reason: string) => {
    setStatus('declined');
    onDecline(approval.id, reason);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl editorial-card p-6 shadow-2xl space-y-5 border border-[#EAE5D9] dark:border-[#22334A]">
        {/* Top Header with Countdown Ring */}
        <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#FDF3F0] dark:bg-[#2C1E1B] text-[#C86D51] flex items-center justify-center font-bold">
              <PhoneCall className="h-4 w-4 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                Incoming Call Transfer Request
              </h3>
              <p className="text-[11px] text-[#64748B]">
                1-Tap Screening Interception
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF6ED] dark:bg-[#16243A] text-xs font-mono font-bold text-[#C86D51]">
            <Clock className="h-3.5 w-3.5" />
            <span>{secondsLeft}s left</span>
          </div>
        </div>

        {/* Status Confirmation States */}
        {status === 'approved' && (
          <div className="p-4 rounded-2xl bg-[#EDF6F0] dark:bg-[#13281E] border border-[#C4E1CC] text-center space-y-1">
            <CheckCircle2 className="h-6 w-6 text-[#3B7A57] mx-auto" />
            <p className="text-xs font-bold text-[#3B7A57]">Call Transfer Approved</p>
            <p className="text-[11px] text-[#64748B]">Patching caller through to your line now...</p>
          </div>
        )}

        {status === 'declined' && (
          <div className="p-4 rounded-2xl bg-[#FDF3F0] dark:bg-[#2C1E1B] border border-[#F3DFD8] text-center space-y-1">
            <XCircle className="h-6 w-6 text-[#C86D51] mx-auto" />
            <p className="text-xs font-bold text-[#C86D51]">Call Declined</p>
            <p className="text-[11px] text-[#64748B]">Polite message taken and WhatsApp confirmation dispatched.</p>
          </div>
        )}

        {status === 'timed_out' && (
          <div className="p-4 rounded-2xl bg-[#FAF6ED] dark:bg-[#2A241A] border border-[#EAE5D9] text-center space-y-1">
            <Clock className="h-6 w-6 text-[#C5A880] mx-auto" />
            <p className="text-xs font-bold text-[#C5A880]">Screening Timed Out</p>
            <p className="text-[11px] text-[#64748B]">Caller placed in Priority Callback Queue automatically.</p>
          </div>
        )}

        {status === 'pending' && (
          <div className="space-y-4">
            {/* Caller Identification Card */}
            <div className="p-4 rounded-2xl bg-[#FBF9F5] dark:bg-[#0C1420] border border-[#EAE5D9] dark:border-[#22334A] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#132238] dark:text-[#F8FAFC]">
                  {approval.callerName}
                </span>
                <span className="text-[11px] font-semibold text-[#1B365D] dark:text-[#93B4E0] bg-[#EDF3FA] dark:bg-[#1A2D4A] px-2 py-0.5 rounded-full">
                  {approval.relationship || 'Personal Contact'}
                </span>
              </div>
              <div className="font-mono text-[#64748B] text-[11px]">
                {approval.callerNumber}
              </div>
              <div className="pt-2 border-t border-[#F0ECE3] dark:border-[#1E2E44]">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-0.5">
                  Caller Purpose:
                </span>
                <p className="text-[#132238] dark:text-[#F8FAFC] font-medium italic">
                  &ldquo;{approval.purpose}&rdquo;
                </p>
              </div>
            </div>

            {/* Decision Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleApproveClick}
                className="py-3 px-4 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="h-3.5 w-3.5 fill-white" />
                <span>Approve &amp; Connect</span>
              </button>

              <button
                onClick={() => handleDeclineClick('Teaching in class')}
                className="py-3 px-4 rounded-full border border-[#C86D51] text-[#C86D51] hover:bg-[#C86D51] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <PhoneOff className="h-3.5 w-3.5" />
                <span>Decline (In Class)</span>
              </button>
            </div>

            {/* Quick Decline Reason options */}
            <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
              <span>Or decline with:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDeclineClick('In meeting')}
                  className="hover:underline text-[#132238] dark:text-[#F8FAFC]"
                >
                  In Meeting
                </button>
                <span>·</span>
                <button
                  onClick={() => handleDeclineClick('Call back tonight')}
                  className="hover:underline text-[#132238] dark:text-[#F8FAFC]"
                >
                  Call Tonight
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
