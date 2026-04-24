/**
 * ThemeContext.tsx - Theme provider for dark/light mode
 * 
 * Provides theme context to all components with color scheme switching
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ColorScheme } from './colors';
import { Typography } from './typography';
import { Shadows } from './shadows';
import { Spacing } from './spacing';

interface ThemeContextType {
  // Theme mode
  isDark: boolean;
  colors: ColorScheme;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
  
  // Theme helpers
  shadows: typeof Shadows;
  typography: typeof Typography;
  spacing: typeof Spacing;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider component
 * Manages dark/light mode state and provides theme values
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Always use light mode
  const [isDark, setIsDark] = useState(false);
  
  // Get colors based on current mode
  const colors = isDark ? Colors.dark : Colors.light;
  
  /**
   * Toggle between dark and light mode
   */
  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);
  
  /**
   * Set specific dark mode state
   */
  const setDarkMode = useCallback((dark: boolean) => {
    setIsDark(dark);
  }, []);
  
  const value: ThemeContextType = {
    isDark,
    colors,
    toggleTheme,
    setDarkMode,
    shadows: Shadows,
    typography: Typography,
    spacing: Spacing,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
