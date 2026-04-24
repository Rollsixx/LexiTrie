/**
 * useDebounce.ts - Debounce hook for search optimization
 * 
 * Delays value updates to prevent excessive re-renders and API calls
 * Used for search input to avoid searching on every keystroke
 * 
 * Time Complexity: O(1) - just timer management
 * Space Complexity: O(1)
 */

import { useState, useEffect } from 'react';

/**
 * Debounce a value with a specified delay
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 * 
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 300);
 * 
 * // Only updates when user stops typing for 300ms
 * useEffect(() => {
 *   searchAPI(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Create timer to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function - clears timer if value changes before delay
    // This ensures we only update after user stops typing
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
