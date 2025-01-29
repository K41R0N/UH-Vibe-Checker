import axios, { AxiosError } from 'axios';

interface TeleportCity {
  name: string;
  slug: string;
}

async function exploreTeleportAPI() {
  try {
    // 1. Get list of available cities
    console.log('Fetching available cities...');
    const citiesResponse = await axios.get('https://api.teleport.org/api/urban_areas/');
    const cities: TeleportCity[] = citiesResponse.data._links['ua:item'].map((city: any) => ({
      name: city.name,
      slug: city.href.split('slug:')[1].replace('/', '')
    }));

    console.log(`Found ${cities.length} cities`);
    console.log('First 5 cities:', cities.slice(0, 5));

    // 2. Get detailed data for Barcelona as an example
    console.log('\nFetching Barcelona data...');
    const barcelonaData = await axios.get('https://api.teleport.org/api/urban_areas/slug:barcelona/scores/');
    
    console.log('\nAvailable categories:');
    barcelonaData.data.categories.forEach((category: any) => {
      console.log(`- ${category.name}: ${category.score_out_of_10.toFixed(2)}/10`);
    });

  } catch (error) {
    if (error instanceof AxiosError) {
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

// Execute the explorer
exploreTeleportAPI(); 