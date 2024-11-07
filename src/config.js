// CORS Proxy configuration
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const API_URL = 'https://api.anthropic.com/v1/messages';

// Get API key from environment variables
const CLAUDE_API_KEY = import.meta.env?.VITE_CLAUDE_API_KEY || '';

// Log environment status in development
if (import.meta.env.DEV) {
  console.log('Environment Variables Status:', {
    VITE_CLAUDE_API_KEY: CLAUDE_API_KEY ? 'Present' : 'Missing',
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  });
}

export const config = {
  CLAUDE_API_KEY,
  API_URL: CORS_PROXY + API_URL,
  IS_PROD: import.meta.env.PROD,
  MODEL: 'claude-3-5-sonnet-20241022',
  MAX_TOKENS: 4096,
  // Helper function to check if config is valid
  isValid() {
    return Boolean(this.CLAUDE_API_KEY && this.CLAUDE_API_KEY.startsWith('sk-ant-'));
  }
};
