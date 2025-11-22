import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import CitySearch from '../CitySearch';

import { searchCitiesService } from '@/services/searchCitiesService/searchCitiesService';

vi.mock('@/utils/debounceF', () => ({
  useDebounced: <T,>(value: T) => value,
}));

vi.mock('@/services/searchCitiesService/searchCitiesService', () => {
  return {
    searchCitiesService: {
      searchCities: vi.fn(() => Promise.resolve([])),
    },
  };
});

describe('CitySearch', () => {
  it('renders input with placeholder', () => {
    render(
      <MemoryRouter>
        <CitySearch />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/search city/i);
    expect(input).toBeInTheDocument();
  });

  it('focuses input when "focus-city-search" event is dispatched', () => {
    render(
      <MemoryRouter>
        <CitySearch />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/search city/i);

    expect(input).not.toHaveFocus();

    window.dispatchEvent(new Event('focus-city-search'));

    expect(input).toHaveFocus();
  });

  it('calls searchCitiesService.searchCities with sanitized query', async () => {
    const searchMock = searchCitiesService.searchCities as unknown as Mock;

    render(
      <MemoryRouter>
        <CitySearch />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/search city/i) as HTMLInputElement;

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Warsaw' } });

    await waitFor(() => {
      expect(searchMock).toHaveBeenCalledTimes(1);
    });

    expect(searchMock).toHaveBeenCalledWith('Warsaw', 6, 120);
  });
});
