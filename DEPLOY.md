# Deployment Guide for Sarangsh

## Prerequisites
1. A Vercel account
2. Claude API key from Anthropic
3. CORS proxy access (temporary or permanent solution)

## CORS Proxy Setup

### Temporary Solution (Development/Testing)
1. Visit https://cors-anywhere.herokuapp.com/corsdemo
2. Click "Request temporary access to the demo server"
3. Access is granted for your domain temporarily

### Permanent Solutions
Consider one of these options:
1. Set up your own CORS proxy server
2. Use Cloudflare Workers
3. Use a dedicated proxy service

## Steps to Deploy

1. **Set Up Environment Variables in Vercel**
   - Go to your project in Vercel Dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variable:
     ```
     Name: VITE_CLAUDE_API_KEY
     Value: your_claude_api_key_here
     ```
   - Make sure to add this to Production, Preview, and Development environments

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect it's a Vite project
   - The build settings are configured in vercel.json:
     - Build Command: `vite build`
     - Output Directory: `dist`
     - Framework Preset: Vite

3. **Verify Deployment**
   - Check the deployment logs for any errors
   - Test the application by uploading a transcript
   - Verify the summary generation works
   - Test the PDF download functionality

## Architecture

The application uses a client-side architecture with CORS proxy:
- Frontend makes requests through CORS proxy
- CORS proxy forwards requests to Anthropic's API
- Security headers are configured in vercel.json
- Environment variables handled by Vercel

## Security Notes

1. **API Key Security**
   - API key is only exposed to the client through environment variables
   - All API calls go through CORS proxy
   - CORS and CSP headers are properly configured
   - Regular key rotation is recommended

2. **CORS Proxy Security**
   - Use trusted CORS proxy services
   - Consider rate limiting
   - Monitor proxy usage
   - Implement proper error handling

3. **Data Handling**
   - No data is stored on servers
   - Transcripts are processed client-side
   - Summaries are stored in localStorage only

## Troubleshooting

1. **CORS Issues**
   - Verify CORS proxy is accessible
   - Check temporary access hasn't expired
   - Verify CSP headers in vercel.json
   - Check browser console for CORS errors

2. **API Errors**
   - Verify VITE_CLAUDE_API_KEY is set
   - Check API key permissions
   - Monitor rate limits
   - Check response status codes

3. **Build Failures**
   - Check Vercel build logs
   - Verify environment variables
   - Check package dependencies

## Maintenance

1. **Updates**
   - Push changes to repository
   - Vercel auto-deploys updates
   - Monitor API usage
   - Check CORS proxy status

2. **Monitoring**
   - Use Vercel's built-in analytics
   - Check error logs regularly
   - Monitor API rate limits
   - Check CORS proxy health

## Configuration Files

1. **vercel.json**
   - Configures build settings
   - Sets up security headers
   - Handles CORS configuration

2. **Environment Variables**
   ```env
   VITE_CLAUDE_API_KEY=your-claude-api-key
   ```

## Support

For issues or questions:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify API key and permissions
4. Check CORS proxy status
5. Verify Anthropic API status
