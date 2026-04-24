/**
 * Root layout - Entry point with ThemeProvider
 * 
 * Wraps app with theme context and initializes data
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';
import { useDictionaryStore } from '../src/store/dictionaryStore';
import { useFavoritesStore } from '../src/store/favoritesStore';
import { loadWords } from '../src/data/loadRichDictionary';

/**
 * Loading screen component
 */
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#667EEA" />
      <Text style={styles.loadingText}>Loading dictionary...</Text>
    </View>
  );
}

/**
 * Inner app content with initialization
 */
function AppContent() {
  const { colors } = useTheme();
  const initializeTrie = useDictionaryStore(state => state.initializeTrie);
  const isInitialized = useDictionaryStore(state => state.isInitialized);
  const isLoading = useDictionaryStore(state => state.isLoading);
  const favoritesStore = useFavoritesStore();

  useEffect(() => {
    favoritesStore.loadFromStorage();
    const words = loadWords();
    initializeTrie(words);
  }, []);

  if (isLoading || !isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="modal/word-detail"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}

/**
 * Root layout component with ThemeProvider
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
});