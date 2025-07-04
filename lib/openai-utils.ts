
import { NextResponse } from 'next/server';

/**
 * Rate limiting store (in production, use Redis or similar)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple rate limiting implementation
 */
export function checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = identifier;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
}

/**
 * Handle OpenAI API errors with appropriate responses
 */
export function handleOpenAIError(error: any): NextResponse {
  console.error('OpenAI API Error:', error);
  
  if (error?.status === 429) {
    return NextResponse.json(
      { 
        error: 'Rate limit exceeded. Please try again later.',
        type: 'rate_limit'
      },
      { status: 429 }
    );
  }
  
  if (error?.status === 401) {
    return NextResponse.json(
      { 
        error: 'API authentication failed.',
        type: 'auth_error'
      },
      { status: 500 }
    );
  }
  
  if (error?.status === 400) {
    return NextResponse.json(
      { 
        error: 'Invalid request to AI service.',
        type: 'bad_request'
      },
      { status: 400 }
    );
  }
  
  // Generic error
  return NextResponse.json(
    { 
      error: 'AI service temporarily unavailable. Please try again.',
      type: 'service_error'
    },
    { status: 503 }
  );
}

/**
 * Validate image URL format
 */
export function validateImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const validProtocols = ['http:', 'https:', 'data:'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'];
    
    if (!validProtocols.includes(parsedUrl.protocol)) {
      return false;
    }
    
    // For data URLs, check if it's an image
    if (parsedUrl.protocol === 'data:') {
      return url.startsWith('data:image/');
    }
    
    // For HTTP URLs, be more flexible
    const pathname = parsedUrl.pathname.toLowerCase();
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Allow known image hosting services
    const imageHosts = ['images.unsplash.com', 'unsplash.com', 'imgur.com', 'i.imgur.com', 'cdn.', 'images.'];
    if (imageHosts.some(host => hostname.includes(host))) {
      return true;
    }
    
    // Check for image extensions
    if (validExtensions.some(ext => pathname.includes(ext))) {
      return true;
    }
    
    // Allow if URL contains image-related query parameters
    if (url.includes('format=') || url.includes('auto=format') || url.includes('w=') || url.includes('h=')) {
      return true;
    }
    
    return false;
    
  } catch {
    return false;
  }
}

/**
 * Sanitize and validate analysis input
 */
export function sanitizeAnalysisInput(input: any): { imageUrl: string; platforms: string[] } | null {
  if (!input || typeof input !== 'object') {
    return null;
  }
  
  const { imageUrl, platforms } = input;
  
  if (!imageUrl || typeof imageUrl !== 'string' || !validateImageUrl(imageUrl)) {
    return null;
  }
  
  if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
    return null;
  }
  
  const validPlatforms = ['facebook', 'instagram', 'tiktok', 'poshmark', 'mercari', 'craigslist', 'etsy', 'website', 'x'];
  const sanitizedPlatforms = platforms.filter(p => typeof p === 'string' && validPlatforms.includes(p));
  
  if (sanitizedPlatforms.length === 0) {
    return null;
  }
  
  return {
    imageUrl: imageUrl.trim(),
    platforms: sanitizedPlatforms
  };
}

/**
 * Log usage for monitoring
 */
export function logUsage(operation: string, success: boolean, tokens?: number): void {
  const timestamp = new Date().toISOString();
  console.log(`[USAGE] ${timestamp} - ${operation}: ${success ? 'SUCCESS' : 'FAILED'}${tokens ? ` (${tokens} tokens)` : ''}`);
}

/**
 * Clean up rate limit store periodically
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
