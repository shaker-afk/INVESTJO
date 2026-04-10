/**
 * app/(tabs)/profile.tsx
 * Profile tab — placeholder until the user profile screen (Firebase Auth) is built.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
  primaryContainer: '#002147',
  surfaceContainerLow: '#f3f4f5',
  onSurfaceVariant: '#44474e',
  warmSand: '#C2B280',
};

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.body}>
        {/* Avatar placeholder */}
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>IJ</Text>
        </View>
        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.sub}>
          Sign in to view your investor profile, KYC status, and saved listings.
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
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.warmSand,
    letterSpacing: 1,
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
