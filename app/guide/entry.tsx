import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Guide entry – parity with companion-app /guide/entry (mobile).
 */
export default function GuideEntryScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>
          Guide
        </ThemedText>
        <ThemedText style={styles.body}>
          Quick guide to using TARA!: check flights, reserve duty-free and gifts, and collect at the airport.
        </ThemedText>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Flights</ThemedText>
          <ThemedText style={styles.body}>Use the Fly tab to search and attach flights to your trip.</ThemedText>
        </View>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Gifts & Shop</ThemedText>
          <ThemedText style={styles.body}>Add items to your basket and checkout. Collect at the airport before your flight.</ThemedText>
        </View>
        <Link href="/" asChild>
          <Pressable style={[styles.cta, { backgroundColor: primary }]}>
            <ThemedText style={styles.ctaText}>Get started</ThemedText>
          </Pressable>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  scroll: { paddingBottom: 80 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  body: { fontSize: 14, color: '#687076', lineHeight: 22, marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { marginBottom: 8 },
  cta: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  ctaText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
