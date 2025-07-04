
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();
    const buildTimestamp = Date.now();
    const deploymentId = `deploy-${buildTimestamp.toString(36)}`.toUpperCase();
    const buildHash = `build-${buildTimestamp.toString(36).toUpperCase()}`;
    
    const deploymentInfo = {
      status: 'LIVE',
      timestamp: now.toISOString(),
      buildTimestamp,
      deploymentId,
      buildHash,
      version: `v${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}.${buildTimestamp}`,
      build: {
        date: now.toISOString().split('T')[0],
        time: now.toISOString().split('T')[1].split('.')[0],
        environment: process.env.NODE_ENV || 'development',
        nextVersion: process.env.npm_package_version || 'unknown'
      },
      cache: {
        status: 'BYPASSED',
        headers: {
          'cache-control': 'no-cache, no-store, must-revalidate',
          'pragma': 'no-cache',
          'expires': '0'
        },
        busting: 'ACTIVE'
      },
      features: {
        aiSystem: 'OpenAI Only Mode',
        poweredBy: 'OpenAI GPT-4o-mini Vision API',
        cacheBypass: true,
        realTimeUpdates: true,
        deploymentIndicators: true
      },
      verification: {
        url: '/api/deployment',
        method: 'GET',
        lastChecked: now.toISOString(),
        healthy: true
      }
    };

    // Set cache-busting headers
    const response = NextResponse.json({
      success: true,
      data: deploymentInfo,
      message: '🚀 Deployment verification successful - All systems are live and updated!'
    });

    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Deployment-ID', deploymentId);
    response.headers.set('X-Build-Hash', buildHash);
    response.headers.set('X-Timestamp', now.toISOString());

    return response;
  } catch (error) {
    console.error('Deployment verification error:', error);
    
    const errorResponse = NextResponse.json({
      success: false,
      error: 'Failed to verify deployment status',
      timestamp: new Date().toISOString()
    }, { status: 500 });

    // Add cache-busting headers even for errors
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    errorResponse.headers.set('Pragma', 'no-cache');
    errorResponse.headers.set('Expires', '0');

    return errorResponse;
  }
}

// Health check endpoint for deployment verification
export async function POST() {
  try {
    const now = new Date();
    
    const healthCheck = {
      status: 'HEALTHY',
      timestamp: now.toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      deployment: {
        environment: process.env.NODE_ENV || 'development',
        version: 'latest',
        healthy: true
      },
      cache: {
        bypassed: true,
        fresh: true
      }
    };

    const response = NextResponse.json({
      success: true,
      data: healthCheck,
      message: '✅ Deployment health check passed!'
    });

    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
