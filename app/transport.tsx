import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const OPTIONS = [
  { icon: 'local-taxi', title: 'Airport taxi', subtitle: 'Official metered and coupon taxi stands.' },
  { icon: 'directions-bus', title: 'Shuttle bus', subtitle: 'Inter-terminal and city-bound shuttle options.' },
  { icon: 'directions-car', title: 'Private pickup', subtitle: 'Coordinate driver pickup zones by terminal.' },
];

export default function TransportScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>Transport</ThemedText>
        <ThemedText style={styles.body}>Ground transport and pickup guidance to keep your transfer smooth.</ThemedText>

        <View style={styles.list}>
          {OPTIONS.map((item) => (
            <View key={item.title} style={styles.card}>
              <AppIcon name={item.icon as any} size={20} color={primary} />
              <View style={styles.cardBody}>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText style={styles.cardSubtitle}>{item.subtitle}</ThemedText>
              </View>
            </View>
          ))}
        </View>

        <Link href="/airport" asChild>
          <Pressable style={({ pressed }) => [styles.cta, { backgroundColor: primary }, pressed && styles.pressed]}>
            <ThemedText style={styles.ctaText}>View airport guide</ThemedText>
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
  cardBody: { flex: 1 },
  cardSubtitle: { marginTop: 3, color: '#687076', fontSize: 13, lineHeight: 18 },
  cta: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  ctaText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  pressed: { opacity: 0.85 },
});
