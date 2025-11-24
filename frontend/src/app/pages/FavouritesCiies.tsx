import { Grid, Stack, Typography, Button, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

import CityCard from '@/components/Home/CityCard';
import { selectFavoriteCities } from '@/redux/selectors/favCitiesSelectors';

export default function FavouritesCiies() {
  const favoriteCities = useSelector(selectFavoriteCities);

  const handleGoToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.dispatchEvent(new Event('focus-city-search'));
  };

  if (favoriteCities.length === 0) {
    return (
      <Stack
        sx={{
          px: 2,
          py: 4,
          minHeight: '60vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 480,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            No favorite cities yet
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Use the search bar at the top to find a city and add it to your favorites by clicking
            the heart icon.
          </Typography>
          <Button variant="contained" startIcon={<SearchIcon />} onClick={handleGoToSearch}>
            Search for a city
          </Button>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack sx={{ px: 2, py: 4 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <AnimatePresence>
          {favoriteCities.map((cityName) => (
            <Grid key={cityName} size={{ xs: 6, sm: 4, md: 4 }}>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                <CityCard cityName={cityName} />
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Stack>
  );
}
