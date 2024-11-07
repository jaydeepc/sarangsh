// Get API key from environment variables
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

// In development, warn about missing API key
if (!CLAUDE_API_KEY && import.meta.env.DEV) {
  console.warn('Missing VITE_CLAUDE_API_KEY environment variable in development');
}

export const config = {
  CLAUDE_API_KEY,
  // Add any other configuration values here
  API_URL: import.meta.env.PROD ? '/api' : 'http://localhost:3000/api',
  IS_PROD: import.meta.env.PROD
};
