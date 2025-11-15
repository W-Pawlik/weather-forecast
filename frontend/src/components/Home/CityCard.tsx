import { Card, Grid, Stack, Typography, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SunnyIcon from '@mui/icons-material/Sunny';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CityCardSkeleton from './CityCardSkeleton';

import { fetchCoordsByName, fetchWeatherByCoords } from '@/services/weatherApi';
import type { WeatherDTO, CityDTO } from '@/types/weatherApi';

interface CityCardProps {
  cityName: string;
}

export default function CityCard({ cityName }: CityCardProps) {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setIsLoading(true);

        const coordsList: CityDTO[] = await fetchCoordsByName(cityName);

        if (!coordsList.length) {
          console.warn('Brak współrzędnych dla miasta:', cityName);
          return;
        }

        const coords = coordsList[0];
        const weatherData = await fetchWeatherByCoords(coords);

        console.log(`${cityName} weather data:`, weatherData);
        setWeather(weatherData);
      } catch (error) {
        console.error('Błąd podczas pobierania pogody:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeather();
  }, [cityName]);

  const handleClick = () => {
    navigate(`/${encodeURIComponent(cityName)}`);
  };

  if (isLoading) {
    return <CityCardSkeleton cityName={cityName} onClick={handleClick} />;
  }

  if (!weather) {
    return (
      <Stack sx={{ p: 2, alignItems: 'center' }}>
        <Typography>Error loading weather data for {cityName}.</Typography>
      </Stack>
    );
  }

  const iconCode = weather.weather[0]?.icon;
  const description = weather.weather[0]?.description;
  const temperature = weather.main.temp;

  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;

  return (
    <Card sx={{ p: 2, cursor: 'pointer' }} onClick={handleClick}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <LocationOnIcon />
          <Typography>{cityName}</Typography>
        </Stack>
        <FavoriteIcon />
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
            {temperature !== undefined ? `${Math.round(temperature)}°C` : '...'}
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
            <Typography>{`${weather.main.humidity}%`}</Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography>Wind:</Typography>
            <Typography>{`${Math.round(weather.wind.speed * 3.6)} km/h`}</Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography>Rain (1h):</Typography>
            <Typography>
              {weather.rain?.['1h'] !== undefined ? `${weather.rain['1h']} mm` : '—'}
            </Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography>Cloudiness:</Typography>
            <Typography>{`${weather.clouds.all}%`}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
