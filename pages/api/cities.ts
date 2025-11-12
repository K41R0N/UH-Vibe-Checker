import { NextApiRequest, NextApiResponse } from 'next'
import { CityService } from '@/lib/services/cityService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const page = parseInt(req.query.page as string) || 1
    console.log(`[API] Fetching cities for page ${page}`)

    const { cities, total } = await CityService.getCities(page, true) // Load weather for subsequent pages

    console.log(`[API] Returning ${cities.length} cities, total: ${total}`)
    res.status(200).json({ cities, total })
  } catch (error) {
    console.error('[API] Error fetching cities:', error)
    res.status(500).json({ message: 'Error fetching cities' })
  }
} 