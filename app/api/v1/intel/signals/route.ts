import { NextResponse } from 'next/server';
import type { MarketSignal } from '@/types';

const signals: MarketSignal[] = [
  {
    id: 'sig-001',
    category: 'GRID',
    signal: 'PJM Interconnect queue delays extending to 36 months.',
    impact:
      'AI-scale projects in the PJM footprint face extended interconnect timelines, requiring immediate off-market sourcing strategies.',
    timestamp: 'Live',
    severity: 'High',
  },
  {
    id: 'sig-002',
    category: 'POLICY',
    signal: 'New EU Data Sovereignty laws impacting cross-border AI training.',
    impact:
      'Operators deploying across EU jurisdictions must now validate data residency compliance before infrastructure commitments.',
    timestamp: 'Live',
    severity: 'Medium',
  },
  {
    id: 'sig-003',
    category: 'CAPACITY',
    signal: 'Off-market 20MW capacity identified in secondary Ohio market.',
    impact:
      'Pre-qualified colocation capacity available outside standard procurement channels — window is 60–90 days.',
    timestamp: 'Live',
    severity: 'Low',
  },
];

export function GET() {
  return NextResponse.json(signals);
}
