// API configuration
export const config = {
  API_ENDPOINT: '/api/summarize',
  MODEL: 'claude-3-5-sonnet-20241022',
  MAX_TOKENS: 4096,
  API_VERSION: '2023-06-01',
  // Helper function to check if API key is valid format
  isValidApiKey: (key) => {
    return typeof key === 'string' && key.startsWith('sk-ant-');
  }
};
