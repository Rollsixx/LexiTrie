/**
 * Favorites screen - Premium design with grid layout
 */

import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { PremiumWordCard } from '../../src/components/PremiumWordCard';
import { EmptyState } from '../../src/components/EmptyState';

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Store state
  const favorites = useFavoritesStore(state => state.favorites);
  const loadFromStorage = useFavoritesStore(state => state.loadFromStorage);
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);

  // Load on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  /**
   * Handle word selection
   */
  const handleWordSelect = useCallback((word: string) => {
    Haptics.selectionAsync();
    router.push({
      pathname: '/modal/word-detail',
      params: { word },
    });
  }, [router]);

  /**
   * Handle favorite toggle
   */
  const handleFavoritePress = useCallback((word: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(word);
  }, [toggleFavorite]);

  /**
   * Render favorite card
   */
  const renderItem: ListRenderItem<string> = useCallback(
    ({ item, index }) => (
      <View style={styles.cardContainer}>
        <PremiumWordCard
          word={item}
          index={index}
          onPress={handleWordSelect}
          onFavoritePress={handleFavoritePress}
          isFavorite={true}
          showFavoriteButton={true}
        />
      </View>
    ),
    [handleWordSelect, handleFavoritePress]
  );

  /**
   * Key extractor
   */
  const keyExtractor = useCallback((item: string) => item, []);

  /**
   * Empty state
   */
  const renderEmpty = useCallback(() => (
    <EmptyState
      icon="⭐"
      title="No favorites yet"
      subtitle="Tap the star on any word to save it here"
      variant="favorites"
    />
  ), []);

  /**
   * Header
   */
  const renderHeader = useCallback(() => {
    if (favorites.length === 0) return null;
    
    return (
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerText, { color: colors.textSecondary }]}>
          {favorites.length} {favorites.length === 1 ? 'word' : 'words'} saved
        </Text>
      </View>
    );
  }, [favorites.length, colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={favorites.length === 0 ? styles.emptyList : styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
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
  cardContainer: {
    marginBottom: 0,
  },
});