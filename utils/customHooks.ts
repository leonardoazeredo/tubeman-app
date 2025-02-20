import { useEffect, useCallback, useRef } from "react";

// Define a type for the timeout ID that is compatible with clearTimeout
type TimeoutId = number | ReturnType<typeof setTimeout>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useDebounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
) {
  // Use useRef to hold the timeout id
  const timeoutIdRef = useRef<TimeoutId | null>(null);
  // Use useRef to hold the latest function.
  const latestFuncRef = useRef<T>(func);

  useEffect(() => {
    // Update the ref with the latest function.
    latestFuncRef.current = func;
  }, [func]); // Only update when the function itself changes

  // Debounced function using useCallback to memoize and prevent recreation on every render
  const debouncedFunc = useCallback<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((...args: any[]) => {
      // Clear the previous timeout if it exists and is not null
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }

      // Set a new timeout, using the latest function from the ref
      timeoutIdRef.current = setTimeout(() => {
        latestFuncRef.current(...args); // Call the function from the ref
        timeoutIdRef.current = null; // Clear timeout after execution
      }, delay); // setTimeout return type is now compatible with TimeoutId
    }) as T,
    [delay] // Only recreate debouncedFunc if delay changes
  );

  // Flush function to immediately execute any pending debounced call
  const flush = useCallback<() => void>(() => {
    // Clear timeout only if it's not null
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current); // clearTimeout should now accept TimeoutId
      latestFuncRef.current(); // Execute the function immediately
      timeoutIdRef.current = null; // Clear timeout after execution
    }
  }, []);

  // Cancel function to prevent execution of pending debounced call
  const cancel = useCallback<() => void>(() => {
    // Clear timeout only if it's not null
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current); // clearTimeout should now accept TimeoutId
      timeoutIdRef.current = null; // Clear timeout to prevent future execution
    }
  }, []);

  // Cleanup function in useEffect to clear timeout if component unmounts
  useEffect(() => {
    return () => {
      // Clear timeout only if it's not null
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current); // clearTimeout should now accept TimeoutId
      }
    };
  }, []); // Run only on unmount

  return Object.assign(debouncedFunc, { flush, cancel }); // Attach flush and cancel to the debounced function
}
