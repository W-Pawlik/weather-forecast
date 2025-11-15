import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

if (!('fetch' in globalThis)) {
  // @ts-ignore
  globalThis.fetch = vi.fn();
}
