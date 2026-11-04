import { NextResponse } from 'next/server';
/** No demo fixtures in public production APIs. */
export function GET() {
 return NextResponse.json({status:'not_connected',data:[],error:'Verified asset data is unavailable'},{
  status:503, headers:{'Cache-Control':'no-store'}
 });
}
