import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';

import Settings from '../Settings';

import { toggleTempratureUnit, toggleTheme } from '@/redux/slices/settingsSlice';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

const useSelectorMock = useSelector as unknown as Mock;
const useDispatchMock = useDispatch as unknown as Mock;

describe('Settings page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays current theme and temperature unit from the store', () => {
    useSelectorMock.mockReturnValueOnce('light').mockReturnValueOnce('celsius');

    useDispatchMock.mockReturnValue(vi.fn());

    render(<Settings />);

    expect(screen.getByText(/Current Theme:/i)).toHaveTextContent('Light');
    expect(screen.getByText(/Current Temperature Unit:/i)).toHaveTextContent('Celsius');
    expect(screen.getByText('°C')).toBeInTheDocument();
  });

  it('dispatches toggleTheme when theme button is clicked', () => {
    const dispatchMock = vi.fn();

    useSelectorMock.mockReturnValueOnce('light').mockReturnValueOnce('celsius');

    useDispatchMock.mockReturnValue(dispatchMock);

    render(<Settings />);

    const buttons = screen.getAllByRole('button');
    const themeButton = buttons[0];

    fireEvent.click(themeButton);

    expect(dispatchMock).toHaveBeenCalledWith(toggleTheme());
  });

  it('dispatches toggleTempratureUnit when temperature unit button is clicked', () => {
    const dispatchMock = vi.fn();

    useSelectorMock.mockReturnValueOnce('light').mockReturnValueOnce('celsius');

    useDispatchMock.mockReturnValue(dispatchMock);

    render(<Settings />);

    const buttons = screen.getAllByRole('button');
    const tempButton = buttons[1];

    fireEvent.click(tempButton);

    expect(dispatchMock).toHaveBeenCalledWith(toggleTempratureUnit());
  });

  it('shows Fahrenheit label and symbol when unit is fahrenheit', () => {
    useSelectorMock.mockReturnValueOnce('dark').mockReturnValueOnce('fahrenheit');

    useDispatchMock.mockReturnValue(vi.fn());

    render(<Settings />);

    expect(screen.getByText(/Current Temperature Unit:/i)).toHaveTextContent('Fahrenheit');
    expect(screen.getByText('°F')).toBeInTheDocument();
  });
});
