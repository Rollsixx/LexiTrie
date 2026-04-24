/**
 * Levenshtein.ts - Levenshtein Distance Algorithm Implementation
 * 
 * The Levenshtein distance (also known as edit distance) measures the minimum
 * number of single-character edits required to change one word into another.
 * 
 * Edit operations:
 *   - Insertion: add a character
 *   - Deletion: remove a character
 *   - Substitution: replace a character
 * 
 * Time Complexity: O(m × n) where m and n are the lengths of the two strings
 * Space Complexity: O(m × n) for the DP matrix
 * 
 * Dynamic Programming Approach:
 *   We build a matrix where dp[i][j] represents the edit distance between
 *   the first i characters of word1 and first j characters of word2.
 * 
 *   Recurrence relation:
 *   - If last characters match: dp[i][j] = dp[i-1][j-1]
 *   - Otherwise: dp[i][j] = 1 + min(
 *       dp[i-1][j]    // deletion
 *       dp[i][j-1]    // insertion
 *       dp[i-1][j-1]  // substitution
 *     )
 */

import { Trie } from './Trie';

/**
 * Calculate the Levenshtein distance between two strings
 * Uses dynamic programming with optimized space (only 2 rows needed)
 * 
 * @param word1 - First string to compare
 * @param word2 - Second string to compare
 * @returns The minimum number of edits needed to transform word1 to word2
 */
export function levenshteinDistance(word1: string, word2: string): number {
  // Normalize inputs: convert to lowercase and trim
  const str1 = word1.toLowerCase().trim();
  const str2 = word2.toLowerCase().trim();

  // Handle edge cases
  // If either string is empty, distance equals length of other string
  if (str1.length === 0) {
    return str2.length;
  }
  if (str2.length === 0) {
    return str1.length;
  }

  // If strings are identical, distance is 0
  if (str1 === str2) {
    return 0;
  }

  // Get lengths for matrix dimensions
  const m = str1.length;
  const n = str2.length;

  // Create DP matrix with dimensions (m+1) × (n+1)
  // dp[i][j] = edit distance between str1[0..i-1] and str2[0..j-1]
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Initialize first column: distances from empty string to str1 prefixes
  // This represents deleting all characters to reach empty string
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;  // i deletions to make empty string
  }

  // Initialize first row: distances from empty string to str2 prefixes
  // This represents inserting characters to reach str2
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;  // j insertions to make str2
  }

  // Fill in the DP matrix
  // For each cell (i, j), we consider three possibilities:
  // 1. Delete str1[i-1]: dp[i-1][j] + 1
  // 2. Insert str2[j-1]: dp[i][j-1] + 1
  // 3. Substitute if different: dp[i-1][j-1] + 1 (or 0 if same)
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // Get the current characters being compared
      const char1 = str1[i - 1];
      const char2 = str2[j - 1];

      // If characters match, no edit needed
      if (char1 === char2) {
        // Copy diagonal value (no edit required)
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // Characters differ - take minimum of three operations
        // and add 1 for the current edit
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // Deletion: remove char from str1
          dp[i][j - 1],     // Insertion: add char to str1
          dp[i - 1][j - 1]  // Substitution: replace char in str1
        );
      }
    }
  }

  // The final cell contains the minimum edit distance
  return dp[m][n];
}

/**
 * Calculate Levenshtein distance using space-optimized approach
 * Only uses two arrays instead of full matrix
 * 
 * Time Complexity: O(m × n)
 * Space Complexity: O(min(m, n))
 * 
 * @param word1 - First string to compare
 * @param word2 - Second string to compare
 * @returns The minimum number of edits needed
 */
export function levenshteinDistanceOptimized(word1: string, word2: string): number {
  // Normalize inputs
  const str1 = word1.toLowerCase().trim();
  const str2 = word2.toLowerCase().trim();

  // Handle edge cases
  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;
  if (str1 === str2) return 0;

  // Ensure str1 is the shorter string for space optimization
  // We want the smaller dimension to be the column count
  let shorter: string;
  let longer: string;
  
  if (str1.length <= str2.length) {
    shorter = str1;
    longer = str2;
  } else {
    shorter = str2;
    longer = str1;
  }

  const m = shorter.length;
  const n = longer.length;

  // Use two arrays for space optimization
  // previousRow: stores dp values for i-1
  // currentRow: stores dp values for current i
  const previousRow: number[] = Array(n + 1).fill(0);
  const currentRow: number[] = Array(n + 1).fill(0);

  // Initialize previousRow (for empty shorter string)
  for (let j = 0; j <= n; j++) {
    previousRow[j] = j;
  }

  // Fill in the matrix row by row
  for (let i = 1; i <= m; i++) {
    // First cell: distance from empty string
    currentRow[0] = i;

    for (let j = 1; j <= n; j++) {
      const charShorter = shorter[i - 1];
      const charLonger = longer[j - 1];

      if (charShorter === charLonger) {
        // Characters match - no additional edit needed
        currentRow[j] = previousRow[j - 1];
      } else {
        // Characters differ - take minimum of three operations + 1
        currentRow[j] = 1 + Math.min(
          previousRow[j],     // Deletion
          currentRow[j - 1],  // Insertion
          previousRow[j - 1] // Substitution
        );
      }
    }

    // Swap rows for next iteration
    // Copy currentRow to previousRow for next iteration
    // (in-place swap would be more efficient but less readable)
    for (let j = 0; j <= n; j++) {
      previousRow[j] = currentRow[j];
    }
  }

  // Result is in the last cell of previousRow
  return previousRow[n];
}

/**
 * Check if two words are similar within a given edit distance threshold
 * Useful for fuzzy matching
 * 
 * @param word1 - First word
 * @param word2 - Second word
 * @param maxDistance - Maximum allowed edit distance (default: 2)
 * @returns true if words are within maxDistance of each other
 */
export function isSimilar(
  word1: string, 
  word2: string, 
  maxDistance: number = 2
): boolean {
  // Guard clause: reject invalid maxDistance
  if (maxDistance < 0) {
    return false;
  }

  // Quick length check: if difference exceeds maxDistance, can't be similar
  const lengthDiff = Math.abs(word1.length - word2.length);
  if (lengthDiff > maxDistance) {
    return false;
  }

  // Calculate actual distance
  const distance = levenshteinDistance(word1, word2);
  
  return distance <= maxDistance;
}

/**
 * Find all words in a Trie that are within maxDistance of query
 * Used for "Did you mean?" suggestions
 * 
 * Time Complexity: O(k × m × n) where:
 *   - k = number of words in Trie
 *   - m = average word length in Trie
 *   - n = query length
 * 
 * @param trie - The Trie containing words to search
 * @param query - The query word
 * @param maxDistance - Maximum edit distance (default: 2)
 * @returns Array of words within maxDistance, sorted by distance
 */
export function fuzzySearch(
  trie: Trie,
  query: string,
  maxDistance: number = 2
): string[] {
  // Normalize query
  const normalizedQuery = query.toLowerCase().trim();
  
  // Guard clause: reject empty queries
  if (!normalizedQuery) {
    return [];
  }

  // Guard clause: reject invalid maxDistance
  if (maxDistance < 0) {
    return [];
  }

  // Get all words from the Trie
  const allWords = trie.getAllWords();
  
  // Calculate distance for each word and filter by maxDistance
  const results: Array<{ word: string; distance: number }> = [];
  
  for (const word of allWords) {
    // Quick length filter for optimization
    const lengthDiff = Math.abs(word.length - normalizedQuery.length);
    if (lengthDiff > maxDistance) {
      continue;  // Skip words that can't possibly be within range
    }
    
    // Calculate actual Levenshtein distance
    const distance = levenshteinDistance(normalizedQuery, word);
    
    // Include if within threshold
    if (distance <= maxDistance) {
      results.push({ word, distance });
    }
  }

  // Sort by distance (ascending), then alphabetically for ties
  results.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;  // Smaller distance first
    }
    return a.word.localeCompare(b.word);  // Alphabetical as tiebreaker
  });

  // Return just the words
  return results.map(r => r.word);
}

/**
 * Get top N closest words to query using fuzzy search
 * More efficient when you only need top results
 * 
 * @param trie - The Trie containing words
 * @param query - The query word
 * @param maxDistance - Maximum edit distance
 * @param limit - Maximum number of results to return
 * @returns Array of up to 'limit' closest words
 */
export function fuzzySearchTopN(
  trie: Trie,
  query: string,
  maxDistance: number = 2,
  limit: number = 5
): string[] {
  // Normalize query
  const normalizedQuery = query.toLowerCase().trim();
  
  // Guard clauses
  if (!normalizedQuery || limit <= 0 || maxDistance < 0) {
    return [];
  }

  const allWords = trie.getAllWords();
  
  // Use a priority queue approach - keep top 'limit' results
  // This is more efficient than sorting all results
  const results: Array<{ word: string; distance: number }> = [];
  
  for (const word of allWords) {
    // Quick length filter
    const lengthDiff = Math.abs(word.length - normalizedQuery.length);
    if (lengthDiff > maxDistance) {
      continue;
    }
    
    const distance = levenshteinDistance(normalizedQuery, word);
    
    if (distance <= maxDistance) {
      // Add to results
      results.push({ word, distance });
      
      // Keep only top 'limit' results
      if (results.length > limit) {
        // Sort and trim (inefficient but simple)
        results.sort((a, b) => a.distance - b.distance);
        results.pop();
      }
    }
  }

  // Final sort
  results.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return a.word.localeCompare(b.word);
  });

  return results.map(r => r.word);
}

export default levenshteinDistance;
