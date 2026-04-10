/**
 * CapitalBadge.jsx — Atom
 * Renders the capital range badge (e.g. "50k – 100k JOD").
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '../../constants/theme';

/**
 * Format a number to a compact string: 50000 → "50k", 1500000 → "1.5M"
 */
function compact(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}k`;
  return `${n}`;
}

/**
 * @param {object} props
 * @param {number} props.min
 * @param {number} props.max
 * @param {string} [props.currency='JOD']
 */
export default function CapitalBadge({ min, max, currency = 'JOD' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {compact(min)} – {compact(max)} {currency}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs - 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSecondaryContainer,
    letterSpacing: 0.3,
  },
});
