/**
 * History screen - Premium design with cards
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useHistoryStore } from '../../src/store/historyStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { PremiumWordCard } from '../../src/components/PremiumWordCard';
import { EmptyState } from '../../src/components/EmptyState';

export default function HistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Store state
  const history = useHistoryStore(state => state.history);
  const clearHistory = useHistoryStore(state => state.clearHistory);

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
   * Handle clear all
   */
  const handleClearHistory = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all search history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearHistory,
        },
      ]
    );
  }, [clearHistory]);

  /**
   * Render history card
   */
  const renderItem: ListRenderItem<string> = useCallback(
    ({ item, index }) => (
      <View style={styles.cardContainer}>
        <PremiumWordCard
          word={item}
          index={index}
          onPress={handleWordSelect}
          showFavoriteButton={false}
          subtitle={index === 0 ? 'Most recent' : undefined}
        />
      </View>
    ),
    [handleWordSelect]
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
      icon="📜"
      title="No history yet"
      subtitle="Your recent searches will appear here"
      variant="history"
    />
  ), []);

  /**
   * Header with clear button
   */
  const renderHeader = useCallback(() => {
    if (history.length === 0) return null;
    
    return (
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerText, { color: colors.textSecondary }]}>
          Last {history.length} searches
        </Text>
        <TouchableOpacity onPress={handleClearHistory}>
          <Text style={[styles.clearButton, { color: colors.error }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [history.length, colors, handleClearHistory]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={history.length === 0 ? styles.emptyList : styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '600',
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
  container: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: 0,
  },
});