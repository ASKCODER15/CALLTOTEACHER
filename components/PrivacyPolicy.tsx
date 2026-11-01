'use client';

import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Award, Check } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
            <ShieldCheck className="h-4 w-4" />
            <span>Digital Personal Data Protection (DPDP) Act, 2023 Compliant</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Call to Teach Privacy Policy
          </h1>
          <p className="text-xs text-[#64748B] font-medium">
            Call to Teach SaaS Platform | Last Updated: October 2026
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
            1. Commitment to Educator and Caller Privacy
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#475569] dark:text-[#CBD5E1]">
            Call to Teach operates as an intelligent call screening and reception service for independent tutors, private teachers, and educational institutes across India. We strictly respect the privacy of educators, their students, inquiring parents, and trusted contacts. This Privacy Policy outlines how voice audio, call logs, inquiry summaries, and contact whitelists are handled in compliance with the Digital Personal Data Protection Act, 2023.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
            2. Data Categories We Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-[#EAE5D9] dark:border-[#22334A] p-4 space-y-1.5 bg-[#FBF9F5] dark:bg-[#0C1420]">
              <span className="font-bold text-[#132238] dark:text-[#F8FAFC] block">Educator Knowledge Base</span>
              <p className="text-[#64748B] dark:text-[#94A3B8]">
                Verified teacher name, subjects taught, fee schedules, batch timings, and FAQ responses entered voluntarily by the tutor.
              </p>
            </div>
            <div className="rounded-xl border border-[#EAE5D9] dark:border-[#22334A] p-4 space-y-1.5 bg-[#FBF9F5] dark:bg-[#0C1420]">
              <span className="font-bold text-[#132238] dark:text-[#F8FAFC] block">Whitelist Contacts</span>
              <p className="text-[#64748B] dark:text-[#94A3B8]">
                Names, phone numbers, and transfer rules designated by the teacher for emergency family access.
              </p>
            </div>
            <div className="rounded-xl border border-[#EAE5D9] dark:border-[#22334A] p-4 space-y-1.5 bg-[#FBF9F5] dark:bg-[#0C1420]">
              <span className="font-bold text-[#132238] dark:text-[#F8FAFC] block">Voice Audio &amp; Transcripts</span>
              <p className="text-[#64748B] dark:text-[#94A3B8]">
                Inbound caller speech recordings processed for speech recognition and converted to text for query resolution.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
            3. Strict Non-Monetization Guarantee
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#475569] dark:text-[#CBD5E1]">
            We never sell, rent, or trade educator profiles, caller telephone numbers, or academic pricing information to third-party ad networks, marketing agencies, or aggregators.
          </p>
        </div>
      </div>
    </div>
  );
};
