import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook to sync a React state value with a URL search parameter.
 * Handles popstate navigation automatically to ensure UI matches the URL.
 * 
 * @param {string} key - The URL query parameter key.
 * @param {string} defaultValue - Fallback value if parameter is empty or invalid.
 * @param {function} [validator] - Validation callback to confirm if a URL value is acceptable.
 * @returns {[string, function]} State and state setter.
 */
export default function useQueryState(key, defaultValue, validator) {
  const getParamValue = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const val = params.get(key);
    if (!val) return defaultValue;
    return validator ? (validator(val) ? val : defaultValue) : val;
  }, [key, defaultValue, validator]);

  const [state, setState] = useState(getParamValue);

  // Sync state changes to the URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, state);
    const search = params.toString();
    const nextUrl = `${window.location.pathname}?${search}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }, [key, state]);

  // Sync browser back/forward buttons (popstate events) back to component state
  useEffect(() => {
    const handlePopState = () => {
      setState(getParamValue());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getParamValue]);

  return [state, setState];
}
