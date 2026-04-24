/**
 * WordCard.tsx - Word display card component
 * 
 * Displays a word with favorite button and tap-to-detail functionality
 * UsesTouchableOpacity for press feedback
 * 
 * Time Complexity: O(1) - just UI rendering
 * Space Complexity: O(1)
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFavoritesStore } from '../store/favoritesStore';

interface WordCardProps {
  /** The word to display */
  word: string;
  /** Callback when card is pressed */
  onPress?: (word: string) => void;
  /** Whether to show favorite button */
  showFavoriteButton?: boolean;
  /** Optional subtitle text */
  subtitle?: string;
  /** Index for alternating background */
  index?: number;
}

/**
 * WordCard component
 * Displays a word in a card format with tap interaction
 */
export function WordCard({
  word,
  onPress,
  showFavoriteButton = true,
  subtitle,
  index = 0,
}: WordCardProps) {
  // Get favorites from store
  const favorites = useFavoritesStore(state => state.favorites);
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);

  // Check if word is favorited
  const isFavorited = useMemo(() => {
    const sanitizedWord = word.toLowerCase().trim();
    return favorites.includes(sanitizedWord);
  }, [word, favorites]);

  /**
   * Handle card press
   */
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(word);
    }
  }, [word, onPress]);

  /**
   * Handle favorite button press
   */
  const handleFavoritePress = useCallback(() => {
    toggleFavorite(word);
  }, [word, toggleFavorite]);

  /**
   * Alternating background color
   */
  const backgroundColor = useMemo(() => 
    index % 2 === 0 ? '#fff' : '#f9f9f9',
    [index]
  );

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.wordContainer}>
          <Text style={styles.word}>{word}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>

        {showFavoriteButton && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorited ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  wordContainer: {
    flex: 1,
  },
  word: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#FFD700',
  },
});

export default WordCard;