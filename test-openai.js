
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  console.log('Testing OpenAI API...');
  console.log('API Key:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
  
  try {
    // Test 1: Basic text completion
    console.log('\n=== Test 1: Basic Text Completion ===');
    const textResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say hello" }],
      max_tokens: 10,
    });
    
    console.log('Text response:', textResponse.choices[0]?.message?.content);
    console.log('Usage:', textResponse.usage);
    
    // Test 2: Vision API with a test image
    console.log('\n=== Test 2: Vision API Test ===');
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What do you see in this image? Be specific."
            },
            {
              type: "image_url",
              image_url: {
                url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 100,
    });
    
    console.log('Vision response:', visionResponse.choices[0]?.message?.content);
    console.log('Usage:', visionResponse.usage);
    
  } catch (error) {
    console.error('OpenAI test failed:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testOpenAI();
