/**
 * Trie.ts - Trie Data Structure Implementation
 * 
 * A Trie (prefix tree) is a tree data structure used for efficient string operations.
 * It enables fast prefix searches and is ideal for autocomplete functionality.
 * 
 * Time Complexity:
 *   - insert: O(m) where m is the length of the word
 *   - search: O(m) where m is the length of the word
 *   - startsWith: O(p + n) where p is prefix length, n is number of results
 *   - delete: O(m) where m is the length of the word
 * 
 * Space Complexity:
 *   - O(ALPHABET_SIZE * m * n) in worst case
 *   - where m = average word length, n = number of words
 *   - More efficient than storing each word separately due to prefix sharing
 */

export interface TrieNode {
  // Map to store child nodes - each key is a character
  // Using Map provides O(1) lookup time for characters
  children: Map<string, TrieNode>;
  
  // Flag to mark if this node represents the end of a valid word
  isEndOfWord: boolean;
  
  // The complete word stored at this node (null for non-end nodes)
  word: string | null;
  
  // Frequency count for ranking suggestions (higher = more common)
  frequency: number;
}

export interface TrieOptions {
  // Maximum number of autocomplete results to return
  maxResults?: number;
}

/**
 * Trie class implementation for word storage and retrieval
 * Supports insert, search, prefix search, and delete operations
 */
export class Trie {
  // Root node of the Trie - empty string as key
  public readonly root: TrieNode;
  
  // Configuration options
  private readonly maxResults: number;
  
  // Track total number of words inserted
  private wordCount: number = 0;

  /**
   * Initialize a new Trie with optional configuration
   * 
   * @param options - Configuration options for the Trie
   */
  constructor(options: TrieOptions = {}) {
    // Initialize root node with empty children map
    this.root = this.createNode(null);
    this.root.isEndOfWord = false;
    this.root.word = null;
    this.maxResults = options.maxResults ?? 10;
  }

  /**
   * Factory method to create a new TrieNode
   * Centralizes node creation for consistency
   * 
   * @param word - Optional word to associate with this node
   * @returns A new TrieNode with default values
   */
  private createNode(word: string | null): TrieNode {
    return {
      children: new Map<string, TrieNode>(),  // O(1) insertion and lookup
      isEndOfWord: false,                     // Default: not end of word
      word: word,                             // Store word at end nodes
      frequency: 0,                           // Default frequency
    };
  }

  /**
   * Insert a word into the Trie
   * Time Complexity: O(m) where m is word length
   * 
   * @param word - The word to insert (converts to lowercase)
   */
  public insert(word: string): void {
    // Normalize input: convert to lowercase and trim whitespace
    const normalizedWord = word.toLowerCase().trim();
    
    // Guard clause: reject empty strings
    if (!normalizedWord) {
      return;
    }

    // Start from root node
    let currentNode: TrieNode = this.root;
    
    // Traverse or create nodes for each character
    for (let i = 0; i < normalizedWord.length; i++) {
      const char = normalizedWord[i];
      
      // Check if character edge already exists
      if (!currentNode.children.has(char)) {
        // Create new node if path doesn't exist
        // Pass null since we don't know if this is end of word yet
        currentNode.children.set(char, this.createNode(null));
      }
      
      // Move to the next node
      currentNode = currentNode.children.get(char) as TrieNode;
    }
    
    // Mark the final node as end of word
    // Update word and increment frequency for ranking
    if (!currentNode.isEndOfWord) {
      currentNode.isEndOfWord = true;
      currentNode.word = normalizedWord;
      this.wordCount++;
    }
    
    // Increment frequency for ranking (more frequent words appear first)
    currentNode.frequency++;
  }

  /**
   * Search for an exact word in the Trie
   * Time Complexity: O(m) where m is word length
   * 
   * @param word - The word to search for
   * @returns true if word exists in Trie, false otherwise
   */
  public search(word: string): boolean {
    // Normalize input
    const normalizedWord = word.toLowerCase().trim();
    
    // Guard clause: reject empty strings
    if (!normalizedWord) {
      return false;
    }

    // Traverse to the end of the word
    const node = this.traverseToEnd(normalizedWord);
    
    // Return true only if we reached end and it's marked as end of word
    return node !== null && node.isEndOfWord;
  }

  /**
   * Check if any word in Trie starts with given prefix
   * Time Complexity: O(p) where p is prefix length
   * 
   * @param prefix - The prefix to search for
   * @returns true if any word starts with prefix, false otherwise
   */
  public startsWith(prefix: string): boolean {
    // Normalize input
    const normalizedPrefix = prefix.toLowerCase().trim();
    
    // Guard clause: reject empty strings
    if (!normalizedPrefix) {
      return false;
    }

    // Traverse to the prefix node
    const node = this.traverseToEnd(normalizedPrefix);
    
    // Return true if we successfully traversed the entire prefix
    return node !== null;
  }

  /**
   * Get all words that start with given prefix (autocomplete)
   * Time Complexity: O(p + n) where p = prefix length, n = results
   * 
   * @param prefix - The prefix to search for
   * @returns Array of words matching the prefix, sorted by frequency
   */
  public getAutocompleteResults(prefix: string): string[] {
    // Normalize input
    const normalizedPrefix = prefix.toLowerCase().trim();
    
    // Guard clause: reject empty strings
    if (!normalizedPrefix) {
      return [];
    }

    // Find the node corresponding to the prefix
    const prefixNode = this.traverseToEnd(normalizedPrefix);
    
    // If prefix doesn't exist, return empty array
    if (!prefixNode) {
      return [];
    }

    // Collect all words from this node using DFS
    const results: string[] = [];
    this.collectWords(prefixNode, results);

    // Sort by frequency (descending) for ranking
    // If frequency is same, sort alphabetically
    results.sort((a, b) => {
      const nodeA = this.findNodeForWord(a);
      const nodeB = this.findNodeForWord(b);
      
      if (nodeA && nodeB) {
        if (nodeB.frequency !== nodeA.frequency) {
          return nodeB.frequency - nodeA.frequency;  // Higher frequency first
        }
      }
      return a.localeCompare(b);  // Alphabetical as tiebreaker
    });

    // Return limited results
    return results.slice(0, this.maxResults);
  }

  /**
   * Collect all words recursively from a given node
   * Uses Depth-First Search (DFS) traversal
   * 
   * @param node - Current node to explore
   * @param results - Array to collect words into
   */
  private collectWords(node: TrieNode, results: string[]): void {
    // If this node marks end of a word, add it to results
    if (node.isEndOfWord && node.word) {
      results.push(node.word);
    }

    // Recursively explore all child nodes
    // Using for...of loop over Map entries for efficiency
    for (const [, childNode] of node.children) {
      this.collectWords(childNode, results);
    }
  }

  /**
   * Traverse the Trie to the node representing the end of a word
   * Helper method used by search and startsWith
   * 
   * @param word - The word to traverse to
   * @returns The node at end of word, or null if path doesn't exist
   */
  private traverseToEnd(word: string): TrieNode | null {
    let currentNode: TrieNode = this.root;
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      
      // If character path doesn't exist, word isn't in Trie
      if (!currentNode.children.has(char)) {
        return null;
      }
      
      currentNode = currentNode.children.get(char) as TrieNode;
    }
    
    return currentNode;
  }

  /**
   * Find the node for a given word (for frequency lookup)
   * 
   * @param word - The word to find
   * @returns The node at end of word, or null if not found
   */
  private findNodeForWord(word: string): TrieNode | null {
    const normalizedWord = word.toLowerCase().trim();
    return this.traverseToEnd(normalizedWord);
  }

  /**
   * Delete a word from the Trie
   * Uses recursive deletion - removes nodes that are no longer needed
   * Time Complexity: O(m) where m is word length
   * 
   * @param word - The word to delete
   * @returns true if word was deleted, false if not found
   */
  public delete(word: string): boolean {
    // Normalize input
    const normalizedWord = word.toLowerCase().trim();
    
    // Guard clause: reject empty strings
    if (!normalizedWord) {
      return false;
    }

    // First check if word exists
    if (!this.search(normalizedWord)) {
      return false;
    }

    // Perform recursive deletion starting from root
    this.deleteHelper(this.root, normalizedWord, 0);
    this.wordCount--;
    return true;
  }

  /**
   * Recursive helper for delete operation
   * Removes nodes bottom-up if they're not part of another word
   * 
   * @param node - Current node
   * @param word - Remaining word to delete
   * @param depth - Current depth in word
   * @returns true if this node should be deleted
   */
  private deleteHelper(node: TrieNode, word: string, depth: number): boolean {
    // Base case: we've processed all characters
    if (depth === word.length) {
      // Mark as not end of word
      node.isEndOfWord = false;
      node.word = null;
      // Return true if node has no children (can be safely deleted)
      return node.children.size === 0;
    }

    const char = word[depth];
    const childNode = node.children.get(char) as TrieNode;
    
    // Recursively delete from child
    const shouldDeleteChild = this.deleteHelper(childNode, word, depth + 1);
    
    // If child should be deleted, remove it from children map
    if (shouldDeleteChild) {
      node.children.delete(char);
    }
    
    // Return true if:
    // 1. Current node should be deleted (no children and not end of word)
    // 2. Child was deleted
    return (
      node.children.size === 0 &&
      !node.isEndOfWord &&
      shouldDeleteChild
    );
  }

  /**
   * Get all words in the Trie
   * Useful for debugging and validation
   * 
   * @returns Array of all words in Trie
   */
  public getAllWords(): string[] {
    const results: string[] = [];
    this.collectWords(this.root, results);
    return results;
  }

  /**
   * Get the total number of unique words in Trie
   * 
   * @returns Number of words stored
   */
  public getWordCount(): number {
    return this.wordCount;
  }

  /**
   * Clear all words from the Trie
   * Resets to initial state
   */
  public clear(): void {
    this.root.children.clear();
    this.wordCount = 0;
  }
}

export default Trie;
