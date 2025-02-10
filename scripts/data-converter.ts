import fs from 'fs';
import path from 'path';
import { CityData } from '../src/types/city';

interface RawCityData {
  name: string;
  country: string;
  description?: string;
  housing_cost?: string;
  food_cost?: string;
  transport_cost?: string;
  utilities_cost?: string;
  safety_score?: string;
  healthcare_score?: string;
  climate?: string;
}

function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function convertToAppFormat(rawData: RawCityData): CityData {
  return {
    id: generateSlug(rawData.name),
    name: rawData.name,
    country: rawData.country,
    slug: generateSlug(rawData.name),
    description: rawData.description || `Explore ${rawData.name}, a unique destination in ${rawData.country}.`,
    costOfLiving: {
      housing: parseInt(rawData.housing_cost || '1000'),
      food: parseInt(rawData.food_cost || '400'),
      transportation: parseInt(rawData.transport_cost || '100'),
      utilities: parseInt(rawData.utilities_cost || '150')
    },
    qualityOfLife: {
      safety: parseFloat(rawData.safety_score || '7'),
      healthcare: parseFloat(rawData.healthcare_score || '7'),
      climate: rawData.climate || 'Moderate'
    }
  };
}

async function convertData(inputPath: string, outputPath: string) {
  try {
    // Read input data
    const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    
    // Convert to app format
    const cities: Record<string, CityData> = {};
    for (const city of rawData) {
      const converted = convertToAppFormat(city);
      cities[generateSlug(city.name)] = converted;
    }
    
    // Write output
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(cities, null, 2));
    console.log(`✓ Data converted successfully\n✓ Output saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error converting data:', error);
    process.exit(1);
  }
}

// Example usage:
// convertData('input.json', 'src/data/cities.json'); 