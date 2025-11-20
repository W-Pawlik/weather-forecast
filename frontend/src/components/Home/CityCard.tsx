import { Card, Grid, Stack, Typography, Box, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SunnyIcon from '@mui/icons-material/Sunny';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import CityCardSkeleton from './CityCardSkeleton';

import { useCityWeather } from '@/hooks/userCityWeather';
import { AppDispatch } from '@/redux/store';
import { toggleFavoriteCity } from '@/redux/slices/favCitiesSlice';
import { selectIsCityFavorite } from '@/redux/selectors/favCitiesSelectors';
import Temperature from '@/components/common/Temperature';

const MotionIconButton = motion(IconButton);

interface CityCardProps {
  cityName: string;
}

export default function CityCard({ cityName }: CityCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isFavorite = useSelector(selectIsCityFavorite(cityName));

  const {
    data: weatherData,
    isLoading: weatherLoading,
    error: weatherError,
    isError,
  } = useCityWeather(cityName);

  const handleClick = () => {
    navigate(`/${encodeURIComponent(cityName)}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavoriteCity(cityName));
  };

  if (weatherLoading) {
    return <CityCardSkeleton cityName={cityName} onClick={handleClick} />;
  }

  if (!weatherData || weatherError || isError) {
    return (
      <Stack sx={{ p: 2, alignItems: 'center' }}>
        <Typography>Error loading weather data for {cityName}.</Typography>
      </Stack>
    );
  }

  const iconCode = weatherData.weather[0]?.icon;
  const description = weatherData.weather[0]?.description;
  const temperatureC = weatherData.main.temp;

  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;

  return (
    <Card sx={{ p: 2, cursor: 'pointer' }} onClick={handleClick}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <LocationOnIcon />
          <Typography>{cityName}</Typography>
        </Stack>
        <MotionIconButton
          onClick={handleToggleFavorite}
          color={isFavorite ? 'error' : 'default'}
          whileTap={{ scale: 0.8 }}
          animate={isFavorite ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </MotionIconButton>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
        {iconUrl ? (
          <Box
            component="img"
            src={iconUrl}
            alt={description || 'Weather icon'}
            sx={{ width: 64, height: 64 }}
          />
        ) : (
          <SunnyIcon />
        )}

        <Stack direction="column">
          <Typography variant="h5">
            <Temperature valueC={temperatureC} />
          </Typography>
          <Typography sx={{ textTransform: 'capitalize' }}>
            {description || 'Ładowanie pogody...'}
          </Typography>
        </Stack>
      </Stack>

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography>Humidity:</Typography>
            <Typography>{`${weatherData.main.humidity}%`}</Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography>Wind:</Typography>
            <Typography>{`${Math.round(weatherData.wind.speed * 3.6)} km/h`}</Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography>Rain (1h):</Typography>
            <Typography>
              {weatherData.rain?.['1h'] !== undefined ? `${weatherData.rain['1h']} mm` : '—'}
            </Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography>Cloudiness:</Typography>
            <Typography>{`${weatherData.clouds.all}%`}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
