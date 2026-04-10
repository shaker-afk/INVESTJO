/**
 * DiscoveryDashboard.jsx — Screen / Template
 *
 * Discovery Dashboard (Screen 1) for the InvestJO platform.
 *
 * Architecture:
 *  - Data layer: src/services/firebase/listingService.js (Firebase-ready)
 *  - i18n layer: src/hooks/useTranslation.js
 *  - Design tokens: src/constants/theme.js
 *  - Components: Atomic Design (atoms → molecules → organisms)
 *
 * RTL: Layout direction auto-adjusts via `isRTL` from useTranslation.
 * Bilingual: All user-facing strings come through the `t()` function.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Services
import { fetchListings } from '../../src/services/firebase/listingService';

// Hooks
import { useTranslation } from '../../src/hooks/useTranslation';
import { useFilters } from '../../src/contexts/FilterContext';

// Organisms
import DashboardHeader from '../../src/components/organisms/DashboardHeader';
import FeaturedCard from '../../src/components/organisms/FeaturedCard';

// Molecules
import InvestmentCard from '../../src/components/molecules/InvestmentCard';

// Theme
import { Colors, Spacing } from '../../src/constants/theme';

// ---------------------------------------------------------------------------
// Section Header sub-component
// ---------------------------------------------------------------------------
function SectionHeader({ title, actionLabel, isRTL, onAction }) {
  return (
    <View style={[sectionStyles.row, isRTL && sectionStyles.rowRTL]}>
      <Text style={[sectionStyles.title, isRTL && sectionStyles.textRTL]}>{title}</Text>
      <TouchableOpacity onPress={onAction} accessibilityRole="button">
        <Text style={sectionStyles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rowRTL: { flexDirection: 'row-reverse' },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.3,
  },
  textRTL: { textAlign: 'right' },
  action: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryContainer,
  },
});

// ---------------------------------------------------------------------------
// Sector Filter Chips
// ---------------------------------------------------------------------------
const SECTORS = ['All', 'Energy', 'Tourism', 'Technology', 'Agriculture'];
const SECTORS_AR = ['الكل', 'طاقة', 'سياحة', 'تكنولوجيا', 'زراعة'];

function SectorChips({ activeSector, onSelect, isRTL, lang }) {
  const labels = lang === 'ar' ? SECTORS_AR : SECTORS;
  const values = SECTORS; // always use English keys for filtering

  return (
    <View style={chipStyles.wrapper}>
      <FlatList
        horizontal
        data={labels}
        keyExtractor={(_, i) => values[i]}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          chipStyles.list,
          isRTL && chipStyles.listRTL,
        ]}
        inverted={isRTL}
        renderItem={({ item, index }) => {
          const isActive = activeSector === values[index];
          return (
            <TouchableOpacity
              style={[chipStyles.chip, isActive && chipStyles.chipActive]}
              onPress={() => onSelect(values[index])}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[chipStyles.label, isActive && chipStyles.labelActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const chipStyles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  list: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  listRTL: { flexDirection: 'row-reverse' },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  chipActive: {
    backgroundColor: Colors.primaryContainer,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  labelActive: {
    color: Colors.onPrimary,
    fontWeight: '600',
  },
});

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export default function DiscoveryDashboard() {
  const { t, lang, isRTL, toggleLanguage } = useTranslation();
  const { filters, hasActiveFilters, resetFilters } = useFilters();

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSector, setActiveSector] = useState('All');
  const [error, setError] = useState(null);

  // ── Data fetching ────────────────────────────────────────────────────────
  const loadListings = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchListings();
      setListings(data);
    } catch (e) {
      setError(e.message ?? 'Failed to load listings.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  // ── Filtering logic ──────────────────────────────────────────────────────
  useEffect(() => {
    let result = listings;

    // Quick-chip sector filter (local)
    if (activeSector !== 'All') {
      result = result.filter((l) => l.sector === activeSector);
    }

    // FilterContext — sector multi-select
    if (filters.sectors.length > 0) {
      result = result.filter((l) => filters.sectors.includes(l.sector));
    }

    // FilterContext — capital range
    if (filters.capitalBucket) {
      const { min, max } = filters.capitalBucket;
      result = result.filter(
        (l) => l.capitalMin >= min && l.capitalMax <= (max === Infinity ? 99999999 : max)
      );
    }

    // FilterContext — eco only
    if (filters.ecoOnly) {
      result = result.filter((l) => l.isEcoFriendly);
    }

    // Search filter (EN title + AR title)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.titleEn.toLowerCase().includes(q) ||
          l.titleAr.includes(searchQuery)
      );
    }

    setFilteredListings(result);
  }, [listings, activeSector, searchQuery, filters]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadListings();
  }, [loadListings]);

  const handleCardPress = useCallback((listing) => {
    router.push(`/listing/${listing.id}`);
  }, []);

  const handleFilterPress = useCallback(() => {
    router.push('/filters');
  }, []);

  // Reset both the quick-chip and the modal filters
  const handleViewAll = useCallback(() => {
    setActiveSector('All');
    resetFilters();
  }, [resetFilters]);

  // ── Derived data ─────────────────────────────────────────────────────────
  // Top 3 by trending are always shown in the featured slider (unaffected by chips)
  const featuredListings = [...listings]
    .sort((a, b) => b.trendingCount - a.trendingCount)
    .slice(0, 3);
  // The feed shows ALL filtered results — no slicing
  const feedListings = filteredListings;

  // ── Render list item ─────────────────────────────────────────────────────
  const renderCard = useCallback(
    ({ item }) => (
      <InvestmentCard
        listing={item}
        isRTL={isRTL}
        lang={lang}
        ecoLabel={t('ecoFriendly')}
        trendLabel={t('trending')}
        onPress={handleCardPress}
      />
    ),
    [isRTL, lang, t, handleCardPress]
  );

  // ── Featured slider ─────────────────────────────────────────────────────────
  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = useRef(null);
  const isUserScrolling = useRef(false);

  // Auto-advance every 4 seconds; pause while the user is dragging
  useEffect(() => {
    if (featuredListings.length <= 1) return;
    const interval = setInterval(() => {
      if (isUserScrolling.current) return;
      setSlideIndex((prev) => {
        const next = (prev + 1) % featuredListings.length;
        sliderRef.current?.scrollToOffset({
          offset: next * SCREEN_WIDTH,
          animated: true,
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredListings.length]);

  const FeaturedSlider = featuredListings.length > 0 ? (
    <View style={styles.section}>
      <SectionHeader
        title={t('featuredProject')}
      />

      {/* Horizontal paged scroll */}
      <FlatList
        ref={sliderRef}
        data={featuredListings}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScrollBeginDrag={() => { isUserScrolling.current = true; }}
        onMomentumScrollEnd={(e) => {
          isUserScrolling.current = false;
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setSlideIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            <FeaturedCard
              listing={item}
              isRTL={isRTL}
              lang={lang}
              featuredLabel={t('featuredProject')}
              investLabel={t('invest')}
              onPress={handleCardPress}
            />
          </View>
        )}
      />

      {/* Pagination dots */}
      <View style={styles.dotsRow}>
        {featuredListings.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === slideIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  ) : null;

  // ── List header ──────────────────────────────────────────────────────────
  const ListHeader = (
    <>
      {/* Featured Hero Slider */}
      {FeaturedSlider}

      {/* Sector chip filters */}
      <View style={styles.section}>
        <SectorChips
          activeSector={activeSector}
          onSelect={setActiveSector}
          isRTL={isRTL}
          lang={lang}
        />
      </View>

      {/* Feed label */}
      <SectionHeader
        title={t('activeOpportunities')}
        actionLabel={t('viewAll')}
        isRTL={isRTL}
        onAction={handleViewAll}
      />
    </>
  );

  // ── Empty / error states ─────────────────────────────────────────────────
  const ListEmpty = (
    <View style={styles.emptyState}>
      {error ? (
        <>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadListings}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.emptyText}>{t('noListings')}</Text>
      )}
    </View>
  );

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primaryContainer} />
        <DashboardHeader
          searchQuery=""
          onSearchChange={() => {}}
          searchPlaceholder={t('searchPlaceholder')}
          lang={lang}
          isRTL={isRTL}
          onToggleLanguage={toggleLanguage}
          filterLabel={t('filter')}
          onFilterPress={handleFilterPress}
          hasActiveFilters={hasActiveFilters}
          tagline={t('tagline')}
        />
        <View style={styles.loadingBody}>
          <ActivityIndicator size="large" color={Colors.primaryContainer} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryContainer} />

      <FlatList
        data={feedListings}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        ListHeaderComponent={
          <>
            <DashboardHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder={t('searchPlaceholder')}
              lang={lang}
              isRTL={isRTL}
              onToggleLanguage={toggleLanguage}
              filterLabel={t('filter')}
              onFilterPress={handleFilterPress}
              hasActiveFilters={hasActiveFilters}
              tagline={t('tagline')}
            />
            <View style={styles.feedContainer}>
              {ListHeader}
            </View>
          </>
        }
        ListEmptyComponent={<View style={styles.feedContainer}>{ListEmpty}</View>}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primaryContainer}
          />
        }
        // Performance
        removeClippedSubviews
        maxToRenderPerBatch={4}
        windowSize={8}
      />
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  loadingBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 32,
  },
  feedContainer: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingTop: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  retryText: {
    color: Colors.onPrimary,
    fontWeight: '600',
    fontSize: 14,
  },

  // Featured slider pagination dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outlineVariant,
  },
  dotActive: {
    width: 18,
    borderRadius: 3,
    backgroundColor: Colors.primaryContainer,
  },
});
