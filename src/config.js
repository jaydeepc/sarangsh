// Build and environment configuration
const IS_PROD = import.meta.env.PROD;
const IS_DEV = import.meta.env.DEV;

// Feature flags and settings
const SETTINGS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_CONTENT_LENGTH: 100,
  MAX_CONTENT_LENGTH: 100000,
  SUPPORTED_FILE_TYPES: ['application/pdf'],
  API_TIMEOUT: 30000, // 30 seconds
};

// Claude API configuration
const API_CONFIG = {
  MODEL: 'claude-3-5-sonnet-20241022',
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.2,
  API_VERSION: '2023-06-01',
  ENDPOINT: 'https://api.anthropic.com/v1/messages'
};

// Validation helpers
const validation = {
  isValidApiKey: (key) => {
    return typeof key === 'string' && key.startsWith('sk-ant-');
  },
  isValidFileType: (type) => {
    return SETTINGS.SUPPORTED_FILE_TYPES.includes(type);
  },
  isValidFileSize: (size) => {
    return size <= SETTINGS.MAX_FILE_SIZE;
  },
  isValidContentLength: (length) => {
    return length >= SETTINGS.MIN_CONTENT_LENGTH && length <= SETTINGS.MAX_CONTENT_LENGTH;
  }
};

// Error messages
const ERRORS = {
  INVALID_API_KEY: 'Invalid API key format. Please check your API key.',
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  INVALID_FILE_TYPE: 'Please upload a PDF file',
  CONTENT_TOO_SHORT: 'Content is too short. Please provide more text to summarize.',
  CONTENT_TOO_LONG: 'Content is too long. Please provide a shorter text to summarize.',
  READ_FILE_ERROR: 'Failed to read PDF file. Please try again.',
  SUMMARY_EMPTY: 'Generated summary is empty. Please try again.',
  API_ERROR: 'Failed to generate summary. Please try again.',
  NO_CONTENT: 'Please provide either text or upload a PDF file'
};

// Animation configurations
const ANIMATIONS = {
  PAGE_TRANSITION: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  },
  ERROR_ANIMATION: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  }
};

export const config = {
  IS_PROD,
  IS_DEV,
  SETTINGS,
  API_CONFIG,
  validation,
  ERRORS,
  ANIMATIONS
};
