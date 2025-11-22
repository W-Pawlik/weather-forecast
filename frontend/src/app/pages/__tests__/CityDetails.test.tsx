import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';

import CityDetails from '../CityDetails';

import { useCityWeather } from '@/hooks/userCityWeather';
import { useCityForecast } from '@/hooks/useCityForecast';
import { toggleFavoriteCity } from '@/redux/slices/favCitiesSlice';

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

vi.mock('@/hooks/userCityWeather', () => ({
  useCityWeather: vi.fn(),
}));

vi.mock('@/hooks/useCityForecast', () => ({
  useCityForecast: vi.fn(),
}));

vi.mock('@/utils/forecast', () => ({
  buildDailyForecast: vi.fn(() => [
    {
      date: '2024-01-01',
      dayLabel: 'Mon',
      minTemp: 1,
      maxTemp: 5,
      icon: null,
      description: '',
      popPercent: 10,
    },
    {
      date: '2024-01-02',
      dayLabel: 'Tue',
      minTemp: 0,
      maxTemp: 4,
      icon: null,
      description: '',
      popPercent: 20,
    },
  ]),
}));

vi.mock('@/components/CityDetails/CurrentWeatherCard', () => ({
  __esModule: true,
  default: ({ weather, isLoading, isError }: any) => (
    <div data-testid="current-card">
      {isLoading ? 'loading' : isError ? 'error' : weather?.name || 'no-weather'}
    </div>
  ),
}));

vi.mock('@/components/CityDetails/ForecastCard', () => ({
  __esModule: true,
  default: ({ dailyForecast, isLoading, isError }: any) => (
    <div data-testid="forecast-card">
      {isLoading ? 'loading-forecast' : isError ? 'error-forecast' : `days:${dailyForecast.length}`}
    </div>
  ),
}));

const useSelectorMock = useSelector as unknown as Mock;
const useDispatchMock = useDispatch as unknown as Mock;
const useCityWeatherMock = useCityWeather as unknown as Mock;
const useCityForecastMock = useCityForecast as unknown as Mock;

describe('CityDetails page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders message when there is no city name in the address', () => {
    mockUseParams.mockReturnValue({});
    useSelectorMock.mockReturnValue(false);

    useDispatchMock.mockReturnValue(vi.fn());
    useCityWeatherMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    useCityForecastMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });

    render(<CityDetails />);

    expect(screen.getByText(/No city name in the address/i)).toBeInTheDocument();
  });

  it('renders header and weather / forecast cards for a valid city', () => {
    mockUseParams.mockReturnValue({ cityName: 'Warsaw' });
    useSelectorMock.mockReturnValue(false);

    const dispatchMock = vi.fn();
    useDispatchMock.mockReturnValue(dispatchMock);

    useCityWeatherMock.mockReturnValue({
      data: {
        name: 'Warsaw',
        sys: { country: 'PL' },
        wind: { speed: 5, deg: 90 },
      } as any,
      isLoading: false,
      isError: false,
    });

    useCityForecastMock.mockReturnValue({
      data: {
        list: [
          {
            pop: 0.7,
            rain: { '3h': 1.2 },
            snow: undefined,
          },
        ],
      } as any,
      isLoading: false,
      isError: false,
    });

    render(<CityDetails />);

    expect(screen.getByTestId('current-card')).toHaveTextContent('Warsaw');

    expect(screen.getByTestId('forecast-card')).toHaveTextContent('days:2');
  });

  it('navigates back when the back button is clicked', () => {
    mockUseParams.mockReturnValue({ cityName: 'Warsaw' });
    useSelectorMock.mockReturnValue(false);
    useDispatchMock.mockReturnValue(vi.fn());

    useCityWeatherMock.mockReturnValue({
      data: {
        name: 'Warsaw',
        sys: { country: 'PL' },
        wind: { speed: 5, deg: 90 },
      } as any,
      isLoading: false,
      isError: false,
    });

    useCityForecastMock.mockReturnValue({
      data: { list: [] } as any,
      isLoading: false,
      isError: false,
    });

    render(<CityDetails />);

    const buttons = screen.getAllByRole('button');
    const backButton = buttons[0];

    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('dispatches toggleFavoriteCity when favorite button is clicked', () => {
    mockUseParams.mockReturnValue({ cityName: 'Warsaw' });
    useSelectorMock.mockReturnValue(false);

    const dispatchMock = vi.fn();
    useDispatchMock.mockReturnValue(dispatchMock);

    useCityWeatherMock.mockReturnValue({
      data: {
        name: 'Warsaw',
        sys: { country: 'PL' },
        wind: { speed: 5, deg: 90 },
      } as any,
      isLoading: false,
      isError: false,
    });

    useCityForecastMock.mockReturnValue({
      data: { list: [] } as any,
      isLoading: false,
      isError: false,
    });

    render(<CityDetails />);

    const buttons = screen.getAllByRole('button');
    const favoriteButton = buttons[1];

    fireEvent.click(favoriteButton);

    expect(dispatchMock).toHaveBeenCalledWith(toggleFavoriteCity('Warsaw'));
  });
});
