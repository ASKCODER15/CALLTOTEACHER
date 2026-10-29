import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { question, profile, language = 'hinglish', callerName = 'Parent' } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are "CallSetu AI", an intelligent, polite, and warm call manager for a tuition teacher in India named ${profile.teacherName || 'the teacher'} at "${profile.className || 'Coaching Center'}".

The teacher is currently teaching in an active batch and cannot attend the phone directly.
You are on a phone call with a parent or caller named: "${callerName}".
The caller is asking: "${question}".

Here is the STRICT, VERIFIED CLASS INFORMATION you must use to answer:
- Class Name: ${profile.className}
- Teacher: ${profile.teacherName} (${profile.qualification || ''})
- Location & Landmark: ${profile.location}, ${profile.city || ''}
- Grades / Standards: ${(profile.grades || []).join(', ')}
- Subjects Taught: ${(profile.subjects || []).join(', ')}
- Fee Structure: ${JSON.stringify(profile.feeStructure || [])}
- Batches & Timings: ${JSON.stringify(profile.batches || [])}
- Verified FAQs: ${JSON.stringify(profile.faqs || [])}

INSTRUCTIONS FOR YOUR RESPONSE:
1. Speak in a friendly, conversational tone matching language preference: ${language.toUpperCase()} (if Hinglish, use natural Indian polite conversational Hindi written in English script like "Namaste! Haan bilkul...").
2. Answer the caller's specific question directly and accurately using ONLY the verified facts above.
3. Keep the spoken response concise (2-4 sentences max), as this is a telephone conversation.
4. Mention that the teacher is currently taking class, but you can schedule a trial demo or have the teacher call back after 9:30 PM if needed.
5. Do NOT hallucinate fees or discounts that are not listed.

Return only the conversational spoken response for CallSetu AI:`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text?.trim();
        if (text) {
          return NextResponse.json({ answer: text, source: 'gemini' });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to rule engine:', geminiError);
      }
    }

    // Deterministic Rule-Based Fallback Engine
    const qLower = question.toLowerCase();
    let answer = '';

    if (qLower.includes('fee') || qLower.includes('cost') || qLower.includes('paisa') || qLower.includes('charge') || qLower.includes('rupee')) {
      const fees = profile.feeStructure || [];
      if (fees.length === 0) {
        answer = `Namaste! ${profile.className} ki current fee structure abhi profile me update ho rahi hai. ${profile.teacherName} ji class ke baad callback karke confirm kar denge.`;
      } else {
        // Check if question asks for a specific grade
        const matchedFee = fees.find((f: { gradeCategory: string }) => {
          const cat = f.gradeCategory.toLowerCase();
          return (qLower.includes('10') && (cat.includes('10') || cat.includes('tenth'))) ||
                 (qLower.includes('12') && (cat.includes('12') || cat.includes('twelfth'))) ||
                 (qLower.includes('11') && (cat.includes('11') || cat.includes('eleventh'))) ||
                 (qLower.includes('9') && (cat.includes('9') || cat.includes('ninth'))) ||
                 (qLower.includes('8') && (cat.includes('8') || cat.includes('eighth')));
        });

        if (matchedFee) {
          answer = `Namaste! ${profile.className} me ${matchedFee.gradeCategory} ki monthly fee ${matchedFee.amount} ${matchedFee.billingCycle} hai. Isme study sheets aur regular tests include rehte hain. Kya aap 2 free demo classes book karna chahenge?`;
        } else {
          const feeSummary = fees.map((f: { gradeCategory: string; amount: string; billingCycle: string }) => `${f.gradeCategory}: ${f.amount} ${f.billingCycle}`).join('; ');
          answer = `Namaste! ${profile.className} me verified fee structure is tarah hai: ${feeSummary}. Kya aap student ke liye trial demo attend karwana chahenge?`;
        }
      }
    } else if (qLower.includes('time') || qLower.includes('timing') || qLower.includes('batch') || qLower.includes('schedule') || qLower.includes('kab')) {
      const batches = profile.batches || [];
      if (batches.length === 0) {
        const start = profile.teachingHours?.start || '16:00';
        const end = profile.teachingHours?.end || '21:30';
        answer = `Ji, hamari batches evening me ${start} se ${end} tak chalti hain. Batch details teacher se verify karke aapko SMS par bhej di jayegi.`;
      } else {
        const matchedBatch = batches.find((b: { name: string; grades?: string }) => {
          const str = (b.name + ' ' + (b.grades || '')).toLowerCase();
          return (qLower.includes('10') && (str.includes('10') || str.includes('tenth'))) ||
                 (qLower.includes('12') && (str.includes('12') || str.includes('twelfth'))) ||
                 (qLower.includes('11') && (str.includes('11') || str.includes('eleventh'))) ||
                 (qLower.includes('9') && (str.includes('9') || str.includes('ninth'))) ||
                 (qLower.includes('8') && (str.includes('8') || str.includes('eighth')));
        });

        if (matchedBatch) {
          answer = `Ji, ${matchedBatch.name} (${matchedBatch.grades || ''}) ki timing ${matchedBatch.timing} hai (${matchedBatch.days}). Kya aap is batch me demo slot book karna chahenge?`;
        } else {
          const batchList = batches.map((b: { name: string; timing: string }) => `${b.name} (${b.timing})`).join(', ');
          answer = `Ji, verified batches: ${batchList}. Teaching hours ${profile.teachingHours?.start || '16:00'} se ${profile.teachingHours?.end || '21:30'} tak hain. Aap kis class ke liye timings confirm karna chahte hain?`;
        }
      }
    } else if (qLower.includes('demo') || qLower.includes('trial') || qLower.includes('admission') || qLower.includes('join')) {
      answer = `Ji bilkul! ${profile.className} me hum new students ke liye 2 free demo / trial classes provide karte hain taaki aap teaching quality dekh sakein. Teacher abhi class me hain, main aapka slot reserve kar deta hoon!`;
    } else if (qLower.includes('where') || qLower.includes('location') || qLower.includes('address') || qLower.includes('kaha') || qLower.includes('center')) {
      answer = `${profile.className} ka center ${profile.location}${profile.city ? ', ' + profile.city : ''}${profile.pincode ? ' - ' + profile.pincode : ''} me situated hai. Address details aapko SMS par bhi bhej di jayengi.`;
    } else if (qLower.includes('subject') || qLower.includes('padhate') || qLower.includes('teach') || qLower.includes('math') || qLower.includes('science')) {
      answer = `Hamare yaha ${(profile.subjects || ['Science', 'Mathematics']).join(', ')} complete NCERT aur board pattern ke sath cover kiye jaate hain.`;
    } else {
      // Check FAQs
      const matchedFaq = (profile.faqs || []).find((f: { question: string; answer: string }) =>
        f.question.toLowerCase().split(' ').some((w: string) => w.length > 3 && qLower.includes(w))
      );
      if (matchedFaq) {
        answer = `Ji, ${matchedFaq.answer} ${profile.teacherName} abhi batch me hain, isliye CallSetu AI se assist kar raha hoon.`;
      } else {
        answer = `Namaste! ${profile.teacherName} ji abhi ongoing batch me hain. Maine aapka message note kar liya hai. Class ke baad ${profile.teachingHours?.end || '09:30 PM'} par woh aapse call ya WhatsApp par connect karenge.`;
      }
    }

    return NextResponse.json({ answer, source: 'rule_engine' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
