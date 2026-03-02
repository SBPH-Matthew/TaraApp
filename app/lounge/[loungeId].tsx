import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const LOUNGE_MAP: Record<string, { name: string; terminal: string; hours: string; amenities: string[] }> = {
  'pacific-club': {
    name: 'Pacific Club Lounge',
    terminal: 'NAIA Terminal 1',
    hours: 'Open daily, 24 hours',
    amenities: ['Hot meals', 'Shower rooms', 'Fast Wi-Fi', 'Charging stations'],
  },
  skyline: {
    name: 'Skyline Business Lounge',
    terminal: 'NAIA Terminal 3',
    hours: 'Open daily, 5:00 AM - 11:00 PM',
    amenities: ['Quiet zone', 'Snacks and drinks', 'Power outlets', 'Work desks'],
  },
};

export default function LoungeDetailsScreen() {
  const { loungeId } = useLocalSearchParams<{ loungeId: string }>();
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;
  const key = Array.isArray(loungeId) ? loungeId[0] : loungeId;
  const lounge = LOUNGE_MAP[key ?? ''] ?? {
    name: `Lounge ${key ?? '—'}`,
    terminal: 'Terminal information unavailable',
    hours: 'Hours unavailable',
    amenities: ['Seating area', 'Wi-Fi'],
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>{lounge.name}</ThemedText>

        <View style={styles.card}>
          <View style={styles.row}>
            <AppIcon name="place" size={18} color={primary} />
            <ThemedText style={styles.cardText}>{lounge.terminal}</ThemedText>
          </View>
          <View style={styles.row}>
            <AppIcon name="schedule" size={18} color={primary} />
            <ThemedText style={styles.cardText}>{lounge.hours}</ThemedText>
          </View>
        </View>

        <ThemedText type="defaultSemiBold" style={styles.amenitiesTitle}>Amenities</ThemedText>
        <View style={styles.amenitiesWrap}>
          {lounge.amenities.map((item) => (
            <View key={item} style={styles.amenityRow}>
              <AppIcon name="check-circle" size={16} color="#01BC1D" />
              <ThemedText style={styles.amenityText}>{item}</ThemedText>
            </View>
          ))}
        </View>

        <Pressable style={({ pressed }) => [styles.reserveBtn, { backgroundColor: primary }, pressed && styles.pressed]}>
          <ThemedText style={styles.reserveText}>Reserve access</ThemedText>
        </Pressable>

        <Link href="/lounge" asChild>
          <Pressable style={({ pressed }) => [styles.backBtn, { borderColor: primary }, pressed && styles.pressed]}>
            <ThemedText style={[styles.backText, { color: primary }]}>Back to lounges</ThemedText>
          </Pressable>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  scroll: { paddingBottom: 80 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  card: { borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 12, padding: 14, backgroundColor: '#fff', gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardText: { fontSize: 14 },
  amenitiesTitle: { marginTop: 18, fontSize: 16 },
  amenitiesWrap: { marginTop: 10, gap: 8 },
  amenityRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amenityText: { fontSize: 14 },
  reserveBtn: { marginTop: 22, minHeight: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  reserveText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  backBtn: { marginTop: 10, minHeight: 48, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 15, fontWeight: '600' },
  pressed: { opacity: 0.85 },
});
