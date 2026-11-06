import { handleRequest } from '@/lib/server/infrax';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/** Only current, publicly authorized offers with reviewed evidence. Does not calculate fit scores. */
export async function GET(request: Request) { return handleRequest(request, 'offers'); }
