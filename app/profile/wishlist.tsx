import { StyleSheet, View, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Wishlist – parity with companion-app /profile/wishlist (mobile).
 * Empty state or list of wishlist items. TODO: backend.
 */
export default function WishlistScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;
  const items: { id: string; name: string }[] = []; // TODO: from backend

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={[styles.title, { color: primary }]}>
        Wishlist
      </ThemedText>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <AppIcon name="favorite-border" size={40} color="#687076" />
          </View>
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No items in your wishlist
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Browse gifts and add items you like to your wishlist.
          </ThemedText>
          <Link href="/gifts" asChild>
            <Pressable style={[styles.cta, { backgroundColor: primary }]}>
              <ThemedText style={styles.ctaText}>Browse Gifts</ThemedText>
            </Pressable>
          </Link>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <View key={item.id} style={styles.row}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
            </View>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { marginTop: 24 },
  emptySubtitle: { fontSize: 14, color: '#687076', marginTop: 8, textAlign: 'center' },
  cta: { marginTop: 24, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, minHeight: 44, justifyContent: 'center' },
  ctaText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  list: { gap: 12 },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e4e4e7' },
});
