import { useNavigate, useParams } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { useCityWeather } from '@/hooks/userCityWeather';
import { useCityForecast } from '@/hooks/useCityForecast';
import { buildDailyForecast } from '@/utils/forecast';
import { degToCompass } from '@/utils/wind';
import { AppDispatch } from '@/redux/store';
import { selectIsCityFavorite } from '@/redux/selectors/favCitiesSelectors';
import { toggleFavoriteCity } from '@/redux/slices/favCitiesSlice';
import CityDetailsHeader from '@/components/CityDetails/CityDetailsHeader';
import CurrentWeatherCard from '@/components/CityDetails/CurrentWeatherCard';
import ForecastCard from '@/components/CityDetails/ForecastCard';

export default function CityDetails() {
  const navigate = useNavigate();
  const { cityName: cityNameParam } = useParams<{ cityName: string }>();

  const decodedCityName = cityNameParam ? decodeURIComponent(cityNameParam) : '';

  const dispatch = useDispatch<AppDispatch>();
  const isFavorite = useSelector(selectIsCityFavorite(decodedCityName));

  const {
    data: weather,
    isLoading: weatherLoading,
    isError: weatherIsError,
  } = useCityWeather(decodedCityName);

  const {
    data: forecast,
    isLoading: forecastLoading,
    isError: forecastIsError,
  } = useCityForecast(decodedCityName);

  const handleToggleFavorite = () => {
    if (!decodedCityName) return;
    dispatch(toggleFavoriteCity(decodedCityName));
  };

  if (!decodedCityName) {
    return <Typography sx={{ p: 2 }}>No city name in the address.</Typography>;
  }

  const isWeatherError = weatherIsError || !weather;
  const dailyForecast = forecast ? buildDailyForecast(forecast, 5) : [];
  const isForecastError = forecastIsError;

  const firstForecast = forecast?.list[0];
  const popPercent = firstForecast ? Math.round((firstForecast.pop ?? 0) * 100) : 0;
  const rainAmount = firstForecast?.rain?.['3h'] ?? 0;
  const snowAmount = firstForecast?.snow?.['3h'] ?? 0;
  const precipAmount = rainAmount || snowAmount;
  const precipType = rainAmount > 0 ? 'Rain' : snowAmount > 0 ? 'Snow' : 'No precipitation';

  const windSpeedKmH = weather ? Math.round(weather.wind.speed * 3.6) : null;
  const windDir = weather ? degToCompass(weather.wind.deg) : null;

  return (
    <Box sx={{ p: 2 }}>
      <CityDetailsHeader
        onBack={() => navigate(-1)}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />

      <Stack spacing={3}>
        <CurrentWeatherCard
          weather={weather ?? null}
          isLoading={weatherLoading}
          isError={isWeatherError}
          popPercent={popPercent}
          precipAmount={precipAmount}
          precipType={precipType}
          windSpeedKmH={windSpeedKmH}
          windDir={windDir}
        />

        <ForecastCard
          dailyForecast={dailyForecast}
          isLoading={forecastLoading}
          isError={isForecastError}
        />
      </Stack>
    </Box>
  );
}
