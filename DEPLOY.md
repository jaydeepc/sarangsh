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

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Double-check VITE_CLAUDE_API_KEY is set in Vercel
   - Verify the value is correct and properly formatted
   - Redeploy after updating environment variables

2. **Build Failures**
   - Check build logs in Vercel
   - Ensure all dependencies are installed
   - Verify environment variables are set correctly

3. **API Errors**
   - Check Claude API key is valid
   - Verify API endpoints are accessible
   - Check CORS configuration in vercel.json

## Security Notes

1. Never commit API keys to the repository
2. Always use environment variables for sensitive data
3. Keep your API keys secure and rotate them regularly
4. Monitor API usage and set up proper rate limiting

## Updates and Maintenance

1. **Deploying Updates**
   - Push changes to your repository
   - Vercel will automatically deploy updates

2. **Monitoring**
   - Use Vercel's built-in monitoring
   - Check API usage regularly
   - Monitor error logs

## Configuration Files

1. **vercel.json**
   - Configures build settings
   - Sets up security headers
   - Configures API routes

2. **vite.config.js**
   - Configures build process
   - Sets up development server
   - Handles environment variables

3. **.env.example**
   - Shows required environment variables
   - Provides format for API keys
   - Documents security requirements
