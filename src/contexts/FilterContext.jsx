/**
 * FilterContext.jsx
 * Shared filter state accessible by both DiscoveryDashboard and FiltersScreen.
 * Avoids prop-drilling across Expo Router navigation boundaries.
 *
 * Consumed via: useFilters() hook
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Capital Range Buckets
// ---------------------------------------------------------------------------
export const CAPITAL_BUCKETS = [
  { label: 'Any',              labelAr: 'الكل',                value: null },
  { label: 'Under 50k JOD',    labelAr: 'أقل من 50,000 د.أ',  value: { min: 0,      max: 50000  } },
  { label: '50k – 150k JOD',   labelAr: '50,000 – 150,000 د.أ', value: { min: 50000,  max: 150000 } },
  { label: '150k – 300k JOD',  labelAr: '150,000 – 300,000 د.أ', value: { min: 150000, max: 300000 } },
  { label: 'Over 300k JOD',    labelAr: 'أكثر من 300,000 د.أ', value: { min: 300000, max: Infinity } },
];

export const ALL_SECTORS = ['Energy', 'Tourism', 'Technology', 'Agriculture'];

// ---------------------------------------------------------------------------
// Default filter state
// ---------------------------------------------------------------------------
const DEFAULT_FILTERS = {
  sectors: [],          // [] = all sectors
  capitalBucket: null,  // null = any, or a CAPITAL_BUCKETS[n].value object
  ecoOnly: false,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  /** Replace entire filter state */
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  /** Reset to defaults */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  /** Derived: is any filter active? */
  const hasActiveFilters =
    filters.sectors.length > 0 ||
    filters.capitalBucket !== null ||
    filters.ecoOnly;

  return (
    <FilterContext.Provider
      value={{ filters, applyFilters, resetFilters, hasActiveFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
}

/** Hook to consume FilterContext */
export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used inside <FilterProvider>');
  return ctx;
}
