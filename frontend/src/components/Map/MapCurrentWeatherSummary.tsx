import { Box, Stack, Typography } from '@mui/material';

import Temperature from '@/components/common/Temperature';
import type { WeatherDTO } from '@/types/weatherApi';

interface MapCurrentWeatherSummaryProps {
  cityName: string;
  weather: WeatherDTO | null | undefined;
  isLoading: boolean;
  isError: boolean;
  windSpeedKmH: number | null;
  windDir: string | null;
  precipType: string;
  precipAmount: number;
  popPercent: number;
}

export default function MapCurrentWeatherSummary({
  cityName,
  weather,
  isLoading,
  isError,
  windSpeedKmH,
  windDir,
  precipType,
  precipAmount,
  popPercent,
}: MapCurrentWeatherSummaryProps) {
  if (isLoading) {
    return <Typography>Loading weather data for {cityName}...</Typography>;
  }

  if (isError || !weather) {
    return <Typography>Failed to load weather data for {cityName}.</Typography>;
  }

  const iconCode = weather.weather[0]?.icon;
  const description = weather.weather[0]?.description ?? '';
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        {iconUrl && (
          <Box
            component="img"
            src={iconUrl}
            alt={description || 'Weather icon'}
            sx={{ width: 56, height: 56 }}
          />
        )}
        <Stack spacing={0.5}>
          <Typography variant="h5">
            <Temperature valueC={weather.main.temp} />
          </Typography>
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Feels like: <Temperature valueC={weather.main.feels_like} />
          </Typography>
        </Stack>
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="body2">
          Humidity: <strong>{weather.main.humidity}%</strong>
        </Typography>
        <Typography variant="body2">
          Wind:{' '}
          <strong>
            {windSpeedKmH !== null ? `${windSpeedKmH} km/h` : '—'}
            {windDir ? ` (${windDir})` : ''}
          </strong>
        </Typography>
        <Typography variant="body2">
          Precipitation:{' '}
          <strong>
            {precipType}
            {precipAmount ? ` • ${precipAmount} mm / 3h` : ' • 0 mm'}
            {` • ${popPercent}%`}
          </strong>
        </Typography>
      </Stack>
    </Stack>
  );
}
