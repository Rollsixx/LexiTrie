/**
 * Search screen - Main search functionality with premium UI
 */

import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  Text,
  ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useDictionaryStore } from '../../src/store/dictionaryStore';
import { useHistoryStore } from '../../src/store/historyStore';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { PremiumSearchBar } from '../../src/components/PremiumSearchBar';
import { PremiumWordCard } from '../../src/components/PremiumWordCard';
import { EmptyState } from '../../src/components/EmptyState';
import { useDebounce } from '../../src/hooks/useDebounce';

export default function SearchScreen() {
  const router = useRouter();
  const { colors, shadows } = useTheme();
  
  // Local state
  const [inputValue, setInputValue] = useState('');
  
  // Debounce input
  const debouncedQuery = useDebounce(inputValue, 300);
  
  // Store state
  const autocompleteResults = useDictionaryStore(state => state.autocompleteResults);
  const fuzzyResults = useDictionaryStore(state => state.fuzzyResults);
  const setSearchQuery = useDictionaryStore(state => state.setSearchQuery);
  const isInitialized = useDictionaryStore(state => state.isInitialized);
  const wordCount = useDictionaryStore(state => state.wordCount);
  
  const addToHistory = useHistoryStore(state => state.addToHistory);
  const favorites = useFavoritesStore(state => state.favorites);
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);

  // Update store when query changes
  useEffect(() => {
    if (isInitialized) {
      setSearchQuery(debouncedQuery);
    }
  }, [debouncedQuery, isInitialized, setSearchQuery]);

  /**
   * Handle word selection
   */
  const handleWordSelect = useCallback((word: string) => {
    Haptics.selectionAsync();
    addToHistory(word);
    setInputValue('');
    Keyboard.dismiss();
    router.push({
      pathname: '/modal/word-detail',
      params: { word },
    });
  }, [router, addToHistory]);

  /**
   * Handle favorite toggle
   */
  const handleFavoritePress = useCallback((word: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(word);
  }, [toggleFavorite]);

  /**
   * Handle search input change
   */
  const handleSearchChange = useCallback((query: string) => {
    setInputValue(query);
  }, []);

  const showResults = inputValue.length > 0 && isInitialized;
  const hasSuggestions = autocompleteResults.length > 0;
  const hasFuzzy = fuzzyResults.length > 0;
  
  /**
   * Render suggestion card
   */
  const renderSuggestionItem = useCallback(({ item, index }: { item: string; index: number }) => (
    <View style={styles.cardWrapper}>
      <PremiumWordCard
        word={item}
        index={index}
        onPress={handleWordSelect}
        onFavoritePress={handleFavoritePress}
        isFavorite={favorites.includes(item.toLowerCase())}
        showFavoriteButton={true}
        isExactMatch={index === 0 && hasSuggestions}
      />
    </View>
  ), [handleWordSelect, handleFavoritePress, favorites, hasSuggestions]);

  /**
   * Render fuzzy suggestion
   */
  const renderFuzzyItem = useCallback(({ item, index }: { item: string; index: number }) => (
    <View style={styles.cardWrapper}>
      <PremiumWordCard
        word={item}
        index={autocompleteResults.length + index}
        onPress={handleWordSelect}
        showFavoriteButton={false}
        subtitle="Did you mean?"
      />
    </View>
  ), [handleWordSelect, autocompleteResults.length]);

  /**
   * Empty state
   */
  const renderEmpty = useCallback(() => {
    if (!isInitialized) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading dictionary...
          </Text>
        </View>
      );
    }

    if (inputValue.length > 0 && !hasSuggestions && !hasFuzzy) {
      return (
        <EmptyState
          icon="🔍"
          title="No results found"
          subtitle="Try a different search term"
          variant="search"
        />
      );
    }

    return (
      <View style={styles.welcomeContainer}>
        <View style={[styles.welcomeCard, shadows.medium(colors)]}>
          <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>
            LexiTrie Dictionary
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            {wordCount.toLocaleString()} words loaded
          </Text>
          <Text style={[styles.welcomeHint, { color: colors.textTertiary }]}>
            Start typing to search...
          </Text>
        </View>
      </View>
    );
  }, [isInitialized, inputValue, hasSuggestions, hasFuzzy, wordCount, colors, shadows]);

  // Combine results for FlatList
  const combinedResults = [
    ...autocompleteResults,
    ...fuzzyResults.filter(f => !autocompleteResults.includes(f)),
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Search Bar */}
      <PremiumSearchBar
        value={inputValue}
        onSearchChange={handleSearchChange}
        placeholder="Search for a word..."
        autoFocus={false}
      />

      {/* Results */}
      <FlatList
        data={showResults ? combinedResults : []}
        renderItem={({ item, index }) => {
          if (index < autocompleteResults.length) {
            return renderSuggestionItem({ item, index });
          }
          return renderFuzzyItem({ 
            item, 
            index: index - autocompleteResults.length 
          });
        }}
        keyExtractor={(item) => item}
        style={styles.list}
        contentContainerStyle={combinedResults.length === 0 ? styles.emptyList : styles.listContent}
        ListEmptyComponent={renderEmpty}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  welcomeCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  welcomeHint: {
    fontSize: 14,
  },
  cardWrapper: {
    marginBottom: 4,
  },
});