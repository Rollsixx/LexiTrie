/**
 * dictionaryStore.ts - Zustand store for dictionary/Trie management
 * 
 * Manages the Trie data structure and search operations
 * 
 * Why Zustand over Context + useReducer?
 * - Cleaner syntax with hooks
 * - Built-in selectors for optimized re-renders
 * - Easier to test (stores are just functions)
 * - Less boilerplate
 * - Supports middleware (persist, devtools)
 */

import { create } from 'zustand';
import { Trie } from '../algorithms/Trie';
import { fuzzySearch, fuzzySearchTopN } from '../algorithms/Levenshtein';
import { WordDefinition } from '../types';
import { getWordDefinition as getRichWordDefinition } from '../data/loadRichDictionary';

interface DictionaryState {
  // State properties
  trie: Trie | null;
  isLoading: boolean;
  isInitialized: boolean;
  wordCount: number;
  searchQuery: string;
  autocompleteResults: string[];
  fuzzyResults: string[];
  error: string | null;

  // Actions
  initializeTrie: (words: string[]) => void;
  setSearchQuery: (query: string) => void;
  performAutocomplete: (prefix: string) => void;
  performFuzzySearch: (query: string, maxDistance?: number) => void;
  clearSearch: () => void;
  getWordDefinition: (word: string) => WordDefinition | null;
}

/**
 * Create Zustand store for dictionary operations
 * 
 * The Trie is loaded into memory for instant search performance
 * Trade-off: Uses more memory but provides O(1) character lookup
 */
export const useDictionaryStore = create<DictionaryState>((set, get) => ({
  // Initial state
  trie: null,
  isLoading: false,
  isInitialized: false,
  wordCount: 0,
  searchQuery: '',
  autocompleteResults: [],
  fuzzyResults: [],
  error: null,

  /**
   * Initialize the Trie with words
   * This is called once on app startup
   * 
   * Time Complexity: O(n × m) where n = number of words, m = average word length
   */
  initializeTrie: (words: string[]) => {
    // Guard clause: prevent re-initialization
    if (get().isInitialized) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Create new Trie instance
      const trie = new Trie({ maxResults: 10 });

      // Insert all words into Trie
      // Using for...of for better performance than forEach
      for (const word of words) {
        // Validate and sanitize input
        const sanitizedWord = String(word).toLowerCase().trim();
        if (sanitizedWord && sanitizedWord.length > 0) {
          trie.insert(sanitizedWord);
        }
      }

      // Update state with initialized Trie
      set({
        trie,
        isLoading: false,
        isInitialized: true,
        wordCount: trie.getWordCount(),
        error: null,
      });
    } catch (error) {
      // Handle initialization errors
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize dictionary',
      });
    }
  },

  /**
   * Update search query and trigger autocomplete
   */
  setSearchQuery: (query: string) => {
    // Sanitize input
    const sanitizedQuery = String(query).toLowerCase().trim();
    
    set({ searchQuery: sanitizedQuery });

    // If query is empty, clear results
    if (!sanitizedQuery) {
      set({
        autocompleteResults: [],
        fuzzyResults: [],
      });
      return;
    }

    // Get current state
    const { trie } = get();

    // Guard clause: check Trie is initialized
    if (!trie) {
      return;
    }

    // Perform autocomplete
    get().performAutocomplete(sanitizedQuery);

    // If exact match found, don't need fuzzy search
    if (!trie.search(sanitizedQuery)) {
      get().performFuzzySearch(sanitizedQuery);
    } else {
      set({ fuzzyResults: [] });
    }
  },

  /**
   * Perform autocomplete search using Trie
   * Returns words that start with the given prefix
   * 
   * Time Complexity: O(p + n) where p = prefix length, n = results
   */
  performAutocomplete: (prefix: string) => {
    const { trie } = get();

    // Guard clause: check Trie is initialized
    if (!trie) {
      set({ autocompleteResults: [] });
      return;
    }

    // Sanitize input
    const sanitizedPrefix = String(prefix).toLowerCase().trim();

    // Guard clause: check prefix is valid
    if (!sanitizedPrefix) {
      set({ autocompleteResults: [] });
      return;
    }

    // Get autocomplete results from Trie
    const results = trie.getAutocompleteResults(sanitizedPrefix);

    set({ autocompleteResults: results });
  },

  /**
   * Perform fuzzy search using Levenshtein distance
   * Returns words within maxDistance edits
   * 
   * Time Complexity: O(k × m × n) where k = words in Trie
   */
  performFuzzySearch: (query: string, maxDistance: number = 2) => {
    const { trie } = get();

    // Guard clause: check Trie is initialized
    if (!trie) {
      set({ fuzzyResults: [] });
      return;
    }

    // Sanitize input
    const sanitizedQuery = String(query).toLowerCase().trim();

    // Guard clause: check query is valid
    if (!sanitizedQuery || sanitizedQuery.length < 3) {
      set({ fuzzyResults: [] });
      return;
    }

    // Get fuzzy results - limit to top 5 for performance
    const results = fuzzySearchTopN(trie, sanitizedQuery, maxDistance, 5);

    set({ fuzzyResults: results });
  },

  /**
   * Clear search state
   */
  clearSearch: () => {
    set({
      searchQuery: '',
      autocompleteResults: [],
      fuzzyResults: [],
    });
  },

  /**
   * Get word definition from rich dictionary
   */
  getWordDefinition: (word: string) => {
    return getRichWordDefinition(word);
  },
}));

export default useDictionaryStore;
