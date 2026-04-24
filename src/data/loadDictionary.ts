/**
 * loadDictionary.ts - Dictionary loading utility
 * 
 * Loads words from JSON and provides them to the Trie
 * Handles validation and error cases
 */

import wordsData from './words.json';
import { WordEntry } from '../types';

/**
 * Load all words from the JSON data
 * 
 * @returns Array of word strings
 * 
 * Time Complexity: O(n) where n = number of words
 * Space Complexity: O(n) for storing word array
 */
export function loadWords(): string[] {
  // Validate data structure
  if (!Array.isArray(wordsData)) {
    console.warn('Invalid words data structure');
    return [];
  }

  // Extract and validate words
  const words: string[] = [];
  
  for (const entry of wordsData) {
    // Validate entry is an object with word property
    if (entry && typeof entry === 'object' && 'word' in entry) {
      const word = String(entry.word).toLowerCase().trim();
      
      // Only add non-empty words
      if (word && word.length > 0) {
        words.push(word);
      }
    }
  }

  return words;
}

/**
 * Load words with frequency data
 * 
 * @returns Array of WordEntry objects
 */
export function loadWordsWithFrequency(): WordEntry[] {
  if (!Array.isArray(wordsData)) {
    return [];
  }

  const entries: WordEntry[] = [];
  
  for (const entry of wordsData) {
    if (entry && typeof entry === 'object' && 'word' in entry) {
      const word = String(entry.word).toLowerCase().trim();
      const frequency = typeof entry.frequency === 'number' ? entry.frequency : 0;
      
      if (word && word.length > 0) {
        entries.push({ word, frequency });
      }
    }
  }

  return entries;
}

/**
 * Get total word count
 * 
 * @returns Number of words in dictionary
 */
export function getWordCount(): number {
  const words = loadWords();
  return words.length;
}

export default loadWords;
