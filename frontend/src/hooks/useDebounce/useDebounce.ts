import { useEffect, useRef, useState } from 'react';

export function useDebounce<T>(value: T, delay?: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedValue(value),
      delay || 500,
    );
    timerRef.current = timer;

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
