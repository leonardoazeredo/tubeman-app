import { useEffect, useCallback, useRef } from "react";

type TimeoutId = number | ReturnType<typeof setTimeout>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useDebounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
) {
  const timeoutIdRef = useRef<TimeoutId | null>(null);

  const latestFuncRef = useRef<T>(func);

  useEffect(() => {
    latestFuncRef.current = func;
  }, [func]);

  const debouncedFunc = useCallback<T>(
    ((...args: any[]) => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }

      timeoutIdRef.current = setTimeout(() => {
        latestFuncRef.current(...args);
        timeoutIdRef.current = null;
      }, delay);
    }) as T,
    [delay]
  );

  const flush = useCallback<() => void>(() => {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      latestFuncRef.current();
      timeoutIdRef.current = null;
    }
  }, []);

  const cancel = useCallback<() => void>(() => {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return Object.assign(debouncedFunc, { flush, cancel });
}
