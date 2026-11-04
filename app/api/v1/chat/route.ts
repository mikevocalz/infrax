import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { GoogleGenAI } from '@google/genai';
import { verifiedSourceRows, evidencePrompt } from '@/lib/infra/grounding.mjs';
export const runtime='nodejs';

export async function POST(request:NextRequest) {
  if (process.env.INFRAX_AI_ENABLED !== 'true' || !process.env.DATABASE_URL || !process.env.GEMINI_API_KEY)
    return NextResponse.json({response:'The evidence-based assistant is not configured. No live availability can be confirmed.',sources:[]},{status:503});
  let question:string;
  try {
    const body=await request.json();
    question=String(body.query??'').trim();
    if (!question || question.length > 400) return NextResponse.json({error:'Question must be 1–400 characters'},{status:400});
  }catch {return NextResponse.json({error:'Invalid request body'},{status:400});}
  try {
    const sql=neon(process.env.DATABASE_URL);
    const rows=await sql.query(
      "SELECT m.headline,m.publication_status,m.reviewed_at,m.expires_at,s.source_url,s.observed_at,s.published_at,s.retrieved_at,l.allowed_usage,l.redistribution_approved,l.reviewed_at AS license_reviewed_at FROM infra.market_signals m JOIN infra.source_records s ON s.id=m.source_record_id JOIN infra.source_licenses l ON l.id=s.license_id WHERE m.publication_status='published' AND m.reviewed_at IS NOT NULL AND l.redistribution_approved=true AND l.allowed_usage IN ('attributed_public','licensed_public') AND (m.expires_at IS NULL OR m.expires_at > now()) ORDER BY m.published_at DESC NULLS LAST LIMIT 8"
    );
    const evidence=verifiedSourceRows(rows);
    if (!evidence.length)
      return NextResponse.json({response:'No reviewed public infrastructure signals are available to support this question.',sources:[]},{headers:{'Cache-Control':'no-store'}});
    const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
    const answer=await ai.models.generateContent({model:process.env.INFRAX_GEMINI_MODEL||'gemini-2.5-flash',
      contents:evidencePrompt(question,evidence),
      config:{temperature:0.1}});
    return NextResponse.json({response:answer.text||'No supported answer returned.',
      sources:evidence.map((item,index)=>({number:index+1,url:item.sourceUrl,observedAt:item.observedAt,publishedAt:item.publishedAt}))},
      {headers:{'Cache-Control':'no-store'}});
  }catch{
    return NextResponse.json({response:'Market intelligence is temporarily unavailable. No availability has been verified.',sources:[]},{status:503});
  }
}
