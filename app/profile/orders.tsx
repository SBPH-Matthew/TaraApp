import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ORDERS = [
  { id: 'ORD-2026-001', item: 'Duty Free Bundle', date: 'Feb 10, 2026', status: 'Ready for pickup' },
  { id: 'ORD-2026-002', item: 'Travel Essentials Kit', date: 'Feb 08, 2026', status: 'Completed' },
];

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText style={[styles.title, { color: primary }]}>MY ORDERS</ThemedText>
        <ThemedText style={styles.subtitle}>Track your recent airport and duty-free reservations.</ThemedText>

        <View style={styles.list}>
          {ORDERS.map((order) => (
            <View key={order.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <ThemedText type="defaultSemiBold" style={styles.orderId}>{order.id}</ThemedText>
                <View style={styles.statusPill}>
                  <ThemedText style={styles.statusText}>{order.status}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.orderItem}>{order.item}</ThemedText>
              <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
            </View>
          ))}
        </View>

        <Link href="/shop" asChild>
          <Pressable style={({ pressed }) => [styles.cta, { backgroundColor: primary }, pressed && styles.pressed]}>
            <AppIcon name="storefront" size={18} color="#fff" />
            <ThemedText style={styles.ctaText}>Continue shopping</ThemedText>
          </Pressable>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  scroll: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { marginTop: 8, color: '#687076', fontSize: 14, lineHeight: 20 },
  list: { marginTop: 20, gap: 12 },
  card: { borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 12, padding: 14, backgroundColor: '#fff' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  orderId: { fontSize: 14 },
  statusPill: { backgroundColor: '#eef7ff', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 11, fontWeight: '600', color: '#0B3BA7' },
  orderItem: { marginTop: 8, fontSize: 16, fontWeight: '500' },
  orderDate: { marginTop: 4, color: '#687076', fontSize: 13 },
  cta: { marginTop: 20, minHeight: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  ctaText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  pressed: { opacity: 0.85 },
});
