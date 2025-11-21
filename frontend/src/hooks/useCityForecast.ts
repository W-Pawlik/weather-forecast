import { useQuery } from '@tanstack/react-query';

import { CityDTO, FiveDayForecastDTO } from '@/types/weatherApi';
import { weatherService } from '@/services/openWeatherService/weatherDataService';

export function useCityForecast(cityName: string) {
  return useQuery<FiveDayForecastDTO | null>({
    queryKey: ['forecast', cityName],
    enabled: !!cityName,
    queryFn: async () => {
      const coordsList: CityDTO[] = await weatherService.fetchCoordsByName(cityName);
      if (!coordsList.length) {
        console.warn('No coords for: ', cityName);
        return null;
      }
      const coords = coordsList[0];
      const forecast = await weatherService.fetchFiveDaysForecastByCoords(coords);
      return forecast;
    },
  });
}
