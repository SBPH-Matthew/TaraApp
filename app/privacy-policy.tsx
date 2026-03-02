import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SECTIONS = [
  { id: 'intro', title: 'Introduction' },
  { id: 'data', title: 'Data We Collect' },
  { id: 'use', title: 'How We Use Data' },
  { id: 'contact', title: 'Contact' },
];

/**
 * Privacy policy – parity with companion-app /privacy-policy (mobile).
 * Sticky in-page nav (lg:hidden), long content.
 */
export default function PrivacyPolicyScreen() {
  const [activeId, setActiveId] = useState('intro');
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  const onScroll = (e: { nativeEvent: { contentOffset: { y: number }; layoutMeasurement: { height: number }; contentSize: { height: number } } }) => {
    const y = e.nativeEvent.contentOffset.y;
    const threshold = 120;
    if (y < threshold) setActiveId('intro');
    else if (y < threshold + 200) setActiveId('data');
    else if (y < threshold + 400) setActiveId('use');
    else setActiveId('contact');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={onScroll}
        scrollEventThrottle={100}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={[styles.title, { color: primary }]}>
          Privacy Policy
        </ThemedText>
        <ThemedText style={styles.updated}>Last updated: February 10, 2026</ThemedText>

        <View style={styles.stickyNav}>
          {SECTIONS.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setActiveId(s.id)}
              style={[styles.navItem, activeId === s.id && { borderBottomColor: primary }]}
            >
              <ThemedText style={[styles.navText, activeId === s.id && { color: primary }]}>
                {s.title}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.section} nativeID="intro">
          <ThemedText type="subtitle" style={styles.sectionTitle}>Introduction</ThemedText>
          <ThemedText style={styles.body}>
            TARA! (“we”) respects your privacy. This policy describes how we collect, use, and protect your information when you use our app.
          </ThemedText>
        </View>
        <View style={styles.section} nativeID="data">
          <ThemedText type="subtitle" style={styles.sectionTitle}>Data We Collect</ThemedText>
          <ThemedText style={styles.body}>
            We collect: account information (name, email, date of birth, country, mobile); flight data you attach to your trip; basket and wishlist data; and usage data necessary to operate the service. We use Google OAuth for sign-in and store tokens locally.
          </ThemedText>
        </View>
        <View style={styles.section} nativeID="use">
          <ThemedText type="subtitle" style={styles.sectionTitle}>How We Use Data</ThemedText>
          <ThemedText style={styles.body}>
            We use your data to provide flight information, duty-free and gift reservations, and airport services. We do not sell your personal data. We may retain server logs for up to 90 days and anonymised analytics as required.
          </ThemedText>
        </View>
        <View style={styles.section} nativeID="contact">
          <ThemedText type="subtitle" style={styles.sectionTitle}>Contact</ThemedText>
          <ThemedText style={styles.body}>
            For privacy requests or questions, contact: privacy@taraapp.example.com. You may request access, correction, or deletion of your data.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  scrollContent: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  updated: { fontSize: 12, color: '#687076', marginBottom: 24 },
  stickyNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  navItem: { paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 2, borderBottomColor: 'transparent', minHeight: 44, justifyContent: 'center' },
  navText: { fontSize: 14, fontWeight: '600', color: '#687076' },
  section: { marginBottom: 32 },
  sectionTitle: { marginBottom: 12 },
  body: { fontSize: 14, color: '#687076', lineHeight: 22 },
});
