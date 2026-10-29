'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import {
  PhoneCall,
  PhoneOff,
  PhoneForwarded,
  Volume2,
  VolumeX,
  Mic,
  Send,
  ShieldCheck,
  UserCheck,
  Clock,
  RotateCcw,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { CallCategory, CallOutcome, CallLogItem, TrustedContact } from '@/lib/types';

interface CallSimulatorProps {
  initialScenario?: 'scenario_a' | 'scenario_b' | 'scenario_c' | null;
  selectedContact?: TrustedContact | null;
  onCallLogged?: (call: CallLogItem) => void;
  onRequestApproval?: (data: {
    callerName: string;
    callerNumber: string;
    relationship?: string;
    purpose: string;
    onResult: (status: 'approved' | 'declined' | 'timed_out') => void;
  }) => void;
}

export const CallSimulator: React.FC<CallSimulatorProps> = ({
  initialScenario = 'scenario_b',
  selectedContact = null,
  onCallLogged,
  onRequestApproval
}) => {
  const { currentTeacher, addCallLog } = useApp();
  const profile = currentTeacher.profile;
  const contacts = currentTeacher.trustedContacts;

  // Selected contact ID for Scenario A
  const [selectedContactId, setSelectedContactId] = useState<string>(
    selectedContact?.id || contacts[0]?.id || ''
  );

  // Active call state
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');
  const [callerName, setCallerName] = useState('Mrs. Meenakshi Joshi');
  const [callerNumber, setCallerNumber] = useState('+91 98901 88776');
  const [callerCategory, setCallerCategory] = useState<CallCategory>('parent_inquiry');
  const [callerRole, setCallerRole] = useState('Prospective Parent (Class 10)');
  const [currentScenario, setCurrentScenario] = useState<'scenario_a' | 'scenario_b' | 'scenario_c' | 'custom'>(
    initialScenario || 'scenario_b'
  );

  // Call runtime
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioSpeechEnabled, setIsAudioSpeechEnabled] = useState(true);

  // Live dialog transcript
  const [transcript, setTranscript] = useState<
    { speaker: 'Caller' | 'CallSetu AI' | 'Teacher'; text: string; time: string }[]
  >([]);

  // Custom user speech input during live call
  const [customUserInput, setCustomUserInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [transferApproved, setTransferApproved] = useState<boolean | null>(null);
  const [approvalOutcome, setApprovalOutcome] = useState<'approved' | 'declined' | 'timed_out' | null>(null);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Update scenario when initialScenario or selectedContact changes
  useEffect(() => {
    if (selectedContact) {
      setSelectedContactId(selectedContact.id);
      loadScenario('scenario_a', selectedContact.id);
    } else if (initialScenario) {
      loadScenario(initialScenario);
    }
  }, [initialScenario, selectedContact]);

  // Call duration counter
  useEffect(() => {
    if (callState !== 'connected') return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  // Text to speech helper
  const speakAudio = (text: string) => {
    if (!isAudioSpeechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find((v) => v.lang.includes('IN') || v.lang.includes('hi'));
      if (indianVoice) utterance.voice = indianVoice;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  // Scenario Loader
  const loadScenario = (scenario: 'scenario_a' | 'scenario_b' | 'scenario_c', contactId?: string) => {
    setCurrentScenario(scenario);
    setCallState('idle');
    setTranscript([]);
    setTransferApproved(null);
    setApprovalOutcome(null);
    setCallDuration(0);

    if (scenario === 'scenario_a') {
      const targetId = contactId || selectedContactId;
      const match = contacts.find((c) => c.id === targetId) || contacts[0] || {
        id: 'tc_default',
        name: 'Dr. Anand Verma',
        phone: '+91 98221 23456',
        relationship: 'Spouse',
        transferPermission: 'during_teaching'
      };
      setCallerName(match.name);
      setCallerNumber(match.phone);
      setCallerCategory('trusted_contact');
      const ruleLabel =
        match.transferPermission === 'always'
          ? 'Always Transfer'
          : match.transferPermission === 'during_teaching'
          ? 'Ask Approval During Teaching'
          : 'Never Transfer (Take Message)';
      setCallerRole(`${match.relationship} · Rule: ${ruleLabel}`);
    } else if (scenario === 'scenario_b') {
      const gradeTarget = profile.grades[1] || profile.grades[0] || 'Class 10';
      setCallerName('Mrs. Meenakshi Joshi');
      setCallerNumber('+91 98901 88776');
      setCallerCategory('parent_inquiry');
      setCallerRole(`Prospective Parent (${gradeTarget})`);
    } else {
      setCallerName('Courier Delivery Associate');
      setCallerNumber('+91 91234 56789');
      setCallerCategory('personal_call');
      setCallerRole('Unverified Personal / Delivery');
    }
  };

  // Switch trusted contact directly
  const handleSelectContact = (cId: string) => {
    setSelectedContactId(cId);
    loadScenario('scenario_a', cId);
  };

  // Trigger Incoming Call
  const startIncomingCall = () => {
    setCallState('ringing');
    setTranscript([]);
    setCallDuration(0);
    setTransferApproved(null);
    setApprovalOutcome(null);
  };

  // Accept incoming call by CallSetu AI
  const acceptCall = () => {
    setCallState('connected');

    if (currentScenario === 'scenario_a') {
      const activeContact =
        contacts.find((c) => c.id === selectedContactId) || contacts[0] || {
          name: callerName,
          phone: callerNumber,
          relationship: 'Trusted',
          transferPermission: 'during_teaching'
        };

      const permission = activeContact.transferPermission;

      if (permission === 'always') {
        const greeting = `Namaste ${activeContact.name}! ${profile.teacherName} ji abhi class me hain, lekin aapka number Always Transfer priority list me verified hai. Main turant call classroom handset par connect kar raha hoon...`;
        const exchanges = [
          { speaker: 'Caller' as const, text: `Hello CallSetu, urgent 1 minute ${profile.teacherName} se baat karni hai.`, time: '0:02' },
          { speaker: 'CallSetu AI' as const, text: greeting, time: '0:06' },
          { speaker: 'Teacher' as const, text: `[Call Connected Directly: Pre-approved rule "Always Transfer" executed without interruption]`, time: '0:09' }
        ];
        setTranscript(exchanges);
        speakAudio(greeting);
        setTransferApproved(true);
        setApprovalOutcome('approved');
      } else if (permission === 'never') {
        const greeting = `Namaste ${activeContact.name}! ${profile.teacherName} ji abhi active batch me teach kar rahi hain. Unke configured rule ke anusar class hours me telephone transfer restricted hai. Maine aapka message note kar liya hai, class break me Sunita ji check karengi.`;
        const exchanges = [
          { speaker: 'Caller' as const, text: `Hello CallSetu, urgent baat ho sakti hai kya?`, time: '0:02' },
          { speaker: 'CallSetu AI' as const, text: greeting, time: '0:06' }
        ];
        setTranscript(exchanges);
        speakAudio(greeting);
        setTransferApproved(false);
        setApprovalOutcome('declined');
      } else {
        // 'during_teaching': Requires 1-tap teacher authorization
        const greeting = `Namaste ${activeContact.name}! ${profile.teacherName} ji abhi ${profile.batches[0]?.name || 'evening batch'} me padha rahi hain. Main unki screen par 1-tap transfer alert bhej raha hoon, kripya 10 second hold karein...`;
        const firstExchange = [
          { speaker: 'Caller' as const, text: `Hello CallSetu, urgent 1 minute baat ho sakti hai? Just wanted to check on pickup details.`, time: '0:02' },
          { speaker: 'CallSetu AI' as const, text: greeting, time: '0:06' }
        ];
        setTranscript(firstExchange);
        speakAudio(greeting);

        setTimeout(() => {
          if (onRequestApproval) {
            onRequestApproval({
              callerName: activeContact.name,
              callerNumber: activeContact.phone,
              relationship: activeContact.relationship,
              purpose: `Urgent update from ${activeContact.relationship} (${activeContact.name})`,
              onResult: (result) => {
                setApprovalOutcome(result);
                if (result === 'approved') {
                  setTransferApproved(true);
                  const approvedMsg = {
                    speaker: 'Teacher' as const,
                    text: '[Teacher Approved 1-Tap Transfer: Call connected directly to classroom handset]',
                    time: '0:14'
                  };
                  setTranscript((prev) => [...prev, approvedMsg]);
                  speakAudio('Transfer approved. Connecting call now.');
                } else if (result === 'declined') {
                  setTransferApproved(false);
                  const declineMsg = {
                    speaker: 'CallSetu AI' as const,
                    text: `Teacher abhi lecture me busy hain aur call transfer decline kiya hai. Unhone note kar liya hai aur break me call karengi.`,
                    time: '0:15'
                  };
                  setTranscript((prev) => [...prev, declineMsg]);
                  speakAudio(declineMsg.text);
                } else {
                  // timed_out
                  setTransferApproved(false);
                  const timeoutAction = currentTeacher.callSettings.timeoutAction;
                  const timeoutText =
                    timeoutAction === 'whatsapp_callback'
                      ? `Teacher screen attend nahi kar paayi. Maine WhatsApp alert bhej diya hai aur callback schedule kiya hai.`
                      : timeoutAction === 'urgent_sms'
                      ? `Teacher attend nahi kar paayi. Unhe break schedule ke sath urgent SMS forward kar diya gaya hai.`
                      : `Teacher abhi board par hain aur attend nahi kar paayi. Maine audio message log kar diya hai.`;

                  const timeoutMsg = {
                    speaker: 'CallSetu AI' as const,
                    text: timeoutText,
                    time: '0:18'
                  };
                  setTranscript((prev) => [...prev, timeoutMsg]);
                  speakAudio(timeoutText);
                }
              }
            });
          }
        }, 1200);
      }

    } else if (currentScenario === 'scenario_b') {
      const feeInfo = profile.feeStructure[1] || profile.feeStructure[0] || {
        gradeCategory: 'Class 10 Board Intensive',
        amount: '₹2,800',
        billingCycle: 'per month'
      };
      const batchInfo = profile.batches[1] || profile.batches[0] || {
        name: 'Class 10 Board Focus',
        timing: '04:30 PM - 06:00 PM'
      };

      const initialGreeting = `Namaste! ${profile.className} me call karne ke liye dhanyawad. ${profile.teacherName} abhi batch me hain. Main CallSetu AI hoon, bataiye kis class ki inquiry hai?`;
      const callerFirst = `Namaste! Mere bete ke liye ${feeInfo.gradeCategory} ki monthly fees aur batch timing jan-ni thi.`;
      const aiResponse = `Ji zaroor! ${feeInfo.gradeCategory} ki fee ${feeInfo.amount} ${feeInfo.billingCycle} hai. Batch timing ${batchInfo.timing} (${batchInfo.name}) chalti hai. Kya aap 2 free demo classes book karna chahte hain?`;

      setTranscript([
        { speaker: 'Caller', text: callerFirst, time: '0:02' },
        { speaker: 'CallSetu AI', text: initialGreeting, time: '0:06' },
        { speaker: 'CallSetu AI', text: aiResponse, time: '0:12' }
      ]);
      speakAudio(aiResponse);

    } else if (currentScenario === 'scenario_c') {
      const callerFirst = `Hello madam, ${profile.teacherName} ji ka parcel hai gate par, OTP chahiye aur baat karwao unse.`;
      const aiResponse = `Namaste! ${profile.teacherName} abhi active class me hain aur direct call transfer nahi ho sakti. Parcel reception counter guard ke paas submit kar dijiye. Main ma'am ko screen par authorization notification bhej raha hoon.`;

      setTranscript([
        { speaker: 'Caller', text: callerFirst, time: '0:02' },
        { speaker: 'CallSetu AI', text: aiResponse, time: '0:07' }
      ]);
      speakAudio(aiResponse);

      setTimeout(() => {
        if (onRequestApproval) {
          onRequestApproval({
            callerName,
            callerNumber,
            relationship: 'Courier Associate',
            purpose: 'Delivery parcel gate check / OTP request',
            onResult: (result) => {
              setApprovalOutcome(result);
              if (result === 'approved') {
                setTransferApproved(true);
                setTranscript((prev) => [
                  ...prev,
                  { speaker: 'Teacher', text: '[Teacher Approved: "OTP is 4821. Please leave parcel with Ramesh guard."]', time: '0:14' }
                ]);
                speakAudio('Teacher approved. Please leave parcel with Ramesh guard.');
              } else if (result === 'declined') {
                setTransferApproved(false);
                const declineMsg = `Teacher ne decline kiya hai. Ongoing batch ke dauran parcel guard Ramesh ji ke paas submit kar dijiye, delivery verify ho jayegi.`;
                setTranscript((prev) => [
                  ...prev,
                  { speaker: 'CallSetu AI', text: declineMsg, time: '0:15' }
                ]);
                speakAudio(declineMsg);
              } else {
                // timed_out
                setTransferApproved(false);
                const timeoutAction = currentTeacher.callSettings.timeoutAction;
                const timeoutText =
                  timeoutAction === 'whatsapp_callback'
                    ? `Teacher class me busy hain aur respond nahi kar paayi. Maine unhe WhatsApp message bhej diya hai. Package guard ke paas drop kar dijiye.`
                    : `Teacher class attend nahi kar paayi. Message note kar liya gaya hai. Parcel reception guard ke paas drop kar dijiye.`;

                setTranscript((prev) => [
                  ...prev,
                  { speaker: 'CallSetu AI', text: timeoutText, time: '0:17' }
                ]);
                speakAudio(timeoutText);
              }
            }
          });
        }
      }, 1200);
    }
  };

  // Submit Caller Question via API Route
  const handleCallerSendQuestion = async (userText: string) => {
    if (!userText.trim() || isAiThinking) return;

    const timeStr = `0:${callDuration < 10 ? '0' + callDuration : callDuration}`;
    const newCallerMsg = { speaker: 'Caller' as const, text: userText, time: timeStr };
    setTranscript((prev) => [...prev, newCallerMsg]);
    setCustomUserInput('');
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/gemini/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          profile,
          language: currentTeacher.callSettings.aiLanguage,
          callerName
        })
      });

      const data = await res.json();
      const aiReply = data.answer || "Ji maine aapka message note kar liya hai, class ke baad ma'am connect karengi.";

      const aiMsg = { speaker: 'CallSetu AI' as const, text: aiReply, time: `0:${callDuration + 2}` };
      setTranscript((prev) => [...prev, aiMsg]);
      speakAudio(aiReply);
    } catch {
      const fallbackReply = `Ji, ${profile.className} me enrollment ke liye 2 free demo classes available hain. Center location ${profile.location} hai.`;
      setTranscript((prev) => [...prev, { speaker: 'CallSetu AI', text: fallbackReply, time: `0:${callDuration + 2}` }]);
      speakAudio(fallbackReply);
    } finally {
      setIsAiThinking(false);
    }
  };

  // End Call & Commit to Log
  const endCall = () => {
    setCallState('ended');
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    let outcome: CallOutcome = 'answered_by_ai';
    let followUp: FollowUpStatus = 'resolved';

    if (currentScenario === 'scenario_b') {
      outcome = 'answered_by_ai';
      followUp = 'form_sent';
    } else if (approvalOutcome === 'approved' || transferApproved === true) {
      outcome = 'transferred';
      followUp = 'resolved';
    } else if (approvalOutcome === 'timed_out') {
      outcome = currentTeacher.callSettings.timeoutAction === 'whatsapp_callback' ? 'callback_scheduled' : 'message_taken';
      followUp = 'needs_callback';
    } else if (approvalOutcome === 'declined' || transferApproved === false) {
      outcome = 'message_taken';
      followUp = 'resolved';
    }

    const summaryText =
      currentScenario === 'scenario_b'
        ? `Parent inquired about ${profile.grades[1] || profile.grades[0] || 'tuition'} fees & timings. Answered verified fees (${profile.feeStructure[1]?.amount || profile.feeStructure[0]?.amount || 'Rs 2,800'}) and scheduled demo class.`
        : currentScenario === 'scenario_a'
        ? `Trusted contact (${callerName}) called during teaching hours. Rule outcome: ${transferApproved ? 'Approved & Transferred' : 'Screened/Message Logged'}.`
        : `Personal delivery caller screened. Outcome: ${approvalOutcome === 'approved' ? 'Approved by teacher' : approvalOutcome === 'timed_out' ? 'Timed out (message taken)' : 'Declined'}.`;

    const newLogItem = addCallLog({
      callerName,
      callerNumber,
      category: callerCategory,
      callerType: callerRole,
      timestamp: 'Just now',
      durationSeconds: callDuration || 45,
      reason: transcript[0]?.text || 'Simulated call inquiry',
      summary: summaryText,
      outcome,
      followUpStatus: followUp,
      aiTranscript: transcript
    });

    if (onCallLogged) {
      onCallLogged(newLogItem);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Scenario Selection Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Simulated Incoming-Call Engine
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Interactive test workbench demonstrating how CallSetu routes and answers real classroom caller situations.
          </p>
        </div>

        {/* Audio Speech Toggle */}
        <button
          onClick={() => setIsAudioSpeechEnabled(!isAudioSpeechEnabled)}
          className={`btn-secondary flex items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-xs font-bold ${
            isAudioSpeechEnabled ? 'text-indigo-800 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {isAudioSpeechEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-700" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
          <span>{isAudioSpeechEnabled ? 'Spoken Voice: Active' : 'Spoken Voice: Muted'}</span>
        </button>
      </div>

      {/* Preset Scenarios Strip (Clean rectangular buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Scenario A Tab */}
        <button
          onClick={() => loadScenario('scenario_a')}
          className={`text-left rounded-lg p-3.5 transition border ${
            currentScenario === 'scenario_a'
              ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 dark:border-indigo-500'
              : 'border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
              Scenario A
            </span>
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-700 dark:text-indigo-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 mt-1 dark:text-white">
            Approved Trusted Contact
          </h3>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-normal leading-relaxed">
            Spouse or School Principal calling during active batch hours.
          </p>
        </button>

        {/* Scenario B Tab */}
        <button
          onClick={() => loadScenario('scenario_b')}
          className={`text-left rounded-lg p-3.5 transition border ${
            currentScenario === 'scenario_b'
              ? 'border-violet-600 bg-violet-50/80 dark:bg-violet-950/60 dark:border-violet-500'
              : 'border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-800 dark:text-violet-300">
              Scenario B · Standard
            </span>
            <UserCheck className="h-3.5 w-3.5 text-violet-700 dark:text-violet-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 mt-1 dark:text-white">
            Parent Fees &amp; Timings Query
          </h3>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-normal leading-relaxed">
            Answers verified fees, batch timings, and books trial demo.
          </p>
        </button>

        {/* Scenario C Tab */}
        <button
          onClick={() => loadScenario('scenario_c')}
          className={`text-left rounded-lg p-3.5 transition border ${
            currentScenario === 'scenario_c'
              ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/60 dark:border-amber-500'
              : 'border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Scenario C · Screening
            </span>
            <Clock className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 mt-1 dark:text-white">
            Personal / Courier Caller
          </h3>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-normal leading-relaxed">
            Unverified caller screened; requires 1-tap teacher authorization.
          </p>
        </button>
      </div>

      {/* Contact selector when testing Scenario A */}
      {currentScenario === 'scenario_a' && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 dark:border-indigo-900/60 dark:bg-indigo-950/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-700 shrink-0 dark:text-indigo-400" />
            <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
              Select Approved Contact to Test Permission Rule:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedContactId}
              onChange={(e) => handleSelectContact(e.target.value)}
              disabled={callState === 'connected'}
              className="rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-bold text-indigo-950 focus:border-indigo-600 focus:outline-none dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-100"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.relationship}) — Rule: {c.transferPermission === 'always' ? 'Always Transfer' : c.transferPermission === 'during_teaching' ? 'Approval Required' : 'Never Transfer (Message)'}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Simulation Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Terminal Call Interface Mockup */}
        <div className="lg:col-span-5 mx-auto w-full max-w-sm">
          <div className="rounded-2xl border border-slate-300 bg-slate-900 p-5 text-white shadow-md flex flex-col justify-between min-h-[460px]">
            {/* Header Status */}
            <div className="text-center pt-2 space-y-2">
              <span className="inline-block rounded bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                {callState === 'idle'
                  ? 'Simulator Ready'
                  : callState === 'ringing'
                  ? 'Incoming Call...'
                  : callState === 'connected'
                  ? 'Call Connected · CallSetu AI'
                  : 'Call Completed'}
              </span>

              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-indigo-700 text-lg font-bold">
                {callerName.charAt(0)}
              </div>

              <h4 className="text-base font-bold truncate px-2">{callerName}</h4>
              <p className="text-xs text-slate-400 tabular-nums">{callerNumber} (Sample)</p>
              <p className="text-[11px] text-indigo-300 font-medium">{callerRole}</p>

              {callState === 'connected' && (
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-emerald-400 tabular-nums">
                    00:{callDuration < 10 ? '0' + callDuration : callDuration}
                  </span>
                </div>
              )}
            </div>

            {/* Audio Waveform */}
            {callState === 'connected' && (
              <div className="flex items-center justify-center gap-1.5 py-4">
                {[14, 24, 36, 20, 32, 42, 28, 16, 38, 22, 14].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded bg-indigo-400"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4">
              {callState === 'idle' && (
                <button
                  onClick={startIncomingCall}
                  className="w-full btn-primary rounded-lg py-3 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Initiate Simulated Incoming Call</span>
                </button>
              )}

              {callState === 'ringing' && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCallState('idle')}
                    className="rounded-lg bg-rose-600 p-2.5 text-xs font-bold text-white hover:bg-rose-700"
                  >
                    Decline
                  </button>

                  <button
                    onClick={acceptCall}
                    className="rounded-lg bg-emerald-600 p-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    Answer with AI
                  </button>
                </div>
              )}

              {callState === 'connected' && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2.5 rounded-lg border transition ${
                      isMuted ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                    title="Mute"
                  >
                    <Mic className="h-4 w-4" />
                  </button>

                  <button
                    onClick={endCall}
                    className="btn-accent rounded-lg px-4 py-2 text-xs font-bold"
                  >
                    End Call
                  </button>

                  <button
                    onClick={() => setIsAudioSpeechEnabled(!isAudioSpeechEnabled)}
                    className={`p-2.5 rounded-lg border transition ${
                      isAudioSpeechEnabled ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                    title="Voice toggle"
                  >
                    {isAudioSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>
                </div>
              )}

              {callState === 'ended' && (
                <button
                  onClick={startIncomingCall}
                  className="w-full btn-secondary rounded-lg py-2.5 text-xs font-bold flex items-center justify-center gap-2 text-slate-900 bg-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Simulate Another Call</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Conversation Transcript */}
        <div className="lg:col-span-7 space-y-4">
          <div className="pro-card rounded-xl p-5 flex flex-col h-[460px] justify-between">
            {/* Transcript Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Live Spoken Dialog Transcript
              </h3>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Grounding: {profile.className} Verified Profile
              </span>
            </div>

            {/* Transcript Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 text-xs">
              {transcript.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <PhoneCall className="h-8 w-8 mb-2 text-indigo-400" />
                  <p className="font-bold text-slate-900 dark:text-slate-100">Simulator is Idle</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 max-w-xs font-medium">
                    Click <strong className="text-indigo-700 dark:text-indigo-400">&quot;Initiate Simulated Incoming Call&quot;</strong> to start testing.
                  </p>
                </div>
              ) : (
                transcript.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.speaker === 'Caller' ? 'items-start' : msg.speaker === 'CallSetu AI' ? 'items-end' : 'items-center'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5 px-1">
                      {msg.speaker} · {msg.time}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-lg px-3.5 py-2 text-xs leading-relaxed ${
                        msg.speaker === 'Caller'
                          ? 'bg-slate-100 text-slate-900 font-medium border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
                          : msg.speaker === 'CallSetu AI'
                          ? 'bg-indigo-700 text-white font-medium'
                          : 'bg-amber-100 text-amber-950 font-bold border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}

              {isAiThinking && (
                <div className="flex flex-col items-end">
                  <div className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    CallSetu is replying...
                  </div>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Interactive Query Chips & Input */}
            {callState === 'connected' && (
              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Ask as Caller (Test Verified Knowledge Base):
                </p>

                {/* Quick query chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Demo class kab hoti hai?',
                    'Class 10 ki fees kitni hai?',
                    'Center ka address aur landmark bataiye?',
                    'Kya Sunday test aur notes included hain?',
                    'Sunita ma\'am se urgent baat ho sakti hai?'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCallerSendQuestion(preset)}
                      disabled={isAiThinking}
                      className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-800 hover:border-indigo-600 hover:text-indigo-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      &quot;{preset}&quot;
                    </button>
                  ))}
                </div>

                {/* Freeform input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customUserInput}
                    onChange={(e) => setCustomUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCallerSendQuestion(customUserInput);
                    }}
                    placeholder="Type what the caller asks..."
                    disabled={isAiThinking}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    onClick={() => handleCallerSendQuestion(customUserInput)}
                    disabled={isAiThinking || !customUserInput.trim()}
                    className="btn-primary rounded-lg px-3.5 py-1.5 text-xs font-bold disabled:opacity-50"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
