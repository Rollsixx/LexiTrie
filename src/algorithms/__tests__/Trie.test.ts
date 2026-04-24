/**
 * Trie.test.ts - Unit Tests for Trie Data Structure
 * 
 * Tests cover:
 * - Insert operation
 * - Search operation
 * - Prefix/autocomplete functionality
 * - Delete operation
 * - Edge cases
 */

import { Trie } from '../Trie';

describe('Trie', () => {
  let trie: Trie;

  beforeEach(() => {
    // Create fresh Trie instance before each test
    trie = new Trie({ maxResults: 10 });
  });

  describe('insert', () => {
    test('should insert a single word', () => {
      trie.insert('hello');
      expect(trie.search('hello')).toBe(true);
    });

    test('should insert multiple words', () => {
      trie.insert('hello');
      trie.insert('world');
      trie.insert('help');
      
      expect(trie.search('hello')).toBe(true);
      expect(trie.search('world')).toBe(true);
      expect(trie.search('help')).toBe(true);
    });

    test('should handle case insensitivity', () => {
      trie.insert('Hello');
      expect(trie.search('hello')).toBe(true);
      expect(trie.search('HELLO')).toBe(true);
    });

    test('should handle whitespace trimming', () => {
      trie.insert('  hello  ');
      expect(trie.search('hello')).toBe(true);
    });

    test('should not insert empty string', () => {
      trie.insert('');
      expect(trie.search('')).toBe(false);
      expect(trie.getWordCount()).toBe(0);
    });

    test('should not insert duplicate words (unique words only)', () => {
      trie.insert('hello');
      trie.insert('hello');
      trie.insert('hello');
      
      expect(trie.getWordCount()).toBe(1);
    });
  });

  describe('search', () => {
    test('should return true for existing word', () => {
      trie.insert('apple');
      expect(trie.search('apple')).toBe(true);
    });

    test('should return false for non-existent word', () => {
      trie.insert('apple');
      expect(trie.search('banana')).toBe(false);
    });

    test('should return false for partial word', () => {
      trie.insert('apple');
      expect(trie.search('app')).toBe(false);
    });

    test('should return false for empty string', () => {
      trie.insert('hello');
      expect(trie.search('')).toBe(false);
    });

    test('should be case insensitive', () => {
      trie.insert('Hello');
      expect(trie.search('hello')).toBe(true);
      expect(trie.search('HELLO')).toBe(true);
    });
  });

  describe('startsWith (prefix check)', () => {
    test('should return true for existing prefix', () => {
      trie.insert('hello');
      expect(trie.startsWith('hel')).toBe(true);
    });

    test('should return false for non-existing prefix', () => {
      trie.insert('hello');
      expect(trie.startsWith('world')).toBe(false);
    });

    test('should return true for full word prefix', () => {
      trie.insert('hello');
      expect(trie.startsWith('hello')).toBe(true);
    });

    test('should return false for empty prefix', () => {
      trie.insert('hello');
      expect(trie.startsWith('')).toBe(false);
    });
  });

  describe('getAutocompleteResults', () => {
    test('should return correct autocomplete suggestions', () => {
      trie.insert('hello');
      trie.insert('help');
      trie.insert('helicopter');
      trie.insert('held');
      
      const results = trie.getAutocompleteResults('hel');
      
      expect(results).toContain('hello');
      expect(results).toContain('help');
      expect(results).toContain('helicopter');
      expect(results).toContain('held');
    });

    test('should return empty array for non-existing prefix', () => {
      trie.insert('hello');
      const results = trie.getAutocompleteResults('xyz');
      
      expect(results).toEqual([]);
    });

    test('should return empty array for empty prefix', () => {
      trie.insert('hello');
      const results = trie.getAutocompleteResults('');
      
      expect(results).toEqual([]);
    });

    test('should limit results to maxResults', () => {
      // Insert many words starting with 'a'
      trie.insert('apple');
      trie.insert('application');
      trie.insert('apply');
      trie.insert('appreciate');
      trie.insert('approach');
      
      const shortTrie = new Trie({ maxResults: 3 });
      shortTrie.insert('apple');
      shortTrie.insert('application');
      shortTrie.insert('apply');
      shortTrie.insert('appreciate');
      shortTrie.insert('approach');
      
      const results = shortTrie.getAutocompleteResults('ap');
      
      expect(results.length).toBeLessThanOrEqual(3);
    });

    test('should handle single character prefix', () => {
      trie.insert('cat');
      trie.insert('car');
      trie.insert('cab');
      
      const results = trie.getAutocompleteResults('c');
      
      expect(results.length).toBe(3);
      expect(results).toContain('cat');
      expect(results).toContain('car');
      expect(results).toContain('cab');
    });
  });

  describe('delete', () => {
    test('should delete existing word', () => {
      trie.insert('hello');
      expect(trie.search('hello')).toBe(true);
      
      const deleted = trie.delete('hello');
      expect(deleted).toBe(true);
      expect(trie.search('hello')).toBe(false);
    });

    test('should return false for non-existing word', () => {
      trie.insert('hello');
      
      const deleted = trie.delete('world');
      expect(deleted).toBe(false);
    });

    test('should not affect other words when deleting', () => {
      trie.insert('hello');
      trie.insert('help');
      trie.insert('world');
      
      trie.delete('hello');
      
      expect(trie.search('hello')).toBe(false);
      expect(trie.search('help')).toBe(true);
      expect(trie.search('world')).toBe(true);
    });

    test('should handle deleting prefix of another word', () => {
      trie.insert('cat');
      trie.insert('catch');
      
      trie.delete('cat');
      
      expect(trie.search('cat')).toBe(false);
      expect(trie.search('catch')).toBe(true);
    });
  });

  describe('getWordCount', () => {
    test('should return 0 for empty trie', () => {
      expect(trie.getWordCount()).toBe(0);
    });

    test('should return correct count after insertions', () => {
      trie.insert('hello');
      trie.insert('world');
      trie.insert('hello'); // duplicate
      
      expect(trie.getWordCount()).toBe(2);
    });

    test('should decrement after delete', () => {
      trie.insert('hello');
      trie.insert('world');
      
      trie.delete('hello');
      
      expect(trie.getWordCount()).toBe(1);
    });
  });

  describe('getAllWords', () => {
    test('should return all words', () => {
      trie.insert('apple');
      trie.insert('banana');
      trie.insert('cherry');
      
      const allWords = trie.getAllWords();
      
      expect(allWords).toContain('apple');
      expect(allWords).toContain('banana');
      expect(allWords).toContain('cherry');
    });

    test('should return empty array for empty trie', () => {
      expect(trie.getAllWords()).toEqual([]);
    });
  });

  describe('clear', () => {
    test('should remove all words', () => {
      trie.insert('hello');
      trie.insert('world');
      
      trie.clear();
      
      expect(trie.getWordCount()).toBe(0);
      expect(trie.search('hello')).toBe(false);
      expect(trie.search('world')).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should handle words with same prefix', () => {
      trie.insert('a');
      trie.insert('ab');
      trie.insert('abc');
      trie.insert('abcd');
      
      expect(trie.search('a')).toBe(true);
      expect(trie.search('ab')).toBe(true);
      expect(trie.search('abc')).toBe(true);
      expect(trie.search('abcd')).toBe(true);
    });

    test('should handle special characters gracefully', () => {
      trie.insert('hello');
      // Special characters are treated as regular characters
      expect(trie.search('hello')).toBe(true);
    });
  });
});
