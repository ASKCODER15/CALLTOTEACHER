'use client';

import React from 'react';
import {
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Check,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: (tab?: string) => void;
  onLaunchSimulation: (scenarioType?: 'scenario_a' | 'scenario_b' | 'scenario_c') => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenDomain: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onLaunchSimulation,
  onOpenPrivacy,
  onOpenTerms,
  onOpenDomain
}) => {
  return (
    <div className="min-h-screen space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 md:pt-10 md:pb-16 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Product Kicker */}
              <div className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-900 border border-indigo-200 dark:bg-indigo-950/80 dark:border-indigo-800 dark:text-indigo-200">
                <ShieldCheck className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                <span>CallSetu Telephony Workflow for Indian Coaching Institutes</span>
              </div>

              {/* Mandatory Headline */}
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white leading-[1.15]">
                Har call sambhalo. <br />
                <span className="text-indigo-700 dark:text-indigo-400">
                  Class pe focus karo.
                </span>
              </h1>

              {/* Hindi subtext */}
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                हर ज़रूरी कॉल अटेंड होगी - बिना क्लास डिस्टर्ब किए।
              </p>

              <p className="max-w-xl text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                During active batches, answering phone calls disrupts students, while ignoring calls risks missing prospective student admissions or urgent family notices. CallSetu answers routine parent inquiries using your verified course fees and schedules, evaluates trusted contact permissions, and screens personal calls for 1-tap authorization.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onEnterApp('overview')}
                  className="btn-primary flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold shadow-sm"
                >
                  <span>Open Teacher Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => onLaunchSimulation('scenario_b')}
                  className="btn-secondary flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold shadow-xs"
                >
                  <PhoneCall className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                  <span>Simulate Parent Inquiry Call</span>
                </button>

                <button
                  onClick={onOpenDomain}
                  className="btn-secondary flex items-center gap-1.5 rounded-lg px-3.5 py-3 text-xs font-bold shadow-xs"
                >
                  <Globe className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                  <span>Custom Domain</span>
                </button>
              </div>

              {/* Functional Principles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Verified Fee Data</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Only quotes tutor&apos;s verified rates</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Strict Whitelist</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Rule-based trusted contact routing</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Teacher Privacy</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Completely isolated data per tutor</span>
                </div>
              </div>
            </div>

            {/* Right Architectural Schematic */}
            <div className="lg:col-span-5">
              <div className="pro-card rounded-xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Active Batch Guard Mode
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                    04:00 PM - 09:30 PM
                  </span>
                </div>

                {/* Simulated Screen Card */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Incoming Call Identified
                    </span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                      +91 98901 88776
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="rounded border border-indigo-200 bg-indigo-50/80 p-3 text-indigo-950 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-100">
                      <p className="font-bold text-[11px] uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                        Parent Query:
                      </p>
                      <p className="text-xs mt-1 font-semibold leading-relaxed">
                        &quot;Class 10 Board science batch monthly fees kitni hai?&quot;
                      </p>
                    </div>

                    <div className="rounded border border-emerald-300 bg-white p-3 text-slate-900 shadow-xs dark:border-emerald-800 dark:bg-slate-850 dark:text-slate-100">
                      <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                        CallSetu Automated Response:
                      </p>
                      <p className="text-xs mt-1 font-medium leading-relaxed">
                        &quot;Class 10 monthly fee Rs 2,800 hai, jisme weekly mock test paper aur study notes include rehte hain. Kal 4:30 PM trial demo class attend karna chahenge?&quot;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <span>Outcome: <strong className="text-emerald-700 dark:text-emerald-400">Answered by AI</strong></span>
                    <span>Teacher Disturbance: <strong className="text-slate-900 dark:text-white">0 Seconds</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => onLaunchSimulation('scenario_b')}
                  className="w-full btn-secondary rounded-lg py-2.5 text-xs font-bold"
                >
                  Test Interactive Call Simulator
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Indian Teacher Problem Section */}
      <section id="problem" className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-left space-y-2">
            <h2 className="text-xs font-bold tracking-wider uppercase text-indigo-700 dark:text-indigo-400">
              Operational Realities
            </h2>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Why Unmanaged Calling Impacts Independent Educators
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
              Unlike larger commercial coaching chains with staffed front desks, independent tutors and home tuition teachers must balance active instruction with administrative responsiveness.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="pro-card rounded-xl p-6 space-y-2.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">1. Instructional Continuity</h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Interrupting a complex derivation or board exam review to answer a routine fee query breaks the focus of fifteen to twenty students present in the batch.
              </p>
            </div>

            <div className="pro-card rounded-xl p-6 space-y-2.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">2. Timely Parent Inquiries</h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Prospective parents calling during peak evening hours often seek quick answers regarding batches, demo classes, and monthly fees. Unanswered calls result in lost inquiries.
              </p>
            </div>

            <div className="pro-card rounded-xl p-6 space-y-2.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">3. Genuine Urgent Matters</h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Keeping the phone entirely on silent creates anxiety regarding family emergencies, school principal calls, or critical student transportation updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Scenarios Section */}
      <section id="scenarios" className="py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-left space-y-2">
            <h2 className="text-xs font-bold tracking-wider uppercase text-indigo-700 dark:text-indigo-400">
              Deterministic Logic
            </h2>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Three Specific Caller Scenarios Handled
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-normal">
              Every caller is evaluated strictly against the educator&apos;s verified rules.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scenario A */}
            <div className="pro-card rounded-xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200">
                  Scenario A
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Approved Trusted Contact
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  Incoming number matches the teacher&apos;s pre-configured trusted contact list (spouse, school head, or clinic).
                </p>
                <div className="rounded border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1 dark:border-slate-800 dark:bg-slate-900">
                  <span className="font-bold text-slate-900 dark:text-white block">Configured Behavior:</span>
                  <p className="text-slate-700 dark:text-slate-300 text-xs font-normal leading-relaxed">
                    Evaluates rule &quot;During teaching hours&quot; and presents a silent 1-tap screen card on the teacher&apos;s device to authorize transfer.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onLaunchSimulation('scenario_a')}
                className="btn-secondary w-full rounded-lg py-2.5 text-xs font-bold"
              >
                Simulate Scenario A
              </button>
            </div>

            {/* Scenario B */}
            <div className="pro-card rounded-xl p-6 flex flex-col justify-between space-y-4 border-indigo-400">
              <div className="space-y-3">
                <span className="rounded bg-violet-50 px-2 py-1 text-xs font-bold text-violet-900 dark:bg-violet-950 dark:text-violet-200">
                  Scenario B
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Parent Inquiry (Fees &amp; Timings)
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  A prospective parent calls to ask about monthly tuition fees, seat availability, test series, or trial classes.
                </p>
                <div className="rounded border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs space-y-1 dark:border-indigo-900 dark:bg-indigo-950/40">
                  <span className="font-bold text-indigo-950 dark:text-indigo-200 block">Configured Behavior:</span>
                  <p className="text-indigo-900 dark:text-indigo-300 text-xs font-medium leading-relaxed">
                    CallSetu answers with exact verified fees and timings from the Class Profile, books a demo trial, and logs the inquiry.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onLaunchSimulation('scenario_b')}
                className="btn-primary w-full rounded-lg py-2.5 text-xs font-bold"
              >
                Simulate Scenario B
              </button>
            </div>

            {/* Scenario C */}
            <div className="pro-card rounded-xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="rounded bg-amber-50 px-2 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                  Scenario C
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Personal / Unknown Caller
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  A courier delivery associate or unknown caller asks to speak to the teacher immediately.
                </p>
                <div className="rounded border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1 dark:border-slate-800 dark:bg-slate-900">
                  <span className="font-bold text-slate-900 dark:text-white block">Security Policy:</span>
                  <p className="text-slate-700 dark:text-slate-300 text-xs font-normal leading-relaxed">
                    Identity is never auto-trusted. CallSetu asks the specific purpose, holds the line, and alerts the educator for authorization.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onLaunchSimulation('scenario_c')}
                className="btn-secondary w-full rounded-lg py-2.5 text-xs font-bold"
              >
                Simulate Scenario C
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Engine Architecture Section */}
      <section id="how-it-works" className="py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <h2 className="text-xs font-bold tracking-wider uppercase text-indigo-700 dark:text-indigo-400">
                System Workflow
              </h2>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                How CallSetu Processes Inbound Calls
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Structured decision rules prevent unauthorized interruptions while ensuring legitimate inquiries receive immediate answers.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: 'Isolated Database Architecture', desc: 'Each tutor account has segregated contacts, syllabus, and call history.' },
                  { title: 'Language Preferences', desc: 'Communicates in conversational Hinglish, pure Hindi, Indian English, Gujarati, or Marathi.' },
                  { title: 'Deterministic Fallback Handling', desc: 'If the teacher does not respond, CallSetu takes a detailed message or offers callback scheduling.' },
                  { title: 'Custom Domain Hosting', desc: 'Map your coaching center website to your own custom domain name.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-emerald-800 mt-0.5 shrink-0 dark:bg-emerald-950 dark:text-emerald-300">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="pro-card rounded-xl p-6 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Call Progression Pipeline
                </h4>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                    <span className="font-mono font-bold text-indigo-700 text-sm">01</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Teaching Schedule Check</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">Evaluates active batch timing (e.g. 04:00 PM - 09:30 PM).</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                    <span className="font-mono font-bold text-indigo-700 text-sm">02</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Directory Verification</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">Matches number against configured Trusted Directory rules.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                    <span className="font-mono font-bold text-indigo-700 text-sm">03</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Knowledge Base Grounding</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">Answers inquiries using tutor-verified fee tables and batch hours.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                    <span className="font-mono font-bold text-indigo-700 text-sm">04</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">1-Tap Screen Authorization</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">Teacher approves transfer or CallSetu records follow-up message.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Readiness & Custom Domain Banner */}
      <section className="pro-card rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Connected Custom Domain &amp; Institutional Branding
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal">
              Connect your coaching institute&apos;s own domain name with automated SSL and CNAME record verification.
            </p>
          </div>

          <button
            onClick={onOpenDomain}
            className="btn-primary self-start rounded-lg px-4 py-2.5 text-xs font-bold whitespace-nowrap"
          >
            Configure Custom Domain
          </button>
        </div>
      </section>

      {/* Clean Footer with Privacy, Terms, and Domain Links */}
      <footer className="border-t border-slate-200 pt-8 pb-4 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">
              TalktoTeach / CallSetu
            </p>
            <p className="text-xs mt-0.5 text-slate-600 dark:text-slate-400 font-medium">
              Automated call screening software for educational tutors and coaching centers across India.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <button
              onClick={onOpenPrivacy}
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-700 hover:underline"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={onOpenTerms}
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-700 hover:underline"
            >
              Terms and Conditions
            </button>
            <span>·</span>
            <button
              onClick={onOpenDomain}
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-700 hover:underline"
            >
              Custom Domain
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
