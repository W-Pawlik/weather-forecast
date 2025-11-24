import type { WeatherDTO } from '@/types/weatherApi';

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export type WeatherGroupResponse = {
  cnt: number;
  list: WeatherDTO[];
};

export async function fetchWeatherGroup(cityIds: number[]): Promise<WeatherGroupResponse> {
  if (!cityIds.length) {
    return { cnt: 0, list: [] };
  }
  const idsParam = cityIds.join(',');
  const url = `${WEATHER_BASE_URL}/group?id=${idsParam}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch weather group: ${res.status}`);
  }
  return res.json();
}
