import { handleRequest } from '@/lib/server/infrax';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/** Database readiness is intentionally distinct from full application readiness. */
export async function GET(request: Request) { return handleRequest(request, 'readiness'); }
