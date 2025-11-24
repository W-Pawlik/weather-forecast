import { Skeleton, Stack } from '@mui/material';

export default function MapCurrentWeatherSummarySkeleton() {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Skeleton variant="circular" width={56} height={56} />
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Skeleton variant="text" width={80} height={28} />
          <Skeleton variant="text" width={160} />
          <Skeleton variant="text" width={140} />
        </Stack>
      </Stack>

      <Stack spacing={0.5}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="75%" />
        <Skeleton variant="text" width="90%" />
      </Stack>
    </Stack>
  );
}
