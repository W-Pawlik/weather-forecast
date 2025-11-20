import { createTheme } from '@mui/material/styles';

import { ThemeMode } from '@/types/settings';

export const buildMainTheme = (mode: ThemeMode) =>
  createTheme({
    palette: {
      mode,
    },
  });
