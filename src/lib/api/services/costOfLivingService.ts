import { CostOfLivingData, QualityOfLifeData } from '@/types/api';
import { teleportClient, fetchWithErrorHandling } from '../client';

export class CostOfLivingService {
  async getCityData(cityName: string): Promise<{
    costOfLiving: CostOfLivingData;
    qualityOfLife: QualityOfLifeData;
  } | null> {
    return fetchWithErrorHandling(
      async () => {
        const citySlug = this.formatCitySlug(cityName);
        const { data } = await teleportClient.get(`/slug:${citySlug}/scores/`);

        return {
          costOfLiving: {
            housing: this.extractScore(data, 'HOUSING') * 100,
            food: this.extractScore(data, 'COST-OF-LIVING') * 100,
            transportation: this.extractScore(data, 'COMMUTE') * 50,
            utilities: this.extractScore(data, 'HOUSING') * 30
          },
          qualityOfLife: {
            safety: this.extractScore(data, 'SAFETY'),
            healthcare: this.extractScore(data, 'HEALTHCARE'),
            climate: this.getClimateDescription(data)
          }
        };
      },
      'CostOfLivingService.getCityData'
    );
  }

  private formatCitySlug(cityName: string): string {
    return cityName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  private extractScore(data: any, category: string): number {
    const categoryData = data.categories.find(
      (cat: any) => cat.name.toUpperCase() === category
    );
    return categoryData ? Math.round(categoryData.score_out_of_10 * 10) : 0;
  }

  private getClimateDescription(data: any): string {
    const climateScore = this.extractScore(data, 'CLIMATE');
    if (climateScore >= 80) return 'Excellent';
    if (climateScore >= 60) return 'Good';
    if (climateScore >= 40) return 'Moderate';
    return 'Challenging';
  }
} 