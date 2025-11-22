import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/consts/drawerList', () => ({
  navItems: [
    {
      to: '/',
      label: 'Home',
      icon: () => <span data-testid="home-icon" />,
      end: true,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: () => <span data-testid="settings-icon" />,
      end: false,
    },
  ],
}));

import NavDrawer from '../NavDrawer';

describe('NavDrawer', () => {
  it('renders nav items from navItems config', () => {
    render(
      <MemoryRouter>
        <NavDrawer open={true} onClose={() => {}} variant="temporary" width={300} />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
  });

  it('calls onClose when clicking inside the drawer presentation area', () => {
    const onClose = vi.fn();

    render(
      <MemoryRouter>
        <NavDrawer open={true} onClose={onClose} variant="temporary" width={300} />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home');
    const presentation = homeLink.closest('[role="presentation"]') as HTMLElement | null;

    expect(presentation).not.toBeNull();

    if (presentation) {
      fireEvent.click(presentation);
    }

    expect(onClose).toHaveBeenCalled();
  });
});
