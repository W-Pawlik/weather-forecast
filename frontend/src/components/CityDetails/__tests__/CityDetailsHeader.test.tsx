import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import CityDetailsHeader from '../CityDetailsHeader';

describe('CityDetailsHeader', () => {
  it('renders Back label and buttons', () => {
    render(<CityDetailsHeader onBack={() => {}} isFavorite={false} onToggleFavorite={() => {}} />);

    expect(screen.getByText(/Back/i)).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();

    render(<CityDetailsHeader onBack={onBack} isFavorite={false} onToggleFavorite={() => {}} />);

    const buttons = screen.getAllByRole('button');
    const backButton = buttons[0];

    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders empty heart when not favorite and calls onToggleFavorite on click', () => {
    const onToggleFavorite = vi.fn();

    render(
      <CityDetailsHeader onBack={() => {}} isFavorite={false} onToggleFavorite={onToggleFavorite} />
    );

    expect(screen.getByTestId('FavoriteBorderIcon')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    const heartButton = buttons[1];

    fireEvent.click(heartButton);
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('renders filled heart when favorite', () => {
    render(<CityDetailsHeader onBack={() => {}} isFavorite={true} onToggleFavorite={() => {}} />);

    expect(screen.getByTestId('FavoriteIcon')).toBeInTheDocument();
  });
});
