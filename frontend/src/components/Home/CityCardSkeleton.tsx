import { Card, Grid, Stack, Typography, Skeleton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface CityCardSkeletonProps {
  cityName: string;
  onClick?: () => void;
}

export default function CityCardSkeleton({ cityName, onClick }: CityCardSkeletonProps) {
  return (
    <Card sx={{ p: 2, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <LocationOnIcon />
          <Typography>{cityName}</Typography>
        </Stack>
        <FavoriteIcon />
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Skeleton variant="circular" width={64} height={64} />

        <Stack direction="column" spacing={1}>
          <Skeleton variant="text" width={60} height={32} />
          <Skeleton variant="text" width={120} height={20} />
        </Stack>
      </Stack>

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography>Humidity:</Typography>
            <Skeleton variant="text" width={40} />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography>Wind:</Typography>
            <Skeleton variant="text" width={60} />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography>Rain (1h):</Typography>
            <Skeleton variant="text" width={50} />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography>Cloudiness:</Typography>
            <Skeleton variant="text" width={50} />
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
