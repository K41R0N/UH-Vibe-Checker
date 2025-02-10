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
    const housingScore = this.extractScore(data, 'HOUSING') ?? 600; // Default value if null
    
    return {
      costOfLiving: {
        housing: housingScore,
        food: this.extractScore(data, 'COST-OF-LIVING') ?? 400,
        transportation: this.extractScore(data, 'COMMUTE') ?? 50,
        utilities: Math.round(housingScore * 0.3) ?? 150 // Estimated from housing cost
      },
      qualityOfLife: {
        safety: this.extractScore(data, 'SAFETY') ?? 7.0,
        healthcare: this.extractScore(data, 'HEALTHCARE') ?? 7.0,
        climate: this.getClimateScore(this.extractScore(data, 'CLIMATE'))
      }
    };
  }

  private extractScore(data: any, category: string): number | null {
    try {
      const categoryData = data?.categories?.find(
        (cat: any) => cat?.name?.toUpperCase() === category
      );
      return categoryData ? Math.round(categoryData.score_out_of_10 * 10) : null;
    } catch (error) {
      console.error(`Error extracting ${category} score:`, error);
      return null;
    }
  }

  private getClimateScore(score: number | null): string {
    if (score === null) return 'Moderate';
    if (score > 70) return 'Excellent';
    if (score > 50) return 'Good';
    if (score > 30) return 'Moderate';
    return 'Challenging';
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
        safety: 7.0,
        healthcare: 7.0,
        climate: 'Moderate'
      }
    };
  }
} 