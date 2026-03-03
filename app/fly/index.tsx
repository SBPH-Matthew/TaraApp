import { AppIcon } from "@/components/ui/app-icon";
import {
  BACKGROUND,
  CircleArrowColors,
  Colors,
  FontFamilies,
  TrackColors,
} from "@/constants/theme";
import { Stack, router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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

import { ThemedText } from "@/components/themed-text";
import { DUTY_FREE_SHOP_URL } from "@/services/dutyFreeProducts";
import {
  GIFT_PLACEHOLDER_IMAGE,
  SPEEDREGALO_COLLECTIONS_URL,
  getSpeedRegaloProductUrl,
  useStorefrontProducts,
} from "@/services/shopifyStorefront";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PRODUCT_CARD_WIDTH = SCREEN_WIDTH * 0.72;

type Tab = "departing" | "arriving";

type Flight = {
  id: string;
  airline: string;
  flightNumber: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  status: string;
  date: string;
  boardingTime: string;
  arrivalTime: string;
  gateLabel: string;
  terminalLabel: string;
  beltNumber?: string;
};

const MOCK_FLIGHTS: Flight[] = [
  {
    id: "pr103",
    airline: "Philippine Airlines",
    flightNumber: "PR 103",
    fromCity: "Manila",
    fromCode: "MNL",
    toCity: "Tokyo Narita",
    toCode: "NRT",
    status: "On Time",
    date: "2026-02-10",
    boardingTime: "08:30 AM",
    arrivalTime: "01:30 PM",
    gateLabel: "6",
    terminalLabel: "NAIA Terminal 2",
  },
  {
    id: "5j812",
    airline: "Cebu Pacific",
    flightNumber: "5J 812",
    fromCity: "Manila",
    fromCode: "MNL",
    toCity: "Hong Kong",
    toCode: "HKG",
    status: "On Time",
    date: "2026-02-10",
    boardingTime: "10:05 AM",
    arrivalTime: "12:35 PM",
    gateLabel: "12",
    terminalLabel: "NAIA Terminal 3",
  },
  {
    id: "z2328",
    airline: "Philippine AirAsia",
    flightNumber: "Z2 328",
    fromCity: "Manila",
    fromCode: "MNL",
    toCity: "Davao",
    toCode: "DVO",
    status: "On Time",
    date: "2026-02-10",
    boardingTime: "06:05 PM",
    arrivalTime: "07:45 PM",
    gateLabel: "7",
    terminalLabel: "NAIA Terminal 3",
  },
  {
    id: "pr2457",
    airline: "Philippine Airlines",
    flightNumber: "PR 2457",
    fromCity: "General Santos",
    fromCode: "GES",
    toCity: "Manila",
    toCode: "MNL",
    status: "On Time",
    date: "2026-02-10",
    boardingTime: "06:20 PM",
    arrivalTime: "08:00 PM",
    gateLabel: "3",
    terminalLabel: "NAIA Terminal 2",
  },
  {
    id: "t8512",
    airline: "AirSWIFT",
    flightNumber: "T8 512",
    fromCity: "Manila",
    fromCode: "MNL",
    toCity: "El Nido",
    toCode: "ENI",
    status: "On Time",
    date: "2026-02-10",
    boardingTime: "07:25 PM",
    arrivalTime: "08:35 PM",
    gateLabel: "4",
    terminalLabel: "NAIA Terminal 4",
  },
  {
    id: "5j301",
    airline: "Cebu Pacific",
    flightNumber: "5J 301",
    fromCity: "Manila",
    fromCode: "MNL",
    toCity: "Cebu",
    toCode: "CEB",
    status: "On Time",
    date: "2026-02-10",
    boardingTime: "08:00 PM",
    arrivalTime: "09:20 PM",
    gateLabel: "9",
    terminalLabel: "NAIA Terminal 3",
  },
];

const PROMO_IMAGES = [
  require("@/assets/images/migration/TaraPromo1.png"),
  require("@/assets/images/migration/TaraPromo2.png"),
  require("@/assets/images/migration/TaraPromo3.png"),
];

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80";

type GiftCardItem = {
  id: string;
  name: string;
  price: string;
  image: number | string;
  handle?: string | null;
};

const GIFT_CARDS: GiftCardItem[] = [
  {
    id: "gift-1",
    name: "Duty Free Picks",
    price: "$24.00",
    image: require("@/assets/images/migration/hero-mobile-1.png"),
  },
  {
    id: "gift-2",
    name: "Gift Hampers & Baskets",
    price: "$45.00",
    image: require("@/assets/images/migration/GiftHampers.png"),
  },
];

function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/* ── Flight Card ─────────────────────────────────────────────── */

function FlightCard({
  flight,
  tab,
  onPress,
}: {
  flight: Flight;
  tab: Tab;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.flightCard, pressed && styles.pressed]}
    >
      <View style={styles.statusRow}>
        <AppIcon name="check-circle" size={16} color="#01BC1D" />
        <ThemedText style={styles.statusText}>{flight.status}</ThemedText>
      </View>
      <ThemedText style={styles.airlineText}>{flight.airline}</ThemedText>
      <ThemedText style={styles.flightNumber}>
        {flight.flightNumber}
      </ThemedText>
      <View style={styles.routeRow}>
        <ThemedText style={styles.routeText}>
          {flight.fromCity} ({flight.fromCode})
        </ThemedText>
        <AppIcon name="arrow-forward" size={16} color="#1e1e1e" />
        <ThemedText style={styles.routeText}>
          {flight.toCity} ({flight.toCode})
        </ThemedText>
      </View>
      <View style={styles.detailGrid}>
        <View style={styles.detailRow}>
          <DetailBlock label="Date" value={formatShortDate(flight.date)} />
          <DetailBlock
            label={tab === "departing" ? "Boarding Time" : "Arrival Time"}
            value={
              tab === "departing" ? flight.boardingTime : flight.arrivalTime
            }
          />
        </View>
        <View style={styles.detailRow}>
          <DetailBlock
            label={tab === "departing" ? "Gate" : "Belt"}
            value={
              tab === "departing"
                ? flight.gateLabel
                : (flight.beltNumber ?? "—")
            }
          />
          <DetailBlock label="Airport" value={flight.terminalLabel} />
        </View>
      </View>
    </Pressable>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailCell}>
      <ThemedText style={styles.detailLabel}>{label}</ThemedText>
      <ThemedText style={styles.detailValue}>{value}</ThemedText>
    </View>
  );
}

/* ── Section Title (matches home screen) ─────────────────────── */

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {subtitle ? (
        <ThemedText style={styles.sectionSubtitle}>{subtitle}</ThemedText>
      ) : null}
    </View>
  );
}

/* ── Promos (matches home screen HorizontalCards) ────────────── */

function HorizontalPromoCards() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = 250;
  const gap = 10;
  const itemSpan = cardWidth + gap;
  const maxIndex = Math.max(PROMO_IMAGES.length - 1, 0);
  const fillRatio =
    PROMO_IMAGES.length > 1 ? (activeIndex + 1) / PROMO_IMAGES.length : 1;

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    scrollRef.current?.scrollTo({ x: clamped * itemSpan, animated: true });
    setActiveIndex(clamped);
  };

  return (
    <View style={styles.sliderWrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / itemSpan);
          setActiveIndex(Math.max(0, Math.min(next, maxIndex)));
        }}
      >
        {PROMO_IMAGES.map((image, idx) => (
          <Image
            key={idx}
            source={image}
            style={styles.promoCard}
          />
        ))}
      </ScrollView>
      <View style={styles.sliderBottom}>
        <View style={styles.track}>
          <View
            style={[styles.trackFill, { width: `${fillRatio * 100}%` }]}
          />
        </View>
        <View style={styles.sliderArrows}>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex - 1)}
            accessibilityLabel="Previous promo"
          >
            <AppIcon
              name="chevron-left"
              size={16}
              color={CircleArrowColors.icon}
            />
          </Pressable>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex + 1)}
            accessibilityLabel="Next promo"
          >
            <AppIcon
              name="chevron-right"
              size={16}
              color={CircleArrowColors.icon}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ── Product Card (matches home screen) ──────────────────────── */

type ProductCardItem = {
  id: string;
  name: string;
  price: string;
  image: number | string;
};

function ProductCard({
  item,
  width,
  onPress,
}: {
  item: ProductCardItem;
  width: number;
  onPress?: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const isRemoteImage = typeof item.image === "string";
  useEffect(() => {
    setImageError(false);
  }, [item.id, item.image]);
  const imageSource =
    typeof item.image === "string"
      ? {
          uri: imageError
            ? PLACEHOLDER_IMAGE
            : (item.image || PLACEHOLDER_IMAGE),
        }
      : item.image;
  return (
    <View style={[styles.productCard, { width }]}>
      <View style={styles.productImageWrap}>
        <Image
          source={imageSource}
          style={styles.productImage}
          onError={isRemoteImage ? () => setImageError(true) : undefined}
        />
        <View style={styles.productBadges} pointerEvents="box-none">
          <View style={styles.badgeExclusive}>
            <ThemedText style={styles.badgeText}>Exclusive</ThemedText>
          </View>
          <View style={styles.badgeEarnPoints}>
            <ThemedText style={styles.badgeEarnText}>Earn Points!</ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.productContent}>
        <View style={styles.productTitlePriceBlock}>
          <ThemedText style={styles.productTitle} numberOfLines={2}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.productPrice}>{item.price}</ThemedText>
        </View>
        <View style={styles.productActionsRow}>
          <Pressable
            style={styles.productHeartBtn}
            accessibilityLabel="Add to wishlist"
          >
            <AppIcon name="favorite-border" size={20} color="#111827" />
          </Pressable>
          <Pressable style={styles.viewProductBtn} onPress={onPress}>
            <AppIcon name="external-link" size={14} color="#fff" />
            <ThemedText style={styles.viewProductText}>
              View product
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ── Gifts (matches home screen HorizontalGiftCards) ─────────── */

const GIFT_PAGE_SIZE = 12;

function HorizontalGiftCards() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: storefrontGifts, isSuccess } = useStorefrontProducts(
    "az",
    GIFT_PAGE_SIZE,
  );
  const items = useMemo((): GiftCardItem[] => {
    if (isSuccess && storefrontGifts && storefrontGifts.length > 0) {
      return storefrontGifts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price || "$0.00",
        image: p.image || GIFT_PLACEHOLDER_IMAGE,
        handle: p.handle,
      }));
    }
    return GIFT_CARDS;
  }, [isSuccess, storefrontGifts]);

  const gap = 10;
  const itemSpan = PRODUCT_CARD_WIDTH + gap;
  const maxIndex = Math.max(items.length - 1, 0);
  const fillRatio = items.length > 1 ? (activeIndex + 1) / items.length : 1;

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    scrollRef.current?.scrollTo({ x: clamped * itemSpan, animated: true });
    setActiveIndex(clamped);
  };

  return (
    <View style={styles.sliderWrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / itemSpan);
          setActiveIndex(Math.max(0, Math.min(next, maxIndex)));
        }}
      >
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            width={PRODUCT_CARD_WIDTH}
            onPress={() =>
              Linking.openURL(getSpeedRegaloProductUrl(item.handle ?? null))
            }
          />
        ))}
      </ScrollView>
      <View style={styles.sliderBottom}>
        <View style={styles.track}>
          <View
            style={[styles.trackFill, { width: `${fillRatio * 100}%` }]}
          />
        </View>
        <View style={styles.sliderArrows}>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex - 1)}
            accessibilityLabel="Previous gift"
          >
            <AppIcon
              name="chevron-left"
              size={16}
              color={CircleArrowColors.icon}
            />
          </Pressable>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex + 1)}
            accessibilityLabel="Next gift"
          >
            <AppIcon
              name="chevron-right"
              size={16}
              color={CircleArrowColors.icon}
            />
          </Pressable>
        </View>
      </View>
      <Pressable
        style={styles.viewAllRow}
        onPress={() => Linking.openURL(SPEEDREGALO_COLLECTIONS_URL)}
      >
        <ThemedText style={styles.viewAllText}>View More</ThemedText>
        <AppIcon name="arrow-forward" size={14} color="#1130bc" />
      </Pressable>
    </View>
  );
}

/* ── Main Screen ─────────────────────────────────────────────── */

export default function FlyScreen() {
  const [tab, setTab] = useState<Tab>("departing");
  const [search, setSearch] = useState("");

  const filteredFlights = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return MOCK_FLIGHTS;
    return MOCK_FLIGHTS.filter(
      (f) =>
        f.flightNumber.toLowerCase().includes(term) ||
        f.airline.toLowerCase().includes(term) ||
        f.fromCity.toLowerCase().includes(term) ||
        f.toCity.toLowerCase().includes(term),
    );
  }, [search]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Flights",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.light.primary },
          headerTitleStyle: {
            fontFamily: FontFamilies.bodySemiBold,
            fontSize: 18,
            color: "#fff",
          },
          headerTintColor: "#fff",
        }}
      />
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Flight search section ── */}
        <View style={styles.searchSection}>
          <ThemedText style={styles.headerTitle}>
            CHECK YOUR FLIGHT
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Unlock personalized picks, perfect pickup timing,
            terminal-specific perks, and keep all your QR passes and bookings
            in one place.
          </ThemedText>

          <View style={styles.tabsRow}>
            <Pressable
              style={[
                styles.tabBtn,
                tab === "departing" && styles.tabActive,
              ]}
              onPress={() => setTab("departing")}
            >
              <AppIcon
                name="flight-takeoff"
                size={24}
                color={tab === "departing" ? "#001fcd" : "#6b7280"}
              />
              <ThemedText
                style={[
                  styles.tabLabel,
                  tab === "departing" && styles.tabLabelActive,
                ]}
              >
                Departing
              </ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.tabBtn,
                tab === "arriving" && styles.tabActive,
              ]}
              onPress={() => setTab("arriving")}
            >
              <AppIcon
                name="flight-land"
                size={24}
                color={tab === "arriving" ? "#001fcd" : "#6b7280"}
              />
              <ThemedText
                style={[
                  styles.tabLabel,
                  tab === "arriving" && styles.tabLabelActive,
                ]}
              >
                Arriving
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.formGroup}>
            <TextInput
              placeholder="Flight Number"
              placeholderTextColor="#6b7280"
              value={search}
              onChangeText={setSearch}
              style={styles.formInput}
            />
            <TextInput
              placeholder="mm/dd/yyyy"
              placeholderTextColor="#6b7280"
              style={styles.formInput}
            />
            <TextInput
              placeholder="Philippine Airlines"
              placeholderTextColor="#6b7280"
              style={styles.formInput}
            />
            <Pressable style={styles.searchBtn}>
              <ThemedText style={styles.searchBtnText}>Search</ThemedText>
            </Pressable>
          </View>

          {filteredFlights.length === 0 ? (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyTitle}>
                No flights to display
              </ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                Try adjusting your search or date. Flights are loaded from
                live data.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.flightList}>
              {filteredFlights.slice(0, 6).map((flight, index) => (
                <View key={flight.id}>
                  {index === 2 && (
                    <Pressable
                      onPress={() => Linking.openURL(DUTY_FREE_SHOP_URL)}
                      style={styles.dfpAdWrap}
                    >
                      <Image
                        source={require("@/assets/images/migration/DfpAdBillboardMobile.png")}
                        style={styles.dfpAdImage}
                        resizeMode="contain"
                      />
                    </Pressable>
                  )}
                  <FlightCard
                    flight={flight}
                    tab={tab}
                    onPress={() =>
                      router.push({
                        pathname: "/fly/[flightId]",
                        params: { flightId: flight.id },
                      })
                    }
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Promos (home screen pattern) ── */}
        <SectionTitle title="PROMOS FOR YOU" />
        <HorizontalPromoCards />

        {/* ── Gifts (home screen pattern) ── */}
        <SectionTitle
          title="GIFTS & MORE!"
          subtitle="Perfect gifts for last-minute shoppers. Reserve ahead and collect at the airport."
        />
        <HorizontalGiftCards />

        {/* ── Duty Free Experience (shop screen pattern) ── */}
        <View style={styles.airplaneWrap}>
          <Image
            source={require("@/assets/images/migration/Airplane.png")}
            style={styles.airplane}
            resizeMode="contain"
          />
        </View>
        <View style={styles.blockTextWrap}>
          <ThemedText style={styles.blockTitle}>
            <ThemedText
              style={[styles.blockTitle, styles.blockTitleForeground]}
            >
              MORE ACCESS.{"\n"}MORE CONVENIENCE.{"\n"}
            </ThemedText>
            <ThemedText style={[styles.blockTitle, styles.blockTitlePrimary]}>
              SAME DUTY FREE{"\n"}EXPERIENCE.
            </ThemedText>
          </ThemedText>
          <ThemedText style={styles.blockBody}>
            Enjoy Duty Free shopping without the long queues—browse ahead,
            choose your picks, and prep for pickup.
          </ThemedText>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => Linking.openURL(DUTY_FREE_SHOP_URL)}
          >
            <ThemedText style={styles.primaryBtnText}>
              Shop Duty Free
            </ThemedText>
          </Pressable>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => Linking.openURL(DUTY_FREE_SHOP_URL)}
          >
            <ThemedText style={styles.secondaryBtnText}>
              How It Works
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

/* ── Styles ───────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: BACKGROUND },
  pageContent: { paddingBottom: 92 },

  /* Search section */
  searchSection: {
    padding: 16,
    paddingTop: 16,
  },
  headerTitle: {
    fontFamily: FontFamilies.header,
    fontSize: 32,
    color: "#001fcd",
    lineHeight: 36,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: "#1e1e1e",
    lineHeight: 20,
    marginTop: 8,
  },

  /* Tabs */
  tabsRow: {
    flexDirection: "row",
    gap: 48,
    marginTop: 24,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#001fcd" },
  tabLabel: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 16,
    color: "#6b7280",
  },
  tabLabelActive: { color: "#001fcd" },

  /* Form */
  formGroup: { gap: 12, marginTop: 24 },
  formInput: {
    fontFamily: FontFamilies.body,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e4e4e4",
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1e1e1e",
  },
  searchBtn: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#001fcd",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 16,
  },

  /* Empty state */
  emptyState: {
    marginTop: 24,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e4",
    backgroundColor: "rgba(244,244,245,0.3)",
    alignItems: "center",
  },
  emptyTitle: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
    color: "#1e1e1e",
  },
  emptySubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },

  /* Flight list */
  flightList: { marginTop: 24, gap: 16 },

  /* Flight card */
  flightCard: {
    borderWidth: 1,
    borderColor: "#e4e4e4",
    borderRadius: 12,
    padding: 20,
    backgroundColor: "#fff",
  },
  pressed: { opacity: 0.9 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusText: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 16,
    color: "#01BC1D",
  },
  airlineText: {
    fontFamily: FontFamilies.body,
    fontSize: 18,
    color: "#1e1e1e",
    marginTop: 4,
  },
  flightNumber: {
    fontFamily: FontFamilies.header,
    fontSize: 40,
    lineHeight: 44,
    color: "#1e1e1e",
    letterSpacing: -0.4,
    marginTop: 2,
  },
  routeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  routeText: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 16,
    color: "#1e1e1e",
    flexShrink: 1,
  },
  detailGrid: { marginTop: 12, gap: 12 },
  detailRow: { flexDirection: "row", gap: 16 },
  detailCell: { flex: 1 },
  detailLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: "#7e7e7e",
  },
  detailValue: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: "#1e1e1e",
    marginTop: 2,
  },

  /* DFP Ad banner */
  dfpAdWrap: { marginBottom: 16 },
  dfpAdImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    borderRadius: 16,
  },

  /* Section titles (matches home screen) */
  sectionHeader: { paddingHorizontal: 8, marginTop: 12, marginBottom: 20 },
  sectionTitle: {
    fontFamily: FontFamilies.header,
    color: "#1231bb",
    fontSize: 32,
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontFamily: FontFamilies.body,
    marginTop: 4,
    color: "#20252f",
    fontSize: 16,
    lineHeight: 22,
  },

  /* Slider shared (matches home screen) */
  sliderWrap: { marginBottom: 32 },
  hScroll: { paddingHorizontal: 8, gap: 10 },
  sliderBottom: {
    paddingHorizontal: 8,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  track: {
    width: 248,
    height: 3,
    borderRadius: 2,
    backgroundColor: TrackColors.track,
    overflow: "hidden",
  },
  trackFill: { height: 3, backgroundColor: TrackColors.fill },
  sliderArrows: { flexDirection: "row", gap: 6 },
  circleArrow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: CircleArrowColors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  /* View All Row (matches home screen) */
  viewAllRow: {
    alignSelf: "flex-end",
    marginTop: 16,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    color: "#1130bc",
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
  },

  /* Promo cards (matches home screen HorizontalCards tall) */
  promoCard: {
    width: 250,
    height: 142,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },

  /* Product card (matches home screen) */
  productCard: {
    height: 480,
    minHeight: 480,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e3e5ea",
    backgroundColor: "#fff",
    overflow: "hidden",
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  productImageWrap: {
    position: "relative",
    width: "100%",
    minHeight: 320,
    height: 320,
    overflow: "hidden",
    backgroundColor: "#f4f4f5",
  },
  productBadges: {
    position: "absolute",
    left: 8,
    top: 8,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeExclusive: {
    backgroundColor: "#f8d300",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeEarnPoints: {
    backgroundColor: "#1130bc",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 11,
    color: "#111827",
  },
  badgeEarnText: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 11,
    color: "#fff",
  },
  productImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productContent: {
    flex: 1,
    minHeight: 0,
    padding: 24,
    paddingTop: 24,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  productTitlePriceBlock: {
    flexShrink: 0,
    justifyContent: "flex-start",
  },
  productTitle: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: "#111827",
  },
  productPrice: {
    fontFamily: FontFamilies.body,
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  productActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 24,
    flexShrink: 0,
    marginTop: "auto",
  },
  productHeartBtn: {
    padding: 4,
  },
  viewProductBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#1130bc",
    paddingHorizontal: 10,
  },
  viewProductText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 11,
  },

  /* Airplane + Duty Free section (matches shop screen) */
  airplaneWrap: {
    width: "100%",
    position: "relative",
    marginTop: 4,
    height: 280,
    overflow: "hidden",
  },
  airplane: {
    position: "absolute",
    right: -40,
    top: 0,
    width: SCREEN_WIDTH * 1.15,
    height: 280,
  },
  blockTextWrap: { paddingHorizontal: 8, marginTop: 10 },
  blockTitle: {
    fontFamily: FontFamilies.header,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  blockTitleForeground: {
    color: "#1e1e1e",
  },
  blockTitlePrimary: {
    color: "#001fcd",
  },
  blockBody: {
    fontFamily: FontFamilies.body,
    marginTop: 8,
    color: "#1e1e1e",
    fontSize: 18,
    lineHeight: 28,
  },
  primaryBtn: {
    marginTop: 10,
    height: 36,
    borderRadius: 6,
    backgroundColor: "#1130bc",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 12,
  },
  secondaryBtn: {
    marginTop: 6,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1130bc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  secondaryBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#1130bc",
    fontSize: 12,
  },
});
