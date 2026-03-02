import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Help – parity with companion-app /help (mobile).
 */
export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>
          Help
        </ThemedText>
        <ThemedText style={styles.body}>
          Find answers to common questions about flights, duty-free shopping, gifts, and airport services.
        </ThemedText>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Flights</ThemedText>
          <ThemedText style={styles.body}>Check your flight status and attach flights to your trip from the Fly tab.</ThemedText>
        </View>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Gifts & Shopping</ThemedText>
          <ThemedText style={styles.body}>Reserve duty-free items and gifts ahead of time. Collect at the airport before your flight.</ThemedText>
        </View>
        <Link href="/" asChild>
          <Pressable style={[styles.cta, { backgroundColor: primary }]}>
            <ThemedText style={styles.ctaText}>Back to Home</ThemedText>
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
