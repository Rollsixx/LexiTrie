/**
 * spacing.ts - Spacing system for LexiTrie
 * 
 * Consistent spacing based on 8px grid
 */

export const Spacing = {
  // Base unit
  unit: 8,
  
  // Spacing scale
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Screen padding
  screenPadding: 24,
  
  // Section spacing
  sectionGap: 24,
  
  // Card padding
  cardPadding: 16,
  
  // List item spacing
  listItemGap: 8,
  
  // Border radius scale
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};

export type Spacing = typeof Spacing;
export default Spacing;
