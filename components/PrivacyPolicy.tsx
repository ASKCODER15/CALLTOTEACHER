'use client';

import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Database, PhoneCall, Check } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="mx-auto max-w-4xl py-6 space-y-8 text-slate-800 dark:text-slate-200">
      {/* Top back button */}
      <div>
        <button
          onClick={onBack}
          className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Application</span>
        </button>
      </div>

      <div className="pro-card rounded-xl p-8 sm:p-10 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 dark:border-slate-800 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Digital Personal Data Protection (DPDP) Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Last Updated: October 2026 | Effective Date: October 2026
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Commitment to Educator and Student Privacy
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            TalktoTeach (&quot;CallSetu&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides an automated call screening and course inquiry routing platform designed for independent tutors, home tuitions, and coaching institutes across India. We recognize that student records, parent phone numbers, and tuition fee schedules are confidential. This Privacy Policy sets out how we handle data collected through our platform in strict accordance with the Digital Personal Data Protection Act, 2023 (India) and applicable IT rules.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Information We Collect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="rounded-lg border border-slate-300 p-4 space-y-1.5 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block">Tutor Profile Data</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Teacher name, official phone number, coaching center location, subjects, grade levels, and verified course fee schedules.
              </p>
            </div>
            <div className="rounded-lg border border-slate-300 p-4 space-y-1.5 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block">Trusted Directory Data</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Phone numbers, names, and explicit routing rules (Always, During teaching hours, or Never) entered manually by the teacher.
              </p>
            </div>
            <div className="rounded-lg border border-slate-300 p-4 space-y-1.5 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block">Call Interaction Logs</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Caller identification, call timestamp, duration, course inquiry reason, and automated screening summary.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Strict Data Isolation Between Teachers
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            Every tutor account on TalktoTeach operates inside an isolated logical tenant. No tutor, administrator, or outside user has access to another educator&apos;s student marks, fee collections, trusted family numbers, or call logs. We do not aggregate or resell tutor contact lists.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Purpose Limitation and Processing
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            Data provided to CallSetu is processed solely for the following explicit purposes:
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-4 list-disc font-medium">
            <li>Answering routine prospective parent inquiries using the tutor&apos;s verified syllabus and fee tables.</li>
            <li>Evaluating configured whitelist permissions for trusted contacts during active batch hours.</li>
            <li>Transmitting 1-tap transfer prompts to the teacher&apos;s authorized screen.</li>
            <li>Generating post-call follow-up reminders for the tutor.</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. No Third-Party Data Monetization
          </h2>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            We never sell, rent, or lease educator or student information to ed-tech aggregators, advertisers, or loan providers. Inquiries submitted via CallSetu remain the sole property of the coaching center.
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            6. Tutor Data Rights and Deletion
          </h2>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Tutors retain full rights to export, correct, or permanently erase their class profiles, call history records, and trusted directory entries at any point via the dashboard settings or by contacting privacy@talktoteach.in.
          </p>
        </div>

        {/* Section 7 */}
        <div className="border-t border-slate-200 pt-6 dark:border-slate-800 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Grievance Officer:
          </p>
          <p>TalktoTeach Compliance Cell | Email: privacy@talktoteach.in</p>
          <p>Registered Office: Pune, Maharashtra, India - 411038</p>
        </div>
      </div>
    </div>
  );
};
