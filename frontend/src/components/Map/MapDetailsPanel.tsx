import { IconButton, Paper, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import MapCurrentWeatherSummary from './MapCurrentWeatherSummary';
import MapForecastSummary from './MapForecastSummary';

import type { WeatherDTO } from '@/types/weatherApi';
import type { DailyForecast } from '@/utils/forecast';

interface MapDetailsPanelProps {
  cityName: string;
  weather: WeatherDTO | null | undefined;
  isWeatherLoading: boolean;
  isWeatherError: boolean;
  dailyForecast: DailyForecast[];
  isForecastLoading: boolean;
  isForecastError: boolean;
  windSpeedKmH: number | null;
  windDir: string | null;
  precipType: string;
  precipAmount: number;
  popPercent: number;
  width: number;
  onClose: () => void;
}

export default function MapDetailsPanel({
  cityName,
  weather,
  isWeatherLoading,
  isWeatherError,
  dailyForecast,
  isForecastLoading,
  isForecastError,
  windSpeedKmH,
  windDir,
  precipType,
  precipAmount,
  popPercent,
  width,
  onClose,
}: MapDetailsPanelProps) {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: (t) =>
          t.palette.mode === 'dark' ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.98)',
        width,
        maxHeight: '70vh',
        overflowY: 'auto',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle1">{cityName}</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Stack spacing={2}>
        <MapCurrentWeatherSummary
          cityName={cityName}
          weather={weather}
          isLoading={isWeatherLoading}
          isError={isWeatherError}
          windSpeedKmH={windSpeedKmH}
          windDir={windDir}
          precipType={precipType}
          precipAmount={precipAmount}
          popPercent={popPercent}
        />

        <MapForecastSummary
          dailyForecast={dailyForecast}
          isLoading={isForecastLoading}
          isError={isForecastError}
        />
      </Stack>
    </Paper>
  );
}
