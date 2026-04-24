/**
 * favoritesStore.ts - Zustand store for favorites management
 * 
 * Manages favorite words with AsyncStorage persistence
 * 
 * Persistence Strategy:
 * - Load from AsyncStorage on app start
 * - Save to AsyncStorage on every change (using middleware)
 * - Validate data structure after loading
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@lexitrie_favorites';

/**
 * Interface for favorites state and actions
 */
interface FavoritesState {
  // State
  favorites: string[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;

  // Actions
  loadFromStorage: () => Promise<void>;
  addFavorite: (word: string) => Promise<void>;
  removeFavorite: (word: string) => Promise<void>;
  toggleFavorite: (word: string) => void;
  isFavorite: (word: string) => boolean;
  clearFavorites: () => Promise<void>;
}

/**
 * Create Zustand store for favorites
 * Includes AsyncStorage persistence
 */
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  // Initial state
  favorites: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  /**
   * Load favorites from AsyncStorage
   * Validates data structure after parsing
   */
  loadFromStorage: async () => {
    // Guard clause: prevent multiple loads
    if (get().isLoaded) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Read from AsyncStorage
      const storedValue = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedValue === null) {
        // No stored data - initialize with empty array
        set({
          favorites: [],
          isLoading: false,
          isLoaded: true,
        });
        return;
      }

      // Parse stored JSON
      // Use try/catch to handle corrupted data
      let parsedData: unknown;
      try {
        parsedData = JSON.parse(storedValue);
      } catch {
        // If parsing fails, reset to empty
        set({
          favorites: [],
          isLoading: false,
          isLoaded: true,
        });
        return;
      }

      // Validate data structure
      // Must be an array of strings
      if (!Array.isArray(parsedData)) {
        console.warn('Invalid favorites data structure, resetting');
        set({
          favorites: [],
          isLoading: false,
          isLoaded: true,
        });
        return;
      }

      // Validate each item is a string
      const validatedFavorites: string[] = [];
      for (const item of parsedData) {
        if (typeof item === 'string') {
          validatedFavorites.push(item.toLowerCase().trim());
        }
      }

      set({
        favorites: validatedFavorites,
        isLoading: false,
        isLoaded: true,
      });
    } catch (error) {
      // Handle storage errors gracefully
      set({
        isLoading: false,
        isLoaded: true,
        error: error instanceof Error ? error.message : 'Failed to load favorites',
      });
    }
  },

  /**
   * Add a word to favorites
   * Validates input and prevents duplicates
   */
  addFavorite: async (word: string) => {
    // Sanitize input
    const sanitizedWord = String(word).toLowerCase().trim();

    // Guard clause: validate word
    if (!sanitizedWord) {
      return;
    }

    const { favorites } = get();

    // Guard clause: prevent duplicates
    if (favorites.includes(sanitizedWord)) {
      return;
    }

    // Add to favorites
    const newFavorites = [...favorites, sanitizedWord];
    set({ favorites: newFavorites });

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  },

  /**
   * Remove a word from favorites
   */
  removeFavorite: async (word: string) => {
    // Sanitize input
    const sanitizedWord = String(word).toLowerCase().trim();

    const { favorites } = get();

    // Filter out the word
    const newFavorites = favorites.filter(f => f !== sanitizedWord);

    // Only update if actually changed
    if (newFavorites.length === favorites.length) {
      return;
    }

    set({ favorites: newFavorites });

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  },

  /**
   * Toggle favorite status
   * Adds if not present, removes if present
   */
  toggleFavorite: (word: string) => {
    const sanitizedWord = String(word).toLowerCase().trim();
    
    if (!sanitizedWord) {
      return;
    }

    const { favorites } = get();

    let newFavorites: string[];
    
    if (favorites.includes(sanitizedWord)) {
      // Remove
      newFavorites = favorites.filter(f => f !== sanitizedWord);
    } else {
      // Add
      newFavorites = [...favorites, sanitizedWord];
    }

    // Update state immediately
    set({ favorites: newFavorites });

    // Save to AsyncStorage (fire and forget)
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites)).catch(
      err => console.error('Failed to save favorites:', err)
    );
  },

  /**
   * Check if a word is in favorites
   */
  isFavorite: (word: string) => {
    const sanitizedWord = String(word).toLowerCase().trim();
    return get().favorites.includes(sanitizedWord);
  },

  /**
   * Clear all favorites
   */
  clearFavorites: async () => {
    set({ favorites: [] });

    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear favorites:', error);
    }
  },
}));

export default useFavoritesStore;
