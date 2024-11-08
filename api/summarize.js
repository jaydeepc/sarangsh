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
        temperature: 0.2,
        messages: [
          {
            role: 'user',
            content: `Analyze this transcript and create a detailed summary with the following EXACT structure. Include ALL numbers, quotes, and specific details mentioned:

1. EXECUTIVE OVERVIEW
   A. Event Information
      • Event type and purpose
      • Date and time
      • Duration
      • Platform/venue
   
   B. Participants
      • List all speakers with full names and titles
      • Key attendees mentioned
      • Host/moderator details

   C. Key Announcements
      • Major decisions announced
      • Significant changes
      • Important updates
      • Critical numbers shared

2. DETAILED METRICS
   A. Financial Data
      • Revenue figures (with % changes)
      • Profit/margins
      • Growth rates
      • Market share
      • Stock performance

   B. Operational Numbers
      • Customer metrics
      • Production/efficiency data
      • Market penetration
      • Geographic presence

3. IMPORTANT QUOTES
   Format: "Quote text" - Speaker Name, Title
   Include 4-5 most significant quotes about:
   • Strategic decisions
   • Financial results
   • Future plans
   • Market position

4. STRATEGIC UPDATES
   A. Current Initiatives
      • Ongoing projects
      • Recent launches
      • Market expansion
      • Partnerships

   B. Future Plans
      • Upcoming launches
      • Growth targets
      • Investment plans
      • Market strategies

5. ANALYSIS
   A. Performance Review
      • Strengths highlighted
      • Challenges faced
      • Market position
      • Competitive analysis

   B. Risk Factors
      • Market challenges
      • Competitive threats
      • Operational risks
      • Regulatory concerns

6. ACTION ITEMS
   A. Short-term (Next 90 Days)
      • Immediate priorities
      • Specific deadlines
      • Assigned responsibilities
      • Expected outcomes

   B. Long-term
      • Strategic goals
      • Development plans
      • Growth targets
      • Vision alignment

IMPORTANT GUIDELINES:
1. Use bullet points consistently
2. Include ALL numerical data
3. Quote speakers directly for important statements
4. Maintain exact section structure
5. Don't skip any section
6. Provide context for industry terms

Transcript to analyze:

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
    
    // Add section breaks
    summary = summary.replace(/(\d+\.\s+[A-Z\s]+)\n/g, '\n$1\n');

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
