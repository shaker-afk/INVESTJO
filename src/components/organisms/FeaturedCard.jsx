/**
 * FeaturedCard.jsx — Organism
 * A hero card shown above the main feed for the featured / top-ranked listing.
 * Uses a full-bleed image with a glassmorphism overlay.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import SectorBadge from '../atoms/SectorBadge';
import { Colors, Spacing, Radius, Shadow } from '../../constants/theme';

/**
 * @param {object}   props
 * @param {object}   props.listing
 * @param {boolean}  props.isRTL
 * @param {string}   props.lang
 * @param {string}   props.featuredLabel  — Localised "Featured Project" text
 * @param {string}   props.investLabel    — Localised "Invest Now" text
 * @param {Function} [props.onPress]
 */
export default function FeaturedCard({
  listing,
  isRTL,
  lang,
  featuredLabel,
  investLabel,
  onPress,
}) {
  const [imgError, setImgError] = useState(false);

  if (!listing) return null;

  const title = lang === 'ar' ? listing.titleAr : listing.titleEn;
  const description = lang === 'ar' ? listing.descriptionAr : listing.descriptionEn;
  const sectorLabel = lang === 'ar' ? listing.sectorAr : listing.sector;

  const pct = Math.min(Math.round((listing.raisedAmount / listing.targetCapitalization) * 100), 100);

  return (
    <TouchableOpacity
      style={[styles.card, Shadow.modal]}
      onPress={() => onPress?.(listing)}
      activeOpacity={0.92}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {/* Full-bleed image */}
      {imgError ? (
        <View style={[styles.image, styles.imgPlaceholder]} />
      ) : (
        <Image
          source={listing.imageSource ?? { uri: listing.imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      )}

      {/* Gradient overlay for text legibility */}
      <LinearGradient
        colors={['transparent', 'rgba(0,10,30,0.85)']}
        style={styles.overlay}
      >
        {/* Featured label badge */}
        <View style={[styles.featuredBadge, isRTL && styles.rowRTL]}>
          <Ionicons name="star" size={11} color={Colors.warmSand} />
          <Text style={styles.featuredBadgeText}>{featuredLabel}</Text>
        </View>

        {/* Sector badge */}
        <SectorBadge label={sectorLabel} sector={listing.sector} />

        {/* Title */}
        <Text style={[styles.title, isRTL && styles.textRTL]} numberOfLines={2}>
          {title}
        </Text>

        {/* Description */}
        <Text style={[styles.description, isRTL && styles.textRTL]} numberOfLines={2}>
          {description}
        </Text>

        {/* Progress + CTA */}
        <View style={[styles.footer, isRTL && styles.rowRTL]}>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{pct}% funded</Text>
          </View>

          <TouchableOpacity style={styles.ctaButton} onPress={() => onPress?.(listing)}>
            <Text style={styles.ctaText}>{investLabel}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.md,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    height: 280,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  imgPlaceholder: {
    backgroundColor: Colors.primaryContainer,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: Spacing.md,
    justifyContent: 'flex-end',
    gap: Spacing.xs,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(194,178,128,0.2)',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(194,178,128,0.4)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
    marginBottom: Spacing.xs,
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.warmSand,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.onPrimary,
    letterSpacing: -0.4,
    lineHeight: 25,
    marginTop: Spacing.xs,
  },
  textRTL: {
    textAlign: 'right',
  },
  description: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 17,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  progressContainer: {
    flex: 1,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.warmSand,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 3,
  },
  ctaButton: {
    backgroundColor: Colors.warmSand,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
});
