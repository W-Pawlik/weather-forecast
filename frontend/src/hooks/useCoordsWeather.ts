import { useQuery } from '@tanstack/react-query';

import type { WeatherDTO } from '@/types/weatherApi';
import { weatherService } from '@/services/openWeatherService/weatherDataService';

export function useCoordsWeather(lat?: number | null, lon?: number | null) {
  const hasCoords = typeof lat === 'number' && typeof lon === 'number';

  return useQuery<WeatherDTO | null>({
    queryKey: ['weatherByCoords', lat, lon],
    enabled: hasCoords,
    queryFn: async () => {
      if (!hasCoords) return null;
      const coords = { lat: lat as number, lon: lon as number };
      const weather = await weatherService.fetchWeatherByCoords(coords as any);
      return weather;
    },
  });
}
