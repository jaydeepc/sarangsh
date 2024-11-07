# Deployment Guide for Sarangsh

## Prerequisites
1. A Vercel account
2. Claude API key from Anthropic

## Steps to Deploy

1. **Fork or Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/sarangsh.git
   cd sarangsh
   ```

2. **Set Up Environment Variables in Vercel**
   - Go to your project in Vercel Dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variable:
     ```
     Name: VITE_CLAUDE_API_KEY
     Value: your_claude_api_key_here
     ```
   - Make sure to add this to Production, Preview, and Development environments

3. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect it's a Vite project
   - The build settings should be automatically configured:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

4. **Verify Deployment**
   - Check the deployment logs for any errors
   - Test the application by uploading a transcript
   - Verify the summary generation works
   - Test the PDF download functionality

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Ensure VITE_CLAUDE_API_KEY is set in Vercel
   - Check the value is correct
   - Redeploy after updating environment variables

2. **Build Failures**
   - Check build logs in Vercel
   - Ensure all dependencies are installed
   - Verify environment variables are set

3. **API Errors**
   - Check Claude API key is valid
   - Verify API endpoints are accessible
   - Check CORS configuration

## Security Notes

1. Never commit API keys to the repository
2. Always use environment variables for sensitive data
3. Keep your API keys secure and rotate them regularly
4. Monitor API usage and set up proper rate limiting

## Updates and Maintenance

1. **Updating Dependencies**
   ```bash
   npm update
   ```

2. **Deploying Updates**
   - Push changes to your repository
   - Vercel will automatically deploy updates

3. **Monitoring**
   - Use Vercel's built-in monitoring
   - Check API usage regularly
   - Monitor error logs
