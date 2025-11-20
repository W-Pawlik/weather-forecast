import { Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { AppDispatch } from '@/redux/store';
import { toggleTempratureUnit, toggleTheme } from '@/redux/slices/settingsSlice';
import { selectTempratureUnit, selectTheme } from '@/redux/selectors/settingsSelectors';

export default function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector(selectTheme);
  const tempUnit = useSelector(selectTempratureUnit);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleToggleTempUnits = () => {
    dispatch(toggleTempratureUnit());
  };

  const tempUnitLabel =
    tempUnit === 'celsius' ? 'Celsius' : tempUnit === 'fahrenheit' ? 'Fahrenheit' : 'Kelvin';

  const tempUnitSymbol = tempUnit === 'celsius' ? '°C' : tempUnit === 'fahrenheit' ? '°F' : 'K';

  return (
    <Stack sx={{ px: 2, py: 4 }}>
      <Typography variant="h2" gutterBottom>
        Settings of WeathAi
      </Typography>
      <Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h3" sx={{ fontSize: '2rem' }}>
          Theme mode
        </Typography>

        <Typography>
          Choose between light and dark theme modes for the application interface.
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>
            Current Theme: <strong>{theme === 'light' ? 'Light' : 'Dark'}</strong>
          </Typography>

          <Tooltip title="Toggle Theme">
            <IconButton onClick={handleToggleTheme}>
              {theme === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h3" sx={{ fontSize: '2rem' }}>
          Temperature Units
        </Typography>

        <Typography>
          Choose between Celsius, Fahrenheit and Kelvin for temperature display.
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>
            Current Temperature Unit: <strong>{tempUnitLabel}</strong>
          </Typography>

          <Tooltip title="Toggle temperature unit">
            <IconButton onClick={handleToggleTempUnits}>{tempUnitSymbol}</IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  );
}
