import { Box, Stack, Typography } from '@mui/material';

import MapForecastSummarySkeleton from './MapForecastSummarySkeleton';

import Temperature from '@/components/common/Temperature';
import type { DailyForecast } from '@/utils/forecast';

interface MapForecastSummaryProps {
  dailyForecast: DailyForecast[];
  isLoading: boolean;
  isError: boolean;
}

export default function MapForecastSummary({
  dailyForecast,
  isLoading,
  isError,
}: MapForecastSummaryProps) {
  if (isLoading) {
    return <MapForecastSummarySkeleton />;
  }

  if (isError) {
    return <Typography>Failed to load forecast.</Typography>;
  }

  if (dailyForecast.length === 0) {
    return <Typography>No forecast available.</Typography>;
  }

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">5-day forecast</Typography>
      <Stack spacing={0.75}>
        {dailyForecast.map((day) => (
          <Stack
            key={day.date}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              p: 0.75,
              borderRadius: 2,
              bgcolor: 'action.hover',
            }}
          >
            {day.icon && (
              <Box
                component="img"
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.description}
                sx={{ width: 28, height: 28 }}
              />
            )}
            <Stack sx={{ flex: 1 }} spacing={0.25}>
              <Typography variant="body2">{day.dayLabel}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(day.date).toLocaleDateString('en-GB', {
                  month: '2-digit',
                  day: '2-digit',
                })}
              </Typography>
            </Stack>
            <Stack spacing={0.25} alignItems="flex-end">
              <Typography variant="body2">
                <Temperature valueC={day.maxTemp} />{' '}
                <Typography component="span" variant="caption" color="text.secondary">
                  / <Temperature valueC={day.minTemp} />
                </Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                POP {day.popPercent}%
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
