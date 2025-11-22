import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('@/services/openWeatherService/weatherDataService', () => ({
  weatherService: {
    fetchCoordsByName: vi.fn(),
    fetchWeatherByCoords: vi.fn(),
    fetchFiveDaysForecastByCoords: vi.fn(),
  },
}));

import { weatherService } from '@/services/openWeatherService/weatherDataService';
import { useCityWeather } from '@/hooks/userCityWeather';

const fetchCoordsByNameMock = weatherService.fetchCoordsByName as unknown as Mock;
const fetchWeatherByCoordsMock = weatherService.fetchWeatherByCoords as unknown as Mock;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useCityWeather', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls weatherService with coords and returns weather data when cityName is provided', async () => {
    const coords = { name: 'Warsaw', lat: 52.23, lon: 21.01 };
    const weatherData = {
      name: 'Warsaw',
      main: { temp: 10 },
      wind: { speed: 5, deg: 90 },
      weather: [{ id: 1, main: 'Clear', description: 'clear sky', icon: '01d' }],
      clouds: { all: 0 },
      coord: { lat: 52.23, lon: 21.01 },
      base: 'stations',
      visibility: 10000,
      rain: undefined,
      snow: undefined,
      dt: 0,
      sys: { country: 'PL', sunrise: 0, sunset: 0 },
      timezone: 0,
      id: 1,
      cod: 200,
    };

    fetchCoordsByNameMock.mockResolvedValueOnce([coords]);
    fetchWeatherByCoordsMock.mockResolvedValueOnce(weatherData);

    const { result } = renderHook(() => useCityWeather('Warsaw'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchCoordsByNameMock).toHaveBeenCalledTimes(1);
    expect(fetchCoordsByNameMock).toHaveBeenCalledWith('Warsaw');

    expect(fetchWeatherByCoordsMock).toHaveBeenCalledTimes(1);
    expect(fetchWeatherByCoordsMock).toHaveBeenCalledWith(
      expect.objectContaining({ lat: 52.23, lon: 21.01 })
    );

    expect(result.current.data).toBe(weatherData);
  });

  it('returns null and does not call fetchWeatherByCoords when no coords are found', async () => {
    fetchCoordsByNameMock.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useCityWeather('NowhereCity'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchCoordsByNameMock).toHaveBeenCalledTimes(1);
    expect(fetchWeatherByCoordsMock).not.toHaveBeenCalled();

    expect(result.current.data).toBeNull();
  });

  it('does not run query when cityName is empty (enabled === false)', () => {
    const { result } = renderHook(() => useCityWeather(''), {
      wrapper: createWrapper(),
    });

    expect(fetchCoordsByNameMock).not.toHaveBeenCalled();
    expect(fetchWeatherByCoordsMock).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });
});
