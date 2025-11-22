import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import ForecastCard from '../ForecastCard';

import type { DailyForecast } from '@/utils/forecast';

vi.mock('@/components/common/Temperature', () => ({
  __esModule: true,
  default: ({ valueC }: { valueC: number }) => <span>{`${Math.round(valueC)}°C`}</span>,
}));

const sampleForecast: DailyForecast[] = [
  {
    date: '2024-01-01T12:00:00Z',
    dayLabel: 'Mon',
    minTemp: 3.4,
    maxTemp: 7.8,
    icon: '10d',
    description: 'rain',
    popPercent: 60,
  },
  {
    date: '2024-01-02T12:00:00Z',
    dayLabel: 'Tue',
    minTemp: 2,
    maxTemp: 6,
    icon: '04d',
    description: 'clouds',
    popPercent: 20,
  },
];

describe('ForecastCard', () => {
  it('shows loading message when isLoading is true', () => {
    render(<ForecastCard dailyForecast={[]} isLoading isError={false} />);

    expect(screen.getByText(/5-day forecast/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading forecast/i)).toBeInTheDocument();
  });

  it('shows error message when isError is true and not loading', () => {
    render(<ForecastCard dailyForecast={[]} isLoading={false} isError />);

    expect(screen.getByText(/Failed to load forecast/i)).toBeInTheDocument();
  });

  it('renders daily forecast cards when data is available', () => {
    render(<ForecastCard dailyForecast={sampleForecast} isLoading={false} isError={false} />);

    expect(screen.getByText(/5-day forecast/i)).toBeInTheDocument();

    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();

    expect(screen.getByText('01/01')).toBeInTheDocument();
    expect(screen.getByText('02/01')).toBeInTheDocument();

    expect(screen.getByAltText('rain')).toBeInTheDocument();
    expect(screen.getByAltText('clouds')).toBeInTheDocument();

    expect(screen.getByText('8°C')).toBeInTheDocument();
    expect(screen.getByText('3°C')).toBeInTheDocument();
    expect(screen.getByText('6°C')).toBeInTheDocument();
    expect(screen.getByText('2°C')).toBeInTheDocument();

    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('renders no day cards when dailyForecast is empty', () => {
    render(<ForecastCard dailyForecast={[]} isLoading={false} isError={false} />);

    expect(screen.getByText(/5-day forecast/i)).toBeInTheDocument();
    expect(screen.queryByText('Mon')).not.toBeInTheDocument();
  });
});
