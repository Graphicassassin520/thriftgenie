
export interface AnalysisResult {
  category: string;
  condition: string;
  material?: string;
  color?: string;
  brand?: string;
  dimensions?: string;
  enhanced_image_url?: string;
}

export interface PlatformContent {
  platform: string;
  title: string;
  description: string;
  hashtags?: string;
}

export interface PricingResult {
  suggested_price_usd: number;
  pricing_reasoning: string;
}

export interface ListingData {
  id: string;
  originalImageUrl: string;
  enhancedImageUrl?: string;
  analysis: AnalysisResult;
  pricing: PricingResult;
  platformContent: PlatformContent[];
  createdAt: Date;
}

export type Platform = 
  | 'facebook'
  | 'instagram' 
  | 'tiktok'
  | 'poshmark'
  | 'mercari'
  | 'craigslist'
  | 'etsy'
  | 'website'
  | 'x';

export interface ImageEnhancementOptions {
  removeBackground: boolean;
  correctLighting: boolean;
  backgroundType: 'white' | 'gradient' | 'lifestyle' | 'none';
}
