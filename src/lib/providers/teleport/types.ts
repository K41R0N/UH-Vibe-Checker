/**
 * Teleport API Types
 * https://developers.teleport.org/api/reference/
 */

export interface TeleportUrbanArea {
  _links: {
    self: { href: string };
    'ua:scores': { href: string };
    'ua:salaries': { href: string };
    'ua:cost-of-living': { href: string };
  };
  full_name: string;
  name: string;
  ua_id: string;
  slug: string;
  teleport_city_url?: string;
}

export interface TeleportScores {
  categories: Array<{
    name: string;
    score_out_of_10: number;
    color: string;
  }>;
  summary: string;
  teleport_city_score: number;
}

export interface TeleportCostOfLiving {
  prices: Array<{
    item_name: string;
    average_price: number;
    min: number;
    max: number;
    currency_dollar_ppp: number;
  }>;
  currency_name: string;
}

export interface TeleportSalaries {
  salaries: Array<{
    job: {
      id: string;
      title: string;
    };
    salary_percentiles: {
      percentile_25: number;
      percentile_50: number;
      percentile_75: number;
    };
  }>;
}

/**
 * Input type for Teleport enrichment
 */
export interface TeleportInput {
  name: string;
  country: string;
  slug?: string;
}

/**
 * Output type - what Teleport can populate
 */
export interface TeleportEnrichedData {
  costOfLiving?: {
    housing: number;
    food: number;
    transportation: number;
    utilities: number;
  };
  qualityOfLife?: {
    safety: number;
    healthcare: number;
    climate: string;
  };
  teleportData?: {
    overallScore: number;
    categories: Record<string, number>;
    summary: string;
    url: string;
  };
}
