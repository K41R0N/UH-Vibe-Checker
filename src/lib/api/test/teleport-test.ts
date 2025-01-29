import axios, { AxiosError } from 'axios';

async function testTeleportAPI() {
  try {
    // Test with Barcelona
    const response = await axios.get('https://api.teleport.org/api/urban_areas/slug:barcelona/scores/');
    console.log('Barcelona Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API Error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Execute the test
testTeleportAPI(); 