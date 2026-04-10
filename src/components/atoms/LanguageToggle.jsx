/**
 * LanguageToggle.jsx — Atom
 * A compact EN / AR toggle pill for the header.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '../../constants/theme';

/**
 * @param {object} props
 * @param {string} props.lang          — Current language ('en' | 'ar')
 * @param {Function} props.onToggle    — Callback to toggle language
 */
export default function LanguageToggle({ lang, onToggle }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Text style={[styles.option, lang === 'en' && styles.activeOption]}>EN</Text>
      <Text style={styles.divider}>|</Text>
      <Text style={[styles.option, lang === 'ar' && styles.activeOption]}>AR</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  option: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.8,
  },
  activeOption: {
    color: Colors.primaryContainer,
    fontWeight: '700',
  },
  divider: {
    color: Colors.outlineVariant,
    fontSize: 12,
  },
});
