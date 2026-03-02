import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const LOUNGES = [
  { id: 'pacific-club', name: 'Pacific Club Lounge', terminal: 'NAIA Terminal 1', highlights: 'Showers, buffet, Wi-Fi' },
  { id: 'skyline', name: 'Skyline Business Lounge', terminal: 'NAIA Terminal 3', highlights: 'Quiet pods, charging, snacks' },
];

export default function LoungeIndexScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>Lounge Access</ThemedText>
        <ThemedText style={styles.body}>
          Browse available airport lounges and check amenities before your trip.
        </ThemedText>

        <View style={styles.list}>
          {LOUNGES.map((lounge) => (
            <Link key={lounge.id} href={{ pathname: '/lounge/[loungeId]', params: { loungeId: lounge.id } }} asChild>
              <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
                <View style={styles.row}>
                  <AppIcon name="weekend" size={20} color={primary} />
                  <ThemedText type="defaultSemiBold" style={styles.cardTitle}>{lounge.name}</ThemedText>
                </View>
                <ThemedText style={styles.cardMeta}>{lounge.terminal}</ThemedText>
                <ThemedText style={styles.cardDesc}>{lounge.highlights}</ThemedText>
              </Pressable>
            </Link>
          ))}
        </View>

        <Link href="/fly" asChild>
          <Pressable style={({ pressed }) => [styles.cta, { backgroundColor: primary }, pressed && styles.pressed]}>
            <ThemedText style={styles.ctaText}>Check flights first</ThemedText>
          </Pressable>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  scroll: { paddingBottom: 80 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 10 },
  body: { fontSize: 14, color: '#687076', lineHeight: 22 },
  list: { marginTop: 18, gap: 12 },
  card: { borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 12, padding: 14, backgroundColor: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 16, flex: 1 },
  cardMeta: { marginTop: 6, fontSize: 13, color: '#687076' },
  cardDesc: { marginTop: 4, fontSize: 13 },
  cta: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  ctaText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  pressed: { opacity: 0.85 },
});
