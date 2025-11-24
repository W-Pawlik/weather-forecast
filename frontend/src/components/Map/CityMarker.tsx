import { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import L, { DivIcon } from 'leaflet';

import type { MapCity } from '@/types/mapCities';

interface CityWeatherMarkerProps {
  city: MapCity;
  tempLabel: string;
  iconUrl: string | null;
  onSelectCity: (cityName: string) => void;
}

export default function CityWeatherMarker({
  city,
  tempLabel,
  iconUrl,
  onSelectCity,
}: CityWeatherMarkerProps) {
  const position: [number, number] = [city.coord.lat, city.coord.lon];

  const markerIcon: DivIcon = useMemo(() => {
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
  }, [iconUrl, tempLabel]);

  return (
    <Marker
      position={position}
      icon={markerIcon}
      eventHandlers={{
        click: (e: any) => {
          if (e?.originalEvent?.stopPropagation) {
            e.originalEvent.stopPropagation();
          }
          onSelectCity(city.name);
        },
      }}
    />
  );
}
