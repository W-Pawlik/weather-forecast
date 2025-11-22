import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import CityCard from '../CityCard';

import { useCityWeather } from '@/hooks/userCityWeather';

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();
let mockIsFavorite = false;

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (_selector: any) => mockIsFavorite,
}));

vi.mock('@/components/common/Temperature', () => ({
  __esModule: true,
  default: ({ valueC }: { valueC: number }) => <span>{`${Math.round(valueC)}°C`}</span>,
}));

vi.mock('@/redux/slices/favCitiesSlice', () => ({
  toggleFavoriteCity: (cityName: string) => ({
    type: 'favCities/toggleFavoriteCity',
    payload: cityName,
  }),
}));

vi.mock('@/hooks/userCityWeather', () => ({
  useCityWeather: vi.fn(),
}));

const mockedUseCityWeather = useCityWeather as unknown as Mock;

describe('CityCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsFavorite = false;
  });

  it('renders skeleton while weather is loading', () => {
    mockedUseCityWeather.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      isError: false,
    });

    render(<CityCard cityName="Warsaw" />);

    expect(screen.getByText('Warsaw')).toBeInTheDocument();
    expect(screen.getByText(/Humidity:/i)).toBeInTheDocument();
  });

  it('renders error state when weather fails to load', () => {
    mockedUseCityWeather.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Boom'),
      isError: true,
    });

    render(<CityCard cityName="Berlin" />);

    expect(screen.getByText(/Error loading weather data for Berlin\./i)).toBeInTheDocument();
  });

  it('renders weather data when loaded', () => {
    const weatherData = {
      weather: [
        {
          icon: '10d',
          description: 'light rain',
        },
      ],
      main: {
        temp: 18.4,
        humidity: 62,
      },
      wind: {
        speed: 5,
      },
      rain: {
        '1h': 1.2,
      },
      clouds: {
        all: 40,
      },
    };

    mockedUseCityWeather.mockReturnValue({
      data: weatherData,
      isLoading: false,
      error: null,
      isError: false,
    });

    render(<CityCard cityName="Paris" />);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('18°C')).toBeInTheDocument();
    expect(screen.getByText(/Humidity:/i)).toBeInTheDocument();
    expect(screen.getByText('62%')).toBeInTheDocument();
    expect(screen.getByText(/Wind:/i)).toBeInTheDocument();
    expect(screen.getByText('18 km/h')).toBeInTheDocument();
    expect(screen.getByText(/Rain \(1h\):/i)).toBeInTheDocument();
    expect(screen.getByText('1.2 mm')).toBeInTheDocument();
    expect(screen.getByText(/Cloudiness:/i)).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('navigates to city details when card is clicked', () => {
    mockedUseCityWeather.mockReturnValue({
      data: {
        weather: [{ icon: '01d', description: 'clear sky' }],
        main: { temp: 20, humidity: 50 },
        wind: { speed: 3 },
        rain: {},
        clouds: { all: 0 },
      },
      isLoading: false,
      error: null,
      isError: false,
    });

    render(<CityCard cityName="Rome" />);

    fireEvent.click(screen.getByText('Rome'));

    expect(mockNavigate).toHaveBeenCalledWith('/Rome');
  });

  it('dispatches toggleFavoriteCity when heart is clicked and does not navigate', () => {
    mockedUseCityWeather.mockReturnValue({
      data: {
        weather: [{ icon: '01d', description: 'clear sky' }],
        main: { temp: 22, humidity: 55 },
        wind: { speed: 4 },
        rain: {},
        clouds: { all: 10 },
      },
      isLoading: false,
      error: null,
      isError: false,
    });

    render(<CityCard cityName="Madrid" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'favCities/toggleFavoriteCity',
      payload: 'Madrid',
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders filled heart when city is favorite', () => {
    mockedUseCityWeather.mockReturnValue({
      data: {
        weather: [{ icon: '01d', description: 'clear sky' }],
        main: { temp: 22, humidity: 55 },
        wind: { speed: 4 },
        rain: {},
        clouds: { all: 10 },
      },
      isLoading: false,
      error: null,
      isError: false,
    });

    mockIsFavorite = true;

    render(<CityCard cityName="London" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
