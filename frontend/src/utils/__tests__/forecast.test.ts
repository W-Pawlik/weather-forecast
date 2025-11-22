import { describe, it, expect } from 'vitest';

import { buildDailyForecast } from '../forecast';

import { FiveDayForecastDTO } from '@/types/weatherApi';

const baseItem = {
  main: {
    temp: 10,
    feels_like: 9,
    temp_min: 8,
    temp_max: 11,
    pressure: 1010,
    humidity: 70,
  },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
  ],
  clouds: { all: 0 },
  wind: { speed: 3, deg: 200 },
  visibility: 10000,
  pop: 0,
  rain: undefined,
  snow: undefined,
  sys: { pod: 'd' as const },
};

function createForecast(): FiveDayForecastDTO {
  return {
    cod: '200',
    message: 0,
    cnt: 4,
    list: [
      {
        dt: 1,
        dt_txt: '2024-01-01 09:00:00',
        main: { ...baseItem.main, temp_min: 5, temp_max: 8 },
        weather: [
          {
            id: 500,
            main: 'Rain',
            description: 'morning rain',
            icon: '10d',
          },
        ],
        clouds: baseItem.clouds,
        wind: baseItem.wind,
        visibility: baseItem.visibility,
        pop: 0.3,
        rain: { '3h': 0.5 },
        snow: undefined,
        sys: { pod: 'd' },
      },
      {
        dt: 2,
        dt_txt: '2024-01-01 12:00:00',
        main: { ...baseItem.main, temp_min: 7, temp_max: 12 },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'noon clear',
            icon: '01d',
          },
        ],
        clouds: baseItem.clouds,
        wind: baseItem.wind,
        visibility: baseItem.visibility,
        pop: 0.7,
        rain: undefined,
        snow: undefined,
        sys: { pod: 'd' },
      },
      {
        dt: 3,
        dt_txt: '2024-01-02 00:00:00',
        main: { ...baseItem.main, temp_min: 2, temp_max: 6 },
        weather: [
          {
            id: 600,
            main: 'Snow',
            description: 'night snow',
            icon: '13n',
          },
        ],
        clouds: baseItem.clouds,
        wind: baseItem.wind,
        visibility: baseItem.visibility,
        pop: 0.4,
        snow: { '3h': 1 },
        rain: undefined,
        sys: { pod: 'n' },
      },
      {
        dt: 4,
        dt_txt: '2024-01-02 12:00:00',
        main: { ...baseItem.main, temp_min: 3, temp_max: 9 },
        weather: [
          {
            id: 801,
            main: 'Clouds',
            description: 'few clouds',
            icon: '02d',
          },
        ],
        clouds: baseItem.clouds,
        wind: baseItem.wind,
        visibility: baseItem.visibility,
        pop: 0.1,
        snow: undefined,
        rain: undefined,
        sys: { pod: 'd' },
      },
    ],
    city: {
      id: 1,
      name: 'Test City',
      coord: { lat: 0, lon: 0 },
      country: 'TC',
      population: 1000,
      timezone: 0,
      sunrise: 0,
      sunset: 0,
    },
  };
}

describe('buildDailyForecast', () => {
  it('groups items by date and returns one entry per day', () => {
    const forecast = createForecast();

    const result = buildDailyForecast(forecast, 5);

    expect(result).toHaveLength(2);

    const dates = result.map((d) => d.date);
    expect(dates).toEqual(['2024-01-01', '2024-01-02']);
  });

  it('computes min and max temperatures for each day', () => {
    const forecast = createForecast();

    const result = buildDailyForecast(forecast, 5);

    const day1 = result[0];
    const day2 = result[1];

    expect(day1.minTemp).toBe(5);
    expect(day1.maxTemp).toBe(12);

    expect(day2.minTemp).toBe(2);
    expect(day2.maxTemp).toBe(9);
  });

  it('picks representative item around midday (12:00:00) when available', () => {
    const forecast = createForecast();

    const result = buildDailyForecast(forecast, 5);

    const day1 = result[0];

    expect(day1.icon).toBe('01d');
    expect(day1.description).toBe('noon clear');
  });

  it('computes popPercent based on maximum pop for each day', () => {
    const forecast = createForecast();

    const result = buildDailyForecast(forecast, 5);

    const day1 = result[0];
    const day2 = result[1];

    expect(day1.popPercent).toBe(70);
    expect(day2.popPercent).toBe(40);
  });

  it('sets non-empty dayLabel', () => {
    const forecast = createForecast();

    const result = buildDailyForecast(forecast, 5);

    result.forEach((day) => {
      expect(typeof day.dayLabel).toBe('string');
      expect(day.dayLabel.length).toBeGreaterThan(0);
    });
  });
});
