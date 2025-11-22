/* eslint-disable import/order */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { useSelector } from 'react-redux';

import Temperature from '../Temperature';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

const useSelectorMock = useSelector as unknown as Mock;

describe('Temperature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSelectorMock.mockReturnValue('celsius');
  });

  it('renders placeholder when valueC is undefined', () => {
    render(<Temperature valueC={undefined} />);

    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('renders custom placeholder when valueC is null', () => {
    render(<Temperature valueC={null as any} placeholder="N/A" />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders value in Celsius by default', () => {
    useSelectorMock.mockReturnValue('celsius');

    render(<Temperature valueC={10} />);

    expect(screen.getByText('10°C')).toBeInTheDocument();
  });

  it('renders value in Fahrenheit when unit is fahrenheit', () => {
    useSelectorMock.mockReturnValue('fahrenheit');

    render(<Temperature valueC={0} />);

    expect(screen.getByText('32°F')).toBeInTheDocument();
  });

  it('renders value in Kelvin when unit is kelvin', () => {
    useSelectorMock.mockReturnValue('kelvin');

    render(<Temperature valueC={0} />);

    expect(screen.getByText('273K')).toBeInTheDocument();
  });

  it('hides unit symbol when showUnit is false', () => {
    useSelectorMock.mockReturnValue('celsius');

    render(<Temperature valueC={10} showUnit={false} />);

    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
