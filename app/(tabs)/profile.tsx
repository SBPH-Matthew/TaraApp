import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { AppIcon } from '@/components/ui/app-icon';
import { ThemedText } from '@/components/themed-text';

type MenuItem = {
  label: string;
  href: '/profile/edit' | '/profile/wishlist' | '/trips' | '/profile/orders' | '/profile/payment';
  icon: React.ComponentProps<typeof AppIcon>['name'];
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Personal Information', href: '/profile/edit', icon: 'person-outline' },
  { label: 'Wishlist', href: '/profile/wishlist', icon: 'favorite-border' },
  { label: 'My Trips', href: '/trips', icon: 'flight' },
  { label: 'My Orders', href: '/profile/orders', icon: 'card-giftcard' },
  { label: 'Settings', href: '/profile/payment', icon: 'settings' },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <ImageBackground
          source={require('@/assets/images/migration/ProfileBackground.png')}
          style={styles.profileTop}
          imageStyle={styles.profileBgImage}>
          <LinearGradient
            colors={['rgba(0,0,0,0.22)', 'rgba(0,0,0,0.06)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.profileShadeTop}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.00)', 'rgba(255,255,255,0.82)']}
            locations={[0.12, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.profileShadeBottom}
          />

          <View style={styles.avatarWrap}>
            <AppIcon name="person-outline" size={68} color="#a0a6b2" />
          </View>
        </ImageBackground>

        <View style={styles.profileBottom}>
          <ThemedText style={styles.name}>Matthew Andre Butalid</ThemedText>

          <View style={styles.badges}>
            <View style={styles.levelBadge}>
              <AppIcon name="star" size={12} color="#fff" />
              <ThemedText style={styles.levelText}>Level 1</ThemedText>
            </View>
            <View style={styles.titleBadge}>
              <ThemedText style={styles.titleText}>Curious Cat</ThemedText>
            </View>
          </View>

          <Link href="/profile/edit" asChild>
            <Pressable style={({ pressed }) => [styles.editLink, pressed && styles.pressed]}>
              <ThemedText style={styles.editText}>Edit Profile</ThemedText>
              <AppIcon name="chevron-right" size={16} color="#1130bc" />
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.menuWrap}>
        {MENU_ITEMS.map((item) => (
          <Link key={item.label} href={item.href} asChild>
            <Pressable style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}>
              <AppIcon name={item.icon} size={24} color="#6b7280" />
              <ThemedText style={styles.menuText}>{item.label}</ThemedText>
              <AppIcon name="chevron-right" size={22} color="#6b7280" />
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#efefef' },
  content: { paddingBottom: 92 },
  profileCard: {
    marginHorizontal: 8,
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbdde3',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  profileTop: {
    height: 252,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileBgImage: { resizeMode: 'cover' },
  profileShadeTop: {
    ...StyleSheet.absoluteFillObject,
  },
  profileShadeBottom: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarWrap: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 4,
    borderColor: '#f8d400',
    backgroundColor: '#e0e3ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBottom: {
    marginTop: -28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
  name: { color: '#151a22', fontSize: 39 / 2, fontWeight: '700', textAlign: 'center' },
  badges: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1130bc',
    borderRadius: 999,
    overflow: 'hidden',
  },
  levelBadge: {
    backgroundColor: '#1130bc',
    paddingVertical: 5,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelText: { color: '#fff', fontSize: 24 / 2, fontWeight: '700' },
  titleBadge: { paddingVertical: 5, paddingHorizontal: 12, backgroundColor: '#fff' },
  titleText: { color: '#20252f', fontSize: 24 / 2, fontWeight: '600' },
  editLink: {
    marginTop: 10,
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    alignSelf: 'center',
  },
  editText: {
    color: '#1130bc',
    fontSize: 39 / 2,
    fontWeight: '700',
    textDecorationLine: 'underline',
    lineHeight: 22,
  },
  menuWrap: { marginTop: 22, paddingHorizontal: 8, gap: 6 },
  menuRow: {
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: '#efefef',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: { flex: 1, color: '#20252f', fontSize: 36 / 2, fontWeight: '500' },
  pressed: { opacity: 0.8 },
});
