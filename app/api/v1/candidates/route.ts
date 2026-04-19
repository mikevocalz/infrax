import { NextResponse } from 'next/server';
import { CANDIDATES } from '@/lib/mock-data';

export function GET() {
  return NextResponse.json(CANDIDATES);
}
