
import OpenAI from 'openai';
import { AnalysisResult, PricingResult, PlatformContent, Platform } from './types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze an image using OpenAI GPT-4o-mini vision capabilities with improved prompt engineering
 * NO FALLBACK TO MOCK AI - OpenAI only
 */
export async function analyzeImage(imageUrl: string): Promise<AnalysisResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  console.log('🤖 Starting OpenAI image analysis for:', imageUrl);
  
  try {
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert product identification specialist. Analyze this image step-by-step and provide your reasoning.

STEP 1: DESCRIBE WHAT YOU SEE
Look at the image carefully and describe:
- What is the main object in the image?
- What is its approximate size compared to common reference objects?
- What shape and form does it have?
- What materials and colors are visible?
- What is the setting/background?
- Are there any visible brands, text, or logos?

STEP 2: SIZE ASSESSMENT
Determine the actual size category:
- TINY: Fits in palm (lighter, jewelry, coins, small electronics)
- SMALL: Fits in one hand (phone, wallet, remote, small tools)
- MEDIUM: Requires two hands (laptop, book, small appliance)
- LARGE: Requires lifting (chair, monitor, large appliance)
- EXTRA LARGE: Furniture (table, bookshelf, sofa)

STEP 3: CATEGORY IDENTIFICATION
Based on your observations, what category does this item belong to?

Common categories:
- Footwear: Sneakers, Shoes, Boots, Sandals
- Electronics: Smartphone, Laptop, Tablet, Camera, Headphones
- Furniture: Chair, Table, Bookshelf, Desk, Sofa
- Accessories: Lighter, Watch, Wallet, Sunglasses, Jewelry
- Clothing: T-Shirt, Jeans, Jacket, Dress, Hat
- Kitchen: Coffee Maker, Blender, Pot, Pan, Utensils
- Sports: Bicycle, Tennis Racket, Dumbbells, Yoga Mat

STEP 4: VERIFICATION
Double-check your identification:
- Does the size category match the item? (A sneaker should be SMALL, not LARGE)
- Does the setting make sense? (A shoe on a surface vs furniture in a room)
- Are you confusing similar-looking items?

Provide your analysis in this format:
{
  "visual_description": "What you actually see in the image",
  "size_category": "TINY|SMALL|MEDIUM|LARGE|EXTRA_LARGE",
  "identified_category": "Specific product category",
  "confidence": "High|Medium|Low",
  "reasoning": "Why you chose this category"
}`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 600,
      temperature: 0.1,
    });

    const analysisContent = analysisResponse.choices[0]?.message?.content;
    if (!analysisContent) {
      throw new Error('No analysis content received from OpenAI Vision API');
    }

    let preliminaryAnalysis;
    try {
      // Strip markdown code blocks if present
      let cleanAnalysisContent = analysisContent.trim();
      if (cleanAnalysisContent.startsWith('```json')) {
        cleanAnalysisContent = cleanAnalysisContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanAnalysisContent.startsWith('```')) {
        cleanAnalysisContent = cleanAnalysisContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      preliminaryAnalysis = JSON.parse(cleanAnalysisContent);
    } catch (parseError) {
      console.error('Failed to parse preliminary analysis:', analysisContent);
      throw new Error('Invalid JSON response from OpenAI Vision API - unable to parse preliminary analysis');
    }

    // Now get the final structured response based on the analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Based on your previous analysis, provide the final product identification in the exact JSON format required.

Your analysis showed:
- Visual Description: ${preliminaryAnalysis.visual_description}
- Size Category: ${preliminaryAnalysis.size_category}
- Identified Category: ${preliminaryAnalysis.identified_category}
- Confidence: ${preliminaryAnalysis.confidence}
- Reasoning: ${preliminaryAnalysis.reasoning}

Now provide the final response in this EXACT format:
{
  "category": "Specific product category (e.g., Sneakers, Lighter, Office Chair, Smartphone)",
  "condition": "Excellent|Very Good|Good|Fair|Poor",
  "material": "Primary material observed",
  "color": "Primary color",
  "brand": "Brand name if clearly visible, otherwise null",
  "dimensions": "Realistic size for this specific item type"
}

CRITICAL VALIDATION:
- If you identified a TINY item (like lighter), dimensions should be small (e.g., "3\" x 1\" x 0.5\"")
- If you identified a SMALL item (like sneakers), dimensions should be moderate (e.g., "12\" x 4\" x 5\"")
- If you identified a LARGE item (like chair), dimensions should be substantial (e.g., "24\" x 36\" x 24\"")
- Make sure the category matches the size you observed

Respond ONLY with the final JSON.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      temperature: 0.05,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI Vision API');
    }

    // Parse the JSON response with robust extraction
    let analysis: AnalysisResult;
    try {
      analysis = extractJSONFromResponse(content);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', content);
      console.error('❌ Parse error details:', parseError);
      
      // Try to provide more helpful error information
      const truncatedContent = content.length > 500 ? content.substring(0, 500) + '...' : content;
      throw new Error(`Invalid JSON response from OpenAI Vision API. Response preview: "${truncatedContent}"`);
    }
    
    // Validate the response has required fields
    if (!analysis.category || !analysis.condition) {
      throw new Error('Invalid analysis response from OpenAI Vision API - missing required fields (category, condition)');
    }

    // Additional validation to catch obvious size mismatches
    const sizeValidation = validateSizeConsistency(analysis);
    if (!sizeValidation.isValid) {
      console.warn('⚠️ Size validation warning:', sizeValidation.reason);
      console.warn('Analysis details:', analysis);
    }

    console.log('✅ OpenAI Vision analysis successful:', analysis);
    return analysis;

  } catch (error: any) {
    console.error('❌ OpenAI Vision API failed:', error);
    
    // Provide specific error messages based on error type
    if (error?.status === 400) {
      if (error?.message?.includes('download')) {
        throw new Error('OpenAI cannot access the image URL. Please ensure the image is publicly accessible or try uploading a different image.');
      }
      throw new Error(`OpenAI Vision API error: ${error.message || 'Invalid request'}`);
    }
    
    if (error?.status === 401) {
      throw new Error('OpenAI API authentication failed. Please check your API key configuration.');
    }
    
    if (error?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again in a few moments.');
    }
    
    if (error?.status === 500) {
      throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
    }
    
    // Re-throw the error to be handled by the API endpoint
    throw error;
  }
}

/**
 * Extract JSON from OpenAI response with multiple fallback strategies
 */
function extractJSONFromResponse(content: string): AnalysisResult {
  let cleanContent = content.trim();
  
  // Strategy 1: Remove markdown code blocks
  if (cleanContent.includes('```')) {
    // Handle various code block formats
    cleanContent = cleanContent
      .replace(/^```json\s*/gm, '')
      .replace(/^```\s*/gm, '')
      .replace(/\s*```\s*$/gm, '')
      .replace(/```/g, '');
  }
  
  // Strategy 2: Extract JSON from text that may have additional content
  const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanContent = jsonMatch[0];
  }
  
  // Strategy 3: Clean up common formatting issues
  cleanContent = cleanContent
    .trim()
    .replace(/\n\s*\n/g, '\n') // Remove extra newlines
    .replace(/,\s*}/g, '}')    // Remove trailing commas
    .replace(/,\s*]/g, ']')    // Remove trailing commas in arrays
    .replace(/(\d+)" x (\d+)" x (\d+\.\d+)""/g, '$1" x $2" x $3"') // Fix double quotes in dimensions
    .replace(/(\d+)" x (\d+)"/g, '$1\\" x $2\\"') // Escape quotes in dimensions
    .replace(/: "([^"]*)"([^",}\]]*)"([^",}\]]*)"([^",}\]]*)"([^",}\]]*)"([^",}\]]*)"([^",}\]]*)"([^",}\]]*)/g, ': "$1$2$3$4$5$6$7$8"') // Fix multiple quotes in values
    .replace(/: "([^"]*)"([^",}\]]+)"/g, ': "$1$2"'); // Fix basic quote issues
  
  // Strategy 4: Try parsing
  try {
    const parsed = JSON.parse(cleanContent);
    
    // Validate it has the expected structure
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as AnalysisResult;
    }
    throw new Error('Parsed result is not an object');
  } catch (directParseError) {
    // Strategy 5: Try to find and extract a valid JSON object manually
    const lines = cleanContent.split('\n');
    let jsonLines: string[] = [];
    let inJson = false;
    let braceCount = 0;
    
    for (const line of lines) {
      if (line.trim().startsWith('{')) {
        inJson = true;
        braceCount = 0;
      }
      
      if (inJson) {
        jsonLines.push(line);
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;
        
        if (braceCount === 0 && line.includes('}')) {
          break;
        }
      }
    }
    
    if (jsonLines.length > 0) {
      try {
        const reconstructedJson = jsonLines.join('\n').trim();
        return JSON.parse(reconstructedJson) as AnalysisResult;
      } catch (reconstructError) {
        console.error('❌ Reconstruction failed:', reconstructError);
      }
    }
    
    // If all strategies fail, throw with detailed info
    throw new Error(`All JSON parsing strategies failed. Original error: ${directParseError}`);
  }
}

/**
 * Validate that the identified category matches reasonable size expectations
 */
function validateSizeConsistency(analysis: AnalysisResult): { isValid: boolean; reason?: string } {
  const category = analysis.category.toLowerCase();
  const dimensions = analysis.dimensions?.toLowerCase() || '';
  
  // Define size categories for common items
  const tinyItems = ['lighter', 'torch lighter', 'zippo', 'keychain', 'ring', 'coin', 'usb drive'];
  const smallItems = ['smartphone', 'phone', 'wallet', 'watch', 'sunglasses', 'pen', 'tool'];
  const largeItems = ['chair', 'table', 'desk', 'bookshelf', 'cabinet', 'dresser', 'sofa', 'bed'];
  
  // Check for obvious mismatches
  for (const tinyItem of tinyItems) {
    if (category.includes(tinyItem)) {
      // Tiny items should have small dimensions
      if (dimensions.includes('inch') && (
          dimensions.includes('24') || dimensions.includes('30') || 
          dimensions.includes('36') || dimensions.includes('48') ||
          dimensions.includes('60') || dimensions.includes('72')
        )) {
        return { 
          isValid: false, 
          reason: `${analysis.category} identified as tiny item but has large dimensions: ${analysis.dimensions}` 
        };
      }
    }
  }
  
  for (const largeItem of largeItems) {
    if (category.includes(largeItem)) {
      // Large items should have substantial dimensions
      if (dimensions.includes('inch') && (
          dimensions.includes('1"') || dimensions.includes('2"') || 
          dimensions.includes('3"') || dimensions.includes('4"') ||
          dimensions.includes('5"') || dimensions.includes('6"')
        )) {
        return { 
          isValid: false, 
          reason: `${analysis.category} identified as large item but has tiny dimensions: ${analysis.dimensions}` 
        };
      }
    }
  }
  
  return { isValid: true };
}

/**
 * Generate pricing suggestions using OpenAI with improved market analysis
 * NO FALLBACK TO MOCK AI - OpenAI only
 */
export async function generatePricing(analysis: AnalysisResult): Promise<PricingResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  console.log('🤖 Starting OpenAI pricing analysis for:', analysis.category);
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `You are a second-hand marketplace pricing expert. Generate a realistic pricing suggestion for this item based on current market conditions and category-specific factors.

ITEM ANALYSIS:
- Category: ${analysis.category}
- Condition: ${analysis.condition}
- Material: ${analysis.material || 'Not specified'}
- Color: ${analysis.color || 'Not specified'}
- Brand: ${analysis.brand || 'Unbranded'}
- Dimensions: ${analysis.dimensions || 'Standard size'}

PRICING METHODOLOGY:

1. CATEGORY BASE PRICES (typical retail ranges):
   TINY ITEMS: Lighters ($5-25), Jewelry ($10-500), USB drives ($10-50)
   SMALL ITEMS: Phones ($100-1200), Wallets ($20-200), Watches ($50-500)
   MEDIUM ITEMS: Laptops ($300-2000), Books ($10-100), Small appliances ($30-300)
   LARGE ITEMS: Chairs ($100-800), Monitors ($150-600), Kitchen appliances ($100-500)
   EXTRA LARGE: Tables ($200-1500), Bookshelves ($100-800), Sofas ($300-2000)

2. CONDITION MULTIPLIERS:
   - Excellent: 75-85% of retail (like new, minimal use)
   - Very Good: 60-70% of retail (light wear, fully functional)
   - Good: 40-55% of retail (normal wear, good functionality)
   - Fair: 25-35% of retail (noticeable wear, some issues)
   - Poor: 10-20% of retail (significant wear, limited functionality)

3. BRAND ADJUSTMENTS:
   - Premium brands (Apple, Herman Miller, etc.): +20-40%
   - Popular brands (Nike, IKEA, etc.): +10-20%
   - Generic/Unbranded: Base price
   - Unknown brands: -10-20%

4. MARKET FACTORS:
   - High demand items (electronics, designer items): +10-20%
   - Seasonal items: Adjust based on timing
   - Oversaturated categories: -10-20%
   - Unique/vintage items: +20-50%

5. SIZE-SPECIFIC CONSIDERATIONS:
   - Tiny items: Focus on functionality and brand
   - Small electronics: Consider age and model
   - Furniture: Factor in moving/pickup difficulty
   - Clothing: Consider style trends and seasonality

VALIDATION RULES:
- Minimum price: $5 for any functional item
- Maximum depreciation: 90% off retail (except rare cases)
- Lighters should typically be $5-15 (not $50+)
- Furniture should typically be $50+ (not $5-10)
- Electronics depreciate faster than furniture
- Consider local market conditions

Provide your response in this exact JSON format:
{
  "suggested_price_usd": number,
  "pricing_reasoning": "Detailed explanation including: base retail estimate, condition impact, brand factor, market considerations, and final price justification"
}

Be specific about your calculations and market research. Respond ONLY with valid JSON.`
        }
      ],
      max_tokens: 500,
      temperature: 0.15, // Low temperature for consistent pricing logic
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI pricing API');
    }

    let pricing: PricingResult;
    try {
      // Strip markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      pricing = JSON.parse(cleanContent) as PricingResult;
    } catch (parseError) {
      console.error('Failed to parse OpenAI pricing response:', content);
      throw new Error('Invalid JSON response from OpenAI pricing API');
    }
    
    // Validate the response
    if (typeof pricing.suggested_price_usd !== 'number' || !pricing.pricing_reasoning) {
      throw new Error('Invalid pricing response from OpenAI - missing required fields (suggested_price_usd, pricing_reasoning)');
    }

    // Ensure minimum price and reasonable maximums
    if (pricing.suggested_price_usd < 5) {
      pricing.suggested_price_usd = 5;
      pricing.pricing_reasoning += ' (Minimum price of $5 applied)';
    }
    
    // Sanity check for obviously wrong prices based on category
    const categoryValidation = validatePriceReasonableness(analysis.category, pricing.suggested_price_usd);
    if (!categoryValidation.isValid) {
      console.warn('⚠️ Price validation warning:', categoryValidation.reason);
      // Adjust price if it's clearly unreasonable
      if (categoryValidation.suggestedPrice) {
        pricing.suggested_price_usd = categoryValidation.suggestedPrice;
        pricing.pricing_reasoning += ` (Price adjusted from original suggestion due to category constraints: ${categoryValidation.reason})`;
      }
    }

    console.log('✅ OpenAI pricing successful:', pricing);
    return pricing;

  } catch (error: any) {
    console.error('❌ OpenAI pricing API failed:', error);
    
    // Provide specific error messages based on error type
    if (error?.status === 401) {
      throw new Error('OpenAI API authentication failed. Please check your API key configuration.');
    }
    
    if (error?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again in a few moments.');
    }
    
    if (error?.status === 500) {
      throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
    }
    
    // Re-throw the error to be handled by the API endpoint
    throw error;
  }
}

/**
 * Validate that pricing is reasonable for the given category
 */
function validatePriceReasonableness(category: string, price: number): { 
  isValid: boolean; 
  reason?: string; 
  suggestedPrice?: number 
} {
  const categoryLower = category.toLowerCase();
  
  // Define reasonable price ranges for different categories
  const priceRanges = {
    // Tiny items
    lighter: { min: 5, max: 25, typical: 10 },
    jewelry: { min: 5, max: 200, typical: 30 },
    keychain: { min: 5, max: 20, typical: 8 },
    
    // Small items  
    smartphone: { min: 50, max: 800, typical: 200 },
    wallet: { min: 10, max: 100, typical: 25 },
    watch: { min: 15, max: 300, typical: 50 },
    
    // Medium items
    laptop: { min: 100, max: 1500, typical: 400 },
    book: { min: 5, max: 50, typical: 15 },
    
    // Large items
    chair: { min: 30, max: 500, typical: 100 },
    monitor: { min: 50, max: 400, typical: 150 },
    
    // Extra large items
    table: { min: 50, max: 800, typical: 200 },
    bookshelf: { min: 40, max: 400, typical: 120 },
    sofa: { min: 100, max: 1000, typical: 300 }
  };
  
  // Find matching category
  for (const [key, range] of Object.entries(priceRanges)) {
    if (categoryLower.includes(key)) {
      if (price < range.min) {
        return {
          isValid: false,
          reason: `Price $${price} too low for ${category} (minimum: $${range.min})`,
          suggestedPrice: range.min
        };
      }
      if (price > range.max) {
        return {
          isValid: false,
          reason: `Price $${price} too high for ${category} (maximum: $${range.max})`,
          suggestedPrice: range.typical
        };
      }
      return { isValid: true };
    }
  }
  
  // General validation for unknown categories
  if (price > 2000) {
    return {
      isValid: false,
      reason: `Price $${price} unreasonably high for second-hand item`,
      suggestedPrice: 200
    };
  }
  
  return { isValid: true };
}

/**
 * Generate platform-specific content using OpenAI
 * NO FALLBACK TO MOCK AI - OpenAI only
 */
export async function generatePlatformContent(
  analysis: AnalysisResult, 
  pricing: PricingResult,
  platforms: Platform[]
): Promise<PlatformContent[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  const results: PlatformContent[] = [];
  
  console.log(`🤖 Generating platform content with OpenAI for ${platforms.length} platforms`);
  
  // Process platforms in batches to avoid rate limits
  for (const platform of platforms) {
    try {
      console.log(`🤖 Generating ${platform} content with OpenAI`);
      
      const platformSpecs = getPlatformSpecs(platform);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Create an engaging ${platform} listing for this second-hand item:

Item Details:
- Category: ${analysis.category}
- Condition: ${analysis.condition}
- Material: ${analysis.material || 'Quality materials'}
- Color: ${analysis.color || 'Attractive color'}
- Brand: ${analysis.brand || 'Unbranded'}
- Dimensions: ${analysis.dimensions || 'Standard size'}
- Suggested Price: $${pricing.suggested_price_usd}

Platform Requirements:
- Platform: ${platform}
- Title max length: ${platformSpecs.titleLimit} characters
- Description max length: ${platformSpecs.descriptionLimit} characters
- Hashtags: ${platformSpecs.hashtagsRequired ? 'Required' : 'Optional'}
- Tone: ${platformSpecs.tone}

Generate content in this JSON format:
{
  "platform": "${platform}",
  "title": "compelling title under ${platformSpecs.titleLimit} chars",
  "description": "engaging description under ${platformSpecs.descriptionLimit} chars",
  "hashtags": "${platformSpecs.hashtagsRequired ? 'relevant hashtags separated by spaces' : 'null if not needed'}"
}

Guidelines:
- Use platform-appropriate language and emojis
- Highlight key selling points (condition, brand, price value)
- Include relevant keywords for discoverability
- Be honest about condition while staying positive
- Follow platform best practices for engagement
- For Instagram/TikTok: Use trendy language and emojis
- For Craigslist/Facebook: Be straightforward and professional
- For Poshmark/Mercari: Focus on fashion/lifestyle appeal
- For Etsy: Emphasize uniqueness and sustainability

Respond ONLY with valid JSON, no additional text.`
          }
        ],
        max_tokens: 600,
        temperature: 0.3, // Higher creativity for content generation
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error(`No content received from OpenAI for ${platform}`);
      }

      let platformContent: PlatformContent;
      try {
        // Strip markdown code blocks if present
        let cleanContent = content.trim();
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        platformContent = JSON.parse(cleanContent) as PlatformContent;
      } catch (parseError) {
        console.error(`Failed to parse OpenAI content response for ${platform}:`, content);
        throw new Error(`Invalid JSON response from OpenAI for ${platform} content generation`);
      }
      
      // Validate and clean up the response
      if (!platformContent.title || !platformContent.description) {
        throw new Error(`Invalid content response from OpenAI for ${platform} - missing required fields`);
      }

      // Ensure length limits
      platformContent.title = platformContent.title.substring(0, platformSpecs.titleLimit);
      platformContent.description = platformContent.description.substring(0, platformSpecs.descriptionLimit);
      
      results.push(platformContent);
      console.log(`✅ OpenAI content generation successful for ${platform}`);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error: any) {
      console.error(`❌ OpenAI content generation failed for ${platform}:`, error);
      
      // Re-throw the error instead of falling back to templates
      throw new Error(`Failed to generate ${platform} content using OpenAI: ${error.message}`);
    }
  }
  
  return results;
}

/**
 * Get platform-specific specifications
 */
function getPlatformSpecs(platform: Platform) {
  const specs = {
    facebook: { titleLimit: 100, descriptionLimit: 8000, hashtagsRequired: false, tone: 'professional and friendly' },
    instagram: { titleLimit: 150, descriptionLimit: 2200, hashtagsRequired: true, tone: 'trendy and visual' },
    tiktok: { titleLimit: 100, descriptionLimit: 2200, hashtagsRequired: true, tone: 'casual and energetic' },
    poshmark: { titleLimit: 80, descriptionLimit: 8000, hashtagsRequired: true, tone: 'fashion-focused and friendly' },
    mercari: { titleLimit: 80, descriptionLimit: 1000, hashtagsRequired: false, tone: 'straightforward and honest' },
    craigslist: { titleLimit: 70, descriptionLimit: 4000, hashtagsRequired: false, tone: 'direct and professional' },
    etsy: { titleLimit: 140, descriptionLimit: 13000, hashtagsRequired: true, tone: 'artisanal and sustainable' },
    website: { titleLimit: 200, descriptionLimit: 5000, hashtagsRequired: true, tone: 'professional and detailed' },
    x: { titleLimit: 100, descriptionLimit: 280, hashtagsRequired: true, tone: 'concise and engaging' }
  };
  
  return specs[platform] || specs.website;
}

/**
 * Enhanced image processing using Sharp and custom algorithms
 * NO FALLBACK TO MOCK AI - Real image processing only
 */
export async function enhanceImage(imageUrl: string, options: any): Promise<string> {
  console.log('🖼️ Image enhancement requested for:', imageUrl, 'with options:', options);
  
  try {
    // Import image enhancement service
    const { imageEnhancementService } = await import('./image-enhancement');
    const { bufferToDataUrl, dataUrlToBuffer, getMimeType, generateEnhancedFilename } = await import('./image-utils');
    
    let imageBuffer: Buffer;
    
    // Handle different image URL types
    if (imageUrl.startsWith('data:')) {
      // Data URL - convert to buffer
      imageBuffer = dataUrlToBuffer(imageUrl);
    } else if (imageUrl.startsWith('blob:') || imageUrl.startsWith('http')) {
      // Fetch the image from URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else {
      throw new Error('Unsupported image URL format');
    }
    
    console.log('✅ Image loaded, buffer size:', imageBuffer.length);
    
    // Apply enhancements
    const enhancedBuffer = await imageEnhancementService.enhanceImage(imageBuffer, options);
    
    // Convert back to data URL for frontend use
    const enhancedDataUrl = bufferToDataUrl(enhancedBuffer, 'image/jpeg');
    
    console.log('✅ Image enhancement completed successfully');
    return enhancedDataUrl;
    
  } catch (error: any) {
    console.error('❌ Image enhancement failed:', error);
    throw new Error(`Image enhancement failed: ${error.message}`);
  }
}

/**
 * Check OpenAI API health and usage
 */
export async function checkOpenAIHealth(): Promise<{ status: string; model: string; message: string }> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      status: 'error',
      model: 'unknown',
      message: 'OpenAI API key is not configured'
    };
  }

  try {
    console.log('🔍 Checking OpenAI API health...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5,
    });
    
    console.log('✅ OpenAI API health check successful');
    return {
      status: 'healthy',
      model: response.model,
      message: 'OpenAI API is operational'
    };
  } catch (error: any) {
    console.error('❌ OpenAI health check failed:', error);
    return {
      status: 'error',
      model: 'unknown',
      message: `OpenAI API error: ${error.message || 'Unknown error'}`
    };
  }
}
