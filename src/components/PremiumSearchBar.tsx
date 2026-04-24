/**
 * PremiumSearchBar.tsx - Premium search bar with animations
 * 
 * Features:
 * - Gradient border on focus
 * - Smooth scale animation
 * - Haptic feedback on interaction
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';

interface PremiumSearchBarProps {
  placeholder?: string;
  value?: string;
  onSearchChange?: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function PremiumSearchBar({
  placeholder = 'Search words...',
  value: initialValue = '',
  onSearchChange,
  onSearchSubmit,
  disabled = false,
  autoFocus = false,
}: PremiumSearchBarProps) {
  const { colors, shadows } = useTheme();
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation value
  const scale = useSharedValue(1);
  
  /**
   * Handle focus state
   */
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    scale.value = withTiming(1.02, { duration: 150 });
    Haptics.selectionAsync();
  }, []);
  
  /**
   * Handle blur state
   */
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    scale.value = withTiming(1, { duration: 150 });
  }, []);
  
  /**
   * Handle text change
   */
  const handleChangeText = useCallback((text: string) => {
    const sanitized = text.toLowerCase().trim();
    setQuery(text);
    if (onSearchChange) {
      onSearchChange(sanitized);
    }
  }, [onSearchChange]);
  
  /**
   * Handle clear button
   */
  const handleClear = useCallback(() => {
    setQuery('');
    Haptics.selectionAsync();
    if (onSearchChange) {
      onSearchChange('');
    }
  }, [onSearchChange]);
  
  /**
   * Handle submit
   */
  const handleSubmit = useCallback(() => {
    const sanitized = query.toLowerCase().trim();
    if (onSearchSubmit && sanitized) {
      onSearchSubmit(sanitized);
    }
  }, [query, onSearchSubmit]);
  
  // Animated container style
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <View style={styles.wrapper}>
      <Animated.View style={animatedContainerStyle}>
        <View style={[
          styles.container,
          shadows.medium(colors),
          {
            backgroundColor: colors.surface,
            borderColor: isFocused ? colors.primary : colors.border,
          },
        ]}>
          {/* Search icon */}
          <Text style={[styles.searchIcon, { color: colors.textTertiary }]}>
            🔍
          </Text>
          
          {/* Input */}
          <TextInput
            style={[
              styles.input,
              { color: colors.textPrimary },
            ]}
            value={query}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoFocus={autoFocus}
            editable={!disabled}
            autoCorrect={false}
            autoCapitalize="none"
          />
          
          {/* Clear button */}
          {query.length > 0 && !disabled && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={[styles.clearIcon, { backgroundColor: colors.textTertiary }]}>
                <Text style={styles.clearIconText}>✕</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIconText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default PremiumSearchBar;