import { useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';

export type WeatherLayerType = 'none' | 'temperature' | 'wind' | 'precipitation' | 'clouds';

interface WeatherLayerProps {
  activeLayer: WeatherLayerType;
  apiKey?: string;
}

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

export function WeatherLayer({ activeLayer, apiKey }: WeatherLayerProps) {
  const [useFallbackV1, setUseFallbackV1] = useState(false);

  useEffect(() => {
    setUseFallbackV1(false);
  }, [activeLayer, apiKey]);

  if (!apiKey || activeLayer === 'none') {
    return null;
  }

  const opV2 = getOpenWeatherV2Op(activeLayer);
  const layerV1 = getOpenWeatherV1Layer(activeLayer);

  if (!useFallbackV1 && opV2) {
    let extraParams = '&opacity=1';

    if (activeLayer === 'wind') {
      const windPalette =
        '1:FFFFFF00;' +
        '5:EECECCFF;' +
        '15:B364BCFF;' +
        '25:3F213BFF;' +
        '50:744CACFF;' +
        '100:4600AFFF;' +
        '200:0D1126FF';

      extraParams += `&use_norm=true&arrow_step=24&fill_bound=true&palette=${encodeURIComponent(
        windPalette
      )}`;
    }

    if (activeLayer === 'temperature') {
      extraParams += '&fill_bound=true';
    }

    const urlV2 = `https://maps.openweathermap.org/maps/2.0/weather/${opV2}/{z}/{x}/{y}?appid=${apiKey}${extraParams}`;

    return (
      <TileLayer
        key={`owm-v2-${opV2}`}
        url={urlV2}
        zIndex={500}
        opacity={0.8}
        attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
        eventHandlers={{
          tileerror: () => {
            console.warn('OpenWeather Maps 2.0 failed, falling back to 1.0 tiles');
            setUseFallbackV1(true);
          },
        }}
      />
    );
  }

  if (layerV1) {
    const urlV1 = `https://tile.openweathermap.org/map/${layerV1}/{z}/{x}/{y}.png?appid=${apiKey}`;
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
