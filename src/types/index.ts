/**
 * Types index - Central type definitions for the app
 * 
 * Contains shared types used across the application
 */

export interface WordEntry {
  /** The word string */
  word: string;
  /** Frequency count for ranking (higher = more common) */
  frequency: number;
}

export interface DictionaryEntry {
  /** The word string */
  w: string;
  /** Parts of speech (noun, verb, adj, etc.) */
  p: string[];
  /** Definitions */
  d: string[];
  /** IPA pronunciation (optional) */
  i?: string;
  /** Related forms (plural, alternative spellings, etc.) */
  f?: string[];
}

export interface SearchResult {
  /** The matched word */
  word: string;
  /** Edit distance from query (for fuzzy results) */
  distance?: number;
  /** Whether this is an exact match */
  isExact: boolean;
}

export interface WordDefinition {
  /** The word */
  word: string;
  /** Parts of speech */
  partsOfSpeech: string[];
  /** Definitions */
  definitions: string[];
  /** IPA pronunciation */
  pronunciation?: string;
  /** Related forms */
  relatedForms?: string[];
}

export interface AutocompleteState {
  /** Current search query */
  query: string;
  /** Autocomplete suggestions */
  suggestions: string[];
  /** Whether autocomplete is loading */
  isLoading: boolean;
}

export interface FuzzyMatchState {
  /** Current query */
  query: string;
  /** Fuzzy matched results */
  results: string[];
  /** Maximum edit distance used */
  maxDistance: number;
}

export type TabParamList = {
  Search: undefined;
  Favorites: undefined;
  History: undefined;
};

export type RootStackParamList = {
  '(tabs)': undefined;
  'modal/word-detail': {
    word: string;
  };
};

export interface DictionaryStateData {
  trieInitialized: boolean;
  wordCount: number;
  lastUpdated: number | null;
}