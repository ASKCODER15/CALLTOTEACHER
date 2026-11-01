'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Sliders,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Users,
  User,
  Zap,
  ArrowRight,
  Info,
  Radio,
  Volume2,
  Play,
  Loader2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { CallSettings } from '@/lib/types';
import { speakText, checkGnaniStatus } from '@/lib/gnani-voice';

export const CallSettingsManager: React.FC = () => {
  const { currentTeacher, updateCallSettings } = useApp();
  const settings = currentTeacher.callSettings;

  const [formState, setFormState] = useState<CallSettings>({
    ...settings,
    aiVoice: settings.aiVoice || 'Nalini',
    aiModel: settings.aiModel || 'timbre-v2.5',
    aiSpeed: settings.aiSpeed ?? 1.0,
    aiLanguage: settings.aiLanguage || 'hinglish',
    aiVoiceTone: settings.aiVoiceTone || 'warm_respectful'
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [voiceTestFeedback, setVoiceTestFeedback] = useState<string | null>(null);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleToggleDay = (day: string) => {
    const currentDays = formState.teachingDays || [];
    const updated = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    setFormState({ ...formState, teachingDays: updated });
  };

  const handleTestVoice = async () => {
    setIsTestingVoice(true);
    setVoiceTestFeedback(null);
    try {
      const testText = `नमस्ते! मैं कॉल टू टीच की AI रिसेप्शनिस्ट हूँ। वर्तमान कैरेक्टर ${formState.aiVoice || 'Nalini'} और मॉडल ${formState.aiModel || 'timbre-v2.5'} सक्रिय है।`;
      const result = await speakText(testText, {
        voice: formState.aiVoice || 'Nalini',
        model: formState.aiModel || 'timbre-v2.5',
        speed: formState.aiSpeed || 1.0,
        language: formState.aiLanguage === 'english' ? 'en-IN' : formState.aiLanguage === 'marathi' ? 'mr-IN' : 'hi-IN'
      });
      if (result.success) {
        setVoiceTestFeedback(`Voice played successfully with ${formState.aiVoice} (${result.provider === 'gnani' ? 'Gnani 48kHz' : 'Browser Audio'})`);
      }
    } catch (err: any) {
      setVoiceTestFeedback(err.message || 'Error testing voice.');
    } finally {
      setIsTestingVoice(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateCallSettings(formState);
    setSaveSuccess(true);

    // Reconnect status check
    await checkGnaniStatus().catch(() => {});

    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="parchment-banner rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] uppercase tracking-wider">
            <Sliders className="h-3.5 w-3.5 text-[#C86D51]" />
            <span>Automated Screening &amp; Persona Logic</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Call Rules &amp; AI Receptionist Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] max-w-2xl leading-relaxed">
            Configure the visual IF/THEN rules for call deflection, select your AI character voice model, and set teaching hour shields.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDF6F0] text-[#3B7A57] text-xs font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Saved &amp; Reconnected!</span>
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Rules &amp; Reconnect</span>
          </button>
        </div>
      </div>

      {/* AI Receptionist Voice Persona & Character Model Card */}
      <div className="editorial-card p-6 space-y-5 border-l-4 border-l-[#1B365D]">
        <div className="pb-3 border-b border-[#F0ECE3] dark:border-[#1E2E44] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-[#1B365D] dark:text-[#93B4E0]" />
              <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                AI Character Voice &amp; Neural Model Selection
              </h3>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              The AI receptionist answers caller queries using this exact voice character and acoustic model.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FAF6ED] text-[#1B365D] border border-[#EAE5D9] dark:border-[#22334A] dark:bg-[#16243A] dark:text-[#93B4E0]">
              Active: {formState.aiVoice || 'Nalini'} · {formState.aiModel || 'timbre-v2.5'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* AI Character */}
          <div>
            <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1.5">
              AI Voice Character
            </label>
            <select
              value={formState.aiVoice || 'Nalini'}
              onChange={(e) => setFormState({ ...formState, aiVoice: e.target.value })}
              className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
            >
              <optgroup label="Female Educator Voices">
                <option value="Nalini">Nalini (Default · Warm Polite Academic)</option>
                <option value="Chitra">Chitra (Articulate Pan-India Hindi)</option>
                <option value="Radhika">Radhika (Polite Formal Educator)</option>
                <option value="Bhavna">Bhavna (Gentle Receptionist)</option>
                <option value="Kaveri">Kaveri (Clear Conversational)</option>
                <option value="Tanvi">Tanvi (Modern Academic Reception)</option>
                <option value="Vidya">Vidya (Classical &amp; Scholarly)</option>
                <option value="Gauri">Gauri (Calm &amp; Reassuring)</option>
              </optgroup>
              <optgroup label="Male Educator Voices">
                <option value="Deepak">Deepak (Male · Professional Academic)</option>
                <option value="Roopesh">Roopesh (Male · Clear Instructor)</option>
                <option value="Farhan">Farhan (Male · Warm &amp; Articulate)</option>
                <option value="Pranav">Pranav (Male · Energetic Tutor)</option>
                <option value="Gaurav">Gaurav (Male · Formal Administrator)</option>
                <option value="Abhimanyu">Abhimanyu (Male · Authoritative Senior)</option>
              </optgroup>
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1.5">
              Synthesis Neural Model
            </label>
            <select
              value={formState.aiModel || 'timbre-v2.5'}
              onChange={(e) => setFormState({ ...formState, aiModel: e.target.value })}
              className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
            >
              <option value="timbre-v2.5">timbre-v2.5 (High Definition 48kHz)</option>
              <option value="timbre-v2">timbre-v2 (Standard Multi-lingual)</option>
            </select>
          </div>

          {/* Primary Language */}
          <div>
            <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1.5">
              Primary Language
            </label>
            <select
              value={formState.aiLanguage || 'hinglish'}
              onChange={(e) => setFormState({ ...formState, aiLanguage: e.target.value })}
              className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
            >
              <option value="hinglish">Hinglish (Natural Conversational)</option>
              <option value="hindi">Hindi (Standard Shuddh / Pan-India)</option>
              <option value="english">Indian English (Formal &amp; Clear)</option>
              <option value="marathi">Marathi (Maharashtra State)</option>
              <option value="tamil">Tamil (South Regional)</option>
              <option value="telugu">Telugu (South Regional)</option>
              <option value="kannada">Kannada (South Regional)</option>
            </select>
          </div>

          {/* Voice Tone */}
          <div>
            <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1.5">
              Conversational Tone
            </label>
            <select
              value={formState.aiVoiceTone || 'warm_respectful'}
              onChange={(e) => setFormState({ ...formState, aiVoiceTone: e.target.value as any })}
              className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
            >
              <option value="warm_respectful">Warm &amp; Respectful (Educator)</option>
              <option value="polite_formal">Polite &amp; Formal (Institute Desk)</option>
              <option value="quick_direct">Quick &amp; Direct (Concise Screening)</option>
            </select>
          </div>
        </div>

        {/* Speed Slider & Test Button Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#F0ECE3] dark:border-[#1E2E44]">
          <div className="space-y-1 sm:max-w-xs w-full text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#132238] dark:text-[#F8FAFC]">
                Speech Cadence / Speed
              </label>
              <span className="font-mono text-xs font-bold text-[#1B365D] dark:text-[#93B4E0]">
                {(formState.aiSpeed ?? 1.0).toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.3"
              step="0.05"
              value={formState.aiSpeed ?? 1.0}
              onChange={(e) => setFormState({ ...formState, aiSpeed: parseFloat(e.target.value) })}
              className="w-full accent-[#1B365D]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestVoice}
              disabled={isTestingVoice}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#1B365D] text-[#1B365D] dark:border-[#93B4E0] dark:text-[#93B4E0] hover:bg-[#1B365D] hover:text-white transition-all text-xs font-bold"
            >
              {isTestingVoice ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Synthesizing Voice...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Test Voice ({formState.aiVoice || 'Nalini'})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {voiceTestFeedback && (
          <div className="p-3 rounded-xl bg-[#FAF6ED] dark:bg-[#16243A] border border-[#EAE5D9] dark:border-[#22334A] text-xs text-[#132238] dark:text-[#F8FAFC] flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#C86D51] shrink-0" />
            <span>{voiceTestFeedback}</span>
          </div>
        )}
      </div>

      {/* Visual IF/THEN Call Handling Rule Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
            Active Screening Rules (Visual IF/THEN Logic)
          </h2>
          <span className="text-xs text-[#64748B]">Automated by Call to Teach</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rule 1: Parent Inquiries */}
          <div className="editorial-card p-5 space-y-3 border-l-4 border-l-[#C86D51]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#C86D51] uppercase tracking-wider text-[11px]">
                Rule 01 · Tuition Inquiries
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FDF3F0] text-[#C86D51] text-[10px]">
                Strict Grounding
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF6ED] dark:bg-[#16243A] text-[#132238] dark:text-[#F8FAFC] font-semibold">
                <span className="text-[#C86D51] font-bold">IF</span> a parent asks about tuition fees, courses, or batch timings
              </div>
              <div className="flex items-center justify-center text-[#64748B]">
                <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
              </div>
              <div className="p-2.5 rounded-xl bg-[#EDF3FA] dark:bg-[#1A2D4A] text-[#1B365D] dark:text-[#93B4E0] font-semibold">
                <span className="text-[#1B365D] dark:text-[#93B4E0] font-bold">THEN</span> answer immediately using verified profile records in {formState.aiVoice || 'Nalini'}&apos;s voice.
              </div>
            </div>
          </div>

          {/* Rule 2: Trusted Whitelist Contacts */}
          <div className="editorial-card p-5 space-y-3 border-l-4 border-l-[#3B7A57]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#3B7A57] uppercase tracking-wider text-[11px]">
                Rule 02 · Whitelist Priority
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#EDF6F0] text-[#3B7A57] text-[10px]">
                Caller ID Match
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF6ED] dark:bg-[#16243A] text-[#132238] dark:text-[#F8FAFC] font-semibold">
                <span className="text-[#3B7A57] font-bold">IF</span> an incoming number matches a saved Trusted Contact
              </div>
              <div className="flex items-center justify-center text-[#64748B]">
                <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
              </div>
              <div className="p-2.5 rounded-xl bg-[#EDF6F0] dark:bg-[#13281E] text-[#3B7A57] dark:text-[#5BA87B] font-semibold">
                <span className="text-[#3B7A57] font-bold">THEN</span> follow their individual permission (Always Pass, or 1-Tap prompt during batch hours).
              </div>
            </div>
          </div>

          {/* Rule 3: Personal Call Requests */}
          <div className="editorial-card p-5 space-y-3 border-l-4 border-l-[#1B365D]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#1B365D] dark:text-[#93B4E0] uppercase tracking-wider text-[11px]">
                Rule 03 · Personal Screening
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#EDF3FA] text-[#1B365D] text-[10px]">
                1-Tap Prompt
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF6ED] dark:bg-[#16243A] text-[#132238] dark:text-[#F8FAFC] font-semibold">
                <span className="text-[#1B365D] dark:text-[#93B4E0] font-bold">IF</span> a caller requests to speak directly with the teacher
              </div>
              <div className="flex items-center justify-center text-[#64748B]">
                <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
              </div>
              <div className="p-2.5 rounded-xl bg-[#EDF3FA] dark:bg-[#1A2D4A] text-[#1B365D] dark:text-[#93B4E0] font-semibold">
                <span className="text-[#1B365D] dark:text-[#93B4E0] font-bold">THEN</span> present an urgent 1-tap modal with caller name &amp; reason before transferring.
              </div>
            </div>
          </div>

          {/* Rule 4: Timeout & Callback Handling */}
          <div className="editorial-card p-5 space-y-3 border-l-4 border-l-[#C5A880]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#C5A880] uppercase tracking-wider text-[11px]">
                Rule 04 · No-Response Fallback
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FAF6ED] text-[#C5A880] text-[10px]">
                15s Timeout
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF6ED] dark:bg-[#16243A] text-[#132238] dark:text-[#F8FAFC] font-semibold">
                <span className="text-[#C5A880] font-bold">IF</span> teacher does not answer approval prompt within 15 seconds
              </div>
              <div className="flex items-center justify-center text-[#64748B]">
                <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6ED] dark:bg-[#2A241A] text-[#132238] dark:text-[#F8FAFC] font-semibold">
                <span className="text-[#C5A880] font-bold">THEN</span> take a polite message and log caller in Priority Callback Queue.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Hours Shield Configuration Card */}
      <div className="editorial-card p-6 space-y-5">
        <div className="pb-3 border-b border-[#F0ECE3] dark:border-[#1E2E44] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
              Teaching Hours Shield Schedule
            </h3>
            <p className="text-xs text-[#64748B]">
              Define the hours when live class defense is active.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#EDF6F0] text-[#3B7A57] text-xs font-bold">
            Shield Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
              Class Hours Start Time
            </label>
            <input
              type="text"
              value={formState.teachingStart}
              onChange={(e) => setFormState({ ...formState, teachingStart: e.target.value })}
              className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
              Class Hours End Time
            </label>
            <input
              type="text"
              value={formState.teachingEnd}
              onChange={(e) => setFormState({ ...formState, teachingEnd: e.target.value })}
              className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC]"
            />
          </div>
        </div>

        {/* Days of the Week Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#132238] dark:text-[#F8FAFC]">
            Active Teaching Days
          </label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => {
              const isSelected = formState.teachingDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleToggleDay(day)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#1B365D] text-white shadow-2xs'
                      : 'border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] text-[#64748B]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-[#D9D1C2] bg-[#FAF6ED] dark:bg-[#16243A] text-xs text-[#475569] dark:text-[#CBD5E1] flex items-center gap-2">
          <Info className="h-4 w-4 text-[#C5A880] shrink-0" />
          <span>Outside these scheduled hours, routine inquiries are still logged, but trusted calls ring directly.</span>
        </div>
      </div>
    </div>
  );
};
