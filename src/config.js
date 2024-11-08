// API configuration
export const config = {
  MODEL: 'claude-3-5-sonnet-20241022',
  MAX_TOKENS: 4096,
  API_VERSION: '2023-06-01',
  API_URL: 'https://api.anthropic.com/v1/messages',
  isValidApiKey: (key) => typeof key === 'string' && key.startsWith('sk-ant-')
};
