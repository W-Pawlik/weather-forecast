import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import CurrentWeatherCard from '../CurrentWeatherCard';

import type { WeatherDTO } from '@/types/weatherApi';

vi.mock('@/components/common/Temperature', () => ({
  __esModule: true,
  default: ({ valueC }: { valueC: number }) => <span>{`${Math.round(valueC)}°C`}</span>,
}));

const baseWeather: WeatherDTO = {
  coord: { lon: 21.01, lat: 52.23 },
  weather: [
    {
      id: 500,
      main: 'Rain',
      description: 'light rain',
      icon: '10d',
    },
  ],
  base: 'stations',
  main: {
    temp: 18.4,
    feels_like: 17.2,
    temp_min: 16,
    temp_max: 20,
    pressure: 1015,
    humidity: 62,
  },
  visibility: 10000,
  wind: {
    speed: 5,
    deg: 90,
  },
  clouds: {
    all: 40,
  },
  dt: 1234567890,
  sys: {
    country: 'PL',
    sunrise: 1234567000,
    sunset: 1234610000,
  },
  timezone: 3600,
  id: 1,
  name: 'Warsaw',
  cod: 200,
};

describe('CurrentWeatherCard', () => {
  it('shows loading message when isLoading is true', () => {
    render(
      <CurrentWeatherCard
        weather={null}
        isLoading
        isError={false}
        popPercent={0}
        precipAmount={0}
        precipType="None"
        windSpeedKmH={null}
        windDir={null}
      />
    );

    expect(screen.getByText(/Loading weather data/i)).toBeInTheDocument();
  });

  it('shows error message when isError is true and not loading', () => {
    render(
      <CurrentWeatherCard
        weather={null}
        isLoading={false}
        isError
        popPercent={0}
        precipAmount={0}
        precipType="None"
        windSpeedKmH={null}
        windDir={null}
      />
    );

    expect(screen.getByText(/Failed to load weather data/i)).toBeInTheDocument();
  });

  it('renders current weather data when loaded', () => {
    render(
      <CurrentWeatherCard
        weather={baseWeather}
        isLoading={false}
        isError={false}
        popPercent={80}
        precipAmount={2.5}
        precipType="Rain"
        windSpeedKmH={18}
        windDir="E"
      />
    );

    expect(screen.getByText(/Warsaw, PL/)).toBeInTheDocument();
    expect(screen.getByText('18°C')).toBeInTheDocument();
    expect(screen.getByText('17°C')).toBeInTheDocument();
    expect(screen.getByText(/Humidity:/i)).toBeInTheDocument();
    expect(screen.getByText(/light rain/i)).toBeInTheDocument();
    expect(screen.getByText(/Precipitation/i)).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Rain')).toBeInTheDocument();
    expect(screen.getByText('2.5 mm / 3h')).toBeInTheDocument();
    expect(screen.getByText(/Wind/i)).toBeInTheDocument();
    expect(screen.getByText('18 km/h')).toBeInTheDocument();
    expect(screen.getByText(/Direction: E/)).toBeInTheDocument();
    expect(screen.getByText('90°')).toBeInTheDocument();
    expect(screen.getByText(/Cloudiness/i)).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByText(/Pressure/i)).toBeInTheDocument();
    expect(screen.getByText('1015 hPa')).toBeInTheDocument();
  });

  it('shows placeholders for wind when windSpeedKmH and windDir are null', () => {
    render(
      <CurrentWeatherCard
        weather={baseWeather}
        isLoading={false}
        isError={false}
        popPercent={10}
        precipAmount={0}
        precipType="None"
        windSpeedKmH={null}
        windDir={null}
      />
    );

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText(/Direction: —/)).toBeInTheDocument();
  });
});
