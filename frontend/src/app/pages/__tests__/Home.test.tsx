import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';

import Home from '../Home';
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

vi.mock('@/components/Home/CityCard', () => ({
  __esModule: true,
  default: ({ cityName }: { cityName: string }) => <div data-testid="city-card">{cityName}</div>,
}));

const useSelectorMock = useSelector as unknown as Mock;

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when there are no favorite cities and triggers search focus on button click', () => {
    useSelectorMock.mockReturnValue([]);

    const scrollToSpy = vi.fn();
    (window as any).scrollTo = scrollToSpy;

    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    render(<Home />);

    expect(screen.getByText(/No favorite cities yet/i)).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Search for a city/i });

    fireEvent.click(button);

    expect(scrollToSpy).toHaveBeenCalled();

    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    const eventArg = dispatchEventSpy.mock.calls[0][0] as Event;
    expect(eventArg.type).toBe('focus-city-search');

    dispatchEventSpy.mockRestore();
  });

  it('renders a CityCard for each favorite city', () => {
    useSelectorMock.mockReturnValue(['Warsaw', 'Berlin']);

    render(<Home />);

    const cards = screen.getAllByTestId('city-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Warsaw');
    expect(cards[1]).toHaveTextContent('Berlin');
  });
});
