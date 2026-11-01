import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GNANI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'GNANI_API_KEY is not configured in Google AI Studio Secrets.',
          configured: false
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const {
      text,
      voice = 'Nalini',
      language = 'hi-IN',
      speed = 1.0,
      model = 'timbre-v2.5'
    } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Text string is required for speech synthesis.' },
        { status: 400 }
      );
    }

    // Supported voices verified for Gnani Timbre v2.5
    const TIMBRE_V2_5_SUPPORTED_VOICES = new Set([
      'Nalini', 'Bhavna', 'Yashvi', 'Urmila', 'Jwala', 'Chitra', 'Ambuja', 'Deepak',
      'Roopesh', 'Vikrant', 'Hemraj', 'Jalaj', 'Omkar', 'Aarohi', 'Bhavini', 'Charvi',
      'Eishani', 'Falguni', 'Gauri', 'Iravati', 'Janaki', 'Kamakshi', 'Madhuri', 'Radhika',
      'Shweta', 'Tanvi', 'Vidya', 'Wamika', 'Yamini', 'Abhimanyu', 'Chirag', 'Deven',
      'Farhan', 'Jatin', 'Kartik', 'Kaveri', 'Trupti', 'Devika', 'Pranav', 'Shlok',
      'Girish', 'Asmita', 'Trisha', 'Brinda', 'Vedika', 'Noopur', 'Oviya', 'Parvati',
      'Suhana', 'Lehara', 'Lavanya', 'Yukti', 'Varuni', 'Saanvi', 'Kavin', 'Hansika',
      'Reshma', 'Riyaan', 'Zahira', 'Ishaan', 'Kirra', 'Dhruva', 'Damini', 'Urvashi',
      'Falak', 'Veera', 'Lalita', 'Nayana', 'Gaurav', 'Harshit', 'Mehuli', 'Zayan', 'Poorvi'
    ]);

    // Map common aliases or legacy test voices to valid Timbre voices
    const VOICE_ALIAS_MAP: Record<string, string> = {
      chaitra: 'Chitra',
      sneha: 'Nalini',
      kavya: 'Kaveri',
      rohan: 'Deepak',
      aditya: 'Abhimanyu'
    };

    let resolvedVoice = 'Nalini';
    const normalizedVoice = String(voice || 'Nalini').toLowerCase().trim();

    if (VOICE_ALIAS_MAP[normalizedVoice]) {
      resolvedVoice = VOICE_ALIAS_MAP[normalizedVoice];
    } else {
      const match = Array.from(TIMBRE_V2_5_SUPPORTED_VOICES).find(
        (v) => v.toLowerCase() === normalizedVoice
      );
      if (match) {
        resolvedVoice = match;
      } else {
        console.warn(`Requested voice "${voice}" not recognized for Timbre v2.5. Defaulting to Nalini.`);
        resolvedVoice = 'Nalini';
      }
    }

    // Normalize language codes to ISO formats accepted by Gnani
    const LANGUAGE_MAP: Record<string, string> = {
      hinglish: 'hi-IN',
      hindi: 'hi-IN',
      'hi-in': 'hi-IN',
      english: 'en-IN',
      'en-in': 'en-IN',
      marathi: 'mr-IN',
      'mr-in': 'mr-IN',
      tamil: 'ta-IN',
      'ta-in': 'ta-IN',
      telugu: 'te-IN',
      'te-in': 'te-IN',
      kannada: 'kn-IN',
      'kn-in': 'kn-IN',
      bengali: 'bn-IN',
      'bn-in': 'bn-IN'
    };
    const resolvedLanguage =
      LANGUAGE_MAP[String(language || 'hi-IN').toLowerCase().trim()] || language || 'hi-IN';

    const resolvedModel =
      model && typeof model === 'string' && model.trim() ? model.trim() : 'timbre-v2.5';

    // Gnani Timbre TTS Inference API payload
    const gnaniPayload = {
      text: text.trim(),
      model: resolvedModel,
      voice: resolvedVoice,
      language: resolvedLanguage,
      speed: Math.max(0.7, Math.min(1.4, Number(speed) || 1.0)),
      output: {
        format: 'wav',
        audio_encoding: 'linear_pcm',
        channels: 'mono',
        sampling_rate: 48000,
        sample_width: 2
      }
    };

    const gnaniRes = await fetch('https://api.vachana.ai/api/v1/tts/inference', {
      method: 'POST',
      headers: {
        'X-API-Key-ID': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gnaniPayload)
    });

    if (!gnaniRes.ok) {
      const errorText = await gnaniRes.text().catch(() => 'Failed to read response');
      console.error('Gnani TTS error response:', gnaniRes.status, errorText);

      let parsedDetail = '';
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.message) parsedDetail = parsed.message;
      } catch {}

      let errorType = 'API_ERROR';
      let message = parsedDetail || `Gnani AI TTS failed with status ${gnaniRes.status}`;

      if (
        gnaniRes.status === 401 ||
        gnaniRes.status === 403 ||
        errorText.toLowerCase().includes('auth') ||
        errorText.toLowerCase().includes('unauthorized') ||
        errorText.toLowerCase().includes('api key')
      ) {
        errorType = 'AUTHENTICATION_FAILED';
        message = 'Authentication Failed: Invalid or unauthorized GNANI_API_KEY. Please verify your key in Google AI Studio Settings > Secrets.';
      } else if (
        gnaniRes.status === 402 ||
        errorText.toLowerCase().includes('credit') ||
        errorText.toLowerCase().includes('balance') ||
        errorText.toLowerCase().includes('quota') ||
        errorText.toLowerCase().includes('payment')
      ) {
        errorType = 'INSUFFICIENT_CREDITS';
        message = 'Insufficient Credits: Your Gnani AI (Vachana) account balance is exhausted. Please recharge your account credits.';
      } else if (gnaniRes.status === 429) {
        errorType = 'RATE_LIMIT_EXCEEDED';
        message = 'Rate Limit Exceeded: Too many concurrent requests sent to Gnani AI. Please wait a few seconds and try again.';
      } else if (gnaniRes.status === 400) {
        errorType = 'BAD_REQUEST';
        message = parsedDetail || 'Bad Request: The audio format or text parameter was rejected by Gnani Timbre.';
      } else if (gnaniRes.status >= 500) {
        errorType = 'SERVICE_UNAVAILABLE';
        message = `Gnani Service Unavailable (${gnaniRes.status}): Upstream Vachana AI servers are experiencing downtime.`;
      }

      return NextResponse.json(
        {
          error: message,
          errorType,
          statusCode: gnaniRes.status,
          details: errorText
        },
        { status: gnaniRes.status }
      );
    }

    const contentType = gnaniRes.headers.get('content-type') || '';

    // If Gnani returned binary audio directly
    if (contentType.includes('audio') || contentType.includes('octet-stream')) {
      const arrayBuffer = await gnaniRes.arrayBuffer();
      return new Response(new Uint8Array(arrayBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Disposition': 'inline; filename="gnani_speech.wav"',
          'Cache-Control': 'no-cache'
        }
      });
    }

    // If Gnani returned JSON containing base64 audio
    const jsonResponse = await gnaniRes.json().catch(() => null);
    if (jsonResponse) {
      const base64Audio =
        jsonResponse.audioContent ||
        jsonResponse.audio_content ||
        jsonResponse.audio ||
        jsonResponse.data ||
        jsonResponse.base64_audio;

      if (base64Audio && typeof base64Audio === 'string') {
        const cleanBase64 = base64Audio.replace(/^data:audio\/\w+;base64,/, '');
        const binaryBuffer = Buffer.from(cleanBase64, 'base64');
        return new Response(new Uint8Array(binaryBuffer), {
          status: 200,
          headers: {
            'Content-Type': 'audio/wav',
            'Content-Disposition': 'inline; filename="gnani_speech.wav"',
            'Cache-Control': 'no-cache'
          }
        });
      }
    }

    // Fallback: return raw arrayBuffer
    const rawBuffer = await gnaniRes.arrayBuffer();
    return new Response(new Uint8Array(rawBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('Gnani TTS server error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error during speech synthesis' },
      { status: 500 }
    );
  }
}
