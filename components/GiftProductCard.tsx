/**
 * Gift product card – native conversion of companion_app GiftsAllPage product card.
 * Image 4:3, badges (Made in PH, Earn Points!), name, price, View product button.
 */

import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ExternalLink } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, FontFamilies } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type GiftProduct = {
  id: string;
  name: string;
  price: string;
  image: string | null;
  handle: string | null;
};

const GIFT_PLACEHOLDER =
  'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80';

type Props = Readonly<{
  product: GiftProduct;
  onPress: () => void;
  style?: object;
  listMode?: boolean;
}>;

export function GiftProductCard({ product, onPress, style, listMode }: Props) {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;
  const imageUri = product.image ?? GIFT_PLACEHOLDER;
  const viewProductStyle = [styles.viewProductRow, { backgroundColor: primary }];

  if (listMode) {
    return (
      <Pressable style={[styles.listCard, style]} onPress={onPress}>
        <Image source={{ uri: imageUri }} style={styles.listImage} contentFit="cover" />
        <View style={styles.listBody}>
          <View style={styles.badges}>
            <View style={styles.badgeSecondary}>
              <ThemedText style={styles.badgeText}>Made in PH</ThemedText>
            </View>
            <View style={styles.badgePrimary}>
              <ThemedText style={styles.badgePrimaryText}>Earn Points!</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.name} numberOfLines={2}>
            {product.name}
          </ThemedText>
          <ThemedText style={styles.price}>{product.price}</ThemedText>
          <View style={viewProductStyle}>
            <ExternalLink size={14} color="#fff" />
            <ThemedText style={styles.viewProductText}>View product</ThemedText>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
        <View style={[styles.badges, styles.badgesOverImage]}>
          <View style={styles.badgeSecondary}>
            <ThemedText style={styles.badgeText}>Made in PH</ThemedText>
          </View>
          <View style={styles.badgePrimary}>
            <ThemedText style={styles.badgePrimaryText}>Earn Points!</ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.name} numberOfLines={2}>
          {product.name}
        </ThemedText>
        <ThemedText style={styles.price}>{product.price}</ThemedText>
        <View style={viewProductStyle}>
          <ExternalLink size={14} color="#fff" />
          <ThemedText style={styles.viewProductText}>View product</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  listCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  imageWrap: {
    aspectRatio: 4 / 3,
    width: '100%',
    backgroundColor: '#f4f4f5',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  listImage: {
    width: 100,
    height: 75,
    backgroundColor: '#f4f4f5',
  },
  listBody: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  badgesOverImage: {
    position: 'absolute',
    left: 8,
    top: 8,
    marginBottom: 0,
  },
  badgeSecondary: {
    backgroundColor: '#ffd814',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: FontFamilies.bodySemiBold,
    color: '#1e1e1e',
  },
  badgePrimary: {
    backgroundColor: '#0B3BA7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgePrimaryText: {
    fontSize: 11,
    fontFamily: FontFamilies.bodySemiBold,
    color: '#fff',
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
  name: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
    color: '#11181C',
    minHeight: 36,
  },
  price: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  viewProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 16,
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  viewProductText: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 13,
    color: '#fff',
  },
});
