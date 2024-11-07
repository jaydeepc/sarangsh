// Get API key from environment variables
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

// Validate API key is present
if (!CLAUDE_API_KEY) {
  console.error('Missing required environment variable: VITE_CLAUDE_API_KEY');
}

export const config = {
  CLAUDE_API_KEY,
  // Add any other configuration values here
  API_URL: import.meta.env.PROD ? '/api' : 'http://localhost:3000/api'
};
