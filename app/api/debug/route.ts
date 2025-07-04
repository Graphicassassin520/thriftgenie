import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if API key is available
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    const apiKeyLength = process.env.OPENAI_API_KEY?.length || 0;
    const apiKeyPrefix = process.env.OPENAI_API_KEY?.substring(0, 10) || 'Not set';
    
    // Basic OpenAI test
    let openaiTest = 'Not tested';
    if (hasApiKey) {
      try {
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        
        // Simple API test
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: "Say 'API working'" }],
          max_tokens: 10,
        });
        
        openaiTest = response.choices[0]?.message?.content || 'API responded but no content';
      } catch (error: any) {
        openaiTest = `API Error: ${error.message}`;
      }
    }

    return NextResponse.json({
      success: true,
      debug: {
        hasApiKey,
        apiKeyLength,
        apiKeyPrefix,
        openaiTest,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown'
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      debug: {
        hasApiKey: !!process.env.OPENAI_API_KEY,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
} 