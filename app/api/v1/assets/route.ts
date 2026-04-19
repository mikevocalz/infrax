import { NextResponse } from 'next/server';
import type { Asset } from '@/types';

const assets: Asset[] = [
  {
    id: 'site-001',
    name: 'Northern Virginia Hub',
    type: 'Data Center',
    provider: 'Equinix',
    capacity_mw: 15,
    status: 'Active',
    location: 'Ashburn, VA',
  },
  {
    id: 'site-002',
    name: 'West Coast AI Cluster',
    type: 'Cloud',
    provider: 'AWS',
    capacity_mw: 5,
    status: 'Provisioning',
    location: 'us-west-2',
  },
  {
    id: 'site-003',
    name: 'European Edge Node',
    type: 'Edge',
    provider: 'Digital Realty',
    capacity_mw: 2,
    status: 'Active',
    location: 'Frankfurt, DE',
  },
];

export function GET() {
  return NextResponse.json(assets);
}
