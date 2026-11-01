'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Check,
  Globe,
  Sparkles,
  MessageSquare,
  Lock,
  Play,
  Layers,
  GraduationCap,
  Users,
  Zap,
  HelpCircle,
  Radio,
  BookOpen
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: (tab?: string, scenario?: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenDomain: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenPrivacy,
  onOpenTerms,
  onOpenDomain
}) => {
  const { currentTeacher } = useApp();

  return (
    <div className="space-y-20 pb-20 max-w-6xl mx-auto">
      {/* 1. HERO SECTION */}
      <section className="pt-10 sm:pt-16 text-center space-y-6 max-w-4xl mx-auto">
        {/* Editorial Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D9D1C2] dark:border-[#2E4362] bg-[#FAF6ED] dark:bg-[#16243A] text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] tracking-wide uppercase">
          <Sparkles className="h-3.5 w-3.5 text-[#C86D51]" />
          <span>The AI Call Screening Platform for Educators</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold text-[#132238] dark:text-[#F8FAFC] tracking-tight leading-[1.08] text-balance">
          You teach.
          <br />
          <span className="text-[#C86D51] italic">We handle the calls.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-xl text-[#475569] dark:text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed text-balance font-normal">
          An AI receptionist built for teachers, tutors, and coaching classes. Stay focused on your students while routine inquiries and incoming calls are handled intelligently.
        </p>

        {/* Primary Call to Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onEnterApp('overview')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Open Educator Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEnterApp('simulator', 'scenario_b')}
            className="w-full sm:w-auto px-7 py-4 rounded-full border border-[#D9D1C2] dark:border-[#22334A] bg-white dark:bg-[#121E30] text-[#132238] dark:text-[#F8FAFC] text-sm font-bold hover:border-[#1B365D] transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <Play className="h-4 w-4 text-[#C86D51] fill-current" />
            <span>Test Live Voice Call</span>
          </button>
        </div>

        {/* Quiet Trust Metrics */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#3B7A57]" />
            Strict Zero-Hallucination Guardrail
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#3B7A57]" />
            1-Tap WhatsApp Callbacks
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#3B7A57]" />
            Natural Indian Voice Accents
          </span>
        </div>
      </section>

      {/* 2. PRODUCT DEMONSTRATION VISUAL */}
      <section className="editorial-card p-6 sm:p-8 parchment-banner rounded-3xl shadow-sm border border-[#E8E0D2] dark:border-[#22334A] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D2] dark:border-[#22334A]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">
              Live Assistant Showcase
            </span>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#132238] dark:text-[#F8FAFC]">
              How Call to Teach Protects Teaching Hours
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3B7A57] animate-pulse" />
            <span className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC]">
              AI Shield Active: 4:00 PM – 9:00 PM
            </span>
          </div>
        </div>

        {/* Simulated Dialogue Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: Caller Question */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121E30] border border-[#EAE5D9] dark:border-[#22334A] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Mrs. Neha Kulkarni (Parent)
                </span>
                <span className="text-[10px] text-[#64748B]">Calling at 5:14 PM</span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#CBD5E1] italic leading-relaxed">
                &ldquo;Namaste, I want to inquire about Class 10 tuition fees and evening batch timings for my son.&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#132238] dark:bg-[#1B365D] text-white space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#C5A880]">
                  Call to Teach AI Receptionist
                </span>
                <span className="text-[10px] text-slate-300">Responds in 1.2s</span>
              </div>
              <p className="text-xs leading-relaxed">
                &ldquo;Namaste! At Verma Science Tutorial, Class 10 Board Masterclass fee is ₹3,500 per month. Batches run Monday to Saturday from 4:30 PM to 6:00 PM. Two free trial demo classes are offered before admission.&rdquo;
              </p>
            </div>
          </div>

          {/* Right: What the Teacher Experiences */}
          <div className="rounded-2xl border border-[#D9D1C2] dark:border-[#22334A] bg-[#FAF6ED] dark:bg-[#16243A] p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3B7A57] uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>Teacher Experience: 0 Interruptions</span>
            </div>
            <h3 className="font-editorial text-base sm:text-lg font-bold text-[#132238] dark:text-[#F8FAFC]">
              Class Stays 100% Focused
            </h3>
            <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
              Mrs. Sunita Verma continues teaching Physics without pausing her lecture or fumbling for her phone. The parent receives instant, accurate information, and an organized summary is sent to the teacher&apos;s WhatsApp after class.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs font-semibold text-[#1B365D] dark:text-[#93B4E0]">
              <span>Logged to Ledger</span>
              <span>·</span>
              <span>Strictly Non-Hallucinatory</span>
              <span>·</span>
              <span>Parent Impressed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CALLER SCENARIOS */}
      <section className="space-y-8" id="scenarios">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#C86D51] uppercase tracking-wider">
            Intelligent Call Screening
          </span>
          <h2 className="font-editorial text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Four Intelligent Caller Scenarios
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1]">
            Different callers need different treatments. Call to Teach applies the right rule every time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Scenario 1 */}
          <div className="editorial-card p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-[#EDF3FA] dark:bg-[#1A2D4A] flex items-center justify-center text-[#1B365D] dark:text-[#93B4E0]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                1. Trusted Whitelist
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Spouses, children&apos;s schools, and family contacts pass through directly or trigger a discreet 1-tap notification.
              </p>
            </div>
            <button
              onClick={() => onEnterApp('simulator', 'scenario_a')}
              className="text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] hover:underline flex items-center gap-1 pt-2 border-t border-[#F0ECE3] dark:border-[#1E2E44]"
            >
              <span>Test Whitelist Call</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Scenario 2 */}
          <div className="editorial-card p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-[#FDF3F0] dark:bg-[#2C1E1B] flex items-center justify-center text-[#C86D51]">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                2. Parent Inquiries
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Answers fees, batch timings, notes, and trial demo policies strictly from your verified teacher knowledge base.
              </p>
            </div>
            <button
              onClick={() => onEnterApp('simulator', 'scenario_b')}
              className="text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] hover:underline flex items-center gap-1 pt-2 border-t border-[#F0ECE3] dark:border-[#1E2E44]"
            >
              <span>Test Parent Enquiry</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Scenario 3 */}
          <div className="editorial-card p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-[#EDF3FA] dark:bg-[#1A2D4A] flex items-center justify-center text-[#1B365D] dark:text-[#93B4E0]">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                3. Personal Transfers
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Personal callers are screened first. The teacher sees the caller name and reason before choosing to accept or decline.
              </p>
            </div>
            <button
              onClick={() => onEnterApp('simulator', 'scenario_c')}
              className="text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] hover:underline flex items-center gap-1 pt-2 border-t border-[#F0ECE3] dark:border-[#1E2E44]"
            >
              <span>Test Personal Transfer</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Scenario 4 */}
          <div className="editorial-card p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-[#FAF6ED] dark:bg-[#2A241A] flex items-center justify-center text-[#C5A880]">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                4. Vague &amp; Spam Callers
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Telemarketers, loans, and unclear callers are deflected gracefully with a polite message. Your teaching stays peaceful.
              </p>
            </div>
            <button
              onClick={() => onEnterApp('simulator', 'scenario_d')}
              className="text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] hover:underline flex items-center gap-1 pt-2 border-t border-[#F0ECE3] dark:border-[#1E2E44]"
            >
              <span>Test Spam Deflection</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. THREE-LAYER PROTECTION FOR TEACHERS */}
      <section className="editorial-card p-8 space-y-6" id="protection">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">
            Architected for Indian Educators
          </span>
          <h2 className="font-editorial text-3xl font-bold text-[#132238] dark:text-[#F8FAFC] mt-1">
            3-Layer Classroom Protection
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2 p-4 rounded-2xl bg-[#FAF6ED] dark:bg-[#16243A] border border-[#EAE5D9] dark:border-[#22334A]">
            <div className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
              Layer 1: Priority Whitelist
            </div>
            <p className="text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
              Family, school authorities, and medical contacts bypass screening automatically so critical personal calls never get blocked.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-[#EDF3FA] dark:bg-[#1A2D4A] border border-[#D3E0EA] dark:border-[#22334A]">
            <div className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
              Layer 2: Grounded Answering
            </div>
            <p className="text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
              Answers routine tuition fees, batch timings, and syllabi strictly from your saved profile without fabricating unlisted courses.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-[#EDF6F0] dark:bg-[#13281E] border border-[#C4E1CC] dark:border-[#23354C]">
            <div className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
              Layer 3: 1-Tap Transfer Approval
            </div>
            <p className="text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
              When a caller needs personal attention, you get a clean 1-tap prompt with their name and reason. Accept, decline, or let timeout queue a callback.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRIVACY & TRUST COMMITMENT */}
      <section className="parchment-banner rounded-3xl p-8 border border-[#E8E0D2] dark:border-[#22334A] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B7A57] uppercase tracking-wider">
            <Lock className="h-3.5 w-3.5" />
            <span>Strict Privacy &amp; Data Security</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Your Phone Numbers &amp; Student Data Stay Private
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
            Call to Teach never sells educator data or caller lists. Phone numbers in the whitelist are masked, and call transcripts are stored with private encryption.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={onOpenPrivacy}
            className="px-5 py-2.5 rounded-full border border-[#D9D1C2] bg-white dark:bg-[#121E30] text-xs font-bold text-[#132238] dark:text-[#F8FAFC] hover:border-[#1B365D] transition-colors"
          >
            Read Privacy Policy
          </button>
          <button
            onClick={onOpenTerms}
            className="px-5 py-2.5 rounded-full border border-[#D9D1C2] bg-white dark:bg-[#121E30] text-xs font-bold text-[#132238] dark:text-[#F8FAFC] hover:border-[#1B365D] transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section className="text-center space-y-6 pt-6">
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#132238] dark:text-[#F8FAFC]">
          Ready to teach without interruptions?
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
          Launch your educator workspace and configure your AI call manager in less than 2 minutes.
        </p>
        <button
          onClick={() => onEnterApp('overview')}
          className="px-8 py-4 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-sm font-bold shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Launch Call to Teach</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {/* 7. FOOTER */}
      <footer className="pt-12 border-t border-[#EAE5D9] dark:border-[#22334A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#132238] dark:text-[#F8FAFC]">
            Call to Teach
          </span>
          <span>·</span>
          <span>© 2026 Call to Teach. Built for Educators across India.</span>
        </div>

        <div className="flex items-center gap-4 font-semibold">
          <button onClick={onOpenPrivacy} className="hover:underline">
            Privacy Policy
          </button>
          <button onClick={onOpenTerms} className="hover:underline">
            Terms &amp; Conditions
          </button>
          <button onClick={onOpenDomain} className="hover:underline">
            Domain Settings
          </button>
        </div>
      </footer>
    </div>
  );
};
