import { handleRequest } from '@/lib/server/infrax';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/** Compatibility path; contract v2 is a redacted facility-discovery envelope, not mock assets. */
export async function GET(request: Request) { return handleRequest(request, 'facilities'); }
