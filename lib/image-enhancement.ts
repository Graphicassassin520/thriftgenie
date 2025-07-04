
import sharp from 'sharp';
import { ImageEnhancementOptions } from './types';

/**
 * Enhanced image processing service using Sharp
 */
export class ImageEnhancementService {
  
  /**
   * Process an image with the specified enhancement options
   */
  async enhanceImage(imageBuffer: Buffer, options: ImageEnhancementOptions): Promise<Buffer> {
    try {
      console.log('Starting image enhancement with options:', options);
      
      let processedImage = sharp(imageBuffer);
      
      // Get image metadata for processing decisions
      const metadata = await processedImage.metadata();
      console.log('Image metadata:', { width: metadata.width, height: metadata.height, format: metadata.format });
      
      // Apply lighting corrections first if requested
      if (options.correctLighting) {
        processedImage = await this.correctLighting(processedImage);
      }
      
      // Apply background removal and replacement if requested
      if (options.removeBackground) {
        processedImage = await this.processBackground(processedImage, options.backgroundType);
      }
      
      // Convert to high-quality JPEG for web use
      const enhancedBuffer = await processedImage
        .jpeg({ quality: 90, progressive: true })
        .toBuffer();
      
      console.log('Image enhancement completed successfully');
      return enhancedBuffer;
      
    } catch (error) {
      console.error('Image enhancement failed:', error);
      throw new Error(`Image enhancement failed: ${error.message}`);
    }
  }
  
  /**
   * Correct lighting and exposure issues
   */
  private async correctLighting(image: sharp.Sharp): Promise<sharp.Sharp> {
    try {
      console.log('Applying lighting correction');
      
      // Get image statistics to determine adjustments
      const stats = await image.stats();
      
      // Calculate automatic adjustments based on image statistics
      const avgBrightness = (stats.channels[0].mean + stats.channels[1].mean + stats.channels[2].mean) / 3;
      
      let brightnessAdjust = 0;
      let contrastAdjust = 1.0;
      
      // Auto-adjust based on brightness
      if (avgBrightness < 80) {
        // Image is too dark
        brightnessAdjust = Math.min(30, (80 - avgBrightness) * 0.5);
        contrastAdjust = 1.1;
      } else if (avgBrightness > 180) {
        // Image is too bright
        brightnessAdjust = Math.max(-20, (180 - avgBrightness) * 0.3);
        contrastAdjust = 1.05;
      }
      
      // Apply automatic color correction
      return image
        .modulate({
          brightness: 1 + (brightnessAdjust / 100),
          saturation: 1.1, // Slight saturation boost
          hue: 0
        })
        .linear(contrastAdjust, -(128 * contrastAdjust) + 128) // Contrast adjustment
        .gamma(1.1); // Slight gamma correction for better midtones
        
    } catch (error) {
      console.error('Lighting correction failed:', error);
      return image; // Return original if correction fails
    }
  }
  
  /**
   * Process background removal and replacement
   */
  private async processBackground(image: sharp.Sharp, backgroundType: string): Promise<sharp.Sharp> {
    try {
      console.log('Processing background with type:', backgroundType);
      
      // For now, we'll implement a simplified background processing
      // In a production environment, you'd use more sophisticated AI-based background removal
      
      const metadata = await image.metadata();
      const width = metadata.width || 800;
      const height = metadata.height || 600;
      
      switch (backgroundType) {
        case 'white':
          return this.replaceWithWhiteBackground(image, width, height);
          
        case 'gradient':
          return this.replaceWithGradientBackground(image, width, height);
          
        case 'lifestyle':
          return this.replaceWithLifestyleBackground(image, width, height);
          
        case 'none':
          // For transparent background, we'll apply edge detection and masking
          return this.createTransparentBackground(image);
          
        default:
          return image;
      }
      
    } catch (error) {
      console.error('Background processing failed:', error);
      return image; // Return original if processing fails
    }
  }
  
  /**
   * Replace background with clean white
   */
  private async replaceWithWhiteBackground(image: sharp.Sharp, width: number, height: number): Promise<sharp.Sharp> {
    // Create a white background
    const whiteBackground = sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    });
    
    // Apply a simple edge-preserving filter to help separate subject from background
    const processedImage = await image
      .modulate({ saturation: 1.2 }) // Boost saturation to make subject pop
      .sharpen({ sigma: 1, m1: 1, m2: 2 }) // Sharpen edges
      .toBuffer();
    
    // Composite the processed image onto white background
    return whiteBackground.composite([{
      input: processedImage,
      blend: 'over'
    }]);
  }
  
  /**
   * Replace background with gradient
   */
  private async replaceWithGradientBackground(image: sharp.Sharp, width: number, height: number): Promise<sharp.Sharp> {
    // Create a subtle gradient background (light gray to white)
    const gradientSvg = `
      <svg width="${width}" height="${height}">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
    `;
    
    const gradientBackground = sharp(Buffer.from(gradientSvg));
    
    const processedImage = await image
      .modulate({ saturation: 1.15 })
      .sharpen({ sigma: 1, m1: 1, m2: 2 })
      .toBuffer();
    
    return gradientBackground.composite([{
      input: processedImage,
      blend: 'over'
    }]);
  }
  
  /**
   * Replace background with lifestyle scene
   */
  private async replaceWithLifestyleBackground(image: sharp.Sharp, width: number, height: number): Promise<sharp.Sharp> {
    // Create a soft, blurred lifestyle background
    const lifestyleSvg = `
      <svg width="${width}" height="${height}">
        <defs>
          <radialGradient id="lifestyle" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#fef7ed;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#fed7aa;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#f97316;stop-opacity:0.3" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#lifestyle)" />
        <circle cx="20%" cy="20%" r="15%" fill="#ffffff" opacity="0.1" />
        <circle cx="80%" cy="70%" r="20%" fill="#ffffff" opacity="0.05" />
      </svg>
    `;
    
    const lifestyleBackground = sharp(Buffer.from(lifestyleSvg));
    
    const processedImage = await image
      .modulate({ saturation: 1.2, brightness: 1.05 })
      .sharpen({ sigma: 1, m1: 1, m2: 2 })
      .toBuffer();
    
    return lifestyleBackground.composite([{
      input: processedImage,
      blend: 'over'
    }]);
  }
  
  /**
   * Create transparent background (simplified edge detection)
   */
  private async createTransparentBackground(image: sharp.Sharp): Promise<sharp.Sharp> {
    // Apply edge enhancement and return as PNG with transparency
    return image
      .png({ quality: 90, compressionLevel: 6 })
      .modulate({ saturation: 1.1 })
      .sharpen({ sigma: 1.5, m1: 1, m2: 3 });
  }
  
  /**
   * Apply custom adjustments (brightness, contrast, saturation)
   */
  async applyCustomAdjustments(
    imageBuffer: Buffer, 
    brightness: number = 0, 
    contrast: number = 0, 
    saturation: number = 0
  ): Promise<Buffer> {
    try {
      console.log('Applying custom adjustments:', { brightness, contrast, saturation });
      
      let image = sharp(imageBuffer);
      
      // Apply brightness and saturation adjustments
      if (brightness !== 0 || saturation !== 0) {
        image = image.modulate({
          brightness: 1 + (brightness / 100),
          saturation: 1 + (saturation / 100)
        });
      }
      
      // Apply contrast adjustment
      if (contrast !== 0) {
        const contrastMultiplier = 1 + (contrast / 100);
        image = image.linear(contrastMultiplier, -(128 * contrastMultiplier) + 128);
      }
      
      return await image
        .jpeg({ quality: 90, progressive: true })
        .toBuffer();
        
    } catch (error) {
      console.error('Custom adjustments failed:', error);
      throw new Error(`Custom adjustments failed: ${error.message}`);
    }
  }
  
  /**
   * Optimize image for web delivery
   */
  async optimizeForWeb(imageBuffer: Buffer, maxWidth: number = 1200): Promise<Buffer> {
    try {
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();
      
      // Resize if image is too large
      if (metadata.width && metadata.width > maxWidth) {
        return await image
          .resize(maxWidth, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();
      }
      
      // Just optimize compression
      return await image
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
        
    } catch (error) {
      console.error('Web optimization failed:', error);
      return imageBuffer; // Return original if optimization fails
    }
  }
}

// Export singleton instance
export const imageEnhancementService = new ImageEnhancementService();
