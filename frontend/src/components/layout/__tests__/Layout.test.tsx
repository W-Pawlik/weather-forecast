import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/components/layout/TopBar', () => ({
  default: ({ onMenuClick }: { onMenuClick: () => void }) => (
    <button data-testid="menu-btn" onClick={onMenuClick}>
      open menu
    </button>
  ),
}));

vi.mock('@/components/layout/NavDrawer', () => ({
  default: ({ open }: { open: boolean }) => (
    <div data-testid="nav-drawer">{open ? 'drawer-open' : 'drawer-closed'}</div>
  ),
}));

import Layout from '../Layout';

describe('Layout', () => {
  it('renders children inside main content', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div data-testid="child">Content</div>
        </Layout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('opens drawer when TopBar menu button is clicked', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );

    const drawer = screen.getByTestId('nav-drawer');
    expect(drawer).toHaveTextContent('drawer-closed');

    const menuBtn = screen.getByTestId('menu-btn');
    fireEvent.click(menuBtn);

    expect(screen.getByTestId('nav-drawer')).toHaveTextContent('drawer-open');
  });
});
