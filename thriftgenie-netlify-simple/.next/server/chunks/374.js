"use strict";exports.id=374,exports.ids=[374],exports.modules={4374:(e,t,a)=>{a.d(t,{imageEnhancementService:()=>s});var r=a(7441),o=a.n(r);class i{async enhanceImage(e,t){try{console.log("Starting image enhancement with options:",t);let a=o()(e),r=await a.metadata();console.log("Image metadata:",{width:r.width,height:r.height,format:r.format}),t.correctLighting&&(a=await this.correctLighting(a)),t.removeBackground&&(a=await this.processBackground(a,t.backgroundType));let i=await a.jpeg({quality:90,progressive:!0}).toBuffer();return console.log("Image enhancement completed successfully"),i}catch(e){throw console.error("Image enhancement failed:",e),Error(`Image enhancement failed: ${e.message}`)}}async correctLighting(e){try{console.log("Applying lighting correction");let t=await e.stats(),a=(t.channels[0].mean+t.channels[1].mean+t.channels[2].mean)/3,r=0,o=1;return a<80?(r=Math.min(30,(80-a)*.5),o=1.1):a>180&&(r=Math.max(-20,(180-a)*.3),o=1.05),e.modulate({brightness:1+r/100,saturation:1.1,hue:0}).linear(o,-(128*o)+128).gamma(1.1)}catch(t){return console.error("Lighting correction failed:",t),e}}async processBackground(e,t){try{console.log("Processing background with type:",t);let a=await e.metadata(),r=a.width||800,o=a.height||600;switch(t){case"white":return this.replaceWithWhiteBackground(e,r,o);case"gradient":return this.replaceWithGradientBackground(e,r,o);case"lifestyle":return this.replaceWithLifestyleBackground(e,r,o);case"none":return this.createTransparentBackground(e);default:return e}}catch(t){return console.error("Background processing failed:",t),e}}async replaceWithWhiteBackground(e,t,a){let r=o()({create:{width:t,height:a,channels:3,background:{r:255,g:255,b:255}}}),i=await e.modulate({saturation:1.2}).sharpen({sigma:1,m1:1,m2:2}).toBuffer();return r.composite([{input:i,blend:"over"}])}async replaceWithGradientBackground(e,t,a){let r=`
      <svg width="${t}" height="${a}">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
    `,i=o()(Buffer.from(r)),s=await e.modulate({saturation:1.15}).sharpen({sigma:1,m1:1,m2:2}).toBuffer();return i.composite([{input:s,blend:"over"}])}async replaceWithLifestyleBackground(e,t,a){let r=`
      <svg width="${t}" height="${a}">
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
    `,i=o()(Buffer.from(r)),s=await e.modulate({saturation:1.2,brightness:1.05}).sharpen({sigma:1,m1:1,m2:2}).toBuffer();return i.composite([{input:s,blend:"over"}])}async createTransparentBackground(e){return e.png({quality:90,compressionLevel:6}).modulate({saturation:1.1}).sharpen({sigma:1.5,m1:1,m2:3})}async applyCustomAdjustments(e,t=0,a=0,r=0){try{console.log("Applying custom adjustments:",{brightness:t,contrast:a,saturation:r});let i=o()(e);if((0!==t||0!==r)&&(i=i.modulate({brightness:1+t/100,saturation:1+r/100})),0!==a){let e=1+a/100;i=i.linear(e,-(128*e)+128)}return await i.jpeg({quality:90,progressive:!0}).toBuffer()}catch(e){throw console.error("Custom adjustments failed:",e),Error(`Custom adjustments failed: ${e.message}`)}}async optimizeForWeb(e,t=1200){try{let a=o()(e),r=await a.metadata();if(r.width&&r.width>t)return await a.resize(t,null,{withoutEnlargement:!0,fit:"inside"}).jpeg({quality:85,progressive:!0}).toBuffer();return await a.jpeg({quality:85,progressive:!0}).toBuffer()}catch(t){return console.error("Web optimization failed:",t),e}}}let s=new i}};