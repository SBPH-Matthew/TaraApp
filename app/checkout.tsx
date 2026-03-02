import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PAYMENT_METHODS = ['Visa', 'Amex', 'Mastercard', 'PayPal', 'GCash', 'Maya'];

/**
 * Checkout – parity with companion-app /checkout (mobile).
 * Breadcrumb, Contact, Delivery, summary, Place order. TODO: backend.
 */
export default function CheckoutScreen() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  const handlePlaceOrder = () => {
    setLoading(true);
    // TODO: submit order when backend exists
    setTimeout(() => {
      setLoading(false);
      router.replace('/');
    }, 1000);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.breadcrumb}>
          <Link href="/gifts" asChild>
            <Pressable><ThemedText style={styles.breadcrumbLink}>Gifts & More</ThemedText></Pressable>
          </Link>
          <AppIcon name="chevron-right" size={18} color="#687076" />
          <ThemedText type="defaultSemiBold">Checkout</ThemedText>
        </View>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>
          CHECKOUT
        </ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Contact</ThemedText>
        <TextInput
          placeholder="Email or phone number"
          placeholderTextColor="#687076"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />

        <ThemedText type="subtitle" style={styles.sectionTitle}>Delivery</ThemedText>
        <View style={styles.row}>
          <TextInput placeholder="First Name" placeholderTextColor="#687076" value={firstName} onChangeText={setFirstName} style={[styles.input, styles.half]} />
          <TextInput placeholder="Last Name" placeholderTextColor="#687076" value={lastName} onChangeText={setLastName} style={[styles.input, styles.half]} />
        </View>
        <TextInput placeholder="Address Line 1" placeholderTextColor="#687076" value={address} onChangeText={setAddress} style={styles.input} />

        <View style={styles.summary}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Summary</ThemedText>
          <View style={styles.summaryRow}><ThemedText style={styles.muted}>Subtotal</ThemedText><ThemedText type="defaultSemiBold">₱1,000.00</ThemedText></View>
          <View style={styles.summaryRow}><ThemedText style={styles.muted}>Discount</ThemedText><ThemedText type="defaultSemiBold">₱0.00</ThemedText></View>
          <View style={[styles.summaryRow, styles.summaryTotal]}><ThemedText type="defaultSemiBold">Total</ThemedText><ThemedText type="defaultSemiBold">₱1,000.00</ThemedText></View>
        </View>

        <ThemedText style={styles.weAccept}>We accept</ThemedText>
        <View style={styles.paymentBadges}>
          {PAYMENT_METHODS.slice(0, 6).map((m) => (
            <View key={m} style={styles.badge}><ThemedText style={styles.badgeText}>{m}</ThemedText></View>
          ))}
        </View>

        <Pressable onPress={handlePlaceOrder} disabled={loading} style={[styles.placeBtn, { backgroundColor: primary }, loading && styles.disabled]}>
          <ThemedText style={styles.placeBtnText}>{loading ? 'Placing order…' : 'Place order'}</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  scroll: { paddingBottom: 120 },
  breadcrumb: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  breadcrumbLink: { fontSize: 14, color: '#687076' },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 24 },
  sectionTitle: { marginBottom: 12 },
  input: { height: 48, borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 8, paddingHorizontal: 12, fontSize: 16, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  summary: { marginTop: 24, padding: 16, borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 12, backgroundColor: '#fff' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  summaryTotal: { borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 12, marginTop: 12 },
  muted: { fontSize: 14, color: '#687076' },
  weAccept: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1, color: '#687076', marginTop: 24 },
  paymentBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  badge: { borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#687076' },
  placeBtn: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  placeBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  disabled: { opacity: 0.7 },
});
