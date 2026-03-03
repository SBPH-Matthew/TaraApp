import { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/themed-text";
import { BACKGROUND, FontFamilies } from "@/constants/theme";
import { DUTY_FREE_SHOP_URL } from "@/services/dutyFreeProducts";

type BasketItem = { id: string; name: string; price: number; image: string };

const INITIAL_ITEMS: BasketItem[] = [
  {
    id: "choco-1",
    name: "Premium Chocolate Box",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "choco-2",
    name: "Premium Chocolate Box",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "choco-3",
    name: "Premium Chocolate Box",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1505575967455-40e256f73376?auto=format&fit=crop&w=900&q=80",
  },
];

const SUGGESTIONS: BasketItem[] = [
  {
    id: "s1",
    name: "Premium Chocolate Box",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "s2",
    name: "Premium Chocolate Box",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "s3",
    name: "Premium Chocolate Box",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1505575967455-40e256f73376?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "s4",
    name: "Premium Chocolate Box",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=900&q=80",
  },
];

const PAYMENT_METHODS = [
  "Visa",
  "Amex",
  "Mastercard",
  "PayPal",
  "JCB",
  "GCash",
  "Maya",
  "QRPH",
];

function formatPrice(value: number) {
  return `₱${value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = 280;

export default function BasketScreen() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    INITIAL_ITEMS.forEach((item) => {
      map[item.id] = 1;
    });
    return map;
  });
  const suggestRef = useRef<ScrollView>(null);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * (quantities[item.id] ?? 1),
        0,
      ),
    [items, quantities],
  );
  const discount = 0;
  const total = Math.max(0, subtotal - discount);

  const handleQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setQuantities((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  };

  return (
    <View style={s.page}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Breadcrumb + title */}
        <View style={s.breadcrumb}>
          <Link href="/gifts" asChild>
            <Pressable>
              <ThemedText style={s.breadcrumbLink}>Gifts & More</ThemedText>
            </Pressable>
          </Link>
          <ThemedText style={s.breadcrumbSep}> › </ThemedText>
          <ThemedText style={s.breadcrumbActive}>My Basket</ThemedText>
        </View>
        <ThemedText style={s.pageTitle}>MY BASKET</ThemedText>

        {/* Product list */}
        <View style={s.productList}>
          {items.map((item, index) => (
            <View
              key={item.id}
              style={[s.productRow, index === 0 && { paddingTop: 0 }]}
            >
              <Image source={{ uri: item.image }} style={s.productImage} />
              <View style={s.productBody}>
                <ThemedText style={s.productName}>{item.name}</ThemedText>
                <ThemedText style={s.productPrice}>
                  {formatPrice(item.price)}
                </ThemedText>
                <View style={s.qtyRow}>
                  <View style={s.qtyControls}>
                    <Pressable
                      onPress={() => handleQty(item.id, -1)}
                      style={({ pressed }) => [
                        s.qtyBtn,
                        pressed && s.pressed,
                      ]}
                      accessibilityLabel="Decrease quantity"
                    >
                      <AppIcon name="remove" size={16} color="#687076" />
                    </Pressable>
                    <ThemedText style={s.qtyNum}>
                      {quantities[item.id] ?? 1}
                    </ThemedText>
                    <Pressable
                      onPress={() => handleQty(item.id, 1)}
                      style={({ pressed }) => [
                        s.qtyBtn,
                        pressed && s.pressed,
                      ]}
                      accessibilityLabel="Increase quantity"
                    >
                      <AppIcon name="add" size={16} color="#687076" />
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => handleRemove(item.id)}
                    style={({ pressed }) => [
                      s.deleteBtn,
                      pressed && s.pressed,
                    ]}
                    accessibilityLabel="Remove item"
                  >
                    <AppIcon name="delete-outline" size={16} color="#687076" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Summary card */}
        <View style={s.summaryCard}>
          <ThemedText style={s.summaryHeading}>Discount</ThemedText>
          <TextInput
            placeholder="Enter Code"
            placeholderTextColor="#687076"
            style={s.discountInput}
          />

          <ThemedText style={[s.summaryHeading, { marginTop: 24 }]}>
            Total
          </ThemedText>
          <View style={s.totalRow}>
            <ThemedText style={s.totalLabel}>Subtotal</ThemedText>
            <ThemedText style={s.totalValue}>{formatPrice(subtotal)}</ThemedText>
          </View>
          <View style={s.totalRow}>
            <ThemedText style={s.totalLabel}>Discount</ThemedText>
            <ThemedText style={s.totalValue}>
              {formatPrice(discount)}
            </ThemedText>
          </View>
          <View style={s.totalRow}>
            <ThemedText style={s.totalLabel}>Delivery</ThemedText>
            <View style={s.deliveryHint}>
              <AppIcon name="info-outline" size={14} color="#687076" />
              <ThemedText style={s.deliveryHintText}>
                Options available at checkout
              </ThemedText>
            </View>
          </View>
          <View style={s.totalRowFinal}>
            <ThemedText style={s.totalFinalLabel}>Total</ThemedText>
            <ThemedText style={s.totalFinalValue}>
              {formatPrice(total)}
            </ThemedText>
          </View>

          <View style={s.paymentSection}>
            <ThemedText style={s.weAccept}>WE ACCEPT</ThemedText>
            <View style={s.paymentBadges}>
              {PAYMENT_METHODS.map((m) => (
                <View key={m} style={s.badge}>
                  <ThemedText style={s.badgeText}>{m}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View style={s.actionsSection}>
            <Link href="/checkout" asChild>
              <Pressable style={s.checkoutBtn}>
                <ThemedText style={s.checkoutBtnText}>Checkout</ThemedText>
              </Pressable>
            </Link>
            <Link href="/gifts" asChild>
              <Pressable style={s.continueBtn}>
                <ThemedText style={s.continueBtnText}>
                  Continue Shopping
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* You Might Also Like */}
        <View style={s.alsoLike}>
          <ThemedText style={s.alsoLikeTitle}>YOU MIGHT ALSO LIKE</ThemedText>

          <ScrollView
            ref={suggestRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.alsoLikeScroll}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 16}
          >
            {SUGGESTIONS.map((item) => (
              <Pressable
                key={item.id}
                style={s.suggestCard}
                onPress={() => Linking.openURL(DUTY_FREE_SHOP_URL)}
                accessibilityLabel={`View ${item.name}`}
                accessibilityRole="link"
              >
                <View style={s.suggestImageWrap}>
                  <Image
                    source={{ uri: item.image }}
                    style={s.suggestImage}
                  />
                  <View style={s.badgesRow}>
                    <View style={s.exclusiveBadge}>
                      <ThemedText style={s.exclusiveBadgeText}>
                        Exclusive
                      </ThemedText>
                    </View>
                    <View style={s.earnBadge}>
                      <AppIcon name="star" size={12} color="#fff" />
                      <ThemedText style={s.earnBadgeText}>
                        Earn Points!
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <View style={s.suggestBody}>
                  <ThemedText style={s.suggestName}>{item.name}</ThemedText>
                  <ThemedText style={s.suggestPrice}>
                    {formatPrice(item.price)}
                  </ThemedText>
                  <Pressable
                    style={s.addBtn}
                    onPress={() => Linking.openURL(DUTY_FREE_SHOP_URL)}
                  >
                    <ThemedText style={s.addBtnText}>Add</ThemedText>
                    <AppIcon name="shopping-cart" size={16} color="#fff" />
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            style={s.viewMore}
            onPress={() => Linking.openURL(DUTY_FREE_SHOP_URL)}
          >
            <ThemedText style={s.viewMoreText}>View More</ThemedText>
            <AppIcon name="arrow-forward" size={16} color="#1130bc" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const PRIMARY = "#1130bc";

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: BACKGROUND },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },

  breadcrumb: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  breadcrumbLink: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: "#687076",
  },
  breadcrumbSep: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: "#687076",
    marginHorizontal: 4,
  },
  breadcrumbActive: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 12,
    color: "#11181C",
  },
  pageTitle: {
    fontFamily: FontFamilies.header,
    fontSize: 24,
    color: PRIMARY,
    textTransform: "uppercase",
    letterSpacing: -0.4,
    marginTop: 12,
  },

  productList: { marginTop: 24 },
  productRow: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#f4f4f5",
  },
  productBody: { flex: 1 },
  productName: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
    color: "#11181C",
  },
  productPrice: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: "#687076",
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 12,
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 6,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyNum: {
    fontFamily: FontFamilies.bodySemiBold,
    minWidth: 32,
    textAlign: "center",
    fontSize: 14,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 6,
  },
  pressed: { opacity: 0.7 },

  summaryCard: {
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  summaryHeading: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 14,
    color: "#11181C",
  },
  discountInput: {
    fontFamily: FontFamilies.body,
    height: 44,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#11181C",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  totalLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: "#687076",
  },
  totalValue: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
    color: "#11181C",
  },
  deliveryHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deliveryHintText: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: "#687076",
  },
  totalRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 12,
    marginTop: 12,
  },
  totalFinalLabel: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 16,
    color: "#11181C",
  },
  totalFinalValue: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 16,
    color: "#11181C",
  },
  paymentSection: {
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 16,
    marginTop: 16,
  },
  weAccept: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    color: "#11181C",
    textTransform: "uppercase",
  },
  paymentBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  badge: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 11,
    color: "#687076",
  },
  actionsSection: {
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 16,
    marginTop: 16,
    gap: 12,
  },
  checkoutBtn: {
    height: 48,
    backgroundColor: "#ffd814",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#11181C",
    fontSize: 16,
  },
  continueBtn: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnText: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 16,
    color: "#11181C",
  },

  alsoLike: {
    marginTop: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
  },
  alsoLikeTitle: {
    fontFamily: FontFamilies.header,
    fontSize: 32,
    color: PRIMARY,
    textTransform: "uppercase",
    letterSpacing: -1.5,
  },
  alsoLikeScroll: { marginTop: 24, gap: 16, paddingRight: 16 },

  suggestCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  suggestImageWrap: {
    position: "relative",
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.75,
    backgroundColor: "#f4f4f5",
  },
  suggestImage: {
    width: "100%",
    height: "100%",
  },
  badgesRow: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    gap: 8,
  },
  exclusiveBadge: {
    backgroundColor: "#ffd814",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  exclusiveBadgeText: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 11,
    color: "#11181C",
  },
  earnBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: PRIMARY,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  earnBadgeText: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 11,
    color: "#fff",
  },
  suggestBody: { padding: 16 },
  suggestName: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
    color: "#11181C",
  },
  suggestPrice: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: "#687076",
    marginTop: 2,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 36,
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: PRIMARY,
  },
  addBtnText: {
    fontFamily: FontFamilies.bodySemiBold,
    color: "#fff",
    fontSize: 14,
  },

  viewMore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 32,
    alignSelf: "flex-end",
    minHeight: 44,
  },
  viewMoreText: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 16,
    color: PRIMARY,
  },
});
