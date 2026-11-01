'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import {
  Volume2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Radio,
  Clock,
  Sparkles,
  Download,
  Info,
  Sliders,
  Languages,
  ShieldCheck,
  RefreshCw,
  Loader2,
  Save,
  Check,
  Cpu
} from 'lucide-react';
import { checkGnaniStatus, stopCurrentSpeech } from '@/lib/gnani-voice';

export const GnaniVoiceLab: React.FC = () => {
  const { currentTeacher, updateCallSettings } = useApp();
  const activeSettings = currentTeacher.callSettings;

  const [apiKeyDetected, setApiKeyDetected] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);

  // Form State initialized from active educator profile
  const [selectedVoice, setSelectedVoice] = useState<string>(
    activeSettings?.aiVoice || 'Nalini'
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    activeSettings?.aiModel || 'timbre-v2.5'
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    activeSettings?.aiLanguage === 'english'
      ? 'en-IN'
      : activeSettings?.aiLanguage === 'marathi'
      ? 'mr-IN'
      : 'hi-IN'
  );
  const [speechSpeed, setSpeechSpeed] = useState<number>(
    activeSettings?.aiSpeed ?? 1.0
  );

  const [ttsText, setTtsText] = useState<string>(
    'नमस्ते! कॉल टू टीच में आपका स्वागत है। शिक्षक अभी क्लास में पढ़ा रहे हैं। बताइए, मैं आपकी क्या सहायता कर सकता हूँ?'
  );

  // Processing & Audio State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSavingAndReconnecting, setIsSavingAndReconnecting] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [reconnectNotice, setReconnectNotice] = useState<string | null>(null);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);



  useEffect(() => {
    let isMounted = true;
    checkGnaniStatus()
      .then((res) => {
        if (isMounted) {
          setApiKeyDetected(res.configured);
          setIsCheckingStatus(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setApiKeyDetected(false);
          setIsCheckingStatus(false);
        }
      });

    return () => {
      isMounted = false;
      stopCurrentSpeech();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Check if current user selections differ from stored teacher settings
  const isModified =
    selectedVoice !== (activeSettings?.aiVoice || 'Nalini') ||
    selectedModel !== (activeSettings?.aiModel || 'timbre-v2.5') ||
    Math.abs(speechSpeed - (activeSettings?.aiSpeed ?? 1.0)) > 0.01;

  // 1. Synthesize & Preview Voice
  const handleGenerateVoice = async () => {
    if (!ttsText.trim()) return;
    setErrorMsg(null);
    setSuccessInfo(null);
    setReconnectNotice(null);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gnani/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ttsText.trim(),
          voice: selectedVoice,
          model: selectedModel,
          language: selectedLanguage,
          speed: speechSpeed
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 403) {
          throw new Error('Authentication Failed: Verify GNANI_API_KEY in Google AI Studio Secrets.');
        } else if (res.status === 402) {
          throw new Error('Insufficient Credits: Your Vachana AI balance is exhausted.');
        } else {
          throw new Error(errJson.error || errJson.message || `Synthesis failed with status ${res.status}`);
        }
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(url);
      setSuccessInfo(`Voice generated successfully (${(blob.size / 1024).toFixed(1)} KB, 48kHz WAV via ${selectedModel})`);

      setTimeout(() => {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.play().catch(() => {});
        }
      }, 150);
    } catch (err: any) {
      console.error('Voice generation error:', err);
      setErrorMsg(err.message || 'Speech generation encountered an error.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Save Model & Voice Character, then Reconnect
  const handleSaveAndReconnect = async () => {
    setIsSavingAndReconnecting(true);
    setErrorMsg(null);
    setSuccessInfo(null);
    setReconnectNotice(null);

    try {
      // Step A: Save permanently to Teacher Call Settings
      updateCallSettings({
        aiVoice: selectedVoice,
        aiModel: selectedModel,
        aiSpeed: speechSpeed,
        aiLanguage: selectedLanguage === 'en-IN' ? 'english' : selectedLanguage === 'mr-IN' ? 'marathi' : 'hinglish'
      });

      // Step B: Healthcheck re-connection to Gnani API
      const statusCheck = await checkGnaniStatus();
      if (!statusCheck.configured) {
        throw new Error('GNANI_API_KEY is not detected in Google AI Studio Secrets.');
      }

      // Step C: Trigger live verification audio greeting using newly saved character
      const confirmationText = `नमस्ते! मैंने आपके AI वॉइस कैरेक्टर ${selectedVoice} को ${selectedModel} मॉडल पर सफलतापूर्वक सेव और री-कनेक्ट कर दिया है। अब कॉल टू टीच के सभी कॉल्स इसी आवाज़ में अटेंड किए जाएँगे।`;

      const res = await fetch('/api/gnani/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: confirmationText,
          voice: selectedVoice,
          model: selectedModel,
          language: selectedLanguage,
          speed: speechSpeed
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.message || `Handshake failed with status ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(url);

      setReconnectNotice(
        `AI Character "${selectedVoice}" (${selectedModel}) saved and reconnected! Applied across incoming calls and simulator.`
      );

      // Automatically play confirmation audio
      setTimeout(() => {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.play().catch(() => {});
        }
      }, 150);
    } catch (err: any) {
      console.error('Save & Reconnect error:', err);
      setErrorMsg(err.message || 'Failed to reconnect with Gnani AI service.');
    } finally {
      setIsSavingAndReconnecting(false);
    }
  };

  const samplePrompts = [
    {
      title: 'Tuition Fee Response',
      text: 'At Verma Science Tutorial, Class 10 Board Masterclass fee is ₹3,500 per month. Two free demo classes are offered before admission.'
    },
    {
      title: 'Class Timing Greeting',
      text: 'Hello! Mrs. Sunita Verma is currently teaching Class 9 Science. Batches run weekday evenings from 4:00 PM to 9:00 PM.'
    },
    {
      title: 'Personal Callback Note',
      text: 'The educator has logged your inquiry regarding tuition admissions and will call you back immediately after batch completion.'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Studio Header & Status */}
      <div className="parchment-banner rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] uppercase tracking-wider">
            <Radio className="h-3.5 w-3.5 text-[#C86D51]" />
            <span>Gnani AI Acoustic Studio</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Voice Lab &amp; AI Character Tuning
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] max-w-2xl leading-relaxed">
            Configure the neural voice model and AI receptionist persona. Save your model choices to apply them across live phone reception and call simulations.
          </p>
        </div>

        {/* Gnani API Status Badge */}
        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#121E30] border border-[#EAE5D9] dark:border-[#22334A] text-xs font-bold shadow-2xs">
            {isCheckingStatus ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C5A880]" />
                <span className="text-[#64748B]">Verifying Gnani API...</span>
              </>
            ) : apiKeyDetected ? (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-[#3B7A57]" />
                <span className="text-[#132238] dark:text-[#F8FAFC]">Gnani AI: Connected</span>
              </>
            ) : (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-[#C86D51]" />
                <span className="text-[#C86D51]">Secret Required</span>
              </>
            )}
          </div>

          {/* Active Voice Pill */}
          <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
            <span>Active in App:</span>
            <span className="font-bold text-[#1B365D] dark:text-[#93B4E0]">
              {activeSettings?.aiVoice || 'Nalini'}
            </span>
            <span className="text-[10px] text-[#C5A880] font-mono">
              ({activeSettings?.aiModel || 'timbre-v2.5'})
            </span>
          </div>
        </div>
      </div>

      {/* Sync / Unsaved Changes Notification Pill */}
      {isModified && (
        <div className="p-3.5 rounded-2xl bg-[#FAF6ED] dark:bg-[#1A2638] border border-[#C5A880] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#C86D51] shrink-0" />
            <span className="text-[#132238] dark:text-[#F8FAFC]">
              You selected character <strong>{selectedVoice}</strong> with model <strong>{selectedModel}</strong>. Click &ldquo;Save &amp; Reconnect&rdquo; to apply to all incoming calls.
            </span>
          </div>
          <button
            onClick={handleSaveAndReconnect}
            disabled={isSavingAndReconnecting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shrink-0 disabled:opacity-50"
          >
            {isSavingAndReconnecting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save &amp; Reconnect</span>
          </button>
        </div>
      )}

      {/* Main Studio Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Customizer & Controls (7 cols) */}
        <div className="lg:col-span-7 editorial-card p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
            <h2 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
              Voice Persona &amp; Acoustic Configuration
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6ED] text-[#C5A880] border border-[#EAE5D9] dark:border-[#22334A]">
                Model: {selectedModel}
              </span>
            </div>
          </div>

          {/* Model Selector & Voice Character Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1.5 flex items-center justify-between">
                <span>AI Voice Character</span>
                <span className="text-[10px] font-normal text-[#64748B]">Timbre v2.5</span>
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
              >
                <optgroup label="Female Educator Voices">
                  <option value="Nalini">Nalini (Default · Warm Polite Academic)</option>
                  <option value="Chitra">Chitra (Articulate Pan-India Hindi)</option>
                  <option value="Radhika">Radhika (Polite Formal Educator)</option>
                  <option value="Bhavna">Bhavna (Gentle Receptionist)</option>
                  <option value="Kaveri">Kaveri (Clear Conversational)</option>
                  <option value="Tanvi">Tanvi (Modern Academic Front Desk)</option>
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

            <div>
              <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1.5 flex items-center justify-between">
                <span>Synthesis Neural Model</span>
                <span className="text-[10px] font-mono text-[#C5A880]">API Engine</span>
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
              >
                <option value="timbre-v2.5">timbre-v2.5 (High Definition 48kHz Neural)</option>
                <option value="timbre-v2">timbre-v2 (Multi-lingual Standard Neural)</option>
              </select>
            </div>
          </div>

          {/* Language & Dialect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1.5">
                Spoken Language &amp; Dialect
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3.5 py-2.5 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
              >
                <option value="hi-IN">Hindi (hi-IN · Pan-India Standard)</option>
                <option value="en-IN">Indian English (en-IN)</option>
                <option value="mr-IN">Marathi (mr-IN · Maharashtra)</option>
                <option value="ta-IN">Tamil (ta-IN)</option>
                <option value="te-IN">Telugu (te-IN)</option>
                <option value="kn-IN">Kannada (kn-IN)</option>
              </select>
            </div>

            {/* Speech Cadence Slider */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#132238] dark:text-[#F8FAFC]">
                  Speech Speed / Cadence
                </label>
                <span className="font-mono text-xs font-bold text-[#1B365D] dark:text-[#93B4E0]">
                  {speechSpeed.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.3"
                step="0.05"
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#1B365D] mt-2"
              />
              <div className="flex justify-between text-[10px] text-[#64748B]">
                <span>0.75x (Deliberate)</span>
                <span>1.0x (Natural)</span>
                <span>1.3x (Brisk)</span>
              </div>
            </div>
          </div>

          {/* Action Row: Save & Reconnect + Preview */}
          <div className="p-3.5 rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FAF6ED]/60 dark:bg-[#16243A]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-[#132238] dark:text-[#F8FAFC] flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-[#C86D51]" />
                <span>Save Persona to Call to Teach:</span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Saves &ldquo;{selectedVoice}&rdquo; ({selectedModel}) to educator profile and re-synchronizes live call reception.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveAndReconnect}
              disabled={isSavingAndReconnecting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 shrink-0"
            >
              {isSavingAndReconnecting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Reconnecting...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Save &amp; Reconnect</span>
                </>
              )}
            </button>
          </div>

          {/* Text Input Area */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#132238] dark:text-[#F8FAFC]">
                Spoken Test Script
              </label>
              <span className="text-[10px] text-[#64748B]">
                {ttsText.length} characters
              </span>
            </div>
            <textarea
              rows={3}
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
              placeholder="Enter text for the AI voice receptionist to speak..."
              className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] p-3 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D] resize-none leading-relaxed"
            />
          </div>

          {/* 3 Quick Sample Script Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
              Load Realistic Educator Sample:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTtsText(p.text)}
                  className="p-2.5 text-left rounded-xl border border-[#EAE5D9] dark:border-[#22334A] hover:border-[#1B365D] bg-[#FBF9F5] dark:bg-[#0C1420] hover:bg-white transition-all text-xs"
                >
                  <div className="font-bold text-[#132238] dark:text-[#F8FAFC] text-[11px] truncate">
                    {p.title}
                  </div>
                  <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] line-clamp-2 mt-0.5">
                    {p.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerateVoice}
            disabled={isGenerating || !ttsText.trim()}
            className="w-full py-3.5 px-6 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Synthesizing Voice via Gnani Timbre...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Synthesize &amp; Preview with {selectedVoice}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Audio Waveform Visualizer & Playback (5 cols) */}
        <div className="lg:col-span-5 editorial-card p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
              <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                Acoustic Waveform Monitor
              </h3>
              <span className="text-xs text-[#64748B]">
                {selectedVoice} · {selectedModel}
              </span>
            </div>

            {/* Dynamic Sound Wave Graphical Display */}
            <div className="h-44 rounded-2xl bg-[#132238] dark:bg-[#0C1420] border border-[#22334A] p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px] text-[#C5A880]">
                <span>Format: Linear PCM</span>
                <span>Channels: 1 (Mono)</span>
              </div>

              {/* Sound Waveform Visualization Bars */}
              <div className="flex items-center justify-center gap-1.5 h-24 my-auto">
                {[12, 24, 38, 54, 72, 85, 96, 68, 52, 78, 90, 60, 42, 30, 20].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-200 ${
                      isPlaying
                        ? 'bg-[#C86D51] wave-bar'
                        : 'bg-[#C5A880]/60'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(12, h * (speechSpeed || 1))}px` : `${Math.max(8, h * 0.4)}px`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                <span>Sample Width: 2 Bytes</span>
                <span>Bitrate: 768 kbps</span>
              </div>
            </div>

            {/* Reconnect Notice */}
            {reconnectNotice && (
              <div className="p-3.5 rounded-xl border border-[#3B7A57] bg-[#EDF6F0] dark:bg-[#13281E] text-xs text-[#3B7A57] dark:text-[#5BA87B] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Reconnected &amp; Synced!</span>
                </div>
                <p className="leading-snug">{reconnectNotice}</p>
              </div>
            )}

            {/* Error Notice if any */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl border border-[#C86D51] bg-[#FDF3F0] dark:bg-[#2C1E1B] text-xs text-[#C86D51] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Speech Synthesis Notice</span>
                </div>
                <p className="leading-snug">{errorMsg}</p>
              </div>
            )}

            {/* Success Notice if any */}
            {successInfo && (
              <div className="p-3 rounded-xl border border-[#3B7A57] bg-[#EDF6F0] dark:bg-[#13281E] text-xs text-[#3B7A57] dark:text-[#5BA87B] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successInfo}</span>
              </div>
            )}
          </div>

          {/* HTML5 Audio Player & Download WAV */}
          <div className="space-y-3 pt-3 border-t border-[#F0ECE3] dark:border-[#1E2E44]">
            {audioUrl ? (
              <div className="space-y-3">
                <audio
                  ref={audioPlayerRef}
                  src={audioUrl}
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-10 rounded-lg"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B] text-[11px]">Direct Binary WAV</span>
                  <a
                    href={audioUrl}
                    download={`call_to_teach_${selectedVoice.toLowerCase()}_${selectedModel}.wav`}
                    className="inline-flex items-center gap-1 font-semibold text-[#1B365D] dark:text-[#93B4E0] hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download WAV File</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-[#64748B]">
                Click &ldquo;Synthesize &amp; Preview Voice&rdquo; or &ldquo;Save &amp; Reconnect&rdquo; to test real voice playback.
              </div>
            )}

            <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5 pt-2 border-t border-[#F0ECE3] dark:border-[#1E2E44]">
              <Info className="h-3.5 w-3.5 text-[#C5A880] shrink-0" />
              <span>Tested and tuned for high clarity on mobile phone loudspeakers across India.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
