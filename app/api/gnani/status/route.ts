import { NextResponse } from 'next/server';

export async function GET() {
  const isConfigured = Boolean(process.env.GNANI_API_KEY && process.env.GNANI_API_KEY.trim().length > 0);
  return NextResponse.json({
    configured: isConfigured,
    provider: 'Gnani AI (Vachana)',
    services: {
      tts: {
        model: 'timbre-v2.5',
        defaultVoice: 'Nalini',
        defaultLanguage: 'hi-IN'
      },
      stt: {
        service: 'Prisma v3',
        defaultLanguage: 'hi-IN'
      }
    }
  });
}
