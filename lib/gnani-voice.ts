'use client';

export type GnaniVoice =
  | 'Nalini'
  | 'Chitra'
  | 'Radhika'
  | 'Bhavna'
  | 'Kaveri'
  | 'Tanvi'
  | 'Vidya'
  | 'Gauri'
  | 'Deepak'
  | 'Roopesh'
  | 'Farhan'
  | 'Pranav'
  | 'Gaurav'
  | 'Abhimanyu'
  | (string & {});

export interface GnaniTTSOptions {
  voice?: GnaniVoice;
  model?: string;
  language?: 'hi-IN' | 'en-IN' | 'mr-IN' | 'ta-IN' | 'te-IN' | 'kn-IN' | string;
  speed?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: string) => void;
}

let activeAudio: HTMLAudioElement | null = null;

export async function stopCurrentSpeech() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {}
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Synthesizes text to speech using Gnani AI Timbre v2.5.
 * Falls back to Web Speech Synthesis if Gnani API returns an error or is unconfigured.
 */
export async function speakText(
  text: string,
  options: GnaniTTSOptions = {}
): Promise<{ success: boolean; provider: 'gnani' | 'browser_fallback'; error?: string }> {
  await stopCurrentSpeech();

  if (!text || !text.trim()) {
    return { success: false, provider: 'gnani', error: 'Empty text' };
  }

  const {
    voice = 'Nalini',
    model = 'timbre-v2.5',
    language = 'hi-IN',
    speed = 1.0,
    onStart,
    onEnd,
    onError
  } = options;

  try {
    const res = await fetch('/api/gnani/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text.trim(),
        voice,
        model,
        language,
        speed
      })
    });

    if (res.ok && res.headers.get('content-type')?.includes('audio')) {
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      activeAudio = audio;

      audio.onplay = () => {
        if (onStart) onStart();
      };

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        activeAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        activeAudio = null;
        fallbackBrowserTTS(text, language, voice, onStart, onEnd, onError);
      };

      await audio.play();
      return { success: true, provider: 'gnani' };
    }

    // If server returned error json
    const errData = await res.json().catch(() => ({}));
    console.warn('Gnani TTS endpoint returned error, using high-quality browser voice fallback:', errData);
    fallbackBrowserTTS(text, language, voice, onStart, onEnd, onError);
    return {
      success: true,
      provider: 'browser_fallback',
      error: errData.error || 'Switched to browser voice'
    };
  } catch (err: any) {
    console.warn('Gnani network error, falling back to browser speech:', err);
    fallbackBrowserTTS(text, language, voice, onStart, onEnd, onError);
    return { success: true, provider: 'browser_fallback', error: err?.message };
  }
}

function fallbackBrowserTTS(
  text: string,
  lang: string,
  voiceName?: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: string) => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError('Voice synthesis not supported in this browser.');
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi-IN' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;

    const MALE_VOICES = new Set(['deepak', 'roopesh', 'farhan', 'pranav', 'gaurav', 'abhimanyu']);
    const isMale = MALE_VOICES.has(String(voiceName || '').toLowerCase());
    utterance.pitch = isMale ? 0.88 : 1.08;

    // Pick an Indian English or Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) =>
        v.lang.startsWith(lang.split('-')[0]) ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('hindi')
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Browser TTS error:', e);
      if (onError) onError(e.error || 'Speech synthesis failed');
    };

    window.speechSynthesis.speak(utterance);
  } catch (e: any) {
    if (onError) onError(e?.message || 'Speech synthesis failed');
  }
}

/**
 * Transcribes audio blob using Gnani AI Prisma STT v3.
 */
export async function transcribeAudio(
  audioBlob: Blob,
  languageCode: string = 'hi-IN'
): Promise<{ success: boolean; transcript: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'caller_speech.wav');
    formData.append('language_code', languageCode);
    formData.append('preferred_language', languageCode);

    const res = await fetch('/api/gnani/stt', {
      method: 'POST',
      body: formData
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return {
        success: false,
        transcript: '',
        error: data.error || `Speech recognition failed (status ${res.status})`
      };
    }

    return {
      success: true,
      transcript: data.transcript || ''
    };
  } catch (err: any) {
    return {
      success: false,
      transcript: '',
      error: err?.message || 'Network error during audio transcription'
    };
  }
}

/**
 * Checks Gnani API key status.
 */
export async function checkGnaniStatus(): Promise<{
  configured: boolean;
  provider: string;
}> {
  try {
    const res = await fetch('/api/gnani/status');
    if (!res.ok) return { configured: false, provider: 'Gnani AI' };
    return await res.json();
  } catch {
    return { configured: false, provider: 'Gnani AI' };
  }
}
