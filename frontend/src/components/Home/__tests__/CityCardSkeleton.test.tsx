import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import CityCardSkeleton from '../CityCardSkeleton';

describe('CityCardSkeleton', () => {
  it('renders city name and basic skeleton layout', () => {
    render(<CityCardSkeleton cityName="Warsaw" />);

    expect(screen.getByText('Warsaw')).toBeInTheDocument();
    expect(screen.getByText(/Humidity:/i)).toBeInTheDocument();
    expect(screen.getByText(/Wind:/i)).toBeInTheDocument();
    expect(screen.getByText(/Rain \(1h\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Cloudiness:/i)).toBeInTheDocument();
  });
});
