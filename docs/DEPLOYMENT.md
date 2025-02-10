# Netlify Deployment Checklist

## Pre-deployment Steps

1. Ensure all files are committed to Git
2. Verify `.gitignore` is properly configured
3. Check that `cities.json` is in the correct location
4. Verify all environment variables are documented

## Deployment Steps

1. Install Netlify CLI (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize Netlify site:
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Select your team
   - Set a custom site name if desired

4. Configure build settings in Netlify UI:
   - Build command: `npm run netlify-build`
   - Publish directory: `.next`
   - Node version: 18

5. Set up environment variables in Netlify UI:
   - Go to Site settings > Environment variables
   - Add required API keys:
     - NEXT_PUBLIC_OPENWEATHER_API_KEY
     - HUGGINGFACE_API_KEY (when implemented)

6. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Post-deployment Verification

1. Check the deployed site works:
   - Homepage loads
   - City pages load
   - Weather data displays
   - Static assets load correctly

2. Verify API endpoints:
   - Test the health check endpoint
   - Verify environment variables are accessible

3. Check build logs for any warnings or errors

## Troubleshooting

Common issues and solutions:

1. Build fails:
   - Check Node version
   - Verify all dependencies are installed
   - Check build logs for specific errors

2. API calls fail:
   - Verify environment variables are set
   - Check API key permissions
   - Verify CORS settings

3. Pages 404:
   - Check `_redirects` file
   - Verify build output
   - Check Netlify routing settings

## Monitoring

1. Set up Netlify notifications for:
   - Failed builds
   - Failed deploys
   - Form submissions (if implemented)

2. Monitor build minutes and bandwidth usage

## Regular Maintenance

1. Update dependencies monthly
2. Rotate API keys quarterly
3. Review and clean up environment variables
4. Monitor site performance metrics 