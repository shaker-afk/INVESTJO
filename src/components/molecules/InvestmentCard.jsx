/**
 * InvestmentCard.jsx — Molecule
 * A premium card component for a single investment listing.
 * Follows the "Sovereign Ledger" design system:
 *  - surface-container-lowest background on surface-container-low parent
 *  - XL radius (24px) — no sharp corners
 *  - No dividers — spacing only
 *  - Ambient shadow derived from primary (#000a1e)
 *  - Jordanian 7-pointed star watermark on premium cards
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SectorBadge from '../atoms/SectorBadge';
import CapitalBadge from '../atoms/CapitalBadge';
import { Colors, Spacing, Radius, Shadow } from '../../constants/theme';

// ---------------------------------------------------------------------------
// Progress Bar sub-component
// ---------------------------------------------------------------------------
function FundingProgress({ raised, target }) {
  const pct = Math.min(Math.round((raised / target) * 100), 100);
  return (
    <View style={progress.wrapper}>
      <View style={progress.track}>
        <View style={[progress.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={progress.label}>{pct}% funded</Text>
    </View>
  );
}

const progress = StyleSheet.create({
  wrapper: { marginTop: Spacing.sm },
  track: {
    height: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.warmSand,
    borderRadius: 2,
  },
  label: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
    fontWeight: '500',
  },
});

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

/**
 * @param {object}   props
 * @param {object}   props.listing  — A single listing object from listingService
 * @param {boolean}  props.isRTL    — Layout direction flag
 * @param {string}   props.lang     — 'en' | 'ar'
 * @param {string}   props.ecoLabel — Localised "Eco-Friendly" string
 * @param {string}   props.trendLabel — Localised "Trending" string
 * @param {Function} [props.onPress] — Tap handler
 */
export default function InvestmentCard({
  listing,
  isRTL,
  lang,
  ecoLabel,
  trendLabel,
  onPress,
}) {
  const title = lang === 'ar' ? listing.titleAr : listing.titleEn;
  const description = lang === 'ar' ? listing.descriptionAr : listing.descriptionEn;
  const sectorLabel = lang === 'ar' ? listing.sectorAr : listing.sector;

  // Prefer local bundled asset; fall back to remote URL
  const imageSource = listing.imageSource ?? { uri: listing.imageUrl };

  const handlePress = useCallback(() => onPress?.(listing), [listing, onPress]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.92}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {/* Project Image */}
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Jordanian Star Watermark — decorative quality mark */}
        <Text style={styles.starWatermark}>✦</Text>

        {/* Eco-Friendly overlay tag */}
        {listing.isEcoFriendly && (
          <View style={[styles.ecoTag, isRTL && styles.ecoTagRTL]}>
            <Ionicons name="leaf" size={11} color={Colors.eco} />
            <Text style={styles.ecoText}>{ecoLabel}</Text>
          </View>
        )}
      </View>

      {/* Card Body */}
      <View style={styles.body}>
        {/* Badges Row */}
        <View style={[styles.badgeRow, isRTL && styles.rowRTL]}>
          <SectorBadge label={sectorLabel} sector={listing.sector} />
          <CapitalBadge
            min={listing.capitalMin}
            max={listing.capitalMax}
            currency={listing.currency}
          />
        </View>

        {/* Title */}
        <Text style={[styles.title, isRTL && styles.textRTL]} numberOfLines={2}>
          {title}
        </Text>

        {/* Description */}
        <Text style={[styles.description, isRTL && styles.textRTL]} numberOfLines={2}>
          {description}
        </Text>

        {/* Funding Progress */}
        <FundingProgress
          raised={listing.raisedAmount}
          target={listing.targetCapitalization}
        />

        {/* Footer — Trending metric */}
        <View style={[styles.footer, isRTL && styles.rowRTL]}>
          <View style={[styles.trendPill, isRTL && styles.rowRTL]}>
            <Ionicons name="trending-up" size={13} color={Colors.trend} />
            <Text style={styles.trendText}>
              {trendLabel} · {listing.trendingCount.toLocaleString()}
            </Text>
          </View>

          {/* Location */}
          <View style={[styles.location, isRTL && styles.rowRTL]}>
            <Ionicons name="location-outline" size={12} color={Colors.onSurfaceVariant} />
            <Text style={styles.locationText} numberOfLines={1}>
              {listing.location}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadow.card,
  },

  // Image
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  starWatermark: {
    position: 'absolute',
    top: 10,
    right: 14,
    fontSize: 32,
    color: 'rgba(255,255,255,0.12)',
  },

  // Eco tag
  ecoTag: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.ecoLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
  },
  ecoTagRTL: {
    left: undefined,
    right: 12,
    flexDirection: 'row-reverse',
  },
  ecoText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.eco,
  },

  // Body
  body: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },

  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.3,
    lineHeight: 23,
  },
  textRTL: {
    textAlign: 'right',
  },

  description: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 19,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.trendLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.trend,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
    justifyContent: 'flex-end',
  },
  locationText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
});
