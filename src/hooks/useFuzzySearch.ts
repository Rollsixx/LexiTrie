/**
 * useFuzzySearch.ts - Custom hook for fuzzy search functionality
 * 
 * Provides fuzzy search with configurable max distance
 * Uses the dictionary store for Trie operations
 */

import { useMemo, useState, useCallback } from 'react';
import { useDictionaryStore } from '../store/dictionaryStore';
import { fuzzySearchTopN } from '../algorithms/Levenshtein';

interface UseFuzzySearchOptions {
  /** Maximum edit distance for fuzzy matching */
  maxDistance?: number;
  /** Maximum number of results to return */
  limit?: number;
}

interface UseFuzzySearchResult {
  /** Fuzzy search results */
  results: string[];
  /** Whether search is currently running */
  isSearching: boolean;
  /** Error message if any */
  error: string | null;
  /** Function to perform fuzzy search */
  search: (query: string) => void;
  /** Function to clear results */
  clear: () => void;
}

/**
 * Hook for performing fuzzy searches using Levenshtein distance
 * 
 * @param options - Configuration options
 * @returns Search results and control functions
 * 
 * @example
 * const { results, search, clear } = useFuzzySearch({ maxDistance: 2, limit: 5 });
 * 
 * search('helo'); // Returns words within 2 edits of 'helo'
 */
export function useFuzzySearch(
  options: UseFuzzySearchOptions = {}
): UseFuzzySearchResult {
  const {
    maxDistance = 2,
    limit = 5,
  } = options;

  // Get Trie from store
  const trie = useDictionaryStore(state => state.trie);
  const isInitialized = useDictionaryStore(state => state.isInitialized);

  // Local state
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Perform fuzzy search
   * Uses memoization for performance
   */
  const search = useCallback((query: string) => {
    // Reset state
    setError(null);
    setIsSearching(true);

    // Guard clauses
    if (!isInitialized || !trie) {
      setError('Dictionary not initialized');
      setIsSearching(false);
      return;
    }

    const sanitizedQuery = String(query).toLowerCase().trim();

    if (!sanitizedQuery || sanitizedQuery.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    try {
      // Perform fuzzy search
      const searchResults = fuzzySearchTopN(trie, sanitizedQuery, maxDistance, limit);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [trie, isInitialized, maxDistance, limit]);

  /**
   * Clear search results
   */
  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    isSearching,
    error,
    search,
    clear,
  };
}

export default useFuzzySearch;
