import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';

import { useCityWeather } from '@/hooks/userCityWeather';
import { useCityForecast } from '@/hooks/useCityForecast';
import { buildDailyForecast } from '@/utils/forecast';
import { degToCompass } from '@/utils/wind';
import WeatherLayer, { type WeatherLayerType } from '@/components/Map/WeatherLayer';
import MapCityMarkers from '@/components/Map/MapCityMarkers';
import MapDetailsPanel from '@/components/Map/MapDetailsPanel';
import LayerControlPanel from '@/components/Map/LayerControlPanel';
import Temperature from '@/components/common/Temperature';
import { useCoordsWeather } from '@/hooks/useCoordsWeather';

const PANEL_WIDTH = 360;

const DEFAULT_CENTER: [number, number] = [52.2297, 21.0122];
const DEFAULT_ZOOM = 5;
const USER_LOCATION_ZOOM = 10;

interface MapBackgroundClickHandlerProps {
  onBackgroundClick: () => void;
}

function MapBackgroundClickHandler({ onBackgroundClick }: MapBackgroundClickHandlerProps) {
  useMapEvents({
    click() {
      onBackgroundClick();
    },
  });
  return null;
}

interface MapViewUpdaterProps {
  center: [number, number];
  zoom: number;
}

function MapViewUpdater({ center, zoom }: MapViewUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export default function Map() {
  const [activeLayer, setActiveLayer] = useState<WeatherLayerType>('none');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const location: [number, number] = [latitude, longitude];
        setUserLocation(location);
        setMapCenter(location);
        setMapZoom(USER_LOCATION_ZOOM);
      },
      (error) => {
        console.warn('Geolocation error or permission denied', error);
        setUserLocation(null);
        setMapCenter(DEFAULT_CENTER);
        setMapZoom(DEFAULT_ZOOM);
      }
    );
  }, []);

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

  const {
    data: userWeather,
    isLoading: userWeatherLoading,
    isError: userWeatherIsError,
  } = useCoordsWeather(userLocation?.[0], userLocation?.[1]);

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
    <Box sx={{ flex: 1, display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      <Box sx={{ flex: 1, position: 'relative' }}>
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ width: '100%', height: '100%' }}>
          <MapViewUpdater center={mapCenter} zoom={mapZoom} />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <WeatherLayer activeLayer={activeLayer} />

          <MapBackgroundClickHandler onBackgroundClick={() => setSelectedCity(null)} />

          {userLocation && (
            <CircleMarker
              center={userLocation}
              radius={6}
              pathOptions={{
                color: '#1976d2',
                fillColor: '#1976d2',
                fillOpacity: 0.9,
              }}
              eventHandlers={{
                click: (e: any) => {
                  if (e?.originalEvent?.stopPropagation) {
                    e.originalEvent.stopPropagation();
                  }
                },
              }}
            >
              {userWeather && !userWeatherLoading && !userWeatherIsError && (
                <Popup>
                  <Box sx={{ minWidth: 160 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Your location
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      {userWeather.weather[0]?.icon && (
                        <Box
                          component="img"
                          src={`https://openweathermap.org/img/wn/${userWeather.weather[0].icon}.png`}
                          alt={userWeather.weather[0].description || 'Weather icon'}
                          sx={{ width: 32, height: 32 }}
                        />
                      )}
                      <Stack spacing={0.25}>
                        <Typography variant="body1">
                          <Temperature valueC={userWeather.main.temp} />
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ textTransform: 'capitalize' }}
                          color="text.secondary"
                        >
                          {userWeather.weather[0]?.description ?? ''}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography variant="caption" display="block">
                      Humidity: {userWeather.main.humidity}%
                    </Typography>
                    <Typography variant="caption" display="block">
                      Wind:{' '}
                      {`${Math.round(userWeather.wind.speed * 3.6)} km/h${
                        userWeather.wind.deg != null
                          ? ` (${degToCompass(userWeather.wind.deg)})`
                          : ''
                      }`}
                    </Typography>
                  </Box>
                </Popup>
              )}
            </CircleMarker>
          )}

          <MapCityMarkers onSelectCity={setSelectedCity} />
        </MapContainer>

        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
            width: PANEL_WIDTH,
          }}
        >
          <LayerControlPanel
            activeLayer={activeLayer}
            onChangeLayer={setActiveLayer}
            width={PANEL_WIDTH}
          />

          {selectedCity && (
            <Box sx={{ mt: 1 }}>
              <MapDetailsPanel
                cityName={selectedCity}
                weather={weather ?? null}
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
                onClose={() => setSelectedCity(null)}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
