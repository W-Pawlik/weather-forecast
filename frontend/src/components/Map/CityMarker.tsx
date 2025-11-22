import { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import L, { DivIcon } from 'leaflet';

import { useCityWeather } from '@/hooks/userCityWeather';

interface CityMarkerProps {
  cityName: string;
  onSelect: (cityName: string) => void;
}

export default function CityMarker({ cityName, onSelect }: CityMarkerProps) {
  const { data: weather } = useCityWeather(cityName);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const position: [number, number] | null = weather?.coord
    ? [weather.coord.lat, weather.coord.lon]
    : null;

  const iconCode = weather?.weather[0]?.icon;
  const tempLabel = weather ? `${Math.round(weather.main.temp)}°C` : '';
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}.png` : null;

  const markerIcon: DivIcon | undefined = useMemo(() => {
    if (!position) return undefined;
    if (typeof window === 'undefined') return undefined;

    const imgHtml = iconUrl
      ? `<img src="${iconUrl}" alt="" style="width:18px;height:18px;object-fit:contain;" />`
      : '';

    return L.divIcon({
      className: 'city-weather-marker',
      html: `
        <div style="
          display:inline-flex;
          align-items:center;
          gap:4px;
          padding:2px 6px;
          border-radius:6px;
          background: rgba(25, 118, 210, 0.9);
          color:#fff;
          font-size:12px;
          box-shadow:0 1px 3px rgba(0,0,0,0.4);
        ">
          ${imgHtml}
          <span>${tempLabel}</span>
        </div>
      `,
      iconSize: [60, 30],
      iconAnchor: [30, 30],
    });
  }, [position, iconUrl, tempLabel]);

  if (!position || !markerIcon) return null;

  return (
    <Marker
      position={position}
      icon={markerIcon}
      eventHandlers={{
        click: (e: any) => {
          if (e?.originalEvent?.stopPropagation) {
            e.originalEvent.stopPropagation();
          }
          onSelect(cityName);
        },
      }}
    />
  );
}
