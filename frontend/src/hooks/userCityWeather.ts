import { useQuery } from '@tanstack/react-query';

import { CityDTO, WeatherDTO } from '@/types/weatherApi';
import { weatherService } from '@/services/openWeatherService/weatherDataService';

export function useCityWeather(cityName: string) {
  return useQuery<WeatherDTO | null>({
    queryKey: ['weather', cityName],
    enabled: !!cityName,
    retry: 3,
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      const coordsList: CityDTO[] = await weatherService.fetchCoordsByName(cityName);

      if (!coordsList.length) {
        console.warn('No coords for: ', cityName);
        return null;
      }

      const coords = coordsList[0];

      console.log('Fetched coords for ', cityName, coords);

      const weatherData = await weatherService.fetchWeatherByCoords(coords);
      return weatherData;
    },
  });
}
