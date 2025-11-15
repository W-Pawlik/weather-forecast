import { Grid, Stack, Typography } from '@mui/material';

import CityCard from '@/components/Home/CityCard';
import { citiesNames } from '@/consts/home';

export default function Home() {
  return (
    <Stack sx={{ px: 2, py: 4 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {citiesNames.map((cityName) => (
          <Grid key={cityName} size={{ xs: 6, sm: 4, md: 4 }}>
            <CityCard cityName={cityName} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
