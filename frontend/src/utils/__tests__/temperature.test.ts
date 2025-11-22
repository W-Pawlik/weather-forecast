import { describe, it, expect } from 'vitest';

import { cToF, fToC, cToK, kToC, convertTemperature, formatTemperature } from '../temperature';

import { TempUnits } from '@/types/settings';

describe('temperature utils', () => {
  it('cToF converts Celsius to Fahrenheit', () => {
    expect(cToF(0)).toBe(32);
    expect(cToF(100)).toBe(212);
  });

  it('fToC converts Fahrenheit to Celsius', () => {
    expect(fToC(32)).toBeCloseTo(0, 5);
    expect(fToC(212)).toBeCloseTo(100, 5);
  });

  it('cToK converts Celsius to Kelvin', () => {
    expect(cToK(0)).toBeCloseTo(273.15, 5);
    expect(cToK(25)).toBeCloseTo(298.15, 5);
  });

  it('kToC converts Kelvin to Celsius', () => {
    expect(kToC(273.15)).toBeCloseTo(0, 5);
    expect(kToC(298.15)).toBeCloseTo(25, 5);
  });

  it('convertTemperature returns value in Celsius when unit is celsius', () => {
    const unit: TempUnits = 'celsius';
    expect(convertTemperature(20, unit)).toBe(20);
  });

  it('convertTemperature converts to Fahrenheit when unit is fahrenheit', () => {
    const unit: TempUnits = 'fahrenheit';
    expect(convertTemperature(0, unit)).toBe(32);
  });

  it('convertTemperature converts to Kelvin when unit is kelvin', () => {
    const unit: TempUnits = 'kelvin';
    expect(convertTemperature(0, unit)).toBeCloseTo(273.15, 5);
  });

  it('formatTemperature formats Celsius with °C', () => {
    const unit: TempUnits = 'celsius';
    expect(formatTemperature(20, unit)).toBe('20°C');
  });

  it('formatTemperature formats Fahrenheit with °F', () => {
    const unit: TempUnits = 'fahrenheit';
    expect(formatTemperature(20, unit)).toBe('68°F');
  });

  it('formatTemperature formats Kelvin with K', () => {
    const unit: TempUnits = 'kelvin';
    // 0°C = 273.15K -> zaokrąglamy do 273
    expect(formatTemperature(0, unit)).toBe('273K');
  });
});
