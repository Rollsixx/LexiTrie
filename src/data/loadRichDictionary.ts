import rawData from '../../dictionary-filtered.json';
import type { WordDefinition } from '../types';

type RawEntry = { ''?: string; p?: string[]; d?: string[]; i?: string; f?: string[] | string };

interface DictionaryJson {
  '': string;
  p: string[];
  d: string[];
}

const jsonArray: DictionaryJson[] = rawData as DictionaryJson[];

const wordMap: Map<string, RawEntry> = new Map();

for (const entry of jsonArray) {
  const word = entry[''];
  if (word && typeof word === 'string') {
    wordMap.set(word.toLowerCase(), entry);
  }
}

export function loadWords(): string[] {
  return Array.from(wordMap.keys());
}

export function getWordDefinition(word: string): WordDefinition | null {
  const normalizedWord = word.toLowerCase().trim();
  const entry = wordMap.get(normalizedWord);
  
  if (!entry) {
    return null;
  }

  return {
    word: normalizedWord,
    partsOfSpeech: Array.isArray(entry.p) ? entry.p : [],
    definitions: Array.isArray(entry.d) ? entry.d : [],
    pronunciation: entry.i ? String(entry.i) : undefined,
    relatedForms: entry.f 
      ? (Array.isArray(entry.f) ? entry.f : [String(entry.f)]) 
      : undefined,
  };
}

export function getWordCount(): number {
  return wordMap.size;
}

export function searchWordDefinition(query: string): WordDefinition | null {
  const normalizedQuery = query.toLowerCase().trim();
  return getWordDefinition(normalizedQuery);
}

export default { loadWords, getWordDefinition, getWordCount, searchWordDefinition };