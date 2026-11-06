import { handleRequest } from '@/lib/server/infrax';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) { return handleRequest(request, 'intake'); }
