export interface CityCoords {
  lat: number;
  lon: number;
}

export interface CityDTO {
  country: string;
  lat: CityCoords['lat'];
  lon: CityCoords['lon'];
  name: string;
  state?: string;
}

export interface WeatherConditionDTO {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherDTO {
  coord: {
    lon: number;
    lat: number;
  };

  weather: WeatherConditionDTO[];

  base: string;

  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };

  visibility: number;

  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };

  clouds: {
    all: number;
  };

  rain?: {
    '1h'?: number;
    '3h'?: number;
  };

  snow?: {
    '1h'?: number;
    '3h'?: number;
  };

  dt: number;

  sys: {
    type?: number;
    id?: number;
    message?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };

  timezone: number;
  id: number;
  name: string;
  cod: number;
}
