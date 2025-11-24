import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';

import type { WeatherDTO } from '@/types/weatherApi';
import type { MapCity } from '@/types/mapCities';

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function fetchCityWeather(city: MapCity): Promise<WeatherDTO> {
  const params = new URLSearchParams({
    lat: String(city.coord.lat),
    lon: String(city.coord.lon),
    units: 'metric',
    appid: API_KEY,
  });

  const res = await fetch(`${BASE_URL}/weather?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch weather for city ${city.name}`);
  }
  return res.json();
}

export function useMapCitiesWeather(cities: MapCity[]) {
  const queries = useQueries({
    queries: cities.map((city) => ({
      queryKey: ['mapCityWeather', city.id],
      queryFn: () => fetchCityWeather(city),
      staleTime: 5 * 60 * 1000,
      enabled: cities.length > 0,
    })),
  });

  const weatherById = useMemo(() => {
    const map = new Map<number, WeatherDTO>();
    queries.forEach((q, index) => {
      const city = cities[index];
      if (city && q.data) {
        map.set(city.id, q.data);
      }
    });
    return map;
  }, [queries, cities]);

  return { weatherById };
}
