import { useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';

export type WeatherLayerType = 'none' | 'temperature' | 'wind' | 'precipitation' | 'clouds';

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

function getOpenWeatherV2Op(layer: WeatherLayerType): string | null {
  switch (layer) {
    case 'temperature':
      return 'TA2';
    case 'wind':
      return 'WND';
    case 'precipitation':
      return 'PA0';
    case 'clouds':
      return 'CL';
    case 'none':
    default:
      return null;
  }
}

function getOpenWeatherV1Layer(layer: WeatherLayerType): string | null {
  switch (layer) {
    case 'temperature':
      return 'temp_new';
    case 'wind':
      return 'wind_new';
    case 'precipitation':
      return 'precipitation_new';
    case 'clouds':
      return 'clouds_new';
    case 'none':
    default:
      return null;
  }
}

interface WeatherLayerProps {
  activeLayer: WeatherLayerType;
}

export default function WeatherLayer({ activeLayer }: WeatherLayerProps) {
  const [useFallbackV1, setUseFallbackV1] = useState(false);

  useEffect(() => {
    setUseFallbackV1(false);
  }, [activeLayer]);

  if (!API_KEY || activeLayer === 'none') {
    return null;
  }

  const opV2 = getOpenWeatherV2Op(activeLayer);
  const layerV1 = getOpenWeatherV1Layer(activeLayer);

  if (!useFallbackV1 && opV2) {
    const urlV2 = `https://maps.openweathermap.org/maps/2.0/weather/${opV2}/{z}/{x}/{y}?appid=${API_KEY}&opacity=0.9`;

    return (
      <TileLayer
        key={`owm-v2-${opV2}`}
        url={urlV2}
        zIndex={500}
        opacity={0.9}
        attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
        eventHandlers={{
          tileerror: () => {
            setUseFallbackV1(true);
          },
        }}
      />
    );
  }

  if (layerV1) {
    const urlV1 = `https://tile.openweathermap.org/map/${layerV1}/{z}/{x}/{y}.png?appid=${API_KEY}`;

    return (
      <TileLayer
        key={`owm-v1-${layerV1}`}
        url={urlV1}
        opacity={1}
        zIndex={500}
        attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
      />
    );
  }

  return null;
}
