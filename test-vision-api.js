
// Test OpenAI Vision API directly
const { analyzeImage } = require('./lib/openai-ai.ts');

async function testVisionAPI() {
  console.log('Testing OpenAI Vision API...');
  
  try {
    // Test with a publicly accessible image URL
    const testImageUrl = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400';
    console.log('Testing with image URL:', testImageUrl);
    
    const result = await analyzeImage(testImageUrl);
    console.log('Analysis result:', result);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testVisionAPI();
