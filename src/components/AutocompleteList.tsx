/**
 * AutocompleteList.tsx - Autocomplete suggestions component
 * 
 * Displays search suggestions with keyboard navigation
 * Uses FlatList for performance with large lists
 * 
 * Time Complexity: O(n) for rendering n items
 * Space Complexity: O(n) for storing list items
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';

interface AutocompleteListProps {
  /** Array of suggestion strings */
  suggestions: string[];
  /** Callback when user selects a suggestion */
  onSelect: (word: string) => void;
  /** Optional: fuzzy match results to display */
  fuzzyResults?: string[];
  /** Whether the list is visible */
  visible?: boolean;
}

/**
 * AutocompleteList component
 * Displays word suggestions in a scrollable list
 */
export function AutocompleteList({
  suggestions,
  onSelect,
  fuzzyResults = [],
  visible = true,
}: AutocompleteListProps) {
  /**
   * Handle suggestion selection
   */
  const handleSelect = useCallback((word: string) => {
    onSelect(word);
  }, [onSelect]);

  /**
   * Render individual suggestion item
   */
  const renderItem: ListRenderItem<string> = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.suggestionText}>{item}</Text>
        {index === 0 && suggestions.length > 0 && (
          <View style={styles.exactBadge}>
            <Text style={styles.exactBadgeText}>exact</Text>
          </View>
        )}
      </TouchableOpacity>
    ),
    [handleSelect, suggestions]
  );

  /**
   * Key extractor for FlatList
   */
  const keyExtractor = useCallback((item: string) => item, []);

  // Don't render if not visible or no results
  if (!visible) {
    return null;
  }

  const hasResults = suggestions.length > 0;
  const hasFuzzy = fuzzyResults.length > 0;

  if (!hasResults && !hasFuzzy) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Autocomplete suggestions */}
      {hasResults && (
        <>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <FlatList
            data={suggestions}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* Fuzzy match results */}
      {hasFuzzy && (
        <>
          <Text style={styles.sectionTitle}>Did you mean?</Text>
          <FlatList
            data={fuzzyResults}
            renderItem={renderItem}
            keyExtractor={(item) => `fuzzy-${item}`}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  exactBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  exactBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
});

export default AutocompleteList;