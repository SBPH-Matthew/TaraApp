import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PARTNERS = [
  { name: 'Duty Free Philippines', category: 'Retail', promo: 'Selected member discounts available.' },
  { name: 'SpeedRegalo', category: 'Gifts', promo: 'Reserve gifts and pick up before boarding.' },
  { name: 'Airport Lounge Network', category: 'Travel', promo: 'Access partner lounges with select perks.' },
];

export default function PartnersScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>Partners</ThemedText>
        <ThemedText style={styles.body}>Discover active partners and where you can use travel perks and promos.</ThemedText>

        <View style={styles.list}>
          {PARTNERS.map((partner) => (
            <View key={partner.name} style={styles.card}>
              <View style={styles.cardHeader}>
                <AppIcon name="handshake" size={18} color={primary} />
                <ThemedText type="defaultSemiBold" style={styles.partnerName}>{partner.name}</ThemedText>
              </View>
              <ThemedText style={styles.partnerMeta}>{partner.category}</ThemedText>
              <ThemedText style={styles.partnerPromo}>{partner.promo}</ThemedText>
            </View>
          ))}
        </View>

        <Link href="/rewards" asChild>
          <Pressable style={({ pressed }) => [styles.cta, { backgroundColor: primary }, pressed && styles.pressed]}>
            <ThemedText style={styles.ctaText}>View rewards</ThemedText>
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
  card: { borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  partnerName: { flex: 1, fontSize: 15 },
  partnerMeta: { marginTop: 4, color: '#687076', fontSize: 12 },
  partnerPromo: { marginTop: 6, fontSize: 13, lineHeight: 18 },
  cta: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  ctaText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  pressed: { opacity: 0.85 },
});
