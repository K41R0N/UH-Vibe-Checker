# Environment Variables Setup

## Security Best Practices

All sensitive environment variables (API keys, secrets) should be configured in the Netlify dashboard and never committed to the repository.

### Required Environment Variables

#### API Keys (Configure in Netlify Dashboard)
- `NEXT_PUBLIC_OPENWEATHER_API_KEY`: OpenWeather API key for weather data
- `HUGGINGFACE_API_KEY`: Hugging Face API key for AI insights

To set these up:
1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add each variable using the "Add a variable" button
4. For variables needed during build time, also add them to "Deploy contexts" section

### Development Environment

For local development:
1. Copy `.env.template` to `.env.local`
2. Add your development API keys to `.env.local`
3. Never commit `.env.local` to the repository

### Environment Variables by Context

#### Build-time Variables
- `NODE_VERSION`
- `NEXT_TELEMETRY_DISABLED`

#### Runtime Variables
- `NEXT_PUBLIC_OPENWEATHER_API_KEY`
- `HUGGINGFACE_API_KEY`
- `CACHE_TTL`
- `CACHE_CHECK_PERIOD`

### Security Notes

1. Never commit API keys or secrets to the repository
2. Use different API keys for development and production
3. Regularly rotate API keys
4. Monitor environment variable usage in logs
5. Use appropriate access scopes for API keys

### Netlify CLI Development

When using `netlify dev`, environment variables from your Netlify dashboard will be automatically pulled down if you're logged in and linked to the correct site. 