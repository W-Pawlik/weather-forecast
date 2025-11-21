import { IsearchCitiesService } from './IsearchCitiesService';

import { CITY_OPTIONS, CityOption } from '@/data/cities';

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export const searchCitiesService: IsearchCitiesService = {
  searchCities: (prefix: string, limit = 6, delayMs = 150): Promise<CityOption[]> => {
    const q = normalize(prefix.trim());
    if (!q) return Promise.resolve([]);

    const results = CITY_OPTIONS.filter((c) => {
      const name = normalize(c.name);
      if (name.startsWith(q)) return true;
      return Array.isArray(c.alt) && c.alt.some((a) => normalize(a).startsWith(q));
    }).slice(0, limit);

    return new Promise((resolve) => setTimeout(() => resolve(results), delayMs));
  },
};
