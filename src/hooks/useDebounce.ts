import { useRef, useEffect } from 'react';

export function useDebounce(func: any, delay: number, cleanUp = false) {
  const timeoutRef = useRef<any>();

  function clearTimer() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }

  useEffect(() => (cleanUp ? clearTimer : undefined), [cleanUp]);

  return (...args: any): Promise<any> => {
    clearTimer();

    return new Promise((resolve) => {
      timeoutRef.current = setTimeout(() => {
        resolve(func(...args));
      }, delay);
    });
  };
}
