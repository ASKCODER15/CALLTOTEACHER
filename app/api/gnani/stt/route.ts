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

    const incomingFormData = await req.formData().catch(() => null);
    if (!incomingFormData) {
      return NextResponse.json(
        { error: 'Multipart form data with audio_file is required.' },
        { status: 400 }
      );
    }

    const audioFile = incomingFormData.get('audio_file') as File | Blob | null;
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio_file attached in request.' },
        { status: 400 }
      );
    }

    // Validate size (max 25MB)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio file size exceeds the 25MB limit.' },
        { status: 400 }
      );
    }

    const languageCode = (incomingFormData.get('language_code') as string) || 'hi-IN';
    const preferredLanguage = (incomingFormData.get('preferred_language') as string) || 'hi-IN';

    // Build FormData to forward to Gnani Prisma STT v3
    const gnaniFormData = new FormData();
    gnaniFormData.append('audio_file', audioFile, (audioFile as File).name || 'audio_input.wav');
    gnaniFormData.append('language_code', languageCode);
    gnaniFormData.append('preferred_language', preferredLanguage);
    gnaniFormData.append('format', 'transcribe');
    gnaniFormData.append('itn_native_numerals', 'true');

    // Send without setting manual Content-Type header to let runtime generate boundary
    const gnaniRes = await fetch('https://api.vachana.ai/stt/v3', {
      method: 'POST',
      headers: {
        'X-API-Key-ID': apiKey
      },
      body: gnaniFormData
    });

    if (!gnaniRes.ok) {
      const errText = await gnaniRes.text().catch(() => 'Failed to read STT response');
      console.error('Gnani STT error:', gnaniRes.status, errText);

      let errorType = 'API_ERROR';
      let message = `Gnani AI Speech Recognition failed with status ${gnaniRes.status}`;

      if (
        gnaniRes.status === 401 ||
        gnaniRes.status === 403 ||
        errText.toLowerCase().includes('auth') ||
        errText.toLowerCase().includes('unauthorized') ||
        errText.toLowerCase().includes('api key')
      ) {
        errorType = 'AUTHENTICATION_FAILED';
        message = 'Authentication Failed: Invalid or unauthorized GNANI_API_KEY. Please verify your key in Google AI Studio Settings > Secrets.';
      } else if (
        gnaniRes.status === 402 ||
        errText.toLowerCase().includes('credit') ||
        errText.toLowerCase().includes('balance') ||
        errText.toLowerCase().includes('quota') ||
        errText.toLowerCase().includes('payment')
      ) {
        errorType = 'INSUFFICIENT_CREDITS';
        message = 'Insufficient Credits: Your Gnani AI (Vachana) account balance is exhausted. Please recharge your account credits.';
      } else if (gnaniRes.status === 429) {
        errorType = 'RATE_LIMIT_EXCEEDED';
        message = 'Rate Limit Exceeded: Too many concurrent requests sent to Gnani AI. Please wait a few seconds and try again.';
      } else if (gnaniRes.status === 400) {
        errorType = 'BAD_REQUEST';
        message = 'Bad Request: The audio format was rejected by Gnani Prisma. Ensure audio is WAV or MP3.';
      } else if (gnaniRes.status >= 500) {
        errorType = 'SERVICE_UNAVAILABLE';
        message = `Gnani Service Unavailable (${gnaniRes.status}): Upstream Vachana AI servers are experiencing downtime.`;
      }

      return NextResponse.json(
        {
          error: message,
          errorType,
          statusCode: gnaniRes.status,
          details: errText
        },
        { status: gnaniRes.status }
      );
    }

    const gnaniData = await gnaniRes.json().catch(() => null);

    // Extract transcript from Gnani format
    // Gnani response usually contains { transcript: "...", ... } or { text: "..." } or { result: [...] }
    let extractedText = '';
    if (gnaniData) {
      extractedText =
        gnaniData.transcript ||
        gnaniData.text ||
        gnaniData.transcription ||
        (Array.isArray(gnaniData.result) ? gnaniData.result.map((r: any) => r.transcript || r.text).join(' ') : '') ||
        '';
    }

    return NextResponse.json({
      success: true,
      transcript: extractedText,
      raw: gnaniData
    });
  } catch (error: any) {
    console.error('Gnani STT server error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error during speech recognition' },
      { status: 500 }
    );
  }
}
