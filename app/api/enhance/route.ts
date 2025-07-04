
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { enhanceImage } from '@/lib/openai-ai';
import { checkRateLimit, handleOpenAIError, validateImageUrl, logUsage } from '@/lib/openai-utils';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    // Check rate limit (5 requests per minute per IP for enhancement)
    if (!checkRateLimit(`enhance_${clientIP}`, 5, 60000)) {
      logUsage('enhance', false);
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
    const { imageUrl, options, customAdjustments } = body;

    if (!imageUrl || !options || typeof imageUrl !== 'string') {
      logUsage('enhance', false);
      return NextResponse.json(
        { 
          error: 'Missing required fields: imageUrl and options',
          ai_system: 'none',
          powered_by: 'Input Validator'
        },
        { status: 400 }
      );
    }
    
    console.log('🚀 Starting image enhancement:', { 
      imageUrl: imageUrl.substring(0, 50) + '...', 
      options, 
      customAdjustments 
    });
    
    if (!validateImageUrl(imageUrl)) {
      logUsage('enhance', false);
      return NextResponse.json(
        { 
          error: 'Invalid image URL format',
          ai_system: 'none',
          powered_by: 'URL Validator'
        },
        { status: 400 }
      );
    }

    console.log('🖼️ Enhancing image with real image processing...');
    
    // Enhance the image using our image processing service (no AI fallback)
    let enhancedImageUrl = await enhanceImage(imageUrl, options);
    
    // Apply custom adjustments if provided
    if (customAdjustments && (customAdjustments.brightness !== 0 || customAdjustments.contrast !== 0 || customAdjustments.saturation !== 0)) {
      console.log('🎨 Applying custom adjustments:', customAdjustments);
      
      try {
        const { imageEnhancementService } = await import('@/lib/image-enhancement');
        const { dataUrlToBuffer, bufferToDataUrl } = await import('@/lib/image-utils');
        
        // Convert enhanced image back to buffer for further processing
        const enhancedBuffer = dataUrlToBuffer(enhancedImageUrl);
        
        // Apply custom adjustments
        const finalBuffer = await imageEnhancementService.applyCustomAdjustments(
          enhancedBuffer,
          customAdjustments.brightness || 0,
          customAdjustments.contrast || 0,
          customAdjustments.saturation || 0
        );
        
        // Convert back to data URL
        enhancedImageUrl = bufferToDataUrl(finalBuffer, 'image/jpeg');
        
      } catch (adjustmentError) {
        console.error('❌ Custom adjustments failed:', adjustmentError);
        throw new Error(`Custom adjustments failed: ${adjustmentError.message}`);
      }
    }
    
    const processingTime = Date.now() - startTime;
    logUsage('enhance', true);

    console.log('✅ Image enhancement completed successfully');

    return NextResponse.json({
      success: true,
      ai_system: 'Image Processing',
      powered_by: 'Sharp Image Processing Library',
      data: {
        originalImageUrl: imageUrl,
        enhancedImageUrl,
        options,
        customAdjustments,
        processingTimeMs: processingTime
      }
    });

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    logUsage('enhance', false);
    
    console.error('❌ Enhancement error:', error);
    
    // Handle specific OpenAI errors
    if (error?.name === 'OpenAIError' || error?.status) {
      return handleOpenAIError(error);
    }
    
    // No fallback - return clear error message
    return NextResponse.json(
      { 
        error: `Image enhancement failed: ${error.message || 'Unknown error'}. Please try again or contact support if the problem persists.`,
        ai_system: 'Image Processing',
        powered_by: 'Sharp Image Processing Library',
        error_type: 'processing_error',
        processingTimeMs: processingTime
      },
      { status: 500 }
    );
  }
}
