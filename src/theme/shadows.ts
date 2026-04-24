/**
 * shadows.ts - Shadow system for LexiTrie
 * 
 * Elevation presets for consistent depth across the app
 */

import { ViewStyle } from 'react-native';
import { Colors } from './colors';

type ColorScheme = typeof Colors.light;

export const Shadows = {
  small: (colors: ColorScheme): ViewStyle => ({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }),
  
  medium: (colors: ColorScheme): ViewStyle => ({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  }),
  
  large: (colors: ColorScheme): ViewStyle => ({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  }),
  
  // For modals and overlays
  extraLarge: (colors: ColorScheme): ViewStyle => ({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  }),
  
  // Glow effects for focus states
  glow: (color: string): ViewStyle => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  }),
};

export type Shadows = typeof Shadows;
export default Shadows;
