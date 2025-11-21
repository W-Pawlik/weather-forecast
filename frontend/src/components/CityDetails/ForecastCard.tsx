import { Card, Grid, Paper, Stack, Typography, Box } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import Temperature from '@/components/common/Temperature';
import { DailyForecast } from '@/utils/forecast';

interface ForecastCardProps {
  dailyForecast: DailyForecast[];
  isLoading: boolean;
  isError: boolean;
}

export default function ForecastCard({ dailyForecast, isLoading, isError }: ForecastCardProps) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        5-day forecast
      </Typography>

      {isLoading && <Typography>Loading forecast...</Typography>}

      {isError && !isLoading && <Typography>Failed to load forecast.</Typography>}

      {!isLoading && !isError && dailyForecast.length > 0 && (
        <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 5 }}>
          {dailyForecast.map((day) => (
            <Grid key={day.date} size={{ xs: 1, sm: 1, md: 1 }}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  textAlign: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                  {day.dayLabel}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', mb: 1, color: 'text.secondary' }}
                >
                  {new Date(day.date).toLocaleDateString('en-GB', {
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </Typography>

                {day.icon && (
                  <Box
                    component="img"
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt={day.description}
                    sx={{ width: 48, height: 48, mb: 1 }}
                  />
                )}

                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <Temperature valueC={day.maxTemp} />{' '}
                  <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                    / <Temperature valueC={day.minTemp} />
                  </Typography>
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ mt: 0.5 }}
                >
                  <WaterDropIcon fontSize="small" />
                  <Typography variant="caption">{day.popPercent}%</Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Card>
  );
}
