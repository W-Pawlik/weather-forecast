export interface CityCoords {
  lat: number;
  lon: number;
}

export interface CityDTO extends CityCoords {
  name: string;
  country?: string;
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

export interface ForecastListItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    '3h'?: number;
  };
  snow?: {
    '3h'?: number;
  };
  sys: {
    pod: 'd' | 'n';
  };
}

export interface ForecastCity {
  id: number;
  name: string;
  coord: CityCoords;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface FiveDayForecastDTO {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastListItem[];
  city: ForecastCity;
}
