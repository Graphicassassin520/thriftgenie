
import { AnalysisResult, PlatformContent, Platform } from './types';

export function generatePlatformContent(analysis: AnalysisResult, platforms: Platform[]): PlatformContent[] {
  return platforms.map(platform => {
    switch (platform) {
      case 'facebook':
        return generateFacebookContent(analysis);
      case 'instagram':
        return generateInstagramContent(analysis);
      case 'tiktok':
        return generateTikTokContent(analysis);
      case 'poshmark':
        return generatePoshmarkContent(analysis);
      case 'mercari':
        return generateMercariContent(analysis);
      case 'craigslist':
        return generateCraigslistContent(analysis);
      case 'etsy':
        return generateEtsyContent(analysis);
      case 'website':
        return generateWebsiteContent(analysis);
      case 'x':
        return generateXContent(analysis);
      default:
        return generateGenericContent(analysis, platform);
    }
  });
}

function generateFacebookContent(analysis: AnalysisResult): PlatformContent {
  const title = `${analysis.brand ? `${analysis.brand} ` : ''}${analysis.category} - ${analysis.condition} Condition`;
  
  const description = `Professional listing for this ${analysis.condition.toLowerCase()} ${analysis.category.toLowerCase()}${analysis.brand ? ` from ${analysis.brand}` : ''}.

Details:
• Condition: ${analysis.condition}
• Material: ${analysis.material || 'Mixed materials'}
• Color: ${analysis.color || 'Multi-color'}
• Dimensions: ${analysis.dimensions || 'Standard size'}

Perfect for anyone looking for quality ${analysis.category.toLowerCase()} at a great price. Item has been well-maintained and is ready for its new home.

Serious inquiries only. Cash or PayPal accepted. Local pickup preferred, shipping available for additional cost.`;

  return {
    platform: 'facebook',
    title: title.substring(0, 100),
    description: description.substring(0, 8000),
    hashtags: `#${analysis.category.replace(/\s+/g, '')} #${analysis.condition.replace(/\s+/g, '')} #SecondHand #Deal`
  };
}

function generateInstagramContent(analysis: AnalysisResult): PlatformContent {
  const title = `${analysis.brand ? `${analysis.brand} ` : ''}${analysis.category} 💫`;
  
  const description = `✨ ${analysis.condition} condition ${analysis.category.toLowerCase()}${analysis.brand ? ` by ${analysis.brand}` : ''}!

🎨 Color: ${analysis.color || 'Beautiful shade'}
📏 Size: ${analysis.dimensions || 'Perfect size'}
🏷️ Material: ${analysis.material || 'Quality materials'}

Perfect addition to your collection! 💕 DM for details or to make an offer 📩

#thrifted #secondhand #sustainable #preloved #vintage #deal #forsale`;

  const hashtags = `#${analysis.category.replace(/\s+/g, '').toLowerCase()} #${analysis.condition.replace(/\s+/g, '').toLowerCase()} #thrifted #secondhand #sustainable #preloved #vintage #deal #forsale #reseller #thriftfinds #sustainablefashion #ecofriendly #bargain #treasure`;

  return {
    platform: 'instagram',
    title: title.substring(0, 150),
    description: description.substring(0, 2200),
    hashtags: hashtags.substring(0, 2200)
  };
}

function generateTikTokContent(analysis: AnalysisResult): PlatformContent {
  const title = `${analysis.condition} ${analysis.category} find! 🔥`;
  
  const description = `Found this amazing ${analysis.category.toLowerCase()}${analysis.brand ? ` from ${analysis.brand}` : ''} and it's in ${analysis.condition.toLowerCase()} condition! 

Who else loves a good thrift find? 💯

Drop a 🔥 if you want this!`;

  const hashtags = `#thrift #thriftfinds #secondhand #sustainable #preloved #thrifted #deal #forsale #vintage #treasure #thriftflip #sustainablefashion #ecofriendly #bargain #reseller #thrifthaul #goodfinds #prelovedfashion #thriftstore #secondhandfirst`;

  return {
    platform: 'tiktok',
    title: title.substring(0, 100),
    description: description.substring(0, 2200),
    hashtags: hashtags.substring(0, 2200)
  };
}

function generatePoshmarkContent(analysis: AnalysisResult): PlatformContent {
  const title = `${analysis.brand ? `${analysis.brand} ` : ''}${analysis.category} | ${analysis.condition}`;
  
  const description = `💕 Beautiful ${analysis.category.toLowerCase()}${analysis.brand ? ` from ${analysis.brand}` : ''} in ${analysis.condition.toLowerCase()} condition!

✨ DETAILS:
• Brand: ${analysis.brand || 'Boutique/Unbranded'}
• Condition: ${analysis.condition}
• Color: ${analysis.color || 'Gorgeous color'}
• Size: ${analysis.dimensions || 'See measurements'}
• Material: ${analysis.material || 'Quality fabric'}

🌟 From a smoke-free, pet-friendly home
📦 Ships within 1-2 business days
💝 Bundle for additional savings!
🔄 Open to reasonable offers

Questions? Feel free to comment below! 💕

#poshmark #poshmarkfinds #closetcleanout`;

  return {
    platform: 'poshmark',
    title: title.substring(0, 80),
    description: description.substring(0, 8000),
    hashtags: `#poshmark #poshmarkfinds #closetcleanout #${analysis.category.replace(/\s+/g, '').toLowerCase()}`
  };
}

function generateMercariContent(analysis: AnalysisResult): PlatformContent {
  const title = `${analysis.brand ? `${analysis.brand} ` : ''}${analysis.category} - ${analysis.condition}`;
  
  const description = `${analysis.category}${analysis.brand ? ` by ${analysis.brand}` : ''} in ${analysis.condition.toLowerCase()} condition.

Condition: ${analysis.condition}
Color: ${analysis.color || 'As shown'}
Size: ${analysis.dimensions || 'Standard'}
Material: ${analysis.material || 'See photos'}

Ships fast! No returns. Message with questions before purchasing.`;

  return {
    platform: 'mercari',
    title: title.substring(0, 80),
    description: description.substring(0, 1000),
    hashtags: undefined
  };
}

function generateCraigslistContent(analysis: AnalysisResult): PlatformContent {
  const title = `${analysis.category}${analysis.brand ? ` - ${analysis.brand}` : ''} (${analysis.condition})`;
  
  const description = `For sale: ${analysis.category.toLowerCase()}${analysis.brand ? ` from ${analysis.brand}` : ''} in ${analysis.condition.toLowerCase()} condition.

Details:
- Condition: ${analysis.condition}
- Color: ${analysis.color || 'See photos'}
- Dimensions: ${analysis.dimensions || 'Standard size'}
- Material: ${analysis.material || 'Mixed materials'}

Cash only. Serious buyers only please. Can meet in safe public location or you can pick up.

Email with questions or to arrange viewing.`;

  return {
    platform: 'craigslist',
    title: title.substring(0, 70),
    description: description.substring(0, 4000),
    hashtags: undefined
  };
}

function generateEtsyContent(analysis: AnalysisResult): PlatformContent {
  const title = `Vintage ${analysis.category}${analysis.brand ? ` | ${analysis.brand}` : ''} | ${analysis.condition}`;
  
  const description = `✨ Discover this charming ${analysis.category.toLowerCase()}${analysis.brand ? ` from ${analysis.brand}` : ''}, a wonderful addition to any collection!

🌟 ITEM DETAILS:
• Condition: ${analysis.condition} - carefully preserved
• Era: Vintage/Pre-owned
• Color: ${analysis.color || 'Beautiful natural tones'}
• Dimensions: ${analysis.dimensions || 'Please see photos for scale'}
• Materials: ${analysis.material || 'Quality construction'}

💝 WHAT MAKES IT SPECIAL:
This piece carries history and character that only comes with time. Perfect for collectors, gift-givers, or anyone who appreciates unique finds.

📦 SHIPPING & CARE:
• Carefully packaged with love
• Ships within 1-3 business days
• Tracking provided
• Care instructions included

🤝 SHOP POLICIES:
• Questions welcomed before purchase
• Vintage items show natural wear
• Photos are part of description

Thank you for supporting sustainable shopping! ♻️`;

  return {
    platform: 'etsy',
    title: title.substring(0, 140),
    description: description.substring(0, 13000),
    hashtags: `vintage, ${analysis.category.toLowerCase()}, ${analysis.condition.toLowerCase()}, sustainable, eco-friendly, unique, collectible, pre-owned, retro, antique, one-of-a-kind, gift, home-decor, vintage-style`
  };
}

function generateWebsiteContent(analysis: AnalysisResult): PlatformContent {
  const title = `${analysis.brand ? `${analysis.brand} ` : ''}${analysis.category} | ${analysis.condition} Condition | Pre-Owned`;
  
  const description = `Premium pre-owned ${analysis.category.toLowerCase()}${analysis.brand ? ` from renowned brand ${analysis.brand}` : ''} available for purchase. This item has been carefully inspected and verified to be in ${analysis.condition.toLowerCase()} condition.

PRODUCT SPECIFICATIONS:
• Category: ${analysis.category}
• Brand: ${analysis.brand || 'Unbranded/Generic'}
• Condition Grade: ${analysis.condition}
• Primary Color: ${analysis.color || 'Multi-color'}
• Dimensions: ${analysis.dimensions || 'Standard sizing'}
• Material Composition: ${analysis.material || 'Mixed materials'}

CONDITION ASSESSMENT:
Our ${analysis.condition.toLowerCase()} condition rating indicates this item shows ${analysis.condition === 'Excellent' ? 'minimal signs of use' : analysis.condition === 'Very Good' ? 'light wear consistent with normal use' : analysis.condition === 'Good' ? 'moderate wear but fully functional' : 'noticeable wear but still usable'}. All functional aspects have been tested and verified.

SUSTAINABILITY COMMITMENT:
By choosing pre-owned items, you're making an environmentally conscious decision that reduces waste and extends product lifecycles. This item represents excellent value while supporting sustainable consumption practices.

PURCHASE INFORMATION:
• Authenticity guaranteed
• Detailed condition report available
• Professional packaging and shipping
• 30-day return policy for items not as described
• Secure payment processing

Contact us for additional photos, measurements, or specific condition details.`;

  return {
    platform: 'website',
    title: title.substring(0, 200),
    description: description.substring(0, 5000),
    hashtags: `${analysis.category.toLowerCase()}, ${analysis.brand?.toLowerCase() || 'unbranded'}, ${analysis.condition.toLowerCase()}, pre-owned, second-hand, sustainable, eco-friendly, quality, authentic, verified`
  };
}

function generateXContent(analysis: AnalysisResult): PlatformContent {
  const title = `${analysis.category}${analysis.brand ? ` by ${analysis.brand}` : ''} 🔥`;
  
  const description = `Found: ${analysis.condition} ${analysis.category.toLowerCase()}${analysis.brand ? ` from ${analysis.brand}` : ''} 

${analysis.color ? `Color: ${analysis.color}` : ''}
${analysis.dimensions ? `Size: ${analysis.dimensions}` : ''}

Perfect for someone who appreciates quality! 💯

DM if interested 📩`;

  const hashtags = `#forsale #secondhand #${analysis.category.replace(/\s+/g, '').toLowerCase()} #deal #sustainable #preloved`;

  return {
    platform: 'x',
    title: title.substring(0, 100),
    description: description.substring(0, 280),
    hashtags: hashtags.substring(0, 100)
  };
}

function generateGenericContent(analysis: AnalysisResult, platform: string): PlatformContent {
  const title = `${analysis.brand ? `${analysis.brand} ` : ''}${analysis.category} - ${analysis.condition}`;
  
  const description = `${analysis.category}${analysis.brand ? ` from ${analysis.brand}` : ''} in ${analysis.condition.toLowerCase()} condition. 

Details: ${analysis.color || 'Multi-color'}, ${analysis.dimensions || 'Standard size'}, ${analysis.material || 'Quality materials'}.

Great find for the right buyer!`;

  return {
    platform,
    title,
    description,
    hashtags: `#${analysis.category.replace(/\s+/g, '')} #${analysis.condition.replace(/\s+/g, '')} #SecondHand`
  };
}
