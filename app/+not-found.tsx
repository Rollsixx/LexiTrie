/**
 * Not found page - 404 handler
 * 
 * Displayed when navigating to non-existent routes
 */

import React from 'react';
import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.text}>This screen doesn't exist.</Text>
      <Link href="/" style={styles.link}>
        Go to home screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 72,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  link: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
});