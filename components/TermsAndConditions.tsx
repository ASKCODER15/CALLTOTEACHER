'use client';

import React from 'react';
import { Award, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TermsAndConditionsProps {
  onBack: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack }) => {
  return (
    <div className="mx-auto max-w-4xl py-6 space-y-6">
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-[#132238] dark:text-[#F8FAFC] border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] hover:bg-[#FAF6ED] transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Application</span>
        </button>
      </div>

      <div className="editorial-card p-8 sm:p-10 space-y-8">
        <div className="border-b border-[#F0ECE3] pb-6 dark:border-[#1E2E44] space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF6ED] px-3 py-1 text-xs font-bold text-[#C86D51] border border-[#EAE5D9] dark:bg-[#16243A] dark:border-[#22334A]">
            <Award className="h-4 w-4" />
            <span>Educator SaaS Terms of Service</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Call to Teach Terms &amp; Conditions
          </h1>
          <p className="text-xs text-[#64748B] font-medium">
            Platform Service Agreement | Effective: October 2026
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
            1. Nature of the Service
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#475569] dark:text-[#CBD5E1]">
            Call to Teach provides automated AI telephony screening, voice inquiry processing, and contact management software for individual tutors, home educators, and private coaching centres.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
            2. Educator Knowledge Base Responsibility
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#475569] dark:text-[#CBD5E1]">
            Teachers are responsible for verifying that their published fee structures, batch hours, and refund policies in Call to Teach reflect accurate terms. The AI engine strictly adheres to these submitted records.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
            3. Telecommunication Compliance
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#475569] dark:text-[#CBD5E1]">
            Call routing and telephony integrations conform to Telecom Regulatory Authority of India (TRAI) directives regarding commercial communications and DND (Do-Not-Disturb) screening.
          </p>
        </div>
      </div>
    </div>
  );
};
