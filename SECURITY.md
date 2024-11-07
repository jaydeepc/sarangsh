# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within Sarangsh, please send an email to [your-email]. All security vulnerabilities will be promptly addressed.

## API Key Security

1. **Never commit API keys**
   - Don't store actual API keys in any committed files
   - Use environment variables for all sensitive data
   - Keep `.env` file in `.gitignore`

2. **Environment Variables**
   - Local development: Use `.env` file (not committed)
   - Production: Use Vercel environment variables
   - Never expose keys in client-side code

3. **Edge Function Security**
   - All API calls are proxied through Vercel Edge Functions
   - API keys are stored securely in Vercel
   - CORS is properly configured
   - Rate limiting is implemented

## Best Practices

1. **Local Development**
   ```bash
   # Create your .env file
   cp .env.example .env
   # Add your API key but never commit this file
   ```

2. **Production Deployment**
   - Use Vercel's environment variables
   - Enable all security headers
   - Use HTTPS only
   - Implement proper CORS policies

3. **Code Security**
   - Keep dependencies updated
   - Run security audits regularly: `npm audit`
   - Review code for security issues
   - Follow secure coding practices

## Security Headers

The application uses the following security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: default-src 'self'`

## Data Handling

1. **User Data**
   - No user data is stored permanently
   - Transcripts are processed in memory only
   - Summaries are generated on-demand

2. **API Communication**
   - All API requests are encrypted (HTTPS)
   - Data is never logged or stored
   - Temporary data is cleared after processing

## Version Control

1. **Git Security**
   - Don't commit sensitive data
   - Use `.gitignore` properly
   - Review commits before pushing
   - Use signed commits when possible

2. **Repository Security**
   - Enable security alerts
   - Regular dependency updates
   - Code scanning enabled
   - Branch protection rules

## Compliance

- Follow Anthropic's API usage guidelines
- Respect data privacy regulations
- Implement proper error handling
- Regular security audits

## Updates

This security policy will be updated as needed. Check back regularly for any changes.
