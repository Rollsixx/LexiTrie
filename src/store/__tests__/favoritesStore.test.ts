/**
 * favoritesStore.test.ts - Unit Tests for Favorites Store
 * 
 * Tests favorites management with AsyncStorage persistence
 */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavoritesStore } from '../favoritesStore';

describe('FavoritesStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useFavoritesStore.setState({
      favorites: [],
      isLoading: false,
      isLoaded: false,
      error: null,
    });
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('addFavorite', () => {
    test('should add word to favorites', async () => {
      const { addFavorite } = useFavoritesStore.getState();
      
      await addFavorite('hello');
      
      expect(useFavoritesStore.getState().favorites).toContain('hello');
    });

    test('should not add duplicate favorites', async () => {
      const { addFavorite } = useFavoritesStore.getState();
      
      await addFavorite('hello');
      await addFavorite('hello');
      
      const favorites = useFavoritesStore.getState().favorites;
      expect(favorites.filter(f => f === 'hello').length).toBe(1);
    });

    test('should save to AsyncStorage', async () => {
      const { addFavorite } = useFavoritesStore.getState();
      
      await addFavorite('hello');
      
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    test('should normalize to lowercase', async () => {
      const { addFavorite } = useFavoritesStore.getState();
      
      await addFavorite('HELLO');
      
      expect(useFavoritesStore.getState().favorites).toContain('hello');
    });
  });

  describe('removeFavorite', () => {
    test('should remove word from favorites', async () => {
      // First add a favorite
      await useFavoritesStore.getState().addFavorite('hello');
      
      // Then remove it
      await useFavoritesStore.getState().removeFavorite('hello');
      
      expect(useFavoritesStore.getState().favorites).not.toContain('hello');
    });

    test('should save to AsyncStorage after removal', async () => {
      await useFavoritesStore.getState().addFavorite('hello');
      await useFavoritesStore.getState().removeFavorite('hello');
      
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('toggleFavorite', () => {
    test('should add if not present', async () => {
      const { toggleFavorite } = useFavoritesStore.getState();
      
      await toggleFavorite('hello');
      
      expect(useFavoritesStore.getState().favorites).toContain('hello');
    });

    test('should remove if present', async () => {
      const { toggleFavorite } = useFavoritesStore.getState();
      
      await toggleFavorite('hello');
      await toggleFavorite('hello');
      
      expect(useFavoritesStore.getState().favorites).not.toContain('hello');
    });
  });

  describe('isFavorite', () => {
    test('should return true for favorited word', async () => {
      await useFavoritesStore.getState().addFavorite('hello');
      
      const result = useFavoritesStore.getState().isFavorite('hello');
      
      expect(result).toBe(true);
    });

    test('should return false for non-favorited word', () => {
      const result = useFavoritesStore.getState().isFavorite('hello');
      
      expect(result).toBe(false);
    });
  });

  describe('loadFromStorage', () => {
    test('should load favorites from AsyncStorage', async () => {
      // Mock stored data
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(['hello', 'world'])
      );
      
      await useFavoritesStore.getState().loadFromStorage();
      
      const favorites = useFavoritesStore.getState().favorites;
      expect(favorites).toContain('hello');
      expect(favorites).toContain('world');
    });

    test('should handle empty storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      
      await useFavoritesStore.getState().loadFromStorage();
      
      expect(useFavoritesStore.getState().favorites).toEqual([]);
    });
  });

  describe('clearFavorites', () => {
    test('should clear all favorites', async () => {
      await useFavoritesStore.getState().addFavorite('hello');
      await useFavoritesStore.getState().addFavorite('world');
      
      await useFavoritesStore.getState().clearFavorites();
      
      expect(useFavoritesStore.getState().favorites).toEqual([]);
    });
  });
});