import type React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';

type NavItem = {
  to: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
};

export const navItems: NavItem[] = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/map', label: 'Map', icon: MapIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];
