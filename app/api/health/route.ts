
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { checkOpenAIHealth } from '@/lib/openai-ai';

export async function GET() {
  try {
    console.log('🔍 Health check requested...');
    
    const now = new Date();
    const buildTimestamp = Date.now();
    const deploymentId = `deploy-${buildTimestamp.toString(36)}`.toUpperCase();
    
    // Check OpenAI API health
    const openaiHealth = await checkOpenAIHealth();
    
    // Check environment configuration
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    const apiKeyStatus = hasApiKey ? 'configured' : 'missing';
    
    const overallStatus = openaiHealth.status === 'healthy' && hasApiKey ? 'healthy' : 'unhealthy';
    
    console.log(`✅ Health check completed - Status: ${overallStatus}`);
    
    const healthData = {
      status: overallStatus,
      timestamp: now.toISOString(),
      buildTimestamp,
      deploymentId,
      deployment: {
        status: 'LIVE & UPDATED',
        cacheStatus: 'BYPASSED',
        lastCheck: now.toISOString(),
        cacheBusting: 'ACTIVE'
      },
      services: {
        openai: {
          status: openaiHealth.status,
          model: openaiHealth.model,
          message: openaiHealth.message
        },
        configuration: {
          api_key: apiKeyStatus,
          environment: process.env.NODE_ENV || 'unknown'
        },
        cache: {
          status: 'BYPASSED',
          headers: 'ACTIVE',
          busting: 'ENABLED'
        }
      },
      ai_system: 'OpenAI Only',
      powered_by: 'OpenAI GPT-4o-mini Vision API',
      mock_ai_status: 'Disabled - OpenAI Only Mode',
      features: {
        cacheBypass: true,
        deploymentIndicators: true,
        realTimeUpdates: true,
        liveStatus: true
      }
    };

    const response = NextResponse.json(healthData);
    
    // Add comprehensive cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Deployment-ID', deploymentId);
    response.headers.set('X-Health-Check', now.toISOString());
    response.headers.set('X-Cache-Status', 'BYPASSED');
    response.headers.set('X-Status', overallStatus.toUpperCase());
    
    return response;
    
  } catch (error: any) {
    console.error('❌ Health check failed:', error);
    
    const errorResponse = NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message || 'Health check failed',
      ai_system: 'OpenAI Only',
      powered_by: 'OpenAI GPT-4o-mini Vision API',
      mock_ai_status: 'Disabled - OpenAI Only Mode',
      deployment: {
        status: 'ERROR',
        cacheStatus: 'BYPASSED'
      }
    }, { status: 500 });

    // Add cache-busting headers even for errors
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    errorResponse.headers.set('Pragma', 'no-cache');
    errorResponse.headers.set('Expires', '0');
    
    return errorResponse;
  }
}
