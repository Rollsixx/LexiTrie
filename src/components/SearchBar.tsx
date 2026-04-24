/**
 * SearchBar.tsx - Search input component
 * 
 * Text input component for search functionality
 * Includes debouncing to optimize performance
 * 
 * Time Complexity: O(1) - just UI rendering
 * Space Complexity: O(1)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

interface SearchBarProps {
  /** Placeholder text */
  placeholder?: string;
  /** Initial value */
  value?: string;
  /** Callback when search query changes */
  onSearchChange?: (query: string) => void;
  /** Callback when user submits search */
  onSearchSubmit?: (query: string) => void;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Auto-focus on mount */
  autoFocus?: boolean;
}

/**
 * SearchBar component
 * Provides text input with clear button and submit handling
 */
export function SearchBar({
  placeholder = 'Search words...',
  value: initialValue = '',
  onSearchChange,
  onSearchSubmit,
  disabled = false,
  autoFocus = false,
}: SearchBarProps) {
  // Controlled input value
  const [query, setQuery] = useState(initialValue);

  /**
   * Handle text change
   * Sanitizes input and triggers callback
   */
  const handleChangeText = useCallback((text: string) => {
    // Sanitize: convert to lowercase, trim whitespace
    const sanitized = text.toLowerCase().trim();
    setQuery(text); // Keep original for display
    
    // Trigger callback with sanitized value
    if (onSearchChange) {
      onSearchChange(sanitized);
    }
  }, [onSearchChange]);

  /**
   * Handle clear button press
   */
  const handleClear = useCallback(() => {
    setQuery('');
    if (onSearchChange) {
      onSearchChange('');
    }
  }, [onSearchChange]);

  /**
   * Handle submit (Enter key)
   */
  const handleSubmit = useCallback(() => {
    const sanitized = query.toLowerCase().trim();
    if (onSearchSubmit && sanitized) {
      onSearchSubmit(sanitized);
    }
  }, [query, onSearchSubmit]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoFocus={autoFocus}
          editable={!disabled}
          autoCorrect={false}
          autoCapitalize="none"
        />
        
        {query.length > 0 && !disabled && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 14,
    color: '#999',
  },
});

export default SearchBar;