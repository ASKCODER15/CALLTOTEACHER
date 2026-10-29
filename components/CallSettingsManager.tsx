'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Clock,
  Globe,
  ShieldAlert,
  Save,
  CheckCircle2
} from 'lucide-react';
import { CallSettings } from '@/lib/types';

export const CallSettingsManager: React.FC = () => {
  const { currentTeacher, updateCallSettings } = useApp();
  const settings = currentTeacher.callSettings;

  const [formState, setFormState] = useState<CallSettings>(settings);
  const [saved, setSaved] = useState(false);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    const exists = formState.teachingDays.includes(day);
    const updated = exists
      ? formState.teachingDays.filter((d) => d !== day)
      : [...formState.teachingDays, day];
    setFormState({ ...formState, teachingDays: updated });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCallSettings(formState);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Call Handling &amp; Teaching Hour Rules
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Control when CallSetu intervenes, which language it uses, and fallback behaviors.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2 self-start rounded-lg px-4 py-2 text-xs font-bold"
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Call Rules</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Teaching Hours Schedule Card */}
        <div className="pro-card rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Teaching Hours Schedule
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                CallSetu Active:
              </span>
              <input
                type="checkbox"
                checked={formState.teachingHoursEnabled}
                onChange={(e) => setFormState({ ...formState, teachingHoursEnabled: e.target.checked })}
                className="h-4 w-4 rounded text-indigo-700 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Batch Start Time
              </label>
              <input
                type="time"
                value={formState.teachingStart}
                onChange={(e) => setFormState({ ...formState, teachingStart: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Batch End Time
              </label>
              <input
                type="time"
                value={formState.teachingEnd}
                onChange={(e) => setFormState({ ...formState, teachingEnd: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Active Teaching Days
            </label>
            <div className="flex flex-wrap gap-1.5">
              {daysOfWeek.map((day) => {
                const isSelected = formState.teachingDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                      isSelected
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Language & Voice Tone */}
        <div className="pro-card rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Globe className="h-5 w-5 text-violet-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Language Preference &amp; Voice Tone
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                AI Call Voice Language
              </label>
              <select
                value={formState.aiLanguage}
                onChange={(e) => setFormState({ ...formState, aiLanguage: e.target.value as CallSettings['aiLanguage'] })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="hinglish">Hinglish (Conversational Hindi + English - Recommended)</option>
                <option value="hindi">Pure Hindi (विनम्र व औपचारिक)</option>
                <option value="english">Professional Indian English</option>
                <option value="marathi">Marathi (मराठी)</option>
                <option value="gujarati">Gujarati (ગુજરાતી)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Persona &amp; Tone
              </label>
              <select
                value={formState.aiVoiceTone}
                onChange={(e) => setFormState({ ...formState, aiVoiceTone: e.target.value as CallSettings['aiVoiceTone'] })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="warm_respectful">Warm &amp; Respectful (&quot;Namaste ji, ma&apos;am abhi class me hain...&quot;)</option>
                <option value="polite_formal">Polite &amp; Academic</option>
                <option value="quick_direct">Quick &amp; Direct (Brief answers)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Personal Call Approvals & Timeout Fallback */}
        <div className="pro-card rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Personal Call Screening &amp; Unanswered Timeout
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Personal Caller Routing Policy
              </label>
              <select
                value={formState.personalCallApproval}
                onChange={(e) => setFormState({ ...formState, personalCallApproval: e.target.value as CallSettings['personalCallApproval'] })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="always_ask">Always Send 1-Tap Screen Approval to Teacher</option>
                <option value="strict_screen">Strict Screening (Only alert if stated urgent)</option>
                <option value="auto_callback">Never Interrupt (Auto take message &amp; WhatsApp link)</option>
              </select>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-1">
                Unregistered callers claiming to be family or friends are always screened first.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                If Teacher Doesn&apos;t Respond (After {formState.timeoutSeconds}s)
              </label>
              <select
                value={formState.timeoutAction}
                onChange={(e) => setFormState({ ...formState, timeoutAction: e.target.value as CallSettings['timeoutAction'] })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="take_message">Take Detailed Audio Message &amp; Log in History</option>
                <option value="whatsapp_callback">Send Polite WhatsApp Message &amp; Arrange Callback</option>
                <option value="urgent_sms">Send Direct SMS with Teacher&apos;s Break Schedule</option>
              </select>
            </div>
          </div>

          {/* Timeout slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Approval Card Timeout Window:</span>
              <span className="text-indigo-700 font-bold tabular-nums">{formState.timeoutSeconds} seconds</span>
            </div>
            <input
              type="range"
              min={10}
              max={30}
              step={5}
              value={formState.timeoutSeconds}
              onChange={(e) => setFormState({ ...formState, timeoutSeconds: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
            />
          </div>

          {/* Emergency Bypass Toggle */}
          <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3.5 space-y-1.5 dark:border-rose-950 dark:bg-rose-950/30">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formState.allowEmergencyBypass}
                onChange={(e) => setFormState({ ...formState, allowEmergencyBypass: e.target.checked })}
                className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <div>
                <span className="text-xs font-bold text-rose-950 dark:text-rose-200">
                  Emergency Keyword Priority Ring
                </span>
                <p className="text-[11px] text-rose-800 dark:text-rose-300">
                  If caller says &quot;Hospital&quot;, &quot;Accident&quot;, &quot;Emergency&quot;, or &quot;Urgent Medical&quot;, bypass normal hold and flash an emergency priority card.
                </p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
