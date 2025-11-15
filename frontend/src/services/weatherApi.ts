import { CityCoords, CityDTO, WeatherDTO } from '@/types/weatherApi';

export const fetchCoordsByName = async (cityName: string): Promise<CityDTO[]> => {
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`
  );

  if (!res.ok) {
    throw new Error(`HTTP Error! status: ${res.status}`);
  }

  const data: CityDTO[] = await res.json();
  return data ?? [];
};

export const fetchWeatherByCoords = async (coords: CityCoords): Promise<WeatherDTO> => {
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`
  );

  if (!res.ok) {
    throw new Error(`HTTP Error! status: ${res.status}`);
  }

  const data: WeatherDTO = await res.json();
  return data;
};
