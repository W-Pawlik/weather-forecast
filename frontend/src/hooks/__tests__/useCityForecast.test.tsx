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
import { useCityForecast } from '@/hooks/useCityForecast';

const fetchCoordsByNameMock = weatherService.fetchCoordsByName as unknown as Mock;
const fetchFiveDaysForecastByCoordsMock =
  weatherService.fetchFiveDaysForecastByCoords as unknown as Mock;

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

describe('useCityForecast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls weatherService with coords and returns forecast data when cityName is provided', async () => {
    const coords = { name: 'Warsaw', lat: 52.23, lon: 21.01 };
    const forecastData = {
      cod: '200',
      message: 0,
      cnt: 1,
      list: [],
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
    };

    fetchCoordsByNameMock.mockResolvedValueOnce([coords]);
    fetchFiveDaysForecastByCoordsMock.mockResolvedValueOnce(forecastData);

    const { result } = renderHook(() => useCityForecast('Warsaw'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchCoordsByNameMock).toHaveBeenCalledTimes(1);
    expect(fetchCoordsByNameMock).toHaveBeenCalledWith('Warsaw');

    expect(fetchFiveDaysForecastByCoordsMock).toHaveBeenCalledTimes(1);
    expect(fetchFiveDaysForecastByCoordsMock).toHaveBeenCalledWith(
      expect.objectContaining({ lat: 52.23, lon: 21.01 })
    );

    expect(result.current.data).toBe(forecastData);
  });

  it('returns null and does not call fetchFiveDaysForecastByCoords when no coords are found', async () => {
    fetchCoordsByNameMock.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useCityForecast('NowhereCity'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchCoordsByNameMock).toHaveBeenCalledTimes(1);
    expect(fetchFiveDaysForecastByCoordsMock).not.toHaveBeenCalled();

    expect(result.current.data).toBeNull();
  });

  it('does not run query when cityName is empty (enabled === false)', () => {
    const { result } = renderHook(() => useCityForecast(''), {
      wrapper: createWrapper(),
    });

    expect(fetchCoordsByNameMock).not.toHaveBeenCalled();
    expect(fetchFiveDaysForecastByCoordsMock).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });
});
