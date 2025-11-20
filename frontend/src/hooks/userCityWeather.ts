import { useQuery } from '@tanstack/react-query';

import { fetchCoordsByName, fetchWeatherByCoords } from '@/services/weatherApi';
import { CityDTO, WeatherDTO } from '@/types/weatherApi';

export function useCityWeather(cityName: string) {
  return useQuery<WeatherDTO | null>({
    queryKey: ['weather', cityName],
    enabled: !!cityName,
    retry: 3,
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      const coordsList: CityDTO[] = await fetchCoordsByName(cityName);

      if (!coordsList.length) {
        console.warn('No coords for: ', cityName);
        return null;
      }

      const coords = coordsList[0];

      const weatherData = await fetchWeatherByCoords(coords);
      return weatherData;
    },
  });
}
