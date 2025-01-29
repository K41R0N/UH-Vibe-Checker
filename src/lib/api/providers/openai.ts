import { Configuration, OpenAIApi } from 'openai';

export class OpenAIAPI {
  private openai: OpenAIApi;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not defined');
    }
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateCityDescription(cityName: string, country: string): Promise<string> {
    try {
      const prompt = `Write a tweet-length (max 280 characters) introduction to ${cityName}, ${country} for digital nomads and expats. Focus on lifestyle and unique aspects.`;
      
      const response = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 100,
        temperature: 0.7
      });

      return response.data.choices[0].text?.trim() || 
        `Discover ${cityName}, a vibrant city in ${country} with unique culture and lifestyle opportunities.`;
    } catch (error) {
      console.error('Error generating city description:', error);
      return `Explore ${cityName}, ${country}'s hidden gem.`;
    }
  }
} 