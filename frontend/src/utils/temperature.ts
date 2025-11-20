import { TempUnits } from '@/types/settings';

export const cToF = (celsius: number): number => (celsius * 9) / 5 + 32;

export const fToC = (fahrenheit: number): number => ((fahrenheit - 32) * 5) / 9;

export const cToK = (celsius: number): number => celsius + 273.15;

export const kToC = (kelvin: number): number => kelvin - 273.15;

export const convertTemperature = (valueInCelsius: number, unit: TempUnits): number => {
  if (unit === 'celsius') return valueInCelsius;
  if (unit === 'fahrenheit') return cToF(valueInCelsius);
  return cToK(valueInCelsius);
};

export const formatTemperature = (valueInCelsius: number, unit: TempUnits): string => {
  const value = convertTemperature(valueInCelsius, unit);
  const suffix = unit === 'celsius' ? '°C' : unit === 'fahrenheit' ? '°F' : 'K';
  return `${Math.round(value)}${suffix}`;
};
