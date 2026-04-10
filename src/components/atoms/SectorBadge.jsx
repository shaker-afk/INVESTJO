/**
 * SectorBadge.jsx — Atom
 * Renders a pill badge for an investment sector with a colour-coded background.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../constants/theme';

/** Map sector name → { bg, text } colour pair */
const SECTOR_COLORS = {
  Energy:      { bg: Colors.sectorEnergy,  text: Colors.sectorEnergyText },
  Tourism:     { bg: Colors.sectorTourism, text: Colors.sectorTourismText },
  Technology:  { bg: Colors.sectorTech,    text: Colors.sectorTechText },
  Agriculture: { bg: Colors.sectorAgri,    text: Colors.sectorAgriText },
};

/**
 * @param {object} props
 * @param {string} props.label   — Display label (already localised by the parent)
 * @param {string} [props.sector] — Raw sector key used for colour lookup
 */
export default function SectorBadge({ label, sector }) {
  const colorPair = SECTOR_COLORS[sector] ?? {
    bg: Colors.sectorDefault,
    text: Colors.sectorDefaultText,
  };

  return (
    <View style={[styles.container, { backgroundColor: colorPair.bg }]}>
      <Text style={[styles.label, { color: colorPair.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs - 1,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
