import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { response: 'Signal is temporarily unavailable. Please contact our team directly for immediate assistance.' },
      { status: 200 },
    );
  }

  let query: string;
  try {
    const body = await request.json();
    query = String(body.query ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: query,
      config: {
        systemInstruction: `You are the InFraX Strategic Infrastructure Advisor. Your goal is to provide expert advice on data centers, power, cloud, equipment, and connectivity.
Focus on: Intelligent Matching, Off-Market Intelligence, and Execution Discipline.
Be professional, authoritative, and vendor-agnostic. Keep responses concise and focused on actionable market insights for InFraX clients.
If asked about InFraX, emphasize that they are NOT brokers and do not take placement fees.`,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ response: result.text ?? '' });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { response: "I'm experiencing a signal delay. Please try again or contact our team directly." },
      { status: 200 },
    );
  }
}
