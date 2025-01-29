import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const RAPID_API_KEY = process.env.RAPIDAPI_KEY;

// Rate limiting helper
class RateLimiter {
  private lastRequestTime: number = 0;
  private minInterval: number = 1100; // 1.1 seconds to be safe

  async limit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      const delay = this.minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
  }
}

async function testGeoDBAPI() {
  const rateLimiter = new RateLimiter();
  
  const options = {
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  try {
    // 1. Search for Barcelona, Spain specifically
    console.log('\nSearching for Barcelona, Spain...');
    await rateLimiter.limit();
    const citySearch = await axios.get(
      'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=Barcelona&countryIds=ES&limit=1',
      options
    );
    console.log('City Search Result:', JSON.stringify(citySearch.data, null, 2));

    // 2. Get city details
    const cityId = citySearch.data.data[0]?.id;
    if (cityId) {
      console.log('\nGetting details for Barcelona...');
      await rateLimiter.limit();
      const cityDetails = await axios.get(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${cityId}`,
        options
      );
      console.log('City Details:', JSON.stringify(cityDetails.data, null, 2));

      // 3. Get nearby cities
      console.log('\nGetting nearby cities...');
      await rateLimiter.limit();
      const nearbyCities = await axios.get(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${cityId}/nearbyCities?radius=100&limit=5`,
        options
      );
      console.log('Nearby Cities:', JSON.stringify(nearbyCities.data, null, 2));
    }

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Execute the test
console.log('Starting API test (with rate limiting)...');
testGeoDBAPI(); 