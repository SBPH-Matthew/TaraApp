import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const METHODS = [
  { id: 'visa-4421', label: 'Visa ending in 4421', expiry: '12/28', primary: true },
  { id: 'maya-wallet', label: 'Maya Wallet', expiry: 'Linked', primary: false },
];

export default function PaymentMethodsScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText style={[styles.title, { color: primary }]}>PAYMENT METHODS</ThemedText>
        <ThemedText style={styles.subtitle}>Manage your saved cards and wallets for faster checkout.</ThemedText>

        <View style={styles.list}>
          {METHODS.map((method) => (
            <View key={method.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconWrap, { backgroundColor: method.primary ? '#eaf2ff' : '#f4f4f5' }]}>
                  <AppIcon name="credit-card" size={18} color={method.primary ? '#0B3BA7' : '#687076'} />
                </View>
                <View>
                  <ThemedText type="defaultSemiBold" style={styles.methodLabel}>{method.label}</ThemedText>
                  <ThemedText style={styles.methodSub}>{method.expiry}</ThemedText>
                </View>
              </View>
              {method.primary ? <ThemedText style={styles.primaryText}>Primary</ThemedText> : null}
            </View>
          ))}
        </View>

        <Pressable style={({ pressed }) => [styles.addBtn, { borderColor: primary }, pressed && styles.pressed]}>
          <AppIcon name="add" size={18} color={primary} />
          <ThemedText style={[styles.addText, { color: primary }]}>Add payment method</ThemedText>
        </Pressable>
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
  card: {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  iconWrap: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  methodLabel: { fontSize: 15 },
  methodSub: { fontSize: 12, color: '#687076', marginTop: 2 },
  primaryText: { color: '#0B3BA7', fontWeight: '600', fontSize: 12 },
  addBtn: {
    marginTop: 20,
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  addText: { fontSize: 15, fontWeight: '600' },
  pressed: { opacity: 0.85 },
});
