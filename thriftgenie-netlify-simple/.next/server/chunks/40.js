"use strict";exports.id=40,exports.ids=[40],exports.modules={2040:(e,i,t)=>{t.d(i,{RA:()=>n,UI:()=>o,gZ:()=>l,hF:()=>s,iL:()=>a});let r=new(t(4991)).ZP({apiKey:process.env.OPENAI_API_KEY});async function n(e){if(!process.env.OPENAI_API_KEY)throw Error("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.");console.log("\uD83E\uDD16 Starting OpenAI image analysis for:",e);try{let i,t;let n=await r.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"user",content:[{type:"text",text:`You are an expert product identification specialist. Analyze this image step-by-step and provide your reasoning.

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
}`},{type:"image_url",image_url:{url:e,detail:"high"}}]}],max_tokens:600,temperature:.1}),a=n.choices[0]?.message?.content;if(!a)throw Error("No analysis content received from OpenAI Vision API");try{let e=a.trim();e.startsWith("```json")?e=e.replace(/^```json\s*/,"").replace(/\s*```$/,""):e.startsWith("```")&&(e=e.replace(/^```\s*/,"").replace(/\s*```$/,"")),i=JSON.parse(e)}catch(e){throw console.error("Failed to parse preliminary analysis:",a),Error("Invalid JSON response from OpenAI Vision API - unable to parse preliminary analysis")}let o=await r.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"user",content:[{type:"text",text:`Based on your previous analysis, provide the final product identification in the exact JSON format required.

Your analysis showed:
- Visual Description: ${i.visual_description}
- Size Category: ${i.size_category}
- Identified Category: ${i.identified_category}
- Confidence: ${i.confidence}
- Reasoning: ${i.reasoning}

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
- If you identified a TINY item (like lighter), dimensions should be small (e.g., "3" x 1" x 0.5"")
- If you identified a SMALL item (like sneakers), dimensions should be moderate (e.g., "12" x 4" x 5"")
- If you identified a LARGE item (like chair), dimensions should be substantial (e.g., "24" x 36" x 24"")
- Make sure the category matches the size you observed

Respond ONLY with the final JSON.`},{type:"image_url",image_url:{url:e,detail:"high"}}]}],max_tokens:300,temperature:.05}),s=o.choices[0]?.message?.content;if(!s)throw Error("No content received from OpenAI Vision API");try{let e=s.trim();e.startsWith("```json")?e=e.replace(/^```json\s*/,"").replace(/\s*```$/,""):e.startsWith("```")&&(e=e.replace(/^```\s*/,"").replace(/\s*```$/,"")),t=JSON.parse(e)}catch(e){throw console.error("Failed to parse OpenAI response:",s),Error("Invalid JSON response from OpenAI Vision API - unable to parse final analysis")}if(!t.category||!t.condition)throw Error("Invalid analysis response from OpenAI Vision API - missing required fields (category, condition)");let l=function(e){let i=e.category.toLowerCase(),t=e.dimensions?.toLowerCase()||"";for(let r of["lighter","torch lighter","zippo","keychain","ring","coin","usb drive"])if(i.includes(r)&&t.includes("inch")&&(t.includes("24")||t.includes("30")||t.includes("36")||t.includes("48")||t.includes("60")||t.includes("72")))return{isValid:!1,reason:`${e.category} identified as tiny item but has large dimensions: ${e.dimensions}`};for(let r of["chair","table","desk","bookshelf","cabinet","dresser","sofa","bed"])if(i.includes(r)&&t.includes("inch")&&(t.includes('1"')||t.includes('2"')||t.includes('3"')||t.includes('4"')||t.includes('5"')||t.includes('6"')))return{isValid:!1,reason:`${e.category} identified as large item but has tiny dimensions: ${e.dimensions}`};return{isValid:!0}}(t);return l.isValid||(console.warn("⚠️ Size validation warning:",l.reason),console.warn("Analysis details:",t)),console.log("✅ OpenAI Vision analysis successful:",t),t}catch(e){if(console.error("❌ OpenAI Vision API failed:",e),e?.status===400){if(e?.message?.includes("download"))throw Error("OpenAI cannot access the image URL. Please ensure the image is publicly accessible or try uploading a different image.");throw Error(`OpenAI Vision API error: ${e.message||"Invalid request"}`)}if(e?.status===401)throw Error("OpenAI API authentication failed. Please check your API key configuration.");if(e?.status===429)throw Error("OpenAI API rate limit exceeded. Please try again in a few moments.");if(e?.status===500)throw Error("OpenAI service is temporarily unavailable. Please try again later.");throw e}}async function a(e){if(!process.env.OPENAI_API_KEY)throw Error("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.");console.log("\uD83E\uDD16 Starting OpenAI pricing analysis for:",e.category);try{let i;let t=await r.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"user",content:`You are a second-hand marketplace pricing expert. Generate a realistic pricing suggestion for this item based on current market conditions and category-specific factors.

ITEM ANALYSIS:
- Category: ${e.category}
- Condition: ${e.condition}
- Material: ${e.material||"Not specified"}
- Color: ${e.color||"Not specified"}
- Brand: ${e.brand||"Unbranded"}
- Dimensions: ${e.dimensions||"Standard size"}

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

Be specific about your calculations and market research. Respond ONLY with valid JSON.`}],max_tokens:500,temperature:.15}),n=t.choices[0]?.message?.content;if(!n)throw Error("No content received from OpenAI pricing API");try{let e=n.trim();e.startsWith("```json")?e=e.replace(/^```json\s*/,"").replace(/\s*```$/,""):e.startsWith("```")&&(e=e.replace(/^```\s*/,"").replace(/\s*```$/,"")),i=JSON.parse(e)}catch(e){throw console.error("Failed to parse OpenAI pricing response:",n),Error("Invalid JSON response from OpenAI pricing API")}if("number"!=typeof i.suggested_price_usd||!i.pricing_reasoning)throw Error("Invalid pricing response from OpenAI - missing required fields (suggested_price_usd, pricing_reasoning)");i.suggested_price_usd<5&&(i.suggested_price_usd=5,i.pricing_reasoning+=" (Minimum price of $5 applied)");let a=function(e,i){let t=e.toLowerCase();for(let[r,n]of Object.entries({lighter:{min:5,max:25,typical:10},jewelry:{min:5,max:200,typical:30},keychain:{min:5,max:20,typical:8},smartphone:{min:50,max:800,typical:200},wallet:{min:10,max:100,typical:25},watch:{min:15,max:300,typical:50},laptop:{min:100,max:1500,typical:400},book:{min:5,max:50,typical:15},chair:{min:30,max:500,typical:100},monitor:{min:50,max:400,typical:150},table:{min:50,max:800,typical:200},bookshelf:{min:40,max:400,typical:120},sofa:{min:100,max:1e3,typical:300}}))if(t.includes(r)){if(i<n.min)return{isValid:!1,reason:`Price $${i} too low for ${e} (minimum: $${n.min})`,suggestedPrice:n.min};if(i>n.max)return{isValid:!1,reason:`Price $${i} too high for ${e} (maximum: $${n.max})`,suggestedPrice:n.typical};return{isValid:!0}}return i>2e3?{isValid:!1,reason:`Price $${i} unreasonably high for second-hand item`,suggestedPrice:200}:{isValid:!0}}(e.category,i.suggested_price_usd);return!a.isValid&&(console.warn("⚠️ Price validation warning:",a.reason),a.suggestedPrice&&(i.suggested_price_usd=a.suggestedPrice,i.pricing_reasoning+=` (Price adjusted from original suggestion due to category constraints: ${a.reason})`)),console.log("✅ OpenAI pricing successful:",i),i}catch(e){if(console.error("❌ OpenAI pricing API failed:",e),e?.status===401)throw Error("OpenAI API authentication failed. Please check your API key configuration.");if(e?.status===429)throw Error("OpenAI API rate limit exceeded. Please try again in a few moments.");if(e?.status===500)throw Error("OpenAI service is temporarily unavailable. Please try again later.");throw e}}async function o(e,i,t){if(!process.env.OPENAI_API_KEY)throw Error("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.");let n=[];for(let a of(console.log(`🤖 Generating platform content with OpenAI for ${t.length} platforms`),t))try{let t;console.log(`🤖 Generating ${a} content with OpenAI`);let o=function(e){let i={facebook:{titleLimit:100,descriptionLimit:8e3,hashtagsRequired:!1,tone:"professional and friendly"},instagram:{titleLimit:150,descriptionLimit:2200,hashtagsRequired:!0,tone:"trendy and visual"},tiktok:{titleLimit:100,descriptionLimit:2200,hashtagsRequired:!0,tone:"casual and energetic"},poshmark:{titleLimit:80,descriptionLimit:8e3,hashtagsRequired:!0,tone:"fashion-focused and friendly"},mercari:{titleLimit:80,descriptionLimit:1e3,hashtagsRequired:!1,tone:"straightforward and honest"},craigslist:{titleLimit:70,descriptionLimit:4e3,hashtagsRequired:!1,tone:"direct and professional"},etsy:{titleLimit:140,descriptionLimit:13e3,hashtagsRequired:!0,tone:"artisanal and sustainable"},website:{titleLimit:200,descriptionLimit:5e3,hashtagsRequired:!0,tone:"professional and detailed"},x:{titleLimit:100,descriptionLimit:280,hashtagsRequired:!0,tone:"concise and engaging"}};return i[e]||i.website}(a),s=await r.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"user",content:`Create an engaging ${a} listing for this second-hand item:

Item Details:
- Category: ${e.category}
- Condition: ${e.condition}
- Material: ${e.material||"Quality materials"}
- Color: ${e.color||"Attractive color"}
- Brand: ${e.brand||"Unbranded"}
- Dimensions: ${e.dimensions||"Standard size"}
- Suggested Price: $${i.suggested_price_usd}

Platform Requirements:
- Platform: ${a}
- Title max length: ${o.titleLimit} characters
- Description max length: ${o.descriptionLimit} characters
- Hashtags: ${o.hashtagsRequired?"Required":"Optional"}
- Tone: ${o.tone}

Generate content in this JSON format:
{
  "platform": "${a}",
  "title": "compelling title under ${o.titleLimit} chars",
  "description": "engaging description under ${o.descriptionLimit} chars",
  "hashtags": "${o.hashtagsRequired?"relevant hashtags separated by spaces":"null if not needed"}"
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

Respond ONLY with valid JSON, no additional text.`}],max_tokens:600,temperature:.3}),l=s.choices[0]?.message?.content;if(!l)throw Error(`No content received from OpenAI for ${a}`);try{let e=l.trim();e.startsWith("```json")?e=e.replace(/^```json\s*/,"").replace(/\s*```$/,""):e.startsWith("```")&&(e=e.replace(/^```\s*/,"").replace(/\s*```$/,"")),t=JSON.parse(e)}catch(e){throw console.error(`Failed to parse OpenAI content response for ${a}:`,l),Error(`Invalid JSON response from OpenAI for ${a} content generation`)}if(!t.title||!t.description)throw Error(`Invalid content response from OpenAI for ${a} - missing required fields`);t.title=t.title.substring(0,o.titleLimit),t.description=t.description.substring(0,o.descriptionLimit),n.push(t),console.log(`✅ OpenAI content generation successful for ${a}`),await new Promise(e=>setTimeout(e,100))}catch(e){throw console.error(`❌ OpenAI content generation failed for ${a}:`,e),Error(`Failed to generate ${a} content using OpenAI: ${e.message}`)}return n}async function s(e,i){console.log("\uD83D\uDDBC️ Image enhancement requested for:",e,"with options:",i);try{let r;let{imageEnhancementService:n}=await t.e(374).then(t.bind(t,4374)),{bufferToDataUrl:a,dataUrlToBuffer:o,getMimeType:s,generateEnhancedFilename:l}=await t.e(730).then(t.bind(t,7730));if(e.startsWith("data:"))r=o(e);else if(e.startsWith("blob:")||e.startsWith("http")){let i=await fetch(e);if(!i.ok)throw Error(`Failed to fetch image: ${i.statusText}`);let t=await i.arrayBuffer();r=Buffer.from(t)}else throw Error("Unsupported image URL format");console.log("✅ Image loaded, buffer size:",r.length);let c=await n.enhanceImage(r,i),d=a(c,"image/jpeg");return console.log("✅ Image enhancement completed successfully"),d}catch(e){throw console.error("❌ Image enhancement failed:",e),Error(`Image enhancement failed: ${e.message}`)}}async function l(){if(!process.env.OPENAI_API_KEY)return{status:"error",model:"unknown",message:"OpenAI API key is not configured"};try{console.log("\uD83D\uDD0D Checking OpenAI API health...");let e=await r.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"user",content:"Hello"}],max_tokens:5});return console.log("✅ OpenAI API health check successful"),{status:"healthy",model:e.model,message:"OpenAI API is operational"}}catch(e){return console.error("❌ OpenAI health check failed:",e),{status:"error",model:"unknown",message:`OpenAI API error: ${e.message||"Unknown error"}`}}}}};