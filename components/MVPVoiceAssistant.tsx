'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  IndianRupee,
  BookOpen,
  MapPin,
  Sparkles,
  PhoneCall,
  Loader2,
  VolumeX,
  Radio,
  ShieldAlert,
  ArrowRight,
  Info,
  Download
} from 'lucide-react';
import { DEMO_LEARNING_CENTRE_PROFILE as DEMO_PROFILE } from '@/lib/demo-data';

interface ProcessResult {
  transcript: string;
  answer: string;
  groundedIn: string;
  isMissingInfo: boolean;
  audioUrl: string | null;
  processingStatus: string;
  engine: string;
}

interface ApiError {
  type: 'AUTHENTICATION_FAILED' | 'INSUFFICIENT_CREDITS' | 'RATE_LIMIT' | 'UNSUPPORTED_FORMAT' | 'NETWORK_ERROR' | 'GENERAL';
  title: string;
  message: string;
  actionHint: string;
}

export const MVPVoiceAssistant: React.FC<{ onExploreDashboard?: () => void }> = ({ onExploreDashboard }) => {
  // Audio Input State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordTime, setRecordTime] = useState<number>(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  // Processing State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<'idle' | 'stt' | 'grounding' | 'tts' | 'completed'>('idle');
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Recorders and Timers
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cleanup audio url on unmount
  useEffect(() => {
    return () => {
      if (result?.audioUrl) {
        URL.revokeObjectURL(result.audioUrl);
      }
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }
    };
  }, [result]);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['wav', 'mp3', 'm4a', 'ogg', 'webm'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(extension) && !file.type.includes('audio')) {
      setError({
        type: 'UNSUPPORTED_FORMAT',
        title: 'Unsupported Audio Format',
        message: `The uploaded file "${file.name}" is not a recognized audio format.`,
        actionHint: 'Please upload a standard WAV (.wav) or MP3 (.mp3) audio recording under 25MB.'
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError({
        type: 'UNSUPPORTED_FORMAT',
        title: 'Audio File Too Large',
        message: 'The selected file exceeds the 25MB upload limit.',
        actionHint: 'Please upload a shorter audio query (10 to 60 seconds is ideal).'
      });
      return;
    }

    setSelectedFile(file);
    setRecordedBlob(null);
  };

  // Start Live Microphone Recording
  const startRecording = async () => {
    setError(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(audioBlob);
        setSelectedFile(new File([audioBlob], 'live_recording.wav', { type: 'audio/wav' }));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordTime(0);

      recordTimerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setError({
        type: 'GENERAL',
        title: 'Microphone Permission Required',
        message: 'Could not access your microphone to record audio.',
        actionHint: 'Please allow microphone permissions in your browser or select an audio file to upload.'
      });
    }
  };

  // Stop Live Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }
    }
  };

  // Execute End-to-End Voice Assistant Pipeline
  const handleProcessPipeline = async (overrideAudioFile?: File, overrideQuestionText?: string) => {
    const fileToProcess = overrideAudioFile || selectedFile;

    if (!fileToProcess && !overrideQuestionText) {
      setError({
        type: 'GENERAL',
        title: 'No Audio Provided',
        message: 'Please upload an audio file, record your voice, or pick one of the 3 instant test scenarios below.',
        actionHint: 'Click "Record Voice", "Upload Audio", or choose one of the quick test cards.'
      });
      return;
    }

    setError(null);
    setIsProcessing(true);
    setResult(null);

    try {
      let recognizedText = '';

      // STEP 1: Gnani Prisma Speech-to-Text (if audio is provided)
      if (fileToProcess) {
        setCurrentStep('stt');

        const formData = new FormData();
        formData.append('audio_file', fileToProcess);
        formData.append('language_code', 'hi-IN');
        formData.append('preferred_language', 'hi-IN');
        formData.append('format', 'transcribe');
        formData.append('itn_native_numerals', 'true');

        const sttRes = await fetch('/api/gnani/stt', {
          method: 'POST',
          body: formData
        });

        if (!sttRes.ok) {
          const errData = await sttRes.json().catch(() => ({}));
          handleApiError(sttRes.status, errData, 'Speech-to-Text (Gnani Prisma)');
          setIsProcessing(false);
          setCurrentStep('idle');
          return;
        }

        const sttData = await sttRes.json();
        recognizedText = sttData.transcript?.trim() || '';

        if (!recognizedText) {
          setError({
            type: 'GENERAL',
            title: 'No Speech Detected',
            message: 'Gnani Prisma STT did not detect clear spoken words in this recording.',
            actionHint: 'Please speak closer to your microphone or test with one of the instant questions.'
          });
          setIsProcessing(false);
          setCurrentStep('idle');
          return;
        }
      } else if (overrideQuestionText) {
        recognizedText = overrideQuestionText;
      }

      // STEP 2: Grounded Answering from Demo Learning Centre Profile
      setCurrentStep('grounding');
      const groundRes = await fetch('/api/assistant/grounded-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: recognizedText })
      });

      if (!groundRes.ok) {
        const groundErr = await groundRes.json().catch(() => ({}));
        throw new Error(groundErr.error || 'Failed to generate grounded answer.');
      }

      const groundData = await groundRes.json();
      const answerText = groundData.answer;

      // STEP 3: Gnani Timbre Text-to-Speech Synthesis
      setCurrentStep('tts');
      const ttsRes = await fetch('/api/gnani/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: answerText,
          voice: 'Nalini',
          language: 'hi-IN',
          speed: 1.0,
          model: 'timbre-v2.5'
        })
      });

      let audioBlobUrl: string | null = null;
      if (ttsRes.ok) {
        const audioBlob = await ttsRes.blob();
        audioBlobUrl = URL.createObjectURL(audioBlob);
      } else {
        const errData = await ttsRes.json().catch(() => ({}));
        console.warn('TTS warning:', ttsRes.status, errData);
        handleApiError(ttsRes.status, errData, 'Text-to-Speech (Gnani Timbre)');
      }

      setCurrentStep('completed');
      setResult({
        transcript: recognizedText,
        answer: answerText,
        groundedIn: groundData.groundedIn,
        isMissingInfo: groundData.isMissingInfo,
        audioUrl: audioBlobUrl,
        processingStatus: 'Verified & Synthesized (48kHz WAV)',
        engine: groundData.engine || 'Call to Teach Knowledge Base'
      });

      // Autoplay synthesized answer if available
      if (audioBlobUrl) {
        setTimeout(() => {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.play().catch(() => {});
          }
        }, 300);
      }
    } catch (err: any) {
      console.error('Pipeline processing error:', err);
      setError({
        type: 'GENERAL',
        title: 'Processing Pipeline Error',
        message: err.message || 'An unexpected error occurred while executing the voice assistant pipeline.',
        actionHint: 'Please check your connection and retry.'
      });
      setCurrentStep('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApiError = (status: number, errData: any, stage: string) => {
    if (status === 401 || status === 403 || errData.errorType === 'AUTHENTICATION_FAILED') {
      setError({
        type: 'AUTHENTICATION_FAILED',
        title: 'Authentication Failed (GNANI_API_KEY)',
        message: 'The Gnani AI API rejected the request with status ' + status + '.',
        actionHint: 'Ensure GNANI_API_KEY is configured in Google AI Studio Settings > Secrets.'
      });
    } else if (status === 402 || errData.errorType === 'INSUFFICIENT_CREDITS') {
      setError({
        type: 'INSUFFICIENT_CREDITS',
        title: 'Insufficient Credits',
        message: 'Your Gnani AI (Vachana) account balance is exhausted.',
        actionHint: 'Please recharge your Vachana AI account credits for speech inference.'
      });
    } else if (status === 429) {
      setError({
        type: 'RATE_LIMIT',
        title: 'Rate Limit Exceeded',
        message: 'Too many concurrent requests have been sent to Gnani AI.',
        actionHint: 'Please wait a few seconds and click Process Audio again.'
      });
    } else {
      setError({
        type: 'GENERAL',
        title: `${stage} Failed (${status})`,
        message: errData.error || errData.details || `Request failed during ${stage}.`,
        actionHint: 'Inspect the server logs or test with one of the pre-set inquiries.'
      });
    }
  };

  const handleQuickTest = (scenarioType: 'fees' | 'timings' | 'unlisted') => {
    setError(null);
    let questionText = '';
    if (scenarioType === 'fees') {
      questionText = 'What are the fees for Class 10?';
    } else if (scenarioType === 'timings') {
      questionText = 'What are the batch timings for Class 9?';
    } else {
      questionText = 'Do you offer French language classes?';
    }

    handleProcessPipeline(undefined, questionText);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Scope Badge & Header */}
      <div className="parchment-banner rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF6ED] dark:bg-[#16243A] text-[#C86D51] border border-[#EAE5D9] dark:border-[#22334A] text-xs font-bold uppercase tracking-wider">
            <Radio className="h-3.5 w-3.5 text-[#C86D51] animate-pulse" />
            <span>MVP Demo — Audio upload, not live telephone calling</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Call to Teach — Voice Assistant Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
            Experience the voice AI pipeline right in your browser. Upload an audio query, record your voice, or click an instant test scenario. The assistant transcribes with <strong>Gnani Prisma STT</strong>, grounds answers strictly in the verified profile, and speaks back via <strong>Gnani Timbre TTS (Nalini 48kHz WAV)</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
          {onExploreDashboard && (
            <button
              onClick={onExploreDashboard}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>Full Educator Suite</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
          <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 px-1">
            <Info className="h-3.5 w-3.5 text-[#C5A880] shrink-0" />
            <span>Carrier telephony uses DID trunks (Twilio/Exotel)</span>
          </div>
        </div>
      </div>

      {/* Grid: Demo Teacher Profile + Audio Testing Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Verified Teacher Profile (Ground Truth) (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="editorial-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#132238] dark:bg-[#1B365D] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  AV
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC] leading-tight">
                    {DEMO_PROFILE.className}
                  </h2>
                  <p className="text-xs text-[#1B365D] dark:text-[#93B4E0] font-medium">
                    {DEMO_PROFILE.teacherName}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EDF6F0] text-[#3B7A57] text-[10px] font-bold uppercase tracking-wider border border-[#C4E1CC]">
                Ground Truth
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-[#64748B] block mb-1">
                  Subjects &amp; Grades:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DEMO_PROFILE.subjects.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF6ED] dark:bg-[#16243A] text-[#132238] dark:text-[#F8FAFC] font-medium border border-[#EAE5D9] dark:border-[#22334A]"
                    >
                      {sub}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-lg bg-[#EDF3FA] dark:bg-[#1A2D4A] text-[#1B365D] dark:text-[#93B4E0] font-medium">
                    Class 9 &amp; 10 (CBSE / State)
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-[#64748B] block mb-1">
                  Monthly Fee Structure:
                </span>
                <div className="space-y-1.5">
                  {DEMO_PROFILE.feeStructure.map((fee, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F6] dark:bg-[#0C1420] border border-[#EAE5D9] dark:border-[#22334A]"
                    >
                      <span className="font-medium text-[#132238] dark:text-[#F8FAFC]">{fee.course}</span>
                      <span className="font-bold text-[#3B7A57] dark:text-[#5BA87B]">{fee.fee}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-[#64748B] block mb-1">
                  Batch Timings &amp; Schedule:
                </span>
                <div className="space-y-1.5">
                  {DEMO_PROFILE.timings.map((time, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F6] dark:bg-[#0C1420] border border-[#EAE5D9] dark:border-[#22334A]"
                    >
                      <div>
                        <span className="font-bold text-[#132238] dark:text-[#F8FAFC] block">{time.batch}</span>
                        <span className="text-[11px] text-[#64748B]">{time.days}</span>
                      </div>
                      <span className="text-right font-medium text-[#1B365D] dark:text-[#93B4E0] text-[11px]">
                        {time.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0ECE3] dark:border-[#1E2E44] flex items-center justify-between text-[#64748B] text-[11px]">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#C86D51]" />
                  {DEMO_PROFILE.location}
                </span>
                <span className="text-[#3B7A57] font-semibold">2 Free Demo Classes</span>
              </div>
            </div>
          </div>

          {/* Strict Non-Hallucination Guardrail Callout */}
          <div className="rounded-2xl border border-[#D9D1C2] dark:border-[#22334A] bg-[#FAF6ED] dark:bg-[#16243A] p-4 text-xs text-[#475569] dark:text-[#CBD5E1] space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-[#132238] dark:text-[#F8FAFC]">
              <ShieldAlert className="h-4 w-4 text-[#C86D51]" />
              <span>Strict Non-Hallucination Guardrail</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              When an inquiry asks about unlisted subjects (such as French, German, or unlisted fees), the AI strictly refuses to invent answers, responding: <em>&ldquo;The teacher needs to confirm that detail. I have logged your request and Prof. Amit Verma will call you back.&rdquo;</em>
            </p>
          </div>
        </div>

        {/* Right Column: Audio Upload & Processing Station (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="editorial-card p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">Caller Audio Input</h2>
                <p className="text-xs text-[#64748B]">
                  Provide audio via upload, microphone, or select an instant test question
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF6ED] text-[#132238] dark:bg-[#16243A] dark:text-[#F8FAFC]">
                WAV / MP3
              </span>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File Upload Option */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  selectedFile && !recordedBlob
                    ? 'border-[#1B365D] bg-[#EDF3FA] dark:bg-[#1A2D4A]'
                    : 'border-[#D9D1C2] dark:border-[#2E4362] hover:border-[#1B365D] bg-[#FAF9F6] dark:bg-[#0C1420]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".wav,.mp3,.m4a,audio/*"
                  className="hidden"
                />
                <Upload className="h-6 w-6 text-[#1B365D] dark:text-[#93B4E0] mb-2" />
                <span className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC] block">
                  {selectedFile && !recordedBlob ? selectedFile.name : 'Upload Audio File'}
                </span>
                <span className="text-[10px] text-[#64748B] mt-0.5">
                  {selectedFile && !recordedBlob
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB (Ready)`
                    : 'WAV or MP3 (Max 25MB)'}
                </span>
              </div>

              {/* Live Microphone Recording Option */}
              <div
                className={`border-2 rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center ${
                  isRecording
                    ? 'border-[#C86D51] bg-[#FDF3F0] dark:bg-[#2C1E1B] animate-pulse'
                    : recordedBlob
                    ? 'border-[#3B7A57] bg-[#EDF6F0] dark:bg-[#13281E]'
                    : 'border-[#D9D1C2] dark:border-[#2E4362] bg-[#FAF9F6] dark:bg-[#0C1420]'
                }`}
              >
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="w-full flex flex-col items-center justify-center text-[#C86D51]"
                  >
                    <MicOff className="h-6 w-6 mb-1 text-[#C86D51] animate-bounce" />
                    <span className="text-xs font-bold">Stop Recording ({recordTime}s)</span>
                    <span className="text-[10px] mt-0.5">Click to finish and use audio</span>
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    className="w-full flex flex-col items-center justify-center text-[#132238] dark:text-[#F8FAFC]"
                  >
                    <Mic className="h-6 w-6 text-[#1B365D] dark:text-[#93B4E0] mb-1" />
                    <span className="text-xs font-bold">
                      {recordedBlob ? 'Re-record Microphone' : 'Record Microphone'}
                    </span>
                    <span className="text-[10px] text-[#64748B] mt-0.5">
                      {recordedBlob ? `Captured (${recordTime}s audio)` : 'Speak directly in browser'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Instant Realistic Test Scenarios */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#C86D51]" />
                Or Pick an Instant Realistic Test Scenario:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickTest('fees')}
                  disabled={isProcessing}
                  className="p-3 text-left rounded-xl border border-[#EAE5D9] dark:border-[#22334A] hover:border-[#1B365D] bg-[#FAF9F6] dark:bg-[#0C1420] hover:bg-white transition-all text-xs"
                >
                  <div className="font-bold text-[#132238] dark:text-[#F8FAFC] flex items-center justify-between mb-0.5">
                    <span>1. Fees Question</span>
                    <IndianRupee className="h-3.5 w-3.5 text-[#3B7A57]" />
                  </div>
                  <p className="text-[11px] text-[#64748B] line-clamp-2">
                    &ldquo;What are the fees for Class 10?&rdquo;
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickTest('timings')}
                  disabled={isProcessing}
                  className="p-3 text-left rounded-xl border border-[#EAE5D9] dark:border-[#22334A] hover:border-[#1B365D] bg-[#FAF9F6] dark:bg-[#0C1420] hover:bg-white transition-all text-xs"
                >
                  <div className="font-bold text-[#132238] dark:text-[#F8FAFC] flex items-center justify-between mb-0.5">
                    <span>2. Timing Question</span>
                    <Clock className="h-3.5 w-3.5 text-[#1B365D]" />
                  </div>
                  <p className="text-[11px] text-[#64748B] line-clamp-2">
                    &ldquo;What are the batch timings for Class 9?&rdquo;
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickTest('unlisted')}
                  disabled={isProcessing}
                  className="p-3 text-left rounded-xl border border-[#D9D1C2] dark:border-[#22334A] bg-[#FAF6ED] dark:bg-[#16243A] hover:border-[#C86D51] transition-all text-xs"
                >
                  <div className="font-bold text-[#C86D51] flex items-center justify-between mb-0.5">
                    <span>3. Unlisted Question</span>
                    <ShieldAlert className="h-3.5 w-3.5 text-[#C86D51]" />
                  </div>
                  <p className="text-[11px] text-[#64748B] line-clamp-2">
                    &ldquo;Do you offer French language classes?&rdquo;
                  </p>
                </button>
              </div>
            </div>

            {/* Clearly Visible "Process Audio" Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleProcessPipeline()}
                disabled={isProcessing || isRecording}
                className="w-full py-3.5 px-6 rounded-full font-bold text-xs text-white bg-[#1B365D] hover:bg-[#152B4A] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Audio through Gnani Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    <span>Process Audio</span>
                  </>
                )}
              </button>
            </div>

            {/* Processing Steps Live Visualizer */}
            {isProcessing && (
              <div className="p-4 rounded-xl bg-[#FAF6ED] dark:bg-[#16243A] border border-[#EAE5D9] dark:border-[#22334A] space-y-3">
                <span className="text-xs font-bold text-[#132238] dark:text-[#F8FAFC] block">
                  Pipeline Execution Progress:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div
                    className={`p-2 rounded-lg border ${
                      currentStep === 'stt'
                        ? 'border-[#1B365D] bg-[#EDF3FA] text-[#1B365D] font-bold animate-pulse'
                        : currentStep === 'grounding' || currentStep === 'tts' || currentStep === 'completed'
                        ? 'border-[#3B7A57] bg-[#EDF6F0] text-[#3B7A57] font-medium'
                        : 'border-[#EAE5D9] text-[#94A3B8]'
                    }`}
                  >
                    1. Gnani STT
                  </div>
                  <div
                    className={`p-2 rounded-lg border ${
                      currentStep === 'grounding'
                        ? 'border-[#1B365D] bg-[#EDF3FA] text-[#1B365D] font-bold animate-pulse'
                        : currentStep === 'tts' || currentStep === 'completed'
                        ? 'border-[#3B7A57] bg-[#EDF6F0] text-[#3B7A57] font-medium'
                        : 'border-[#EAE5D9] text-[#94A3B8]'
                    }`}
                  >
                    2. Grounded Q&amp;A
                  </div>
                  <div
                    className={`p-2 rounded-lg border ${
                      currentStep === 'tts'
                        ? 'border-[#1B365D] bg-[#EDF3FA] text-[#1B365D] font-bold animate-pulse'
                        : currentStep === 'completed'
                        ? 'border-[#3B7A57] bg-[#EDF6F0] text-[#3B7A57] font-medium'
                        : 'border-[#EAE5D9] text-[#94A3B8]'
                    }`}
                  >
                    3. Gnani TTS
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Notice Card */}
          {error && (
            <div
              className={`rounded-2xl border p-4 shadow-xs space-y-2 text-xs ${
                error.type === 'AUTHENTICATION_FAILED'
                  ? 'border-[#C86D51] bg-[#FDF3F0] text-[#C86D51]'
                  : 'border-[#C5A880] bg-[#FAF6ED] text-[#132238]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#C86D51]" />
                <span>{error.title}</span>
              </div>
              <p className="leading-relaxed">{error.message}</p>
              <div className="pt-2 border-t border-black/10 font-medium">
                <span className="font-bold">Next Step: </span>
                {error.actionHint}
              </div>
            </div>
          )}

          {/* Output Card: Transcription, Grounded Answer & Audio Player */}
          {result && (
            <div className="editorial-card p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#3B7A57]" />
                  <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                    Voice Assistant Response
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#3B7A57] font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{result.processingStatus}</span>
                </div>
              </div>

              {/* 1. Caller Transcription */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  Caller&apos;s Transcribed Question (Gnani Prisma STT):
                </span>
                <div className="p-3 rounded-xl bg-[#FAF6ED] dark:bg-[#16243A] border border-[#EAE5D9] dark:border-[#22334A] text-xs text-[#132238] dark:text-[#F8FAFC] font-medium italic">
                  &ldquo;{result.transcript}&rdquo;
                </div>
              </div>

              {/* 2. Grounded Answer */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    AI Grounded Answer:
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      result.isMissingInfo
                        ? 'bg-[#FDF3F0] text-[#C86D51] border border-[#F3DFD8]'
                        : 'bg-[#EDF3FA] text-[#1B365D] border border-[#D3E0EA]'
                    }`}
                  >
                    Source: {result.groundedIn}
                  </span>
                </div>
                <div
                  className={`p-3.5 rounded-xl border text-xs font-semibold leading-relaxed ${
                    result.isMissingInfo
                      ? 'bg-[#FAF6ED] border-[#D9D1C2] text-[#132238] dark:text-[#F8FAFC]'
                      : 'bg-[#EDF3FA] dark:bg-[#1A2D4A] border-[#D3E0EA] dark:border-[#22334A] text-[#132238] dark:text-[#F8FAFC]'
                  }`}
                >
                  {result.answer}
                </div>
              </div>

              {/* 3. Audio Playback Control */}
              <div className="p-4 rounded-2xl bg-[#132238] text-white space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-[#C5A880]" />
                    <span className="font-bold">Gnani Timbre Voice (Nalini · 48,000 Hz WAV)</span>
                  </div>
                  {result.audioUrl && (
                    <a
                      href={result.audioUrl}
                      download="call_to_teach_reply.wav"
                      className="text-[11px] text-[#C5A880] hover:underline flex items-center gap-1 transition-colors"
                      title="Download synthesized WAV audio"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download WAV</span>
                    </a>
                  )}
                </div>

                {result.audioUrl ? (
                  <audio
                    ref={audioPlayerRef}
                    src={result.audioUrl}
                    onPlay={() => setIsPlayingAudio(true)}
                    onPause={() => setIsPlayingAudio(false)}
                    onEnded={() => setIsPlayingAudio(false)}
                    className="w-full h-10 rounded-lg"
                    controls
                  />
                ) : (
                  <div className="text-xs text-[#C86D51] flex items-center gap-2">
                    <VolumeX className="h-4 w-4" />
                    <span>TTS audio synthesis was skipped or failed.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
