import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';

export function MarketingFooter() {
  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.copy}>Subscribe today for exclusive deals, trend reports, and shop updates.</ThemedText>
      <TextInput
        placeholder="Email Address"
        placeholderTextColor="#7a86d7"
        style={styles.input}
      />
      <Pressable style={styles.subscribeBtn}>
        <ThemedText style={styles.subscribeText}>Subscribe to Newsletter</ThemedText>
      </Pressable>

      <View style={styles.linksWrap}>
        <ThemedText style={styles.groupTitle}>ABOUT US</ThemedText>
        <ThemedText style={styles.link}>News & Updates</ThemedText>
        <ThemedText style={styles.link}>Shipping Policy</ThemedText>
        <ThemedText style={styles.link}>Return Policy</ThemedText>
        <ThemedText style={styles.link}>Terms & Conditions</ThemedText>
        <ThemedText style={styles.link}>Privacy Policy</ThemedText>
        <ThemedText style={styles.link}>Delete Account</ThemedText>
        <ThemedText style={styles.link}>Cookie Policy</ThemedText>
      </View>

      <View style={styles.linksWrap}>
        <ThemedText style={styles.groupTitle}>FLIGHTS</ThemedText>
        <ThemedText style={styles.link}>Shop Duty Free</ThemedText>
        <ThemedText style={styles.link}>Gifts & More</ThemedText>
      </View>

      <ThemedText style={styles.logo}>TARA!</ThemedText>
      <ThemedText style={styles.tagline}>explore more, worry less</ThemedText>

      <View style={styles.socialRow}>
        <View style={styles.social}><AppIcon name="wechat" size={16} color="#1130bc" /></View>
        <View style={styles.social}><AppIcon name="language" size={16} color="#1130bc" /></View>
        <View style={styles.social}><AppIcon name="chat" size={16} color="#1130bc" /></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#0d2bd7',
    marginTop: 22,
    paddingTop: 18,
    paddingHorizontal: 10,
    paddingBottom: 18,
  },
  copy: { color: '#fff', fontSize: 12, lineHeight: 18 },
  input: {
    marginTop: 8,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    fontSize: 13,
  },
  subscribeBtn: {
    marginTop: 8,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#ffd400',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeText: { color: '#151515', fontWeight: '700', fontSize: 12 },
  linksWrap: { marginTop: 14, gap: 4 },
  groupTitle: { color: '#fff', fontSize: 12, fontWeight: '700' },
  link: { color: '#d8deff', fontSize: 11 },
  logo: { marginTop: 16, color: '#fff', fontSize: 54, fontWeight: '900', letterSpacing: -1.5, textAlign: 'center' },
  tagline: { marginTop: -6, color: '#dbe1ff', textAlign: 'center', fontSize: 12 },
  socialRow: { marginTop: 10, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  social: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
