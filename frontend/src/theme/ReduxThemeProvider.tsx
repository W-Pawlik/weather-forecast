import { ReactNode, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { selectTheme } from '@/redux/selectors/settingsSelectors';
import { buildMainTheme } from '@/theme/mainTheme';

type Props = {
  children: ReactNode;
};

export function ReduxThemeProvider({ children }: Props) {
  const mode = useSelector(selectTheme);

  const theme = useMemo(() => buildMainTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
