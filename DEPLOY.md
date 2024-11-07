# Deployment Guide for Sarangsh

## Prerequisites
1. A Vercel account
2. Claude API key from Anthropic

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

The application now uses a simplified architecture:
- Frontend directly calls Anthropic's API
- Environment variables are securely handled by Vercel
- Security headers are configured in vercel.json
- No backend/API routes needed

## Security Notes

1. **API Key Security**
   - API key is only exposed to the client through environment variables
   - All API calls are made directly to Anthropic
   - CORS and CSP headers are properly configured
   - Regular key rotation is recommended

2. **Data Handling**
   - No data is stored on servers
   - Transcripts are processed client-side
   - Summaries are stored in localStorage only

## Troubleshooting

1. **Common Issues**
   - Verify VITE_CLAUDE_API_KEY is set in Vercel
   - Check CSP headers if API calls fail
   - Monitor browser console for errors
   - Verify API key permissions

2. **Build Failures**
   - Check Vercel build logs
   - Verify environment variables
   - Check package dependencies

## Maintenance

1. **Updates**
   - Push changes to repository
   - Vercel auto-deploys updates
   - Monitor API usage

2. **Monitoring**
   - Use Vercel's built-in analytics
   - Check error logs regularly
   - Monitor API rate limits

## Configuration Files

1. **vercel.json**
   ```json
   {
     "version": 2,
     "framework": "vite",
     "buildCommand": "vite build",
     "outputDirectory": "dist",
     "headers": [...]
   }
   ```

2. **Environment Variables**
   ```env
   VITE_CLAUDE_API_KEY=your-claude-api-key
   ```

## Support

For issues or questions:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify API key and permissions
4. Check Anthropic API status
