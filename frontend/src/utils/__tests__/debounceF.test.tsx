import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { useDebounced } from '../debounceF';

afterEach(() => {
  vi.useRealTimers();
});

function TestComponent({ value, delay }: { value: string; delay: number }) {
  const debounced = useDebounced(value, delay);
  return <div data-testid="debounced">{debounced}</div>;
}

describe('useDebounced', () => {
  it('returns initial value immediately', () => {
    vi.useFakeTimers();

    const { getByTestId } = render(<TestComponent value="hello" delay={200} />);

    expect(getByTestId('debounced').textContent).toBe('hello');
  });

  it('updates value only after delay', () => {
    vi.useFakeTimers();

    const { getByTestId, rerender } = render(<TestComponent value="first" delay={200} />);

    expect(getByTestId('debounced').textContent).toBe('first');

    rerender(<TestComponent value="second" delay={200} />);

    expect(getByTestId('debounced').textContent).toBe('first');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(getByTestId('debounced').textContent).toBe('second');
  });

  it('debounces multiple rapid changes and keeps only the last one', () => {
    vi.useFakeTimers();

    const { getByTestId, rerender } = render(<TestComponent value="a" delay={200} />);

    expect(getByTestId('debounced').textContent).toBe('a');

    rerender(<TestComponent value="b" delay={200} />);
    rerender(<TestComponent value="c" delay={200} />);

    expect(getByTestId('debounced').textContent).toBe('a');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(getByTestId('debounced').textContent).toBe('c');
  });
});
