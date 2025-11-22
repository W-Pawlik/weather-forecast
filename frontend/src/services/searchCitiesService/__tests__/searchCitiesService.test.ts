import { describe, it, expect, vi } from 'vitest';

vi.mock('@/data/cities', () => {
  const cities = [
    {
      name: 'Warszawa',
      country: 'PL',
      region: 'Mazowieckie',
      alt: ['Warsaw'],
    },
    {
      name: 'Wrocław',
      country: 'PL',
      region: 'Dolnośląskie',
      alt: ['Wroclaw'],
    },
    {
      name: 'Berlin',
      country: 'DE',
      region: 'Berlin',
      alt: [] as string[],
    },
  ];

  return {
    CITY_OPTIONS: cities,
  };
});

import { searchCitiesService } from '../searchCitiesService';

describe('searchCitiesService', () => {
  it('returns empty array for empty or whitespace-only prefix', async () => {
    const result1 = await searchCitiesService.searchCities('');
    const result2 = await searchCitiesService.searchCities('   ');

    expect(result1).toEqual([]);
    expect(result2).toEqual([]);
  });

  it('finds cities by name prefix (case-insensitive, diacritics-insensitive)', async () => {
    const result = await searchCitiesService.searchCities('wro', 10, 0);

    expect(result.map((c: any) => c.name)).toEqual(['Wrocław']);
  });

  it('finds cities by alternative names (alt field)', async () => {
    const result = await searchCitiesService.searchCities('wars', 10, 0);

    expect(result.map((c: any) => c.name)).toEqual(['Warszawa']);
  });

  it('respects the limit parameter', async () => {
    const result = await searchCitiesService.searchCities('w', 1, 0);

    expect(result.length).toBe(1);
  });

  it('uses default limit when none is provided', async () => {
    const result = await searchCitiesService.searchCities('w');

    expect(result.length).toBe(2);
  });
});
