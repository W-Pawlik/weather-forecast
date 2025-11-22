import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/components/layout/CitySearch', () => ({
  default: () => <div data-testid="city-search" />,
}));

import TopBar from '../TopBar';

describe('TopBar', () => {
  it('calls onMenuClick when menu button is clicked', () => {
    const onMenuClick = vi.fn();

    render(
      <MemoryRouter initialEntries={['/']}>
        <TopBar onMenuClick={onMenuClick} />
      </MemoryRouter>
    );

    const btn = screen.getByLabelText(/open drawer/i);
    fireEvent.click(btn);

    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('renders CitySearch on "/" route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TopBar onMenuClick={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('city-search')).toBeInTheDocument();
  });

  it('renders CitySearch on "/map" route', () => {
    render(
      <MemoryRouter initialEntries={['/map']}>
        <TopBar onMenuClick={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('city-search')).toBeInTheDocument();
  });

  it('does not render CitySearch on other routes', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <TopBar onMenuClick={() => {}} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('city-search')).not.toBeInTheDocument();
  });
});
