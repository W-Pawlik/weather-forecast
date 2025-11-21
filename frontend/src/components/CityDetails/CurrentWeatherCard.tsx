import { Card, Grid, Stack, Typography, Paper, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CompressIcon from '@mui/icons-material/Compress';

import Temperature from '@/components/common/Temperature';
import { WeatherDTO } from '@/types/weatherApi';

interface CurrentWeatherCardProps {
  weather: WeatherDTO | null;
  isLoading: boolean;
  isError: boolean;
  popPercent: number;
  precipAmount: number;
  precipType: string;
  windSpeedKmH: number | null;
  windDir: string | null;
}

export default function CurrentWeatherCard({
  weather,
  isLoading,
  isError,
  popPercent,
  precipAmount,
  precipType,
  windSpeedKmH,
  windDir,
}: CurrentWeatherCardProps) {
  const iconCode = weather?.weather[0]?.icon;
  const description = weather?.weather[0]?.description ?? '';
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@4x.png` : null;

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
      }}
    >
      {isLoading && <Typography>Loading weather data...</Typography>}

      {isError && !isLoading && <Typography>Failed to load weather data.</Typography>}

      {!isLoading && !isError && weather && (
        <Grid container spacing={3} columns={{ xs: 4, md: 12 }}>
          <Grid size={{ xs: 4, md: 6 }}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="h6">
                  {weather.name}
                  {weather.sys.country ? `, ${weather.sys.country}` : ''}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={3} alignItems="center">
                {iconUrl && (
                  <Box
                    component="img"
                    src={iconUrl}
                    alt={description || 'Weather icon'}
                    sx={{ width: 96, height: 96 }}
                  />
                )}
                <Stack spacing={1}>
                  <Typography variant="h2" sx={{ fontWeight: 500 }}>
                    <Temperature valueC={weather.main.temp} />
                  </Typography>
                  <Typography variant="body1">
                    Feels like: <Temperature valueC={weather.main.feels_like} />
                  </Typography>
                  <Typography variant="body1">Humidity: {weather.main.humidity}%</Typography>
                  <Typography
                    variant="body2"
                    sx={{ textTransform: 'capitalize', color: 'text.secondary' }}
                  >
                    {description}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 4, md: 6 }}>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8 }}>
              <Grid size={{ xs: 4, sm: 4 }}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    height: '100%',
                    bgcolor: 'rgba(63, 81, 181, 0.05)',
                  }}
                >
                  <Stack spacing={1} sx={{ height: '100%' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <OpacityIcon fontSize="small" />
                      <Typography variant="subtitle2">Precipitation</Typography>
                    </Stack>
                    <Typography variant="h5">{popPercent}%</Typography>
                    <Typography variant="body2">{precipType}</Typography>
                    <Typography variant="body2">
                      {precipAmount ? `${precipAmount} mm / 3h` : '0 mm'}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 4, sm: 4 }}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    height: '100%',
                    bgcolor: 'rgba(76, 175, 80, 0.05)',
                  }}
                >
                  <Stack spacing={1} sx={{ height: '100%' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AirIcon fontSize="small" />
                      <Typography variant="subtitle2">Wind</Typography>
                    </Stack>
                    <Typography variant="h5">
                      {windSpeedKmH !== null ? `${windSpeedKmH} km/h` : '—'}
                    </Typography>
                    <Typography variant="body2">Direction: {windDir ?? '—'}</Typography>
                    <Typography variant="body2">{weather.wind.deg}°</Typography>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 4, sm: 4 }}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    height: '100%',
                    bgcolor: 'rgba(186, 104, 200, 0.05)',
                  }}
                >
                  <Stack spacing={1} sx={{ height: '100%' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CloudQueueIcon fontSize="small" />
                      <Typography variant="subtitle2">Cloudiness</Typography>
                    </Stack>
                    <Typography variant="h5">{weather.clouds.all}%</Typography>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 4, sm: 4 }}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    height: '100%',
                    bgcolor: 'rgba(255, 152, 0, 0.05)',
                  }}
                >
                  <Stack spacing={1} sx={{ height: '100%' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CompressIcon fontSize="small" />
                      <Typography variant="subtitle2">Pressure</Typography>
                    </Stack>
                    <Typography variant="h5">{weather.main.pressure} hPa</Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Card>
  );
}
