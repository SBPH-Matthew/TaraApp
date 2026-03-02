import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Mock catalog – TODO: backend */
const ITEMS = [
  { id: '1', name: 'Premium Chocolate Box', price: 500 },
  { id: '2', name: 'Gift Hamper', price: 1200 },
  { id: '3', name: 'Personalized Travel Kit', price: 800 },
];

function formatPrice(value: number) {
  return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * All gifts – parity with companion-app /gifts/all (mobile).
 */
export default function GiftsAllScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>
          All Gifts
        </ThemedText>
        <View style={styles.list}>
          {ITEMS.map((item) => (
            <View key={item.id} style={styles.row}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
              <ThemedText style={styles.price}>{formatPrice(item.price)}</ThemedText>
              <Pressable style={[styles.addBtn, { backgroundColor: primary }]}>
                <ThemedText style={styles.addBtnText}>Add</ThemedText>
              </Pressable>
            </View>
          ))}
        </View>
        <Link href="/basket" asChild>
          <Pressable style={[styles.cta, { backgroundColor: primary }]}>
            <ThemedText style={styles.ctaText}>Go to basket</ThemedText>
          </Pressable>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  scroll: { paddingBottom: 120 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  list: { gap: 16 },
  row: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  price: { fontSize: 14, color: '#687076', marginTop: 4 },
  addBtn: { marginTop: 12, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  cta: { marginTop: 24, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
