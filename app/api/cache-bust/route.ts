
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST() {
  // Generate cache-busting parameters
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  
  const cacheBustInfo = {
    success: true,
    timestamp: new Date().toISOString(),
    cacheBustId: `cb-${timestamp}-${randomId}`,
    parameters: {
      timestamp,
      randomId,
      version: `v2.1.${timestamp}`,
      bypass: true
    },
    instructions: {
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?_cb=${timestamp}&_v=${randomId}&_bypass=true`,
      message: 'Use the URL above to bypass all caches'
    }
  };

  // Ultra-aggressive cache-busting headers
  const headers = new Headers();
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.set('Last-Modified', new Date().toUTCString());
  headers.set('ETag', `"${timestamp}-${randomId}"`);
  headers.set('X-Cache-Bust', 'ACTIVE');
  headers.set('X-Timestamp', timestamp.toString());
  headers.set('Vary', '*');

  return NextResponse.json(cacheBustInfo, { headers });
}

export async function GET() {
  return POST(); // Same response for GET requests
}
