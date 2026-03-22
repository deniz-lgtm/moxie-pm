/**
 * Client-side storage utility for browser-based data persistence
 * Uses localStorage with JSON serialization
 */

export const storage = {
  /**
   * Get a value from localStorage and parse it as JSON
   * @param key The storage key
   * @returns The parsed JSON value, or null if not found
   */
  getJSON: (key: string): any => {
    if (typeof window === 'undefined') {
      // Server-side: return null
      return null;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to parse localStorage key "${key}":`, error);
      return null;
    }
  },

  /**
   * Set a value in localStorage as JSON
   * @param key The storage key
   * @param value The value to store
   */
  setJSON: (key: string, value: any): void => {
    if (typeof window === 'undefined') {
      // Server-side: no-op
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to store localStorage key "${key}":`, error);
    }
  },

  /**
   * Remove a value from localStorage
   * @param key The storage key
   */
  remove: (key: string): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove localStorage key "${key}":`, error);
    }
  },

  /**
   * Clear all storage
   */
  clear: (): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};
