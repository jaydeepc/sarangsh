// CORS Proxy configuration
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const API_URL = 'https://api.anthropic.com/v1/messages';

// Get API key from environment variables
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

// In development, warn about missing API key
if (!CLAUDE_API_KEY && import.meta.env.DEV) {
  console.warn('Missing VITE_CLAUDE_API_KEY environment variable in development');
}

export const config = {
  CLAUDE_API_KEY,
  API_URL: CORS_PROXY + API_URL,
  IS_PROD: import.meta.env.PROD,
  // Add any other configuration values here
  MODEL: 'claude-3-5-sonnet-20241022',
  MAX_TOKENS: 4096
};
