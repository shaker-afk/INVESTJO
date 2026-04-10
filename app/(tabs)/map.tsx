/**
 * app/(tabs)/map.tsx
 * Map tab — placeholder until the interactive investment map is built.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
  primaryContainer: '#002147',
  surfaceContainerLow: '#f3f4f5',
  onSurfaceVariant: '#44474e',
  surface: '#f8f9fa',
};

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Ionicons name="map-outline" size={48} color={Colors.primaryContainer} />
        </View>
        <Text style={styles.title}>Investment Map</Text>
        <Text style={styles.sub}>
          Interactive Jordan investment zone map coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceContainerLow },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#e7e8e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryContainer,
    letterSpacing: -0.4,
  },
  sub: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 21,
  },
});
