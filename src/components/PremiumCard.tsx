/**
 * PremiumCard.tsx - Reusable card wrapper with shadows and styling
 * 
 * Consistent card styling across the app
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface PremiumCardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function PremiumCard({
  children,
  style,
  variant = 'default',
}: PremiumCardProps) {
  const { colors, spacing, shadows } = useTheme();
  
  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          ...shadows.medium(colors),
          backgroundColor: colors.surface,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return {
          backgroundColor: colors.surface,
        };
    }
  };
  
  return (
    <View style={[
      styles.container,
      getCardStyle(),
      { borderRadius: spacing.radius.lg },
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default PremiumCard;
