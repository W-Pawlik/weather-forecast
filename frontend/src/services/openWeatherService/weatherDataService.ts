import { IWeatherDataService } from './IweatherDataService';

import { CityCoords, CityDTO, WeatherDTO, FiveDayForecastDTO } from '@/types/weatherApi';

const API_BASE = 'https://api.openweathermap.org';
const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_OPEN_WEATHER_API_KEY is not defined in environment variables.');
}

type QueryParams = Record<string, string | number | undefined>;

async function fetchFromOpenWeather<T>(path: string, params: QueryParams): Promise<T> {
  const url = new URL(path, API_BASE);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  if (API_KEY) {
    url.searchParams.set('appid', API_KEY);
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`OpenWeather request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const weatherService: IWeatherDataService = {
  async fetchCoordsByName(cityName: string): Promise<CityDTO[]> {
    const data = await fetchFromOpenWeather<CityDTO[]>('/geo/1.0/direct', {
      q: cityName,
      limit: 5,
    });

    return data ?? [];
  },

  async fetchWeatherByCoords(coords: CityCoords): Promise<WeatherDTO> {
    return fetchFromOpenWeather<WeatherDTO>('/data/2.5/weather', {
      lat: coords.lat,
      lon: coords.lon,
      units: 'metric',
    });
  },

  async fetchFiveDaysForecastByCoords(coords: CityCoords): Promise<FiveDayForecastDTO> {
    return fetchFromOpenWeather<FiveDayForecastDTO>('/data/2.5/forecast', {
      lat: coords.lat,
      lon: coords.lon,
      units: 'metric',
    });
  },
};
