import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type BasketItem = { id: string; name: string; price: number; image: string };

const INITIAL_ITEMS: BasketItem[] = [
  {
    id: 'choco-1',
    name: 'Premium Chocolate Box',
    price: 500,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200&q=80',
  },
  {
    id: 'choco-2',
    name: 'Premium Chocolate Box',
    price: 500,
    image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=200&q=80',
  },
];

const SUGGESTIONS: BasketItem[] = [
  { id: 's1', name: 'Premium Chocolate Box', price: 500, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200&q=80' },
  { id: 's2', name: 'Premium Chocolate Box', price: 500, image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=200&q=80' },
  { id: 's3', name: 'Premium Chocolate Box', price: 500, image: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?w=200&q=80' },
];

const PAYMENT_METHODS = ['Visa', 'Amex', 'Mastercard', 'PayPal', 'GCash', 'Maya'];

function formatPrice(value: number) {
  return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const CARD_WIDTH = 280;

/**
 * Basket – parity with companion-app /basket (mobile).
 * Breadcrumb, MY BASKET, product list (image, qty -/+, delete), summary card, You Might Also Like, View More.
 */
export default function BasketScreen() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    INITIAL_ITEMS.forEach((item) => { map[item.id] = 1; });
    return map;
  });
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * (quantities[item.id] ?? 1), 0),
    [items, quantities]
  );
  const discount = 0;
  const total = Math.max(0, subtotal - discount);

  const handleQty = (id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] ?? 1) + delta) }));
  };
  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setQuantities((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Breadcrumb + title */}
        <View style={styles.breadcrumb}>
          <Link href="/gifts" asChild>
            <Pressable>
              <ThemedText style={styles.breadcrumbLink}>Gifts & More</ThemedText>
            </Pressable>
          </Link>
          <ThemedText style={styles.breadcrumbSep}> › </ThemedText>
          <ThemedText type="defaultSemiBold">My Basket</ThemedText>
        </View>
        <ThemedText type="title" style={[styles.pageTitle, { color: primary }]}>
          MY BASKET
        </ThemedText>

        {/* Product list */}
        <View style={styles.productList}>
          {items.map((item) => (
            <View key={item.id} style={styles.productRow}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productBody}>
                <ThemedText type="defaultSemiBold" style={styles.productName}>{item.name}</ThemedText>
                <ThemedText style={styles.productPrice}>{formatPrice(item.price)}</ThemedText>
                <View style={styles.qtyRow}>
                  <View style={styles.qtyControls}>
                    <Pressable
                      onPress={() => handleQty(item.id, -1)}
                      style={({ pressed }) => [styles.qtyBtn, pressed && styles.pressed]}
                      accessibilityLabel="Decrease quantity"
                    >
                      <AppIcon name="remove" size={20} color="#687076" />
                    </Pressable>
                    <ThemedText type="defaultSemiBold" style={styles.qtyNum}>
                      {quantities[item.id] ?? 1}
                    </ThemedText>
                    <Pressable
                      onPress={() => handleQty(item.id, 1)}
                      style={({ pressed }) => [styles.qtyBtn, pressed && styles.pressed]}
                      accessibilityLabel="Increase quantity"
                    >
                      <AppIcon name="add" size={20} color="#687076" />
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => handleRemove(item.id)}
                    style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
                    accessibilityLabel="Remove item"
                  >
                    <AppIcon name="delete-outline" size={20} color="#687076" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <ThemedText type="defaultSemiBold" style={styles.summaryHeading}>Discount</ThemedText>
          <TextInput
            placeholder="Enter Code"
            placeholderTextColor="#687076"
            style={styles.discountInput}
          />
          <ThemedText type="defaultSemiBold" style={[styles.summaryHeading, { marginTop: 16 }]}>
            Total
          </ThemedText>
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Subtotal</ThemedText>
            <ThemedText type="defaultSemiBold">{formatPrice(subtotal)}</ThemedText>
          </View>
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Discount</ThemedText>
            <ThemedText type="defaultSemiBold">{formatPrice(discount)}</ThemedText>
          </View>
          <View style={[styles.totalRow, styles.totalRowFinal]}>
            <ThemedText type="defaultSemiBold">Total</ThemedText>
            <ThemedText type="defaultSemiBold">{formatPrice(total)}</ThemedText>
          </View>
          <ThemedText style={[styles.weAccept, { marginTop: 16 }]}>WE ACCEPT</ThemedText>
          <View style={styles.paymentBadges}>
            {PAYMENT_METHODS.slice(0, 6).map((m) => (
              <View key={m} style={styles.badge}>
                <ThemedText style={styles.badgeText}>{m}</ThemedText>
              </View>
            ))}
          </View>
          <Link href="/checkout" asChild>
            <Pressable style={[styles.checkoutBtn, { marginTop: 16 }]}>
              <ThemedText type="defaultSemiBold" style={styles.checkoutBtnText}>Checkout</ThemedText>
            </Pressable>
          </Link>
          <Link href="/gifts" asChild>
            <Pressable style={styles.continueBtn}>
              <ThemedText type="defaultSemiBold" style={styles.continueBtnText}>
                Continue Shopping
              </ThemedText>
            </Pressable>
          </Link>
        </View>

        {/* You Might Also Like */}
        <View style={styles.alsoLike}>
          <ThemedText type="title" style={[styles.alsoLikeTitle, { color: primary }]}>
            YOU MIGHT ALSO LIKE
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.alsoLikeScroll}
          >
            {SUGGESTIONS.map((item) => (
              <View key={item.id} style={styles.suggestCard}>
                <Image source={{ uri: item.image }} style={styles.suggestImage} />
                <View style={styles.suggestBody}>
                  <ThemedText type="defaultSemiBold" style={styles.suggestName}>{item.name}</ThemedText>
                  <ThemedText style={styles.suggestPrice}>{formatPrice(item.price)}</ThemedText>
                  <Pressable style={[styles.addBtn, { backgroundColor: primary }]}>
                    <ThemedText style={styles.addBtnText}>Add</ThemedText>
                    <AppIcon name="shopping-cart" size={16} color="#fff" />
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
          <Link href="/gifts/all" asChild>
            <Pressable style={styles.viewMore}>
              <ThemedText type="defaultSemiBold" style={[styles.viewMoreText, { color: primary }]}>
                View More
              </ThemedText>
              <AppIcon name="arrow-forward" size={16} color={primary} />
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },
  breadcrumb: { flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  breadcrumbLink: { fontSize: 12, color: '#687076' },
  breadcrumbSep: { fontSize: 12, color: '#687076', marginHorizontal: 4 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 12 },
  productList: { marginTop: 24, borderBottomWidth: 1, borderBottomColor: '#e4e4e7' },
  productRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  productImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#f4f4f5' },
  productBody: { flex: 1 },
  productName: { fontSize: 14 },
  productPrice: { fontSize: 14, color: '#687076', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
  },
  qtyBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.8 },
  qtyNum: { minWidth: 32, textAlign: 'center', fontSize: 14 },
  deleteBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 8 },
  summaryCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    backgroundColor: '#fff',
  },
  summaryHeading: { fontSize: 14 },
  discountInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  totalLabel: { fontSize: 14, color: '#687076' },
  totalRowFinal: { borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 12, marginTop: 12 },
  weAccept: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1, color: '#687076' },
  paymentBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  badge: { borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#687076' },
  checkoutBtn: { height: 48, backgroundColor: '#ffd814', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  checkoutBtnText: { color: '#11181C', fontSize: 16 },
  continueBtn: { height: 48, borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  continueBtnText: { fontSize: 16 },
  alsoLike: { marginTop: 40, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#e4e4e7' },
  alsoLikeTitle: { fontSize: 28, fontWeight: '600', textTransform: 'uppercase' },
  alsoLikeScroll: { marginTop: 16, gap: 16, paddingRight: 16 },
  suggestCard: { width: CARD_WIDTH, borderRadius: 12, borderWidth: 1, borderColor: '#e4e4e7', overflow: 'hidden', backgroundColor: '#fff' },
  suggestImage: { width: CARD_WIDTH, height: CARD_WIDTH * 0.75, backgroundColor: '#f4f4f5' },
  suggestBody: { padding: 16 },
  suggestName: { fontSize: 14 },
  suggestPrice: { fontSize: 14, color: '#687076', marginTop: 4 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 36, borderRadius: 8, marginTop: 12 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  viewMore: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 24, alignSelf: 'flex-end', minHeight: 44 },
  viewMoreText: { fontSize: 16 },
});
