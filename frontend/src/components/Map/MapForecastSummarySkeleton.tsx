import { Skeleton, Stack } from '@mui/material';

const PLACEHOLDER_DAYS = 5;

export default function MapForecastSummarySkeleton() {
  return (
    <Stack spacing={1.5}>
      <Skeleton variant="text" width={120} />

      <Stack spacing={0.75}>
        {Array.from({ length: PLACEHOLDER_DAYS }).map((_, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              p: 0.75,
              borderRadius: 2,
              bgcolor: 'action.hover',
            }}
          >
            <Skeleton variant="circular" width={28} height={28} />
            <Stack sx={{ flex: 1 }} spacing={0.25}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Stack>
            <Stack spacing={0.25} alignItems="flex-end">
              <Skeleton variant="text" width={60} />
              <Skeleton variant="text" width={70} />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
