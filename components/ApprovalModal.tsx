'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import {
  PhoneCall,
  PhoneOff,
  Clock,
  PhoneForwarded
} from 'lucide-react';
import { PendingApproval } from '@/lib/types';

interface ApprovalModalProps {
  approval: PendingApproval;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
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
  const { currentTeacher } = useApp();
  const [seconds, setSeconds] = useState(approval.secondsRemaining);
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  useEffect(() => {
    if (actionTaken || seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout(approval.id);
          setActionTaken('timed_out');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, actionTaken, approval.id, onTimeout]);

  const handleApprove = () => {
    setActionTaken('approved');
    onApprove(approval.id);
    setTimeout(() => onClose(), 1400);
  };

  const handleDecline = () => {
    setActionTaken('declined');
    onDecline(approval.id);
    setTimeout(() => onClose(), 1400);
  };

  const percentLeft = Math.max(0, Math.min(100, (seconds / (currentTeacher.callSettings.timeoutSeconds || 15)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="pro-card w-full max-w-md rounded-xl p-6 space-y-4 shadow-xl border-slate-300 dark:border-slate-700 relative overflow-hidden">
        {/* Progress bar on top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-indigo-600 transition-all duration-1000 ease-linear"
            style={{ width: `${percentLeft}%` }}
          />
        </div>

        {/* Header alert */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-white">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                CallSetu Screen Authorization
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {approval.callerName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 tabular-nums">
            <Clock className="h-3 w-3" />
            <span>{seconds}s left</span>
          </div>
        </div>

        {/* Screening Details */}
        <div className="rounded-lg border border-slate-300 bg-slate-50 p-3.5 space-y-2 dark:border-slate-800 dark:bg-slate-900 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-700 dark:text-slate-300 font-bold">Phone Number:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {approval.callerNumber} (Sample)
            </span>
          </div>
          {approval.relationship && (
            <div className="flex justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-bold">Relationship:</span>
              <span className="font-bold text-indigo-700 dark:text-indigo-400">
                {approval.relationship}
              </span>
            </div>
          )}
          <div className="pt-1 border-t border-slate-200 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-300 font-bold block mb-0.5">Stated Purpose / Screening:</span>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              &quot;{approval.purpose}&quot;
            </p>
          </div>
        </div>

        {/* State Feedback if action taken */}
        {actionTaken ? (
          <div className={`rounded-lg p-3 text-center text-xs font-bold ${
            actionTaken === 'approved'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : actionTaken === 'declined'
              ? 'bg-rose-100 text-rose-900 border border-rose-300'
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}>
            {actionTaken === 'approved' && 'Transfer Approved. Connecting caller to teacher...'}
            {actionTaken === 'declined' && 'Transfer Declined. CallSetu will politely take a message.'}
            {actionTaken === 'timed_out' && `No response. Triggered fallback (${currentTeacher.callSettings.timeoutAction.replace('_', ' ')}).`}
          </div>
        ) : (
          /* Action Buttons */
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleDecline}
              className="btn-secondary flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <PhoneOff className="h-3.5 w-3.5 text-rose-600" />
              <span>Decline / Message</span>
            </button>

            <button
              onClick={handleApprove}
              className="btn-primary flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold"
            >
              <PhoneForwarded className="h-3.5 w-3.5" />
              <span>Approve Transfer</span>
            </button>
          </div>
        )}

        <p className="text-[10px] text-center text-slate-700 dark:text-slate-300 font-medium">
          If you do not respond, CallSetu automatically takes a message or offers a callback.
        </p>
      </div>
    </div>
  );
};
