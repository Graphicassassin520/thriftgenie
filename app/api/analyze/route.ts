
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage, generatePricing, generatePlatformContent } from '@/lib/openai-ai';
import { checkRateLimit, handleOpenAIError, sanitizeAnalysisInput, logUsage } from '@/lib/openai-utils';
import { prisma } from '@/lib/db';
import { Platform } from '@/lib/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    // Check rate limit (10 requests per minute per IP)
    if (!checkRateLimit(clientIP, 10, 60000)) {
      logUsage('analyze', false);
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again in a minute.',
          ai_system: 'none',
          powered_by: 'Rate Limiter'
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Sanitize and validate input
    const sanitizedInput = sanitizeAnalysisInput(body);
    if (!sanitizedInput) {
      logUsage('analyze', false);
      return NextResponse.json(
        { 
          error: 'Invalid input. Please provide a valid imageUrl and platforms array.',
          ai_system: 'none',
          powered_by: 'Input Validator'
        },
        { status: 400 }
      );
    }
    
    const { imageUrl, platforms } = sanitizedInput;

    console.log('🚀 Starting OpenAI-powered analysis for:', imageUrl);

    // Step 1: Analyze the image using OpenAI Vision API
    console.log('📸 Step 1: Analyzing image with OpenAI Vision...');
    const analysis = await analyzeImage(imageUrl);
    
    // Step 2: Generate pricing using OpenAI
    console.log('💰 Step 2: Generating pricing with OpenAI...');
    const pricing = await generatePricing(analysis);
    
    // Step 3: Generate platform content using OpenAI
    console.log('📝 Step 3: Generating platform content with OpenAI...');
    const platformContent = await generatePlatformContent(analysis, pricing, platforms as Platform[]);
    
    // Step 4: Save to database
    console.log('💾 Step 4: Saving to database...');
    const listing = await prisma.listing.create({
      data: {
        originalImageUrl: imageUrl,
        category: analysis.category,
        condition: analysis.condition,
        material: analysis.material,
        color: analysis.color,
        brand: analysis.brand,
        dimensions: analysis.dimensions,
        suggestedPrice: pricing.suggested_price_usd,
        pricingReason: pricing.pricing_reasoning,
        platformContent: {
          create: platformContent.map(content => ({
            platform: content.platform,
            title: content.title,
            description: content.description,
            hashtags: content.hashtags
          }))
        }
      },
      include: {
        platformContent: true
      }
    });

    const processingTime = Date.now() - startTime;
    logUsage('analyze', true);
    
    console.log('✅ Analysis completed successfully with OpenAI');
    
    return NextResponse.json({
      success: true,
      ai_system: 'OpenAI',
      powered_by: 'OpenAI GPT-4o-mini Vision API',
      data: {
        id: listing.id,
        analysis,
        pricing,
        platformContent,
        createdAt: listing.createdAt,
        processingTimeMs: processingTime
      }
    });

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    logUsage('analyze', false);
    
    console.error('❌ Analysis error:', error);
    
    // Handle specific OpenAI errors with clear messaging
    if (error?.status === 400 && error?.message?.includes('download')) {
      return NextResponse.json(
        { 
          error: 'OpenAI cannot access the image URL. Please ensure the image is publicly accessible or try uploading a different image.',
          ai_system: 'OpenAI',
          powered_by: 'OpenAI GPT-4o-mini Vision API',
          error_type: 'image_access_error',
          processingTimeMs: processingTime
        },
        { status: 400 }
      );
    }
    
    if (error?.status === 401) {
      return NextResponse.json(
        { 
          error: 'OpenAI API authentication failed. Please contact support.',
          ai_system: 'OpenAI',
          powered_by: 'OpenAI GPT-4o-mini Vision API',
          error_type: 'auth_error',
          processingTimeMs: processingTime
        },
        { status: 500 }
      );
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { 
          error: 'OpenAI API rate limit exceeded. Please try again in a few moments.',
          ai_system: 'OpenAI',
          powered_by: 'OpenAI GPT-4o-mini Vision API',
          error_type: 'rate_limit_error',
          processingTimeMs: processingTime
        },
        { status: 429 }
      );
    }
    
    if (error?.message?.includes('OpenAI API key')) {
      return NextResponse.json(
        { 
          error: 'OpenAI service is not properly configured. Please contact support.',
          ai_system: 'OpenAI',
          powered_by: 'OpenAI GPT-4o-mini Vision API',
          error_type: 'config_error',
          processingTimeMs: processingTime
        },
        { status: 500 }
      );
    }
    
    // Handle specific OpenAI errors
    if (error?.name === 'OpenAIError' || error?.status) {
      return handleOpenAIError(error);
    }
    
    // Handle database errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { 
          error: 'Duplicate listing detected',
          ai_system: 'Database',
          powered_by: 'Prisma ORM',
          error_type: 'duplicate_error',
          processingTimeMs: processingTime
        },
        { status: 409 }
      );
    }
    
    // Generic error - no fallback to mock AI
    return NextResponse.json(
      { 
        error: 'Failed to analyze image using OpenAI. Please try again or contact support if the problem persists.',
        ai_system: 'OpenAI',
        powered_by: 'OpenAI GPT-4o-mini Vision API',
        error_type: 'service_error',
        processingTimeMs: processingTime
      },
      { status: 500 }
    );
  }
}
