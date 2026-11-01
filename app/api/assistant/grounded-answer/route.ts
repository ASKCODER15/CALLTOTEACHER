import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { DEMO_LEARNING_CENTRE_PROFILE } from '@/lib/demo-data';

// Deterministic grounding fallback
function generateDeterministicAnswer(question: string): { answer: string; groundedIn: string; isMissingInfo: boolean } {
  const q = question.toLowerCase();

  // 1. Fee inquiries
  if (q.includes('fee') || q.includes('fees') || q.includes('cost') || q.includes('charges') || q.includes('price') || q.includes('rupees') || q.includes('kitna') || q.includes('kitne')) {
    if (q.includes('9') || q.includes('ninth')) {
      return {
        answer: 'At Demo Learning Centre, the fee for Class 9 Maths and Science is ₹3,000 per month.',
        groundedIn: 'Fee Schedule (Class 9)',
        isMissingInfo: false
      };
    }
    if (q.includes('10') || q.includes('tenth') || q.includes('board')) {
      return {
        answer: 'For Class 10 Board Exam batch, the fee is ₹3,500 per month. We also offer 2 free trial classes.',
        groundedIn: 'Fee Schedule (Class 10)',
        isMissingInfo: false
      };
    }
    return {
      answer: 'At Demo Learning Centre, fees are ₹3,000 per month for Class 9 and ₹3,500 per month for Class 10. Two free demo classes are included.',
      groundedIn: 'Fee Schedule (All Batches)',
      isMissingInfo: false
    };
  }

  // 2. Timing and schedule inquiries
  if (q.includes('time') || q.includes('timing') || q.includes('timings') || q.includes('schedule') || q.includes('days') || q.includes('kab') || q.includes('batch')) {
    if (q.includes('9') || q.includes('ninth')) {
      return {
        answer: 'Class 9 batches run on Monday, Wednesday, and Friday from 4:30 PM to 6:00 PM.',
        groundedIn: 'Batch Timings (Class 9)',
        isMissingInfo: false
      };
    }
    if (q.includes('10') || q.includes('tenth')) {
      return {
        answer: 'Class 10 batches run on Tuesday, Thursday, and Saturday from 6:00 PM to 7:30 PM.',
        groundedIn: 'Batch Timings (Class 10)',
        isMissingInfo: false
      };
    }
    return {
      answer: 'Batches run weekday evenings: Class 9 on Mon-Wed-Fri from 4:30 PM to 6:00 PM, and Class 10 on Tue-Thu-Sat from 6:00 PM to 7:30 PM.',
      groundedIn: 'Batch Schedule',
      isMissingInfo: false
    };
  }

  // 3. Demo / trial inquiries
  if (q.includes('demo') || q.includes('trial') || q.includes('free class') || q.includes('admission')) {
    return {
      answer: 'Yes! Demo Learning Centre provides 2 free trial demo classes before enrollment, with no registration fee.',
      groundedIn: 'Admissions & Trial Policy',
      isMissingInfo: false
    };
  }

  // 4. Subjects / Grades inquiries
  if (q.includes('subject') || q.includes('math') || q.includes('science') || q.includes('physics') || q.includes('chemistry')) {
    return {
      answer: 'Prof. Amit Verma teaches Mathematics and Science (Physics and Chemistry) for Class 9 and 10 students.',
      groundedIn: 'Academic Curriculum',
      isMissingInfo: false
    };
  }

  // 5. Location / Address inquiries
  if (q.includes('address') || q.includes('location') || q.includes('where') || q.includes('center') || q.includes('kahan')) {
    return {
      answer: 'Demo Learning Centre is located in Shivaji Nagar, Pune.',
      groundedIn: 'Center Location',
      isMissingInfo: false
    };
  }

  // 6. Unknown / Unlisted inquiries (Strict non-invention rule)
  return {
    answer: 'The teacher needs to confirm that detail. I have logged your question for Prof. Amit Verma, and he will call you back with the exact information.',
    groundedIn: 'Unlisted Info (Strict Non-Hallucination Fallback)',
    isMissingInfo: true
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json(
        { error: 'Question text is required.' },
        { status: 400 }
      );
    }

    const trimmedQuestion = question.trim();

    // Check if Gemini API is available for natural conversational answering
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const systemPrompt = `You are the AI voice receptionist for "Demo Learning Centre" in Shivaji Nagar, Pune, led by Prof. Amit Verma.
You must answer caller inquiries strictly and only using the verified knowledge base below.

VERIFIED KNOWLEDGE BASE:
- Institute: Demo Learning Centre, Shivaji Nagar, Pune
- Tutor: Prof. Amit Verma
- Subjects: Mathematics, Science (Physics and Chemistry) for Class 9 & Class 10 (CBSE & State Board)
- Fees:
  * Class 9 Maths & Science: ₹3,000 per month
  * Class 10 Board Batch: ₹3,500 per month
  * One-on-One Doubt Clearing: ₹1,000 per session
- Timings:
  * Class 9: Monday, Wednesday, Friday from 4:30 PM to 6:00 PM
  * Class 10: Tuesday, Thursday, Saturday from 6:00 PM to 7:30 PM
  * Sunday: Test series from 10:00 AM to 12:00 PM
- Admissions / Trial Policy: 2 free trial demo classes before enrollment. No registration fee.
- Batch Size: Maximum 15 students per batch.

STRICT INSTRUCTIONS:
1. Speak in a warm, polite, natural conversational Indian style (in Hindi or English matching caller's query).
2. Keep the answer brief (1 to 2 sentences max) suitable for spoken audio transmission.
3. NEVER INVENT, ASSUME, OR GUESS unlisted fees, subjects (e.g. French, German, Commerce, Class 11, Class 12), or timings.
4. IF THE REQUESTED INFORMATION IS MISSING OR NOT IN THE PROFILE: Say politely that the teacher needs to confirm it and you have noted a callback request. Example: "The teacher needs to confirm that detail. I have logged your request and Prof. Amit Verma will call you back."`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nCaller Question: "${trimmedQuestion}"\nAnswer:` }] }
          ]
        });

        const generatedText = response.text?.trim();
        if (generatedText) {
          const isMissing =
            generatedText.toLowerCase().includes('teacher needs to confirm') ||
            generatedText.toLowerCase().includes('confirm that detail') ||
            generatedText.toLowerCase().includes('call you back');

          return NextResponse.json({
            success: true,
            answer: generatedText,
            groundedIn: isMissing ? 'Teacher Callback Queue' : 'Demo Learning Centre Profile',
            isMissingInfo: isMissing,
            engine: 'Gemini 2.5 Flash Grounded'
          });
        }
      } catch (geminiError) {
        console.warn('Gemini grounded answer error, using verified deterministic engine:', geminiError);
      }
    }

    // Deterministic grounded response
    const deterministic = generateDeterministicAnswer(trimmedQuestion);
    return NextResponse.json({
      success: true,
      answer: deterministic.answer,
      groundedIn: deterministic.groundedIn,
      isMissingInfo: deterministic.isMissingInfo,
      engine: 'Verified Profile Deterministic Engine'
    });
  } catch (err: any) {
    console.error('Grounded answer error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate grounded answer' },
      { status: 500 }
    );
  }
}
