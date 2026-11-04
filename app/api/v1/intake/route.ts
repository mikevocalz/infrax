import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { parseIntake } from '@/lib/infra/intake-validation.mjs';

export const runtime = 'nodejs';
export async function POST(request:NextRequest) {
  const origin = process.env.INFRAX_PUBLIC_ORIGIN;
  if (origin && request.headers.get('origin') !== origin)
    return NextResponse.json({error:'Request origin is not permitted'},{status:403});
  if (!process.env.DATABASE_URL)
    return NextResponse.json({error:'Submission is unavailable. No request was saved.'},{status:503});
  const contentLength = Number(request.headers.get('content-length') || '0');
  if (!Number.isFinite(contentLength) || contentLength > 12000)
    return NextResponse.json({error:'Request exceeds the permitted size'},{status:413});
  let intake: ReturnType<typeof parseIntake>;
  try { intake = parseIntake(await request.json()); }
  catch(error) { return NextResponse.json({error: error instanceof Error ? error.message : 'Invalid request'},{status:400}); }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const recent = await sql.query("SELECT count(*)::int AS total FROM infra.intake_requests WHERE email=$1 AND created_at>now()-INTERVAL '1 hour'",[intake.email]);
    if (Number(recent[0]?.total ?? 0) >= 3)
      return NextResponse.json({error:'Too many requests from this address; please try later.'},{status:429});
    const result = await sql.query(
      'INSERT INTO infra.intake_requests (request_type,submitter_name,email,organization,payload,consented_at) VALUES ($1,$2,$3,$4,$5::jsonb,now()) RETURNING id',
      [intake.userType,intake.name,intake.email,intake.organization,JSON.stringify(intake.payload)]
    );
    const receiptId = String(result[0]?.id ?? '');
    if (!receiptId) throw new Error('No durable receipt returned');
    return NextResponse.json({receiptId,status:'received'},{status:201,headers:{'Cache-Control':'no-store'}});
  } catch {
    return NextResponse.json({error:'Request could not be saved. Please retry.'},{status:503});
  }
}
