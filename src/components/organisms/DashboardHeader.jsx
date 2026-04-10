/**
 * DashboardHeader.jsx — Organism
 * The Discovery Dashboard header:
 *   - Greeting + tagline
 *   - Search bar (RTL-safe)
 *   - Language Toggle + Profile icon
 *   - Filter button
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import LanguageToggle from '../atoms/LanguageToggle';
import { Colors, Spacing, Radius } from '../../constants/theme';

/**
 * @param {object}   props
 * @param {string}   props.searchQuery
 * @param {Function} props.onSearchChange
 * @param {string}   props.searchPlaceholder
 * @param {string}   props.lang
 * @param {boolean}  props.isRTL
 * @param {Function} props.onToggleLanguage
 * @param {string}   props.filterLabel
 * @param {Function} props.onFilterPress
 * @param {boolean}  [props.hasActiveFilters] — shows an accent dot when true
 * @param {string}   props.tagline
 */
export default function DashboardHeader({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  lang,
  isRTL,
  onToggleLanguage,
  filterLabel,
  onFilterPress,
  hasActiveFilters = false,
  tagline,
}) {
  return (
    <LinearGradient
      colors={[Colors.primaryContainer, Colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {/* Top row: profile icon + language toggle */}
      <View style={[styles.topRow, isRTL && styles.rowRTL]}>
        <LanguageToggle lang={lang} onToggle={onToggleLanguage} />

        <TouchableOpacity style={styles.profileButton} accessibilityRole="button">
          <Ionicons name="person-circle-outline" size={32} color={Colors.onPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tagline */}
      <Text style={[styles.tagline, isRTL && styles.textRTL]}>{tagline}</Text>

      {/* Search + Filter row */}
      <View style={[styles.searchRow, isRTL && styles.rowRTL]}>
        <View style={[styles.searchBox, isRTL && styles.rowRTL]}>
          <Ionicons
            name="search-outline"
            size={18}
            color={Colors.onSurfaceVariant}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, isRTL && styles.textRTL]}
            placeholder={searchPlaceholder}
            placeholderTextColor={Colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={onSearchChange}
            textAlign={isRTL ? 'right' : 'left'}
            returnKeyType="search"
            accessibilityLabel={searchPlaceholder}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          accessibilityRole="button"
          accessibilityLabel={filterLabel}
        >
          <Ionicons name="options-outline" size={16} color={Colors.onPrimary} />
          <Text style={styles.filterLabel}>{filterLabel}</Text>
          {hasActiveFilters && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingTop: 52,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },

  profileButton: {
    padding: 2,
  },

  tagline: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.onPrimary,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  textRTL: {
    textAlign: 'right',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.onSurface,
    paddingVertical: 0,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onPrimary,
  },
  filterDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.warmSand,
    marginLeft: 2,
  },
});
