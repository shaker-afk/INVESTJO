/**
 * theme.js
 * Design tokens derived from the Stitch "Sovereign Ledger" design system.
 * Deep Navy / Warm Sand palette with tonal surface hierarchy.
 */

export const Colors = {
  // Primary brand colours
  primary: '#000a1e',           // Deep Navy (dark)
  primaryContainer: '#002147', // Deep Navy (mid)

  // Secondary / Sand accent
  secondary: '#6a5e33',
  secondaryContainer: '#f3e2ac',
  warmSand: '#C2B280',

  // Surface hierarchy (background layering — no lines rule)
  surface: '#f8f9fa',           // Level 0 — Base
  surfaceContainerLow: '#f3f4f5',  // Level 1 — Sections
  surfaceContainerLowest: '#ffffff', // Level 2 — Cards
  surfaceContainerHigh: '#e7e8e9',
  surfaceContainerHighest: '#e1e3e4',
  surfaceDim: '#d9dadb',

  // On-surface (text/icon colours)
  onSurface: '#191c1d',
  onSurfaceVariant: '#44474e',
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#706439',

  // Accent used for eco / trending
  eco: '#2d6a4f',
  ecoLight: '#d8f3dc',
  trend: '#7b2d8b',
  trendLight: '#ede7f6',

  // Sector badge palette
  sectorEnergy: '#fff3cd',
  sectorEnergyText: '#664d00',
  sectorTourism: '#d4edda',
  sectorTourismText: '#155724',
  sectorTech: '#cce5ff',
  sectorTechText: '#004085',
  sectorAgri: '#d1ecf1',
  sectorAgriText: '#0c5460',
  sectorDefault: '#e1e3e4',
  sectorDefaultText: '#44474e',

  // Utility
  outline: '#74777f',
  outlineVariant: '#c4c6cf',
  error: '#ba1a1a',
  white: '#ffffff',
  black: '#000000',
};

export const Typography = {
  fontDisplay: 'PublicSans-Bold',
  fontHeadline: 'PublicSans-SemiBold',
  fontBody: 'Inter-Regular',
  fontBodyMedium: 'Inter-Medium',
  fontLabel: 'PublicSans-Regular',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const Shadow = {
  // Ambient shadow — derived from primary, never pure black
  card: {
    shadowColor: '#000a1e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  modal: {
    shadowColor: '#000a1e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 6,
  },
};
