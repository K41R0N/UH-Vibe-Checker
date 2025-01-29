import axios from 'axios';

export class CostOfLivingAPI {
  // Using Teleport API as primary source (free)
  private readonly TELEPORT_API = 'https://api.teleport.org/api/urban_areas';
  
  async getCityData(cityName: string) {
    try {
      // Teleport API requires slug format (e.g., 'new-york-city')
      const citySlug = this.formatCitySlug(cityName);
      const response = await axios.get(
        `${this.TELEPORT_API}/slug:${citySlug}/scores/`
      );
      
      // Backup sources if Teleport fails
      if (!response.data) {
        return this.getFallbackData(cityName);
      }
      
      return this.formatTeleportData(response.data);
    } catch (error) {
      console.error('Error fetching cost of living data:', error);
      return this.getFallbackData(cityName);
    }
  }

  private formatCitySlug(cityName: string): string {
    return cityName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  private formatTeleportData(data: any) {
    return {
      costOfLiving: {
        housing: this.extractScore(data, 'HOUSING'),
        food: this.extractScore(data, 'COST-OF-LIVING'),
        transportation: this.extractScore(data, 'COMMUTE'),
        utilities: this.extractScore(data, 'HOUSING') * 0.3 // Estimated from housing cost
      },
      qualityOfLife: {
        safety: this.extractScore(data, 'SAFETY'),
        healthcare: this.extractScore(data, 'HEALTHCARE'),
        climate: this.extractScore(data, 'CLIMATE')
      }
    };
  }

  private extractScore(data: any, category: string) {
    const categoryData = data.categories.find(
      (cat: any) => cat.name.toUpperCase() === category
    );
    return categoryData ? Math.round(categoryData.score_out_of_10 * 10) : null;
  }

  // Fallback to our existing mock data if API fails
  private async getFallbackData(cityName: string) {
    // Use our existing mock data structure
    return {
      costOfLiving: {
        housing: 1200,
        food: 400,
        transportation: 50,
        utilities: 150
      },
      qualityOfLife: {
        safety: 75,
        healthcare: 85,
        climate: 'Mediterranean'
      }
    };
  }
} 