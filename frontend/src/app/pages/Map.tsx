import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

import { WeatherLayer, WeatherLayerType } from '@/components/Map/WeatherLayer';
import CityMarker from '@/components/Map/CityMarker';
import MapClickHandler from '@/components/Map/MapClickHandler';
import LayerControlPanel from '@/components/Map/LayerControlPanel';
import MapDetailsPanel from '@/components/Map/MapDetailsPanel';
import { useCityWeather } from '@/hooks/userCityWeather';
import { useCityForecast } from '@/hooks/useCityForecast';
import { buildDailyForecast } from '@/utils/forecast';
import { degToCompass } from '@/utils/wind';
import { selectFavoriteCities } from '@/redux/selectors/favCitiesSelectors';

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
const PANEL_WIDTH = 380;

export default function Map() {
  const [activeLayer, setActiveLayer] = useState<WeatherLayerType>('temperature');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const favoriteCities = useSelector(selectFavoriteCities);

  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName);
  };

  const handleClosePanel = () => {
    setSelectedCity(null);
  };

  const {
    data: weather,
    isLoading: weatherLoading,
    isError: weatherIsError,
  } = useCityWeather(selectedCity ?? '');
  const {
    data: forecast,
    isLoading: forecastLoading,
    isError: forecastIsError,
  } = useCityForecast(selectedCity ?? '');

  const isWeatherError = !!selectedCity && (weatherIsError || !weather);
  const dailyForecast = forecast ? buildDailyForecast(forecast, 5) : [];
  const isForecastError = !!selectedCity && forecastIsError;

  const firstForecast = forecast?.list[0];
  const popPercent = firstForecast ? Math.round((firstForecast.pop ?? 0) * 100) : 0;
  const rainAmount = firstForecast?.rain?.['3h'] ?? 0;
  const snowAmount = firstForecast?.snow?.['3h'] ?? 0;
  const precipAmount = rainAmount || snowAmount;
  const precipType = rainAmount > 0 ? 'Rain' : snowAmount > 0 ? 'Snow' : 'No precipitation';

  const windSpeedKmH = weather ? Math.round(weather.wind.speed * 3.6) : null;
  const windDir = weather ? degToCompass(weather.wind.deg) : null;

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        minHeight: 'calc(100vh - 64px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[52.2297, 21.0122]}
          zoom={5}
          style={{ width: '100%', height: '100%' }}
        >
          <MapClickHandler onMapClick={handleClosePanel} />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <WeatherLayer activeLayer={activeLayer} apiKey={API_KEY} />

          {favoriteCities.map((city) => (
            <CityMarker key={city} cityName={city} onSelect={handleSelectCity} />
          ))}
        </MapContainer>

        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Stack spacing={1} alignItems="flex-end">
            <LayerControlPanel
              activeLayer={activeLayer}
              onChangeLayer={setActiveLayer}
              width={PANEL_WIDTH}
            />

            <AnimatePresence>
              {selectedCity && (
                <motion.div
                  key="details-panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: 'tween', duration: 0.2 }}
                >
                  <MapDetailsPanel
                    cityName={selectedCity}
                    weather={weather}
                    isWeatherLoading={weatherLoading}
                    isWeatherError={isWeatherError}
                    dailyForecast={dailyForecast}
                    isForecastLoading={forecastLoading}
                    isForecastError={isForecastError}
                    windSpeedKmH={windSpeedKmH}
                    windDir={windDir}
                    precipType={precipType}
                    precipAmount={precipAmount}
                    popPercent={popPercent}
                    width={PANEL_WIDTH}
                    onClose={handleClosePanel}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
