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
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: `You are a precise and thorough analyst. Your task is to analyze the following transcript and provide a detailed summary in a clear, structured format. Focus on extracting and organizing ALL important information.

Please ensure your response follows this EXACT structure:

1. EXECUTIVE OVERVIEW
   - Event Details (date, time, type, duration)
   - Key Participants (names and titles)
   - Main Announcements (3-4 most significant points)

2. KEY HIGHLIGHTS
   - Financial Metrics (all numbers with comparisons)
   - Operational Updates (key changes and achievements)
   - Strategic Decisions (major choices and plans)

3. CRITICAL ANALYSIS
   - Performance Assessment
   - Market Position
   - Competitive Analysis
   - Risk Factors

4. FORWARD-LOOKING INSIGHTS
   - Growth Plans
   - Strategic Initiatives
   - Market Expansion
   - Product Roadmap

5. ACTION ITEMS
   - Immediate Next Steps
   - Follow-up Tasks
   - Timeline and Deadlines
   - Responsibility Assignments

IMPORTANT:
- Include ALL numerical data mentioned
- Quote speakers directly for important statements
- Maintain consistent formatting
- Provide context for industry terms
- Don't skip any sections
- Use bullet points for clarity

Here's the transcript to analyze:

${prompt}`
          }
        ]
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
