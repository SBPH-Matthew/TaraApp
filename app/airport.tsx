import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const FACILITIES = [
  { icon: 'luggage', title: 'Baggage support', subtitle: 'Track baggage counters and claim area timing.' },
  { icon: 'wifi', title: 'Airport Wi-Fi', subtitle: 'Connect to free Wi-Fi while waiting for boarding.' },
  { icon: 'medical-services', title: 'Assistance services', subtitle: 'Medical help desks and accessibility support points.' },
];

export default function AirportScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>Airport</ThemedText>
        <ThemedText style={styles.body}>Terminal services and facilities to help you move through the airport smoothly.</ThemedText>

        <View style={styles.list}>
          {FACILITIES.map((item) => (
            <View key={item.title} style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: '#eef4ff' }]}>
                <AppIcon name={item.icon as any} size={18} color={primary} />
              </View>
              <View style={styles.cardBody}>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText style={styles.cardSubtitle}>{item.subtitle}</ThemedText>
              </View>
            </View>
          ))}
        </View>

        <Link href="/fly" asChild>
          <Pressable style={({ pressed }) => [styles.cta, { backgroundColor: primary }, pressed && styles.pressed]}>
            <ThemedText style={styles.ctaText}>Check flights</ThemedText>
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
  card: { borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 12, padding: 12, backgroundColor: '#fff', flexDirection: 'row', gap: 10 },
  iconWrap: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1 },
  cardSubtitle: { marginTop: 3, color: '#687076', fontSize: 13, lineHeight: 18 },
  cta: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  ctaText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  pressed: { opacity: 0.85 },
});
