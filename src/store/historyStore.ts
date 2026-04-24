/**
 * historyStore.ts - Zustand store for search history
 * 
 * Manages recent search history (last 50 searches)
 * Does NOT persist to storage (lighter weight than favorites)
 * 
 * Design decision: Keep history in memory only
 * - Reduces storage I/O
 * - History is less important than favorites
 * - User can clear history manually
 */

import { create } from 'zustand';

const MAX_HISTORY_SIZE = 50;

interface HistoryState {
  // State
  history: string[];

  // Actions
  addToHistory: (word: string) => void;
  removeFromHistory: (word: string) => void;
  clearHistory: () => void;
}

/**
 * Create Zustand store for search history
 * 
 * Uses in-memory array with size limit
 * Newest items appear at the beginning
 */
export const useHistoryStore = create<HistoryState>((set, get) => ({
  // Initial state
  history: [],

  /**
   * Add word to search history
   * - Prevents duplicates (moves to front if exists)
   * - Enforces maximum size limit
   * 
   * @param word - The word to add to history
   */
  addToHistory: (word: string) => {
    // Sanitize input
    const sanitizedWord = String(word).toLowerCase().trim();

    // Guard clause: validate word
    if (!sanitizedWord) {
      return;
    }

    const { history } = get();

    // If word already exists, remove it (will be added to front)
    const filteredHistory = history.filter(w => w !== sanitizedWord);

    // Add to beginning (newest first)
    const newHistory = [sanitizedWord, ...filteredHistory];

    // Enforce maximum size limit
    const trimmedHistory = newHistory.slice(0, MAX_HISTORY_SIZE);

    set({ history: trimmedHistory });
  },

  /**
   * Remove specific word from history
   */
  removeFromHistory: (word: string) => {
    const sanitizedWord = String(word).toLowerCase().trim();
    
    const { history } = get();
    const newHistory = history.filter(w => w !== sanitizedWord);
    
    set({ history: newHistory });
  },

  /**
   * Clear all history
   */
  clearHistory: () => {
    set({ history: [] });
  },
}));

export default useHistoryStore;