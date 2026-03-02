import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const GUIDES = [
  { title: 'Travel documents', detail: 'Passport validity and destination visa reminders.' },
  { title: 'Customs declaration', detail: 'Duty-free and declaration thresholds before arrival.' },
  { title: 'Restricted items', detail: 'Security restrictions for hand-carry and checked baggage.' },
];

export default function GovernmentScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>Government</ThemedText>
        <ThemedText style={styles.body}>Official travel guidance and compliance reminders before departure.</ThemedText>

        <View style={styles.list}>
          {GUIDES.map((guide) => (
            <View key={guide.title} style={styles.card}>
              <View style={styles.cardHeader}>
                <AppIcon name="verified-user" size={18} color={primary} />
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>{guide.title}</ThemedText>
              </View>
              <ThemedText style={styles.cardText}>{guide.detail}</ThemedText>
            </View>
          ))}
        </View>

        <Link href="/guide/entry" asChild>
          <Pressable style={({ pressed }) => [styles.cta, { backgroundColor: primary }, pressed && styles.pressed]}>
            <ThemedText style={styles.ctaText}>Open entry guide</ThemedText>
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
  cardTitle: { flex: 1, fontSize: 15 },
  cardText: { marginTop: 6, color: '#687076', fontSize: 13, lineHeight: 18 },
  cta: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  ctaText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  pressed: { opacity: 0.85 },
});
