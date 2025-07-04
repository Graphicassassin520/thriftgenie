
/**
 * Utility functions for image handling and conversion
 */

/**
 * Convert a File or Blob to Buffer for server-side processing
 */
export async function fileToBuffer(file: File | Blob): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Convert Buffer to base64 data URL
 */
export function bufferToDataUrl(buffer: Buffer, mimeType: string = 'image/jpeg'): string {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Convert base64 data URL to Buffer
 */
export function dataUrlToBuffer(dataUrl: string): Buffer {
  const base64Data = dataUrl.split(',')[1];
  return Buffer.from(base64Data, 'base64');
}

/**
 * Get MIME type from file extension or data URL
 */
export function getMimeType(input: string): string {
  if (input.startsWith('data:')) {
    return input.split(';')[0].split(':')[1];
  }
  
  const extension = input.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
    'heic': 'image/heic',
    'heif': 'image/heif'
  };
  
  return mimeTypes[extension || ''] || 'image/jpeg';
}

/**
 * Validate if the input is a valid image format
 */
export function isValidImageFormat(input: string | File): boolean {
  if (input instanceof File) {
    return input.type.startsWith('image/');
  }
  
  if (typeof input === 'string') {
    if (input.startsWith('data:image/')) {
      return true;
    }
    
    const extension = input.toLowerCase().split('.').pop();
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'heic', 'heif'];
    return validExtensions.includes(extension || '');
  }
  
  return false;
}

/**
 * Generate a unique filename for processed images
 */
export function generateEnhancedFilename(originalName: string, options: any): string {
  const timestamp = Date.now();
  const baseName = originalName.split('.')[0];
  const enhancements = [];
  
  if (options.removeBackground) {
    enhancements.push('bg-removed');
  }
  if (options.correctLighting) {
    enhancements.push('lighting-corrected');
  }
  if (options.backgroundType && options.backgroundType !== 'none') {
    enhancements.push(`bg-${options.backgroundType}`);
  }
  
  const enhancementSuffix = enhancements.length > 0 ? `-${enhancements.join('-')}` : '-enhanced';
  return `${baseName}${enhancementSuffix}-${timestamp}.jpg`;
}

/**
 * Calculate processing time in a human-readable format
 */
export function formatProcessingTime(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  
  const seconds = (milliseconds / 1000).toFixed(1);
  return `${seconds}s`;
}

/**
 * Estimate file size reduction percentage
 */
export function calculateSizeReduction(originalSize: number, newSize: number): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - newSize) / originalSize) * 100);
}
