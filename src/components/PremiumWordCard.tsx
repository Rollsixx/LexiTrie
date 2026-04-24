/**
 * PremiumWordCard.tsx - Animated word card with premium styling
 * 
 * Features:
 * - Scale animation on tap
 * - Premium shadows
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';

interface PremiumWordCardProps {
  word: string;
  onPress?: (word: string) => void;
  onFavoritePress?: (word: string) => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
  subtitle?: string;
  index?: number;
  isExactMatch?: boolean;
}

export function PremiumWordCard({
  word,
  onPress,
  onFavoritePress,
  isFavorite = false,
  showFavoriteButton = true,
  subtitle,
  index = 0,
  isExactMatch = false,
}: PremiumWordCardProps) {
  const { colors, shadows } = useTheme();
  
  // Animation values
  const scale = useSharedValue(1);
  
  /**
   * Handle card press with scale animation
   */
  const handlePress = useCallback(() => {
    Haptics.selectionAsync();
    scale.value = withTiming(0.97, { duration: 100 });
    setTimeout(() => {
      scale.value = withTiming(1, { duration: 100 });
    }, 100);
    
    if (onPress) {
      onPress(word);
    }
  }, [word, onPress]);
  
  /**
   * Handle favorite press
   */
  const handleFavoritePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onFavoritePress) {
      onFavoritePress(word);
    }
  }, [word, onFavoritePress]);
  
  // Animated card style
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  // Alternating background
  const backgroundColor = useMemo(() => 
    index % 2 === 0 ? colors.surface : colors.background,
    [index, colors]
  );
  
  return (
    <Animated.View style={animatedCardStyle}>
      <TouchableOpacity
        style={[
          styles.container,
          shadows.small(colors),
          { backgroundColor, borderColor: colors.border },
        ]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.content}>
          {/* Word and badge */}
          <View style={styles.wordContainer}>
            <Text style={[styles.word, { color: colors.textPrimary }]}>
              {word}
            </Text>
            
            {isExactMatch && (
              <View style={[styles.exactBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.exactBadgeText}>exact</Text>
              </View>
            )}
            
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
          
          {/* Favorite button */}
          {showFavoriteButton && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleFavoritePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[
                styles.favoriteIcon,
                { color: isFavorite ? colors.gold : colors.textTertiary }
              ]}>
                {isFavorite ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  wordContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  word: {
    fontSize: 17,
    fontWeight: '600',
  },
  exactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  exactBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 12,
  },
  favoriteIcon: {
    fontSize: 26,
  },
});

export default PremiumWordCard;