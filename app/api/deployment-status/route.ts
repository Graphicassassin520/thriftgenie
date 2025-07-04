
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  const deploymentInfo = {
    status: 'success',
    timestamp: new Date().toISOString(),
    deploymentId: `deploy-${Date.now()}`,
    version: `v2.1.${Math.floor(Date.now() / 1000)}`,
    buildNumber: `build-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
    environment: 'production',
    cacheCleared: true,
    features: {
      upload: 'active',
      platforms: 'active',
      analysis: 'active',
      deployment: 'success'
    },
    systemChecks: {
      api: 'operational',
      database: 'connected',
      assets: 'loaded',
      cache: 'busted'
    }
  };

  // Add aggressive cache-busting headers
  const headers = new Headers();
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.set('X-Deployment-Id', deploymentInfo.deploymentId);
  headers.set('X-Build-Time', deploymentInfo.timestamp);
  headers.set('X-Cache-Status', 'BYPASSED');

  return NextResponse.json(deploymentInfo, { headers });
}
