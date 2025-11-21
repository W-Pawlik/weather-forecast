import { CityCoords, CityDTO, FiveDayForecastDTO, WeatherDTO } from '@/types/weatherApi';

export interface IWeatherDataService {
  fetchCoordsByName(cityName: string): Promise<CityDTO[]>;
  fetchWeatherByCoords(coords: CityCoords): Promise<WeatherDTO>;
  fetchFiveDaysForecastByCoords(coords: CityCoords): Promise<FiveDayForecastDTO>;
}
