import { IWeatherDataService } from './IweatherDataService';

import { CityCoords, CityDTO, WeatherDTO, FiveDayForecastDTO } from '@/types/weatherApi';

const API_BASE = 'https://api.openweathermap.org';

export const weatherService: IWeatherDataService = {
  fetchCoordsByName: async (cityName: string): Promise<CityDTO[]> => {
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    const res = await fetch(
      `${API_BASE}/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${apiKey}`
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! status: ${res.status}`);
    }

    const data: CityDTO[] = await res.json();
    return data ?? [];
  },

  fetchWeatherByCoords: async (coords: CityCoords): Promise<WeatherDTO> => {
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    const res = await fetch(
      `${API_BASE}/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! status: ${res.status}`);
    }

    const data: WeatherDTO = await res.json();
    return data;
  },

  fetchFiveDaysForecastByCoords: async (coords: CityCoords): Promise<FiveDayForecastDTO> => {
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    const res = await fetch(
      `${API_BASE}/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! status: ${res.status}`);
    }

    const data: FiveDayForecastDTO = await res.json();
    return data;
  },
};
