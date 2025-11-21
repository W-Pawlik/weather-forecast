import { CityOption } from '@/data/cities';

export interface IsearchCitiesService {
  searchCities(prefix: string, limit?: number, delayMs?: number): Promise<CityOption[]>;
}
