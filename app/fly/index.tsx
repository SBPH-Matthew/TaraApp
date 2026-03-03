import { AppIcon } from "@/components/ui/app-icon";
import {
  BACKGROUND,
  CircleArrowColors,
  FontFamilies,
  TrackColors,
} from "@/constants/theme";
import { router } from "expo-router";
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

import { ThemedText } from "@/components/themed-text";
import { DUTY_FREE_SHOP_URL } from "@/services/dutyFreeProducts";
import {
  GIFT_PLACEHOLDER_IMAGE,
  SPEEDREGALO_COLLECTIONS_URL,
  getSpeedRegaloProductUrl,
  useStorefrontProducts,
} from "@/services/shopifyStorefront";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GIFT_CARD_WIDTH = SCREEN_WIDTH * 0.75;
const PROMO_CARD_WIDTH = SCREEN_WIDTH * 0.78;

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
            value={tab === "departing" ? flight.boardingTime : flight.arrivalTime}
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

/* ── Promos Section ──────────────────────────────────────────── */

function PromosSection() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const gap = 16;
  const itemSpan = PROMO_CARD_WIDTH + gap;
  const maxIndex = Math.max(PROMO_IMAGES.length - 1, 0);
  const fillRatio =
    PROMO_IMAGES.length > 1 ? (activeIndex + 1) / PROMO_IMAGES.length : 1;

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    scrollRef.current?.scrollTo({ x: clamped * itemSpan, animated: true });
    setActiveIndex(clamped);
  };

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>PROMOS FOR YOU</ThemedText>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promoScroll}
        snapToInterval={itemSpan}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / itemSpan);
          setActiveIndex(Math.max(0, Math.min(next, maxIndex)));
        }}
      >
        {PROMO_IMAGES.map((image, idx) => (
          <Image
            key={idx}
            source={image}
            style={[styles.promoCard, { width: PROMO_CARD_WIDTH }]}
            resizeMode="contain"
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

/* ── Gift Product Card ───────────────────────────────────────── */

function GiftProductCard({
  item,
  width,
  onPress,
}: {
  item: {
    id: string;
    name: string;
    price: string;
    image: string | null;
  };
  width: number;
  onPress: () => void;
}) {
  return (
    <View style={[styles.giftCard, { width }]}>
      <View style={styles.giftImageWrap}>
        <Image
          source={{ uri: item.image || GIFT_PLACEHOLDER_IMAGE }}
          style={styles.giftImage}
        />
        <View style={styles.giftBadges}>
          <View style={styles.badgeMadeInPH}>
            <ThemedText style={styles.badgeTextDark}>Made in PH</ThemedText>
          </View>
          <View style={styles.badgeEarnPoints}>
            <ThemedText style={styles.badgeTextLight}>Earn Points!</ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.giftContent}>
        <ThemedText style={styles.giftName} numberOfLines={2}>
          {item.name}
        </ThemedText>
        <ThemedText style={styles.giftPrice}>{item.price}</ThemedText>
        <View style={styles.giftActions}>
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

/* ── Gifts & More Section ────────────────────────────────────── */

const GIFT_PAGE_SIZE = 8;

function GiftsSection() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: storefrontGifts, isSuccess } = useStorefrontProducts(
    "az",
    GIFT_PAGE_SIZE,
  );

  const items = useMemo(() => {
    if (isSuccess && storefrontGifts && storefrontGifts.length > 0) {
      return storefrontGifts;
    }
    return [];
  }, [isSuccess, storefrontGifts]);

  const gap = 10;
  const itemSpan = GIFT_CARD_WIDTH + gap;
  const maxIndex = Math.max(items.length - 1, 0);
  const fillRatio = items.length > 1 ? (activeIndex + 1) / items.length : 1;

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    scrollRef.current?.scrollTo({ x: clamped * itemSpan, animated: true });
    setActiveIndex(clamped);
  };

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.giftHeaderRow}>
        <View style={styles.giftHeaderText}>
          <ThemedText style={styles.sectionTitle}>GIFTS & MORE!</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Perfect gifts for last-minute shoppers. Reserve ahead and collect at
            the airport.
          </ThemedText>
        </View>
        <Pressable
          style={styles.viewMoreLink}
          onPress={() => Linking.openURL(SPEEDREGALO_COLLECTIONS_URL)}
        >
          <ThemedText style={styles.viewMoreLinkText}>View More</ThemedText>
          <AppIcon name="arrow-forward" size={14} color="#001fcd" />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.giftScroll}
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / itemSpan);
          setActiveIndex(Math.max(0, Math.min(next, maxIndex)));
        }}
      >
        {items.map((item) => (
          <GiftProductCard
            key={item.id}
            item={item}
            width={GIFT_CARD_WIDTH}
            onPress={() =>
              Linking.openURL(getSpeedRegaloProductUrl(item.handle))
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
    </View>
  );
}

/* ── Duty Free Experience Section ────────────────────────────── */

function DutyFreeExperienceSection() {
  return (
    <View style={styles.dutyFreeSection}>
      <Image
        source={require("@/assets/images/migration/Airplane.png")}
        style={styles.airplaneImage}
        resizeMode="contain"
      />
      <View style={styles.dutyFreeContent}>
        <ThemedText style={styles.dutyFreeHeading}>MORE ACCESS.</ThemedText>
        <ThemedText style={styles.dutyFreeHeading}>
          MORE CONVENIENCE.
        </ThemedText>
        <ThemedText
          style={[styles.dutyFreeHeading, styles.dutyFreeHeadingBlue]}
        >
          SAME DUTY FREE EXPERIENCE.
        </ThemedText>
        <ThemedText style={styles.dutyFreeBody}>
          Enjoy Duty Free shopping without the long queues—browse ahead, choose
          your picks, and prep for pickup.
        </ThemedText>
        <View style={styles.dutyFreeButtons}>
          <Pressable
            style={styles.shopDutyFreeBtn}
            onPress={() => Linking.openURL(DUTY_FREE_SHOP_URL)}
          >
            <ThemedText style={styles.shopDutyFreeBtnText}>
              Shop Duty Free
            </ThemedText>
          </Pressable>
          <Pressable
            style={styles.howItWorksBtn}
            onPress={() => Linking.openURL(DUTY_FREE_SHOP_URL)}
          >
            <ThemedText style={styles.howItWorksBtnText}>
              How It Works
            </ThemedText>
          </Pressable>
        </View>
      </View>
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
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Flight search section ── */}
      <View style={styles.searchSection}>
        <ThemedText style={styles.headerTitle}>CHECK YOUR FLIGHT</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Unlock personalized picks, perfect pickup timing, terminal-specific
          perks, and keep all your QR passes and bookings in one place.
        </ThemedText>

        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tabBtn, tab === "departing" && styles.tabActive]}
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
            style={[styles.tabBtn, tab === "arriving" && styles.tabActive]}
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
              Try adjusting your search or date. Flights are loaded from live
              data.
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

      {/* ── Below-the-fold sections ── */}
      <PromosSection />
      <GiftsSection />
      <DutyFreeExperienceSection />
    </ScrollView>
  );
}

/* ── Styles ───────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: BACKGROUND },
  pageContent: { paddingBottom: 48 },

  /* Search section */
  searchSection: {
    padding: 16,
    paddingTop: 56,
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

  /* Shared section styles */
  section: {
    paddingHorizontal: 16,
    paddingTop: 56,
  },
  sectionTitle: {
    fontFamily: FontFamilies.header,
    fontSize: 32,
    color: "#001fcd",
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: "#1e1e1e",
    lineHeight: 20,
    marginTop: 4,
  },

  /* Slider bottom (shared by promos & gifts) */
  sliderBottom: {
    paddingHorizontal: 0,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  track: {
    width: 220,
    height: 4,
    borderRadius: 2,
    backgroundColor: TrackColors.track,
    overflow: "hidden",
  },
  trackFill: { height: 4, backgroundColor: TrackColors.fill },
  sliderArrows: { flexDirection: "row", gap: 8 },
  circleArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#7e7e7e",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  /* Promo section */
  promoScroll: { gap: 16 },
  promoCard: {
    height: 142,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e4e4e4",
    marginTop: 24,
  },

  /* Gifts section header */
  giftHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  giftHeaderText: { flex: 1 },
  viewMoreLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
  },
  viewMoreLinkText: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
    color: "#001fcd",
  },

  /* Gift scroll */
  giftScroll: { gap: 16 },

  /* Gift product card */
  giftCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e4",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  giftImageWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: 4 / 3,
    overflow: "hidden",
    backgroundColor: "#f4f4f5",
  },
  giftImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  giftBadges: {
    position: "absolute",
    left: 8,
    top: 8,
    zIndex: 10,
    flexDirection: "row",
    gap: 4,
  },
  badgeMadeInPH: {
    backgroundColor: "#ffd814",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeEarnPoints: {
    backgroundColor: "#001fcd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeTextDark: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 12,
    color: "#1e1e1e",
  },
  badgeTextLight: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 12,
    color: "#fff",
  },
  giftContent: {
    padding: 16,
  },
  giftName: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
    color: "#1e1e1e",
    lineHeight: 20,
  },
  giftPrice: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  giftActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 16,
  },
  viewProductBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#001fcd",
    paddingHorizontal: 12,
  },
  viewProductText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 12,
  },

  /* Duty Free Experience section */
  dutyFreeSection: {
    marginTop: 56,
  },
  airplaneImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
  },
  dutyFreeContent: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  dutyFreeHeading: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 32,
    lineHeight: 40,
    color: "#1e1e1e",
  },
  dutyFreeHeadingBlue: {
    color: "#001fcd",
  },
  dutyFreeBody: {
    fontFamily: FontFamilies.body,
    fontSize: 18,
    lineHeight: 24,
    color: "#1e1e1e",
    marginTop: 4,
    marginBottom: 12,
  },
  dutyFreeButtons: { gap: 8 },
  shopDutyFreeBtn: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#001fcd",
    alignItems: "center",
    justifyContent: "center",
  },
  shopDutyFreeBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 16,
  },
  howItWorksBtn: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#001fcd",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  howItWorksBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#001fcd",
    fontSize: 16,
  },
});
