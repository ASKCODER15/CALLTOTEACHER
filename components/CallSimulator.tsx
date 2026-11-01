'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import {
  PhoneCall,
  PhoneOff,
  UserCheck,
  Shield,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Volume2,
  VolumeX,
  Mic,
  Info,
  Users,
  Zap,
  ArrowRight,
  Radio
} from 'lucide-react';
import { CallCategory, CallOutcome, CallLogItem, TrustedContact } from '@/lib/types';
import { speakText, transcribeAudio, stopCurrentSpeech } from '@/lib/gnani-voice';

interface CallSimulatorProps {
  initialScenario?: 'scenario_a' | 'scenario_b' | 'scenario_c' | 'scenario_d' | null;
  selectedContact?: TrustedContact | null;
  onRequestApproval: (data: {
    callerName: string;
    callerNumber: string;
    relationship?: string;
    purpose: string;
    onResult: (status: 'approved' | 'declined' | 'timed_out') => void;
  }) => void;
  onCallLogged?: (call: CallLogItem) => void;
}

export const CallSimulator: React.FC<CallSimulatorProps> = ({
  initialScenario = 'scenario_b',
  selectedContact,
  onRequestApproval,
  onCallLogged
}) => {
  const { currentTeacher, addCallLog } = useApp();
  const profile = currentTeacher.profile;
  const contacts = currentTeacher.trustedContacts;
  const settings = currentTeacher.callSettings;

  const [activeScenario, setActiveScenario] = useState<'scenario_a' | 'scenario_b' | 'scenario_c' | 'scenario_d'>(
    initialScenario || 'scenario_b'
  );

  const getScenarioDefaults = (scenario: 'scenario_a' | 'scenario_b' | 'scenario_c' | 'scenario_d') => {
    if (scenario === 'scenario_a') {
      const contact = selectedContact || contacts[0] || {
        name: 'Dr. Anand Verma',
        phone: '+91 98221 23456',
        relationship: 'Spouse',
        transferPermission: 'during_teaching',
        notes: 'Husband'
      };
      return {
        name: contact.name,
        number: contact.phone,
        query: `Hello, this is ${contact.name}. Is ${profile.teacherName.split(' ')[0]} free? I need to check about household keys.`,
        category: 'trusted_contact' as CallCategory,
        ruleTriggered: `Whitelist Rule: ${contact.relationship} (${contact.transferPermission})`,
        expectedOutcome: contact.transferPermission === 'always' ? 'Immediate Transfer' : '1-Tap Approval to Teacher'
      };
    }
    if (scenario === 'scenario_b') {
      return {
        name: 'Mrs. Neha Kulkarni',
        number: '+91 98901 22334',
        query: `Namaste! I am calling regarding my son in Class 10. Could you please share the monthly fees and evening batch timings?`,
        category: 'parent_inquiry' as CallCategory,
        ruleTriggered: 'Verified Knowledge Base Grounding',
        expectedOutcome: 'Answered by AI from Profile Records'
      };
    }
    if (scenario === 'scenario_c') {
      return {
        name: 'Sunil Patil (Builder)',
        number: '+91 94220 88776',
        query: `Hello, I need to speak directly with ${profile.teacherName} regarding property registration documents.`,
        category: 'personal_call' as CallCategory,
        ruleTriggered: 'Personal Call Screening Guard',
        expectedOutcome: 'Teacher Screening Approval Prompt'
      };
    }
    return {
      name: 'Unknown Telecaller',
      number: '+91 88888 12345',
      query: `Hi, congratulations! You have been selected for a pre-approved personal loan offer. Can you confirm your details?`,
      category: 'unclear_reason' as CallCategory,
      ruleTriggered: 'Spam & Vague Call Deflection',
      expectedOutcome: 'Screened & Deflected with Message Note'
    };
  };

  const [callerName, setCallerName] = useState(getScenarioDefaults(activeScenario).name);
  const [callerNumber, setCallerNumber] = useState(getScenarioDefaults(activeScenario).number);
  const [callerQuery, setCallerQuery] = useState(getScenarioDefaults(activeScenario).query);

  // Simulation execution state
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected' | 'ai_speaking' | 'awaiting_approval' | 'completed'>('idle');
  const [dialogue, setDialogue] = useState<Array<{ sender: 'caller' | 'ai' | 'system'; text: string; time: string }>>([]);
  const [outcomeMessage, setOutcomeMessage] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const handleSwitchScenario = (scenario: 'scenario_a' | 'scenario_b' | 'scenario_c' | 'scenario_d') => {
    stopCurrentSpeech();
    setActiveScenario(scenario);
    const defaults = getScenarioDefaults(scenario);
    setCallerName(defaults.name);
    setCallerNumber(defaults.number);
    setCallerQuery(defaults.query);
    setCallState('idle');
    setDialogue([]);
    setOutcomeMessage(null);
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopCurrentSpeech();
    };
  }, []);

  const handleStartSimulation = async () => {
    stopCurrentSpeech();
    setCallState('ringing');
    setDialogue([]);
    setOutcomeMessage(null);

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Step 1: Incoming Ring
    setTimeout(async () => {
      setCallState('connected');
      setDialogue((prev) => [
        ...prev,
        {
          sender: 'system',
          text: `Call Connected · Verified Caller ID: ${callerNumber} (${callerName})`,
          time: currentTime
        },
        {
          sender: 'caller',
          text: callerQuery,
          time: currentTime
        }
      ]);

      // Step 2: AI Voice Receptionist Handling
      setCallState('ai_speaking');

      let aiResponse = '';
      let outcome: CallOutcome = 'answered_by_ai';

      if (activeScenario === 'scenario_a') {
        // Trusted contact
        aiResponse = `Namaste ${callerName}! ${profile.teacherName} is currently in teaching hours. I will notify them on their priority screen right now.`;
        outcome = 'transferred';
      } else if (activeScenario === 'scenario_b') {
        // Parent inquiry - strictly grounded
        const feeInfo = profile.feeStructure[0]
          ? `${profile.feeStructure[0].gradeCategory} fee is ${profile.feeStructure[0].amount} ${profile.feeStructure[0].billingCycle}`
          : 'fees are available on request';
        const batchInfo = profile.batches[0]
          ? `${profile.batches[0].name} runs ${profile.batches[0].timing}`
          : 'timings are 4:30 PM to 6:00 PM';
        aiResponse = `Namaste! At ${profile.className}, ${feeInfo}, and ${batchInfo}. We also offer 2 free trial demo classes.`;
        outcome = 'answered_by_ai';
      } else if (activeScenario === 'scenario_c') {
        // Personal call
        aiResponse = `Hello ${callerName}. ${profile.teacherName} is with students. I have sent an urgent call transfer prompt to their console.`;
        outcome = 'transferred';
      } else {
        // Unknown caller
        aiResponse = `Thank you for calling ${profile.className}. The educator is unavailable for unsolicited promotional offers. We have noted your number.`;
        outcome = 'message_taken';
      }

      setDialogue((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponse,
          time: currentTime
        }
      ]);

      // Voice Playback via Gnani
      if (voiceEnabled) {
        setIsSynthesizing(true);
        const activeVoice = currentTeacher.callSettings?.aiVoice || 'Nalini';
        const activeModel = currentTeacher.callSettings?.aiModel || 'timbre-v2.5';
        const activeSpeed = currentTeacher.callSettings?.aiSpeed || 1.0;
        const activeLang = currentTeacher.callSettings?.aiLanguage || 'hi-IN';
        await speakText(aiResponse, {
          voice: activeVoice,
          model: activeModel,
          speed: activeSpeed,
          language: activeLang
        });
        setIsSynthesizing(false);
      }

      // Step 3: Branching on scenario
      if (activeScenario === 'scenario_a' || activeScenario === 'scenario_c') {
        setCallState('awaiting_approval');
        onRequestApproval({
          callerName,
          callerNumber,
          relationship: activeScenario === 'scenario_a' ? 'Spouse / Family' : 'Personal Contact',
          purpose: callerQuery,
          onResult: (result) => {
            if (result === 'approved') {
              setDialogue((prev) => [
                ...prev,
                {
                  sender: 'system',
                  text: 'Teacher approved the transfer. Call patched through to private line.',
                  time: currentTime
                }
              ]);
              setOutcomeMessage('Call successfully connected to educator.');
            } else if (result === 'declined') {
              setDialogue((prev) => [
                ...prev,
                {
                  sender: 'system',
                  text: 'Teacher declined transfer. Polite message taken: "In class, will return call after batch."',
                  time: currentTime
                }
              ]);
              setOutcomeMessage('Call gracefully screened. WhatsApp note sent to caller.');
            } else {
              setDialogue((prev) => [
                ...prev,
                {
                  sender: 'system',
                  text: '15-second screening timeout reached. Caller placed in Priority Callback Queue.',
                  time: currentTime
                }
              ]);
              setOutcomeMessage('Queued in Callback Queue.');
            }
            setCallState('completed');
          }
        });
      } else {
        setCallState('completed');
        setOutcomeMessage(
          activeScenario === 'scenario_b'
            ? 'Parent query resolved 100% using verified profile without disturbing teacher.'
            : 'Unsolicited call screened and logged.'
        );

        // Add to call log in store
        const newLog = addCallLog({
          callerName,
          callerNumber,
          category: activeScenario === 'scenario_b' ? 'parent_inquiry' : 'unclear_reason',
          callerType: activeScenario === 'scenario_b' ? 'Prospective Parent' : 'Unknown Caller',
          timestamp: 'Just now',
          durationSeconds: 38,
          reason: callerQuery,
          summary: callerQuery,
          outcome,
          aiTranscript: [
            { speaker: 'Caller', text: callerQuery, time: '00:05' },
            { speaker: 'AI Receptionist', text: aiResponse, time: '00:15' }
          ],
          followUpStatus: activeScenario === 'scenario_b' ? 'resolved' : 'needs_callback'
        });

        if (onCallLogged) onCallLogged(newLog);
      }
    }, 1200);
  };

  const handleReset = () => {
    stopCurrentSpeech();
    setCallState('idle');
    setDialogue([]);
    setOutcomeMessage(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Sandbox Notice */}
      <div className="parchment-banner rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] uppercase tracking-wider">
            <Radio className="h-3.5 w-3.5 text-[#C86D51]" />
            <span>Interactive Call-Testing Studio</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Incoming Call Simulator
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
            Test how Call to Teach responds to different incoming calls. Adjust caller details, listen to the voice answer, and inspect the screening decisions in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6ED] dark:bg-[#16243A] border border-[#EAE5D9] dark:border-[#22334A] text-xs">
            <span className="h-2 w-2 rounded-full bg-[#3B7A57] animate-pulse" />
            <span className="text-[#64748B]">Character:</span>
            <span className="font-bold text-[#132238] dark:text-[#F8FAFC]">
              {currentTeacher.callSettings?.aiVoice || 'Nalini'}
            </span>
            <span className="text-[10px] text-[#C5A880] font-mono">
              ({currentTeacher.callSettings?.aiModel || 'timbre-v2.5'})
            </span>
          </div>

          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold transition-all shadow-2xs ${
              voiceEnabled
                ? 'border-[#1B365D] bg-[#1B365D] text-white dark:border-[#284C7E] dark:bg-[#284C7E]'
                : 'border-[#EAE5D9] bg-white text-[#64748B] dark:border-[#22334A] dark:bg-[#121E30]'
            }`}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>{voiceEnabled ? 'Voice: On' : 'Voice: Muted'}</span>
          </button>
        </div>
      </div>

      {/* 4 Scenario Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'scenario_a', label: '1. Trusted Contact', icon: Shield, desc: 'Family / Whitelisted' },
          { id: 'scenario_b', label: '2. Parent Enquiry', icon: Users, desc: 'Fees & Timings' },
          { id: 'scenario_c', label: '3. Personal Approval', icon: Zap, desc: '1-Tap Screening' },
          { id: 'scenario_d', label: '4. Unknown Caller', icon: HelpCircle, desc: 'Spam Deflection' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeScenario === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSwitchScenario(tab.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'border-[#1B365D] bg-white dark:border-[#93B4E0] dark:bg-[#121E30] shadow-sm ring-1 ring-[#1B365D]/20'
                  : 'border-[#EAE5D9] dark:border-[#22334A] bg-[#FAF8F5] dark:bg-[#0C1420] hover:bg-white dark:hover:bg-[#121E30]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? 'text-[#C86D51]' : 'text-[#64748B] dark:text-[#94A3B8]'
                  }`}
                />
                <span className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC]">
                  {tab.label}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                {tab.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Studio Arena: Simulator Console & Live Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Caller Identity & Configuration (5 cols) */}
        <div className="lg:col-span-5 editorial-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
            <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
              Caller Identity Setup
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6ED] text-[#C86D51] dark:bg-[#2C1E1B] dark:text-[#E28468]">
              {getScenarioDefaults(activeScenario).category}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                Caller Full Name
              </label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                Caller Phone Number
              </label>
              <input
                type="text"
                value={callerNumber}
                onChange={(e) => setCallerNumber(e.target.value)}
                className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                Spoken Inquiry / Question
              </label>
              <textarea
                rows={3}
                value={callerQuery}
                onChange={(e) => setCallerQuery(e.target.value)}
                className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D] resize-none"
              />
            </div>

            <div className="pt-2 p-3 rounded-xl bg-[#FAF6ED] dark:bg-[#16243A] border border-[#EAE5D9] dark:border-[#22334A] space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Policy Triggered:</span>
                <span className="font-semibold text-[#132238] dark:text-[#F8FAFC]">
                  {getScenarioDefaults(activeScenario).ruleTriggered}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Expected Outcome:</span>
                <span className="font-bold text-[#3B7A57] dark:text-[#5BA87B]">
                  {getScenarioDefaults(activeScenario).expectedOutcome}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleStartSimulation}
                disabled={callState === 'ringing' || callState === 'ai_speaking'}
                className="flex-1 py-3 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Simulate Call Now</span>
              </button>
              <button
                onClick={handleReset}
                className="p-3 rounded-full border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] text-[#64748B] hover:text-[#132238] dark:hover:text-[#F8FAFC] transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Call Timeline & Dialogue (7 cols) */}
        <div className="lg:col-span-7 editorial-card p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-[#1B365D] dark:text-[#93B4E0]" />
                <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                  Call Timeline &amp; Decision Stream
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {callState === 'ringing' && (
                  <span className="text-xs font-bold text-[#C86D51] animate-pulse">
                    Incoming Ring...
                  </span>
                )}
                {callState === 'ai_speaking' && (
                  <span className="text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#3B7A57] animate-ping" />
                    AI Receptionist Responding
                  </span>
                )}
                {callState === 'completed' && (
                  <span className="text-xs font-bold text-[#3B7A57] dark:text-[#5BA87B]">
                    Call Completed
                  </span>
                )}
              </div>
            </div>

            {/* Conversation Timeline Box */}
            <div className="min-h-[260px] max-h-[340px] overflow-y-auto space-y-3 p-3 rounded-2xl bg-[#FBF9F5] dark:bg-[#0C1420] border border-[#EAE5D9] dark:border-[#22334A]">
              {dialogue.length === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-center p-6 text-[#64748B] dark:text-[#94A3B8] space-y-2">
                  <PhoneCall className="h-8 w-8 text-[#C5A880]/70" />
                  <p className="text-xs font-medium">
                    No active call in progress.
                  </p>
                  <p className="text-[11px] text-[#94A3B8] dark:text-[#64748B] max-w-xs">
                    Click &ldquo;Simulate Call Now&rdquo; on the left to trigger the AI screening engine for this caller scenario.
                  </p>
                </div>
              ) : (
                dialogue.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    {item.sender === 'system' && (
                      <div className="p-2 rounded-xl bg-[#FAF6ED] dark:bg-[#16243A] text-center text-[11px] font-semibold text-[#132238] dark:text-[#F8FAFC] border border-[#EAE5D9] dark:border-[#22334A]">
                        {item.text}
                      </div>
                    )}

                    {item.sender === 'caller' && (
                      <div className="flex flex-col items-start max-w-[85%]">
                        <span className="text-[10px] font-bold text-[#64748B] ml-2">
                          {callerName} ({callerNumber})
                        </span>
                        <div className="p-3 rounded-2xl rounded-tl-xs bg-white dark:bg-[#121E30] border border-[#EAE5D9] dark:border-[#22334A] text-xs text-[#132238] dark:text-[#F8FAFC] shadow-2xs">
                          {item.text}
                        </div>
                      </div>
                    )}

                    {item.sender === 'ai' && (
                      <div className="flex flex-col items-end max-w-[88%] ml-auto">
                        <span className="text-[10px] font-bold text-[#1B365D] dark:text-[#93B4E0] mr-2">
                          Call to Teach AI Receptionist
                        </span>
                        <div className="p-3 rounded-2xl rounded-tr-xs bg-[#132238] dark:bg-[#1B365D] text-white text-xs shadow-xs">
                          {item.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Outcome Status Card */}
          {outcomeMessage && (
            <div className="p-3.5 rounded-xl border border-[#3B7A57] bg-[#EDF6F0] dark:bg-[#13281E] text-[#132238] dark:text-[#F8FAFC] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#3B7A57] dark:text-[#5BA87B] shrink-0" />
                <span className="font-semibold">{outcomeMessage}</span>
              </div>
              <span className="text-[10px] font-bold text-[#3B7A57] dark:text-[#5BA87B] shrink-0">
                Logged to History
              </span>
            </div>
          )}

          <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5 pt-2 border-t border-[#F0ECE3] dark:border-[#1E2E44]">
            <Info className="h-3.5 w-3.5 text-[#C5A880] shrink-0" />
            <span>Simulated call engine strictly mimics the live telephony screening rules.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
