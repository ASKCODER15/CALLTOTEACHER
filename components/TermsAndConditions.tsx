'use client';

import React from 'react';
import { FileText, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TermsAndConditionsProps {
  onBack: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack }) => {
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
          <div className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <FileText className="h-4 w-4" />
            <span>Standard Service Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Terms and Conditions
          </h1>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Last Updated: October 2026 | Applicable to all registered tutors and demo users
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            By accessing or using the TalktoTeach and CallSetu software platforms, you agree to be bound by these Terms and Conditions. If you are registering on behalf of a coaching institute, tutorial academy, or school, you represent that you possess the authority to bind such entity to these terms.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Scope of Service &amp; Administrative Nature
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            TalktoTeach provides an automated reception and call management workflow tool designed to route routine incoming telephone inquiries during active classroom hours. The platform functions strictly as an administrative assistant.
          </p>
          <div className="rounded-lg border border-amber-300 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 space-y-1">
            <span className="font-bold block">Important Emergency Notice:</span>
            <span className="font-medium">
              TalktoTeach is NOT a substitute for emergency dispatch services (such as 112 in India). Callers requiring urgent medical, fire, or police assistance must dial official public emergency authorities directly.
            </span>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Responsibility for Accurate Class Information
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            The tutor or coaching institute is solely responsible for ensuring the accuracy and currency of published tuition fees, course materials, batch timings, and center locations entered into their Class Profile. CallSetu answers incoming callers based strictly on the tutor&apos;s configured data.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Synthetic Interactive Preview Disclaimer
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            The interactive Call Simulator provided within the free preview operates with synthetic sample data for coaching demonstration purposes. It does not initiate actual telecommunication network calls or bill telecommunication charges to your SIM card or carrier.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Acceptable Use Policy
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            You agree not to use the platform to:
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-4 list-disc font-medium">
            <li>Engage in automated unsolicited telemarketing or spam calls (TRAI regulations compliant).</li>
            <li>Impersonate legal, medical, or government authorities.</li>
            <li>Publish fraudulent course accreditations or fictitious fee guarantees.</li>
            <li>Interfere with the security or isolation of other educators&apos; accounts.</li>
          </ul>
        </div>

        {/* Section 6 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            6. Limitation of Liability
          </h2>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            To the maximum extent permitted by Indian law, TalktoTeach shall not be liable for any indirect, incidental, or consequential damages resulting from network carrier outages, telecom operator routing failures, or missed inquiries due to incorrect tutor schedule inputs.
          </p>
        </div>

        {/* Section 7 */}
        <div className="border-t border-slate-200 pt-6 dark:border-slate-800 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Governing Law &amp; Jurisdiction:
          </p>
          <p>These terms are governed by the laws of India. Courts in Pune, Maharashtra shall have exclusive jurisdiction.</p>
        </div>
      </div>
    </div>
  );
};
