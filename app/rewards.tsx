import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const HIGHLIGHTS = [
  { title: 'Earn points', detail: 'Collect points on qualifying purchases and selected services.' },
  { title: 'Redeem perks', detail: 'Use points for vouchers, upgrades, and partner discounts.' },
  { title: 'Track progress', detail: 'Monitor your level status and available rewards in-app.' },
];

export default function RewardsScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>Rewards</ThemedText>
        <ThemedText style={styles.body}>Build points across flights and shopping to unlock member benefits.</ThemedText>

        <View style={styles.banner}>
          <AppIcon name="stars" size={18} color="#fff" />
          <ThemedText style={styles.bannerText}>Level 1: Curious Cat</ThemedText>
        </View>

        <View style={styles.list}>
          {HIGHLIGHTS.map((item) => (
            <View key={item.title} style={styles.card}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText style={styles.cardText}>{item.detail}</ThemedText>
            </View>
          ))}
        </View>

        <Link href="/partners" asChild>
          <Pressable style={({ pressed }) => [styles.cta, { backgroundColor: primary }, pressed && styles.pressed]}>
            <ThemedText style={styles.ctaText}>See partner offers</ThemedText>
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
  banner: { marginTop: 16, borderRadius: 10, backgroundColor: '#0B3BA7', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  bannerText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  list: { marginTop: 14, gap: 12 },
  card: { borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
  cardText: { marginTop: 6, color: '#687076', fontSize: 13, lineHeight: 18 },
  cta: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  ctaText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  pressed: { opacity: 0.85 },
});
