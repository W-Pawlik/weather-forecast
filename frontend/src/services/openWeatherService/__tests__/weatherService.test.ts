import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch as any);

async function getWeatherService() {
  const module = await import('./../weatherDataService');
  return module.weatherService;
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe('weatherService', () => {
  it('fetchCoordsByName calls geo endpoint with query and returns data', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () =>
        [
          {
            name: 'Warsaw',
            country: 'PL',
            lat: 52.23,
            lon: 21.01,
          },
        ] as any,
    } as any);

    const service = await getWeatherService();

    const result = await service.fetchCoordsByName('Warsaw');

    expect(result).toEqual([
      {
        name: 'Warsaw',
        country: 'PL',
        lat: 52.23,
        lon: 21.01,
      },
    ]);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const calledUrl = new URL(mockFetch.mock.calls[0][0]);
    const expectedKey = (import.meta as any).env.VITE_OPEN_WEATHER_API_KEY;

    expect(calledUrl.origin + calledUrl.pathname).toBe(
      'https://api.openweathermap.org/geo/1.0/direct'
    );
    expect(calledUrl.searchParams.get('q')).toBe('Warsaw');
    expect(calledUrl.searchParams.get('limit')).toBe('5');
    expect(calledUrl.searchParams.get('appid')).toBe(expectedKey);
  });

  it('fetchWeatherByCoords calls current weather endpoint with lat/lon and units=metric', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () =>
        ({
          id: 1,
          name: 'Warsaw',
          coord: { lat: 52.23, lon: 21.01 },
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
          visibility: 10000,
          wind: { speed: 3, deg: 200 },
          clouds: { all: 0 },
          dt: 0,
          sys: {
            country: 'PL',
            sunrise: 0,
            sunset: 0,
          },
          timezone: 0,
          cod: 200,
        }) as any,
    } as any);

    const service = await getWeatherService();

    const result = await service.fetchWeatherByCoords({ lat: 52.23, lon: 21.01 });

    expect(result.name).toBe('Warsaw');
    expect(result.main.temp).toBe(10);

    const calledUrl = new URL(mockFetch.mock.calls[0][0]);
    const expectedKey = (import.meta as any).env.VITE_OPEN_WEATHER_API_KEY;

    expect(calledUrl.origin + calledUrl.pathname).toBe(
      'https://api.openweathermap.org/data/2.5/weather'
    );
    expect(calledUrl.searchParams.get('lat')).toBe('52.23');
    expect(calledUrl.searchParams.get('lon')).toBe('21.01');
    expect(calledUrl.searchParams.get('units')).toBe('metric');
    expect(calledUrl.searchParams.get('appid')).toBe(expectedKey);
  });

  it('fetchFiveDaysForecastByCoords calls forecast endpoint and returns data', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () =>
        ({
          cod: '200',
          message: 0,
          cnt: 1,
          list: [
            {
              dt: 123,
              dt_txt: '2024-01-01 12:00:00',
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
                  id: 500,
                  main: 'Rain',
                  description: 'light rain',
                  icon: '10d',
                },
              ],
              clouds: { all: 40 },
              wind: { speed: 3, deg: 200 },
              visibility: 10000,
              pop: 0.5,
              rain: { '3h': 1 },
              sys: { pod: 'd' },
            },
          ],
          city: {
            id: 1,
            name: 'Warsaw',
            coord: { lat: 52.23, lon: 21.01 },
            country: 'PL',
            population: 1000000,
            timezone: 0,
            sunrise: 0,
            sunset: 0,
          },
        }) as any,
    } as any);

    const service = await getWeatherService();

    const result = await service.fetchFiveDaysForecastByCoords({ lat: 52.23, lon: 21.01 });

    expect(result.cod).toBe('200');
    expect(result.city.name).toBe('Warsaw');
    expect(result.list).toHaveLength(1);

    const calledUrl = new URL(mockFetch.mock.calls[0][0]);
    const expectedKey = (import.meta as any).env.VITE_OPEN_WEATHER_API_KEY;

    expect(calledUrl.origin + calledUrl.pathname).toBe(
      'https://api.openweathermap.org/data/2.5/forecast'
    );
    expect(calledUrl.searchParams.get('lat')).toBe('52.23');
    expect(calledUrl.searchParams.get('lon')).toBe('21.01');
    expect(calledUrl.searchParams.get('units')).toBe('metric');
    expect(calledUrl.searchParams.get('appid')).toBe(expectedKey);
  });

  it('throws when OpenWeather returns non-ok response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      json: async () => ({}),
    } as any);

    const service = await getWeatherService();

    await expect(service.fetchCoordsByName('Warsaw')).rejects.toThrowError(
      /OpenWeather request failed: 500/
    );
  });
});
