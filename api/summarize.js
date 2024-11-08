export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const { apiKey, prompt } = await request.json();

    if (!apiKey || !prompt) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Add system message to enforce structured output
    const systemMessage = `You are a precise and thorough analyst. Your task is to:
1. Extract ALL information from the provided transcript
2. Organize it into the exact sections specified
3. Maintain consistent formatting with proper indentation
4. Include ALL numbers, quotes, and specific details mentioned
5. Use bullet points for better readability
6. Never skip any section, even if information is limited
7. Clearly attribute quotes to speakers
8. Format numbers with proper units and comparisons
9. Highlight year-over-year and quarter-over-quarter changes
10. Provide context for industry-specific terms`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent output
        top_p: 0.9,
        top_k: 50
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate summary');
    }

    // Process the response to ensure consistent formatting
    let summary = data.content[0].text;
    
    // Ensure proper section spacing
    summary = summary.replace(/\n{3,}/g, '\n\n');
    
    // Ensure consistent bullet points
    summary = summary.replace(/[•●]/g, '•');
    
    // Ensure proper quote formatting
    summary = summary.replace(/[""]([^""]+)[""]\s*-\s*([^"\n]+)/g, '"$1" - $2');

    return new Response(JSON.stringify({
      content: [{ text: summary }]
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process request',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
