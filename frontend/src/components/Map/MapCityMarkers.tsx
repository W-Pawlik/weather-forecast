import { useEffect, useMemo, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import type { LatLngBounds } from 'leaflet';
import { useSelector } from 'react-redux';

import mapCities, { MapCity } from '@/types/mapCities';
import { useMapCitiesWeather } from '@/hooks/useMapCitiesWeather';
import { selectTempratureUnit } from '@/redux/selectors/settingsSelectors';
import { convertTemperature } from '@/utils/temperature';
import CityWeatherMarker from './CityMarker';

interface MapCityMarkersProps {
  onSelectCity: (cityName: string) => void;
}

function getMinPopulationForZoom(zoom: number): number {
  if (zoom < 4) return 3_000_000;
  if (zoom < 5) return 1_500_000;
  if (zoom < 6) return 800_000;
  if (zoom < 7) return 300_000;
  if (zoom < 8) return 100_000;
  if (zoom < 10) return 20_000;
  return 5_000;
}

function getMaxCitiesForZoom(zoom: number): number {
  if (zoom < 4) return 30;
  if (zoom < 5) return 50;
  if (zoom < 6) return 80;
  if (zoom < 7) return 120;
  if (zoom < 8) return 180;
  if (zoom < 10) return 250;
  return 300;
}

export default function MapCityMarkers({ onSelectCity }: MapCityMarkersProps) {
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);

  const map = useMapEvents({
    moveend() {
      setBounds(map.getBounds());
      setZoom(map.getZoom());
    },
    zoomend() {
      setBounds(map.getBounds());
      setZoom(map.getZoom());
    },
  });

  useEffect(() => {
    setBounds(map.getBounds());
    setZoom(map.getZoom());
  }, [map]);

  const visibleCities = useMemo(() => {
    if (!bounds || zoom == null) return [] as MapCity[];

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const minPop = getMinPopulationForZoom(zoom);
    const maxCities = getMaxCitiesForZoom(zoom);

    const filtered = mapCities.filter((city) => {
      const lat = city.coord.lat;
      const lon = city.coord.lon;

      if (lat < sw.lat || lat > ne.lat || lon < sw.lng || lon > ne.lng) return false;

      const population = city.stat?.population ?? 0;
      return population >= minPop;
    });

    filtered.sort((a, b) => {
      const popA = a.stat?.population ?? 0;
      const popB = b.stat?.population ?? 0;
      return popB - popA;
    });

    return filtered.slice(0, maxCities);
  }, [bounds, zoom]);

  const { weatherById } = useMapCitiesWeather(visibleCities);
  const tempUnit = useSelector(selectTempratureUnit);

  const markersData = useMemo(
    () =>
      visibleCities.map((city) => {
        const weather = weatherById.get(city.id);
        const tempC = weather?.main.temp ?? null;

        let tempLabel = '';
        if (tempC !== null) {
          const numericValue = convertTemperature(tempC, tempUnit);
          const suffix = tempUnit === 'celsius' ? '°C' : tempUnit === 'fahrenheit' ? '°F' : 'K';
          tempLabel = `${Math.round(numericValue)}${suffix}`;
        }

        const iconCode = weather?.weather[0]?.icon;
        const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}.png` : null;

        return { city, tempLabel, iconUrl };
      }),
    [visibleCities, weatherById, tempUnit]
  );

  return (
    <>
      {markersData.map(({ city, tempLabel, iconUrl }) => (
        <CityWeatherMarker
          key={city.id}
          city={city}
          tempLabel={tempLabel}
          iconUrl={iconUrl}
          onSelectCity={onSelectCity}
        />
      ))}
    </>
  );
}
