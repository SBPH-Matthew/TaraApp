/**
 * All Products gift screen – native conversion of companion_app GiftsAllPage.
 * Includes: breadcrumb, filters (category + price), sort, grid/list toggle,
 * product cards (GraphQL via useStorefrontProducts), ad placement after 9th item, View More.
 */

import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight, ChevronDown, LayoutGrid, List } from 'lucide-react-native';

import { GiftProductCard, type GiftProduct } from '@/components/GiftProductCard';
import { ThemedText } from '@/components/themed-text';
import { BACKGROUND, Colors, FontFamilies } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  GIFT_PLACEHOLDER_IMAGE,
  getSpeedRegaloProductUrl,
  useStorefrontProducts,
  type ProductsSort,
  type StorefrontProduct,
} from '@/services/shopifyStorefront';

const CARD_GAP = 12;

const CATEGORIES = [
  'Gift Baskets & Hampers',
  'Personalized Gifts',
  'Bags & Accessories',
  'Jewelry & Fashion',
  'Snacks & Treats',
  'Apparel & Wearables',
  'Flowers & Bouquets',
  'Everyday & Novelty Gifts',
];

const BASE_PRODUCTS: Array<{ id: string; name: string; price: string; image: string; handle: null }> = [
  { id: 'choco-1', name: 'Premium Chocolate Box', price: '₱500.00', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80', handle: null },
  { id: 'choco-2', name: 'Premium Chocolate Box', price: '₱500.00', image: 'https://images.unsplash.com/photo-1501432781167-c0ccfd492087?auto=format&fit=crop&w=900&q=80', handle: null },
  { id: 'choco-3', name: 'Premium Chocolate Box', price: '₱500.00', image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=900&q=80', handle: null },
  { id: 'choco-4', name: 'Premium Chocolate Box', price: '₱500.00', image: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?auto=format&fit=crop&w=900&q=80', handle: null },
];

const FALLBACK_PRODUCTS: GiftProduct[] = Array.from({ length: 16 }, (_, i) => {
  const b = BASE_PRODUCTS[i % BASE_PRODUCTS.length];
  return { ...b, id: `${b.id}-${i}`, image: b.image };
});

function toDisplayProduct(p: StorefrontProduct): GiftProduct {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image ?? GIFT_PLACEHOLDER_IMAGE,
    handle: p.handle ?? null,
  };
}

export default function GiftsAllScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<ProductsSort>('az');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(CATEGORIES.slice(0, 2))
  );

  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  const { data: storefrontProducts, isSuccess, isPending } = useStorefrontProducts(sort, 24);

  const orderedProducts = useMemo(() => {
    if (isSuccess && storefrontProducts && storefrontProducts.length > 0) {
      return storefrontProducts.map(toDisplayProduct);
    }
    if (sort === 'za') return [...FALLBACK_PRODUCTS].reverse();
    return FALLBACK_PRODUCTS;
  }, [sort, isSuccess, storefrontProducts]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const openProduct = (handle: string | null) => {
    Linking.openURL(getSpeedRegaloProductUrl(handle));
  };

  const sortOptions: { value: ProductsSort; label: string }[] = [
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' },
    { value: 'new', label: 'Newest' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <Link href="/gifts" asChild>
          <Pressable hitSlop={8}>
            <ThemedText style={styles.breadcrumbLink}>Gifts & More</ThemedText>
          </Pressable>
        </Link>
        <ThemedText style={styles.breadcrumbSep}>›</ThemedText>
        <ThemedText style={styles.breadcrumbCurrent}>All Products</ThemedText>
      </View>

      {/* Filters (collapsible) */}
      <Pressable
        style={styles.filtersHeader}
        onPress={() => setFiltersOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityLabel={filtersOpen ? 'Hide filters' : 'Show filters'}
      >
        <ThemedText style={styles.filtersTitle}>Filters</ThemedText>
        <ChevronDown size={18} color="#6b7280" style={{ transform: [{ rotate: filtersOpen ? '180deg' : '0deg' }] }} />
      </Pressable>
      {filtersOpen && (
        <View style={styles.filtersPanel}>
          <ThemedText style={styles.filterLabel}>Category</ThemedText>
          <View style={styles.categoryList}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={styles.categoryRow}
                onPress={() => toggleCategory(cat)}
              >
                <View style={[styles.checkbox, selectedCategories.has(cat) && styles.checkboxChecked]}>
                  {selectedCategories.has(cat) && <View style={styles.checkboxInner} />}
                </View>
                <ThemedText style={styles.categoryLabel}>{cat}</ThemedText>
              </Pressable>
            ))}
          </View>
          <ThemedText style={styles.filterLabel}>Price</ThemedText>
          <View style={styles.priceRow}>
            <TextInput
              placeholder="min."
              placeholderTextColor="#6b7280"
              value={priceMin}
              onChangeText={setPriceMin}
              keyboardType="numeric"
              style={styles.priceInput}
            />
            <TextInput
              placeholder="max."
              placeholderTextColor="#6b7280"
              value={priceMax}
              onChangeText={setPriceMax}
              keyboardType="numeric"
              style={styles.priceInput}
            />
          </View>
        </View>
      )}

      {/* Toolbar: sort + view toggle */}
      <View style={styles.toolbar}>
        <View style={styles.sortRow}>
          <ThemedText style={styles.sortLabel}>Sort: </ThemedText>
          <View style={styles.sortOptions}>
            {sortOptions.map((opt) => (
              <Pressable
                key={opt.value}
                style={[styles.sortChip, sort === opt.value && { borderColor: primary, backgroundColor: `${primary}12` }]}
                onPress={() => setSort(opt.value)}
              >
                <ThemedText style={[styles.sortChipText, sort === opt.value && { color: primary }]}>
                  {opt.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.viewToggle}>
          <Pressable
            style={[styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive]}
            onPress={() => setViewMode('grid')}
            accessibilityLabel="Grid view"
          >
            <LayoutGrid size={18} color={viewMode === 'grid' ? primary : '#6b7280'} />
          </Pressable>
          <Pressable
            style={[styles.viewBtn, viewMode === 'list' && styles.viewBtnActive]}
            onPress={() => setViewMode('list')}
            accessibilityLabel="List view"
          >
            <List size={18} color={viewMode === 'list' ? primary : '#6b7280'} />
          </Pressable>
        </View>
      </View>

      {/* Product grid/list + ad slot after 9th item */}
      {isPending && orderedProducts.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : (
        <View style={viewMode === 'grid' ? styles.grid : styles.list}>
          {orderedProducts.flatMap((product, index) => {
            const card = (
              <GiftProductCard
                key={product.id}
                product={product}
                onPress={() => openProduct(product.handle)}
                style={viewMode === 'grid' ? styles.gridCard : undefined}
                listMode={viewMode === 'list'}
              />
            );
            if (index === 8) {
              return [
                <View key="promo-banner" style={styles.promoBanner} />,
                card,
              ];
            }
            return [card];
          })}
        </View>
      )}

      {/* View More */}
      <Pressable
        style={styles.viewMoreRow}
        onPress={() => Linking.openURL(getSpeedRegaloProductUrl(null))}
      >
        <ThemedText style={[styles.viewMoreText, { color: primary }]}>View More</ThemedText>
        <ArrowRight size={16} color={primary} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 100 },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  breadcrumbLink: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: FontFamilies.bodySemiBold,
  },
  breadcrumbSep: { marginHorizontal: 8, fontSize: 12, color: '#6b7280' },
  breadcrumbCurrent: { fontSize: 12, color: '#11181C' },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  filtersTitle: {
    fontSize: 14,
    fontFamily: FontFamilies.bodySemiBold,
    color: '#11181C',
  },
  filtersPanel: {
    paddingVertical: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  filterLabel: {
    fontSize: 12,
    fontFamily: FontFamilies.bodySemiBold,
    color: '#11181C',
    marginBottom: 12,
  },
  categoryList: { marginBottom: 20 },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { borderColor: '#0B3BA7', backgroundColor: '#0B3BA7' },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  categoryLabel: { fontSize: 14, color: '#6b7280', flex: 1 },
  priceRow: { flexDirection: 'row', gap: 12 },
  priceInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  sortRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', flex: 1 },
  sortLabel: { fontSize: 14, color: '#6b7280', marginRight: 8 },
  sortOptions: { flexDirection: 'row', gap: 8 },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    backgroundColor: '#fff',
  },
  sortChipText: { fontSize: 13, color: '#11181C' },
  viewToggle: { flexDirection: 'row', gap: 8 },
  viewBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtnActive: { borderColor: '#0B3BA7', backgroundColor: 'rgba(11,59,167,0.08)' },
  grid: {
    flexDirection: 'column',
    gap: CARD_GAP,
    width: '100%',
  },
  gridCard: { width: '100%' },
  list: { gap: 12 },
  promoBanner: {
    width: '100%',
    height: 100,
    borderRadius: 16,
    backgroundColor: '#f1f1f1',
    marginBottom: CARD_GAP,
    overflow: 'hidden',
  },
  loadingWrap: { paddingVertical: 48, alignItems: 'center' },
  viewMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  viewMoreText: {
    fontSize: 14,
    fontFamily: FontFamilies.bodySemiBold,
  },
});
