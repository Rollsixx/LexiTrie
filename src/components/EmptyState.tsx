/**
 * EmptyState.tsx - Illustrated empty state component
 * 
 * Features:
 * - Animated illustration
 * - Gradient background
 * - Friendly messaging
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  variant?: 'favorites' | 'history' | 'search';
}

export function EmptyState({
  icon,
  title,
  subtitle,
  variant = 'search',
}: EmptyStateProps) {
  const { colors } = useTheme();
  
  // Animation values
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { duration: 500 });
    
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);
  
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));
  
  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  
  const gradientColors: [string, string] = variant === 'favorites' 
    ? [colors.accent, colors.secondary]
    : variant === 'history'
    ? [colors.primary, colors.secondary]
    : [colors.primaryLight, colors.primary];
  
  return (
    <View style={styles.container}>
      <Animated.View style={animatedIconStyle}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Text style={styles.icon}>{icon}</Text>
        </LinearGradient>
      </Animated.View>
      
      <Animated.View style={[styles.textContainer, animatedTextStyle]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      </Animated.View>
      
      <View style={styles.sparklesContainer}>
        <Text style={[styles.sparkle, styles.sparkle1]}>✨</Text>
        <Text style={[styles.sparkle, styles.sparkle2]}>✨</Text>
        <Text style={[styles.sparkle, styles.sparkle3]}>✨</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 44,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  sparklesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
    opacity: 0.6,
    fontSize: 16,
  },
  sparkle1: {
    top: '20%',
    left: '15%',
    fontSize: 14,
  },
  sparkle2: {
    top: '15%',
    right: '20%',
    fontSize: 12,
  },
  sparkle3: {
    bottom: '25%',
    left: '25%',
    fontSize: 10,
  },
});

export default EmptyState;