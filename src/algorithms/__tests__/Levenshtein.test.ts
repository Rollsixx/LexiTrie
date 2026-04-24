/**
 * Levenshtein.test.ts - Unit Tests for Levenshtein Distance Algorithm
 * 
 * Tests cover:
 * - Basic distance calculations
 * - Insertion operations
 * - Deletion operations
 * - Substitution operations
 * - Fuzzy search functionality
 * - Edge cases
 */

import {
  levenshteinDistance,
  levenshteinDistanceOptimized,
  isSimilar,
  fuzzySearch,
  fuzzySearchTopN,
} from '../Levenshtein';
import { Trie } from '../Trie';

describe('levenshteinDistance', () => {
  describe('basic calculations', () => {
    test('should return 0 for identical words', () => {
      expect(levenshteinDistance('hello', 'hello')).toBe(0);
    });

    test('should return 1 for single character substitution', () => {
      expect(levenshteinDistance('cat', 'bat')).toBe(1);
    });

    test('should return 1 for single character insertion', () => {
      expect(levenshteinDistance('cat', 'cats')).toBe(1);
    });

    test('should return 1 for single character deletion', () => {
      expect(levenshteinDistance('cats', 'cat')).toBe(1);
    });
  });

  describe('substitution operations', () => {
    test('should count multiple substitutions', () => {
      expect(levenshteinDistance('sitting', 'kitten')).toBe(3);
    });

    test('should handle complete word substitution', () => {
      expect(levenshteinDistance('cat', 'dog')).toBe(3);
    });
  });

  describe('insertion operations', () => {
    test('should handle insertions at start', () => {
      expect(levenshteinDistance('cat', 'acat')).toBe(1);
    });

    test('should handle insertions at end', () => {
      expect(levenshteinDistance('cat', 'cati')).toBe(1);
    });

    test('should handle multiple insertions', () => {
      expect(levenshteinDistance('cat', 'catch')).toBe(1);
    });
  });

  describe('deletion operations', () => {
    test('should handle deletions at start', () => {
      expect(levenshteinDistance('acat', 'cat')).toBe(1);
    });

    test('should handle deletions at end', () => {
      expect(levenshteinDistance('cati', 'cat')).toBe(1);
    });
  });

  describe('case insensitivity', () => {
    test('should handle mixed case', () => {
      expect(levenshteinDistance('HELLO', 'hello')).toBe(0);
    });

    test('should handle mixed case with edits', () => {
      expect(levenshteinDistance('Hello', 'Helo')).toBe(1);
    });
  });

  describe('whitespace handling', () => {
    test('should handle leading/trailing whitespace', () => {
      expect(levenshteinDistance('  hello  ', 'hello')).toBe(0);
    });
  });

  describe('edge cases', () => {
    test('should handle empty first string', () => {
      expect(levenshteinDistance('', 'hello')).toBe(5);
    });

    test('should handle empty second string', () => {
      expect(levenshteinDistance('hello', '')).toBe(5);
    });

    test('should handle both empty strings', () => {
      expect(levenshteinDistance('', '')).toBe(0);
    });

    test('should handle single character to empty', () => {
      expect(levenshteinDistance('a', '')).toBe(1);
    });

    test('should handle empty to single character', () => {
      expect(levenshteinDistance('', 'a')).toBe(1);
    });
  });
});

describe('levenshteinDistanceOptimized', () => {
  test('should return same result as standard version', () => {
    expect(levenshteinDistanceOptimized('hello', 'hello')).toBe(
      levenshteinDistance('hello', 'hello')
    );
  });

  test('should handle basic edits', () => {
    expect(levenshteinDistanceOptimized('cat', 'bat')).toBe(1);
    expect(levenshteinDistanceOptimized('cat', 'cats')).toBe(1);
  });

  test('should handle complex edits', () => {
    expect(levenshteinDistanceOptimized('sitting', 'kitten')).toBe(3);
  });
});

describe('isSimilar', () => {
  test('should return true for identical words', () => {
    expect(isSimilar('hello', 'hello', 2)).toBe(true);
  });

  test('should return true for single edit', () => {
    expect(isSimilar('cat', 'bat', 2)).toBe(true);
  });

  test('should return true for two edits within threshold', () => {
    expect(isSimilar('cat', 'dog', 3)).toBe(true);
  });

  test('should return false when exceeds threshold', () => {
    expect(isSimilar('cat', 'elephant', 2)).toBe(false);
  });

  test('should handle length difference greater than threshold', () => {
    expect(isSimilar('a', 'abcdef', 2)).toBe(false);
  });

  test('should use default threshold of 2', () => {
    expect(isSimilar('cat', 'bat')).toBe(true);
    expect(isSimilar('cat', 'dog')).toBe(false);
  });

  test('should return false for negative threshold', () => {
    expect(isSimilar('hello', 'hello', -1)).toBe(false);
  });
});

describe('fuzzySearch', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie({ maxResults: 20 });
    trie.insert('hello');
    trie.insert('help');
    trie.insert('hell');
    trie.insert('hero');
    trie.insert('helo');
    trie.insert('yellow');
    trie.insert('world');
    trie.insert('word');
  });

  test('should return empty array for empty query', () => {
    expect(fuzzySearch(trie, '')).toEqual([]);
  });

  test('should return exact match with distance 0', () => {
    const results = fuzzySearch(trie, 'hello', 2);
    expect(results).toContain('hello');
  });

  test('should return words within maxDistance', () => {
    const results = fuzzySearch(trie, 'helo', 2);
    expect(results).toContain('helo');
    expect(results).toContain('hello');
    expect(results).toContain('help');
  });

  test('should sort by distance', () => {
    const results = fuzzySearch(trie, 'helo', 2);
    // Distance 0 should come first (exact match)
    expect(results[0]).toBe('helo');
  });

  test('should return empty array for negative maxDistance', () => {
    const results = fuzzySearch(trie, 'hello', -1);
    expect(results).toEqual([]);
  });

  test('should handle non-matching query', () => {
    const results = fuzzySearch(trie, 'xyz', 2);
    expect(results.length).toBe(0);
  });
});

describe('fuzzySearchTopN', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie({ maxResults: 20 });
    trie.insert('hello');
    trie.insert('help');
    trie.insert('hell');
    trie.insert('hero');
    trie.insert('helloa');
    trie.insert('hellob');
    trie.insert('helloc');
  });

  test('should limit results to specified number', () => {
    const results = fuzzySearchTopN(trie, 'hello', 2, 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  test('should return most similar first', () => {
    const results = fuzzySearchTopN(trie, 'hello', 2, 5);
    expect(results[0]).toBe('hello');
  });

  test('should handle limit of 0', () => {
    const results = fuzzySearchTopN(trie, 'hello', 2, 0);
    expect(results).toEqual([]);
  });

  test('should handle negative limit', () => {
    const results = fuzzySearchTopN(trie, 'hello', 2, -1);
    expect(results).toEqual([]);
  });
});

describe('real-world examples', () => {
  test('should handle common typos', () => {
    expect(levenshteinDistance('teh', 'the')).toBe(1);
    expect(levenshteinDistance('teh', 'the')).toBe(1);
  });

  test('should handle word variations', () => {
    expect(levenshteinDistance('color', 'colour')).toBe(1);
    expect(levenshteinDistance('analyze', 'analyse')).toBe(1);
  });

  test('should handle singular/plural', () => {
    expect(levenshteinDistance('cat', 'cats')).toBe(1);
    expect(levenshteinDistance('dogs', 'dog')).toBe(1);
  });
});