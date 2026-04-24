/**
 * Tabs layout - Premium bottom tab navigation
 * 
 * Features:
 * - Animated icon transitions
 * - Scale animation on active tab
 * - Premium styling with shadows
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/theme/ThemeContext';

/**
 * Animated tab icon component
 */
function TabIcon({ 
  focused,
  icon 
}: { 
  focused: boolean;
  icon: string;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(focused ? 1.1 : 1);

  React.useEffect(() => {
    scale.value = withTiming(focused ? 1.15 : 1, { duration: 200 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.selectionAsync();
  };

  return (
    <Animated.View 
      style={[styles.tabIconContainer, animatedStyle]}
      onTouchStart={handlePress}
    >
      <Text style={[
        styles.tabIcon, 
        { color: focused ? colors.primary : colors.textTertiary }
      ]}>
        {icon}
      </Text>
      {focused && (
        <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
      )}
    </Animated.View>
  );
}

/**
 * Tabs layout component
 */
export default function TabsLayout() {
  const { colors, shadows } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          ...shadows.small(colors),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
          headerTitle: 'LexiTrie',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🔍" />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          headerTitle: 'Favorites',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="⭐" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerTitle: 'History',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📜" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  tabIcon: {
    fontSize: 22,
  },
  activeIndicator: {
    position: 'absolute',
    top: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});