import { describe, it, expect } from 'vitest';

import { degToCompass } from '../wind';

describe('degToCompass', () => {
  it('returns correct cardinal directions for typical angles', () => {
    expect(degToCompass(0)).toBe('N');
    expect(degToCompass(20)).toBe('N');
    expect(degToCompass(45)).toBe('NE');
    expect(degToCompass(90)).toBe('E');
    expect(degToCompass(135)).toBe('SE');
    expect(degToCompass(180)).toBe('S');
    expect(degToCompass(225)).toBe('SW');
    expect(degToCompass(270)).toBe('W');
    expect(degToCompass(315)).toBe('NW');
    expect(degToCompass(360)).toBe('N');
  });

  it('wraps correctly for angles above 360', () => {
    expect(degToCompass(405)).toBe('NE');
    expect(degToCompass(720)).toBe('N');
  });
});
