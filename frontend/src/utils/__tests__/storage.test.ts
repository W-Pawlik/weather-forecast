import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { loadFromStorage, saveToStorage } from '../storage';

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loadFromStorage returns fallback when key does not exist', () => {
    const result = loadFromStorage('missing-key', { foo: 'bar' });

    expect(result).toEqual({ foo: 'bar' });
  });

  it('loadFromStorage returns parsed value when key exists', () => {
    localStorage.setItem('settings', JSON.stringify({ theme: 'dark' }));

    const result = loadFromStorage('settings', { theme: 'light' });

    expect(result).toEqual({ theme: 'dark' });
  });

  it('loadFromStorage returns fallback and logs error for invalid JSON', () => {
    localStorage.setItem('broken', 'not-json');

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = loadFromStorage('broken', { value: 42 });

    expect(result).toEqual({ value: 42 });
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it('saveToStorage writes JSON string to localStorage', () => {
    saveToStorage('config', { lang: 'en' });

    const raw = localStorage.getItem('config');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw as string);
    expect(parsed).toEqual({ lang: 'en' });
  });

  it('saveToStorage catches errors and logs them', () => {
    const spyJson = vi.spyOn(JSON, 'stringify').mockImplementation(() => {
      throw new Error('broken json');
    });

    const spyConsole = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => saveToStorage('key', { a: 1 })).not.toThrow();
    expect(spyConsole).toHaveBeenCalled();

    spyJson.mockRestore();
    spyConsole.mockRestore();
  });
});
