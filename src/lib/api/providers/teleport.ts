import axios from 'axios';
import { CostOfLivingData, QualityOfLifeData } from '@/types/city';

export class TeleportAPI {
  private baseURL = 'https://api.teleport.org/api/cities/';
  private fallbackData = {
    id: '',
    country: 'Unknown',
    costOfLiving: {
      housing: 1000,
      food: 400,
      transportation: 50,
      utilities: 150
    },
    qualityOfLife: {
      safety: 7.0,
      healthcare: 7.0,
      climate: 'Moderate'
    }
  };

  async getCityData(cityName: string) {
    try {
      const searchResponse = await axios.get(
        `${this.baseURL}search/?search=${encodeURIComponent(cityName)}`,
        { timeout: 5000 } // 5 second timeout
      );

      if (!searchResponse.data._embedded['city:search-results'].length) {
        console.warn(`No data found for ${cityName}, using fallback data`);
        return { ...this.fallbackData, id: cityName.toLowerCase() };
      }

      const cityLink = searchResponse.data._embedded['city:search-results'][0]._links['city:item'].href;
      const cityResponse = await axios.get(cityLink, { timeout: 5000 });

      // Some cities might not have urban areas data
      let urbanData = this.fallbackData;
      try {
        if (cityResponse.data._links['city:urban_area']) {
          const scoresLink = cityResponse.data._links['city:urban_area'].href + 'scores/';
          const scoresResponse = await axios.get(scoresLink, { timeout: 5000 });
          urbanData = this.formatCityData(scoresResponse.data);
        }
      } catch (error) {
        console.warn(`Could not fetch urban area data for ${cityName}, using fallback data`);
      }

      return {
        id: cityResponse.data.geoname_id,
        country: cityResponse.data.country || 'Unknown',
        costOfLiving: urbanData.costOfLiving,
        qualityOfLife: urbanData.qualityOfLife
      };
    } catch (error) {
      console.error('Error fetching from Teleport:', error);
      return { ...this.fallbackData, id: cityName.toLowerCase() };
    }
  }

  private formatCityData(data: any) {
    try {
      const categories = data.categories || [];
      return {
        id: data.ua_id || '',
        country: data.continent || 'Unknown',
        costOfLiving: this.formatCostOfLiving(categories),
        qualityOfLife: this.formatQualityOfLife(categories)
      };
    } catch (error) {
      console.error('Error formatting city data:', error);
      return this.fallbackData;
    }
  }

  private formatCostOfLiving(categories: any[]): CostOfLivingData {
    try {
      const costCategory = categories.find(c => c.name === 'Cost of Living') || {};
      const housing = categories.find(c => c.name === 'Housing') || {};
      
      return {
        housing: Math.round((housing.score_out_of_10 || 5) * 200), // Rough estimate
        food: Math.round((costCategory.score_out_of_10 || 5) * 80),
        transportation: Math.round((costCategory.score_out_of_10 || 5) * 10),
        utilities: Math.round((costCategory.score_out_of_10 || 5) * 30)
      };
    } catch (error) {
      console.error('Error formatting cost of living:', error);
      return this.fallbackData.costOfLiving;
    }
  }

  private formatQualityOfLife(categories: any[]): QualityOfLifeData {
    try {
      const safety = categories.find(c => c.name === 'Safety') || {};
      const healthcare = categories.find(c => c.name === 'Healthcare') || {};
      const climate = categories.find(c => c.name === 'Climate') || {};

      return {
        safety: Math.round((safety.score_out_of_10 || 7) * 10) / 10,
        healthcare: Math.round((healthcare.score_out_of_10 || 7) * 10) / 10,
        climate: climate.score_out_of_10 > 7 ? 'Excellent' :
                climate.score_out_of_10 > 5 ? 'Good' :
                climate.score_out_of_10 > 3 ? 'Moderate' : 'Challenging'
      };
    } catch (error) {
      console.error('Error formatting quality of life:', error);
      return this.fallbackData.qualityOfLife;
    }
  }
} 