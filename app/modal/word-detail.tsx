/**
 * Word detail modal - Premium design with gradient header and definitions
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { useDictionaryStore } from '../../src/store/dictionaryStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { PremiumCard } from '../../src/components/PremiumCard';

const POS_COLORS: Record<string, string> = {
  noun: '#3B82F6',
  verb: '#10B981',
  adjective: '#F59E0B',
  adverb: '#8B5CF6',
  pronoun: '#EC4899',
  preposition: '#06B6D4',
  conjunction: '#6366F1',
  interjection: '#F97316',
};

function getPOSColor(pos: string): string {
  return POS_COLORS[pos.toLowerCase()] || '#64748B';
}

export default function WordDetailModal() {
  const router = useRouter();
  const { colors, shadows } = useTheme();
  const { word } = useLocalSearchParams<{ word: string }>();
  
  const validWord = useMemo(() => {
    if (!word || typeof word !== 'string') {
      return null;
    }
    return word.toLowerCase().trim();
  }, [word]);

  const favorites = useFavoritesStore(state => state.favorites);
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);
  const getWordDefinition = useDictionaryStore(state => state.getWordDefinition);
  const trie = useDictionaryStore(state => state.trie);

  const definition = useMemo(() => {
    if (!validWord) return null;
    return getWordDefinition(validWord);
  }, [validWord, getWordDefinition]);

  const existsInDictionary = useMemo(() => {
    if (!validWord || !trie) return false;
    return trie.search(validWord);
  }, [validWord, trie]);

  const suggestions = useMemo(() => {
    if (!validWord || !trie) return [];
    return trie.getAutocompleteResults(validWord).slice(0, 5);
  }, [validWord, trie]);

  const isFavorited = validWord ? favorites.includes(validWord) : false;

  const handleToggleFavorite = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (validWord) {
      toggleFavorite(validWord);
    }
  }, [validWord, toggleFavorite]);

  if (!validWord) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          Invalid word
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, shadows.large(colors)]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerWord}>{validWord}</Text>
              {definition?.pronunciation && (
                <Text style={styles.pronunciation}>{definition.pronunciation}</Text>
              )}
            </View>

            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
            >
              <Text style={[
                styles.favoriteIcon,
                { color: isFavorited ? colors.gold : '#fff' }
              ]}>
                {isFavorited ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {definition ? (
            <>
              {definition.partsOfSpeech.length > 0 && (
                <PremiumCard variant="elevated" style={styles.card}>
                  <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>
                    PARTS OF SPEECH
                  </Text>
                  <View style={styles.posContainer}>
                    {definition.partsOfSpeech.map((pos, index) => (
                      <View
                        key={index}
                        style={[
                          styles.posBadge,
                          { backgroundColor: getPOSColor(pos) + '20' }
                        ]}
                      >
                        <Text style={[
                          styles.posText,
                          { color: getPOSColor(pos) }
                        ]}>
                          {pos}
                        </Text>
                      </View>
                    ))}
                  </View>
                </PremiumCard>
              )}

              {definition.definitions.length > 0 && (
                <PremiumCard variant="elevated" style={styles.card}>
                  <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>
                    DEFINITIONS
                  </Text>
                  {definition.definitions.map((def, index) => (
                    <View key={index} style={styles.definitionItem}>
                      <Text style={[styles.definitionNumber, { color: colors.primary }]}>
                        {index + 1}.
                      </Text>
                      <Text style={[styles.definitionText, { color: colors.textPrimary }]}>
                        {def}
                      </Text>
                    </View>
                  ))}
                </PremiumCard>
              )}

              {definition.relatedForms && definition.relatedForms.length > 0 && (
                <PremiumCard variant="elevated" style={styles.card}>
                  <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>
                    RELATED FORMS
                  </Text>
                  <View style={styles.chipsContainer}>
                    {definition.relatedForms.map((form, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.chip, { backgroundColor: colors.primary + '20' }]}
                        onPress={() => {
                          Haptics.selectionAsync();
                          router.push({
                            pathname: '/modal/word-detail',
                            params: { word: form },
                          });
                        }}
                      >
                        <Text style={[styles.chipText, { color: colors.primary }]}>
                          {form}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </PremiumCard>
              )}
            </>
          ) : (
            <PremiumCard variant="elevated" style={styles.card}>
              <View style={[styles.statusBadge, { backgroundColor: colors.warning + '20' }]}>
                <Text style={[styles.statusText, { color: colors.warning }]}>
                  No definitions found
                </Text>
              </View>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                This word was found in the dictionary but doesn't have detailed definitions yet.
              </Text>
            </PremiumCard>
          )}

          {suggestions.length > 1 && (
            <PremiumCard variant="elevated" style={styles.card}>
              <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>
                SIMILAR WORDS
              </Text>
              <View style={styles.chipsContainer}>
                {suggestions
                  .filter(s => s !== validWord)
                  .map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      style={[styles.chip, { backgroundColor: colors.primary + '20' }]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        router.push({
                          pathname: '/modal/word-detail',
                          params: { word: suggestion },
                        });
                      }}
                    >
                      <Text style={[styles.chipText, { color: colors.primary }]}>
                        {suggestion}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </PremiumCard>
          )}

          <PremiumCard variant="outlined" style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>
              ABOUT
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              LexiTrie uses a Trie (prefix tree) data structure for efficient 
              word lookup. Now with rich definitions, pronunciations, and related forms.
            </Text>
          </PremiumCard>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#fff',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerWord: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'capitalize',
  },
  pronunciation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  content: {
    padding: 16,
    marginTop: -20,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  posContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  posBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  posText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  definitionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  definitionNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    minWidth: 20,
  },
  definitionText: {
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});