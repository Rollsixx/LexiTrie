/**
 * colors.ts - Color palette for LexiTrie
 * 
 * Premium color system with light and dark mode support
 */

export const Colors = {
  light: {
    // Primary palette
    primary: '#667EEA',
    primaryLight: '#8B9CF5',
    primaryDark: '#4A5DD4',
    secondary: '#764BA2',
    secondaryLight: '#9673BC',
    accent: '#F093FB',
    
    // Semantic colors
    success: '#10B981',
    successLight: '#34D399',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    error: '#EF4444',
    errorLight: '#F87171',
    
    // Backgrounds
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    
    // Text
    textPrimary: '#000000',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    
    // Borders
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    // Special
    gold: '#FFD700',
    goldLight: '#FFE44D',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shimmer: 'rgba(255, 255, 255, 0.4)',
  },
  dark: {
    // Primary palette
    primary: '#8B9CF5',
    primaryLight: '#A5B4FC',
    primaryDark: '#667EEA',
    secondary: '#9673BC',
    secondaryLight: '#A88BCC',
    accent: '#F5B8FF',
    
    // Semantic colors
    success: '#34D399',
    successLight: '#6EE7B7',
    warning: '#FBBF24',
    warningLight: '#FCD34D',
    error: '#F87171',
    errorLight: '#FCA5A5',
    
    // Backgrounds
    background: '#0F172A',
    surface: '#1E293B',
    surfaceElevated: '#334155',
    
    // Text
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textInverse: '#0F172A',
    
    // Borders
    border: '#334155',
    borderLight: '#1E293B',
    
    // Special
    gold: '#FFD700',
    goldLight: '#FFE44D',
    overlay: 'rgba(0, 0, 0, 0.7)',
    shimmer: 'rgba(255, 255, 255, 0.1)',
  },
};

export type ColorScheme = typeof Colors.light;
export default Colors;
