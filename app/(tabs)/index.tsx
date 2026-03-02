import { AppIcon } from "@/components/ui/app-icon";
import { CircleArrowColors, FontFamilies, TrackColors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HERO_IMAGES = [
  require("@/assets/images/migration/TaraBanner1.png"),
  require("@/assets/images/migration/TaraBanner2.png"),
  require("@/assets/images/migration/TaraBanner3.png"),
];

const PROMO_CARDS = [
  { id: "promo-1", image: require("@/assets/images/migration/TaraPromo1.png") },
  { id: "promo-2", image: require("@/assets/images/migration/TaraPromo2.png") },
  { id: "promo-3", image: require("@/assets/images/migration/TaraPromo3.png") },
];

const PRODUCT_CARDS = [
  {
    id: "prod-1",
    label: "Duty Free",
    image: require("@/assets/images/migration/hero-mobile-1.png"),
  },
  {
    id: "prod-2",
    label: "Gifts & More",
    image: require("@/assets/images/migration/GiftHampers.png"),
  },
];

const FLIGHTS = [
  {
    id: "Z2328",
    airline: "Philippine AirAsia",
    route: "Ninoy Aquino International (MNL) -> Davao (DVO)",
    date: "13 Feb 2026",
    time: "18:05",
    airport: "Terminal 2",
  },
  {
    id: "T8512",
    airline: "AirSWIFT",
    route: "Ninoy Aquino International (MNL) -> El Nido (ENI)",
    date: "13 Feb 2026",
    time: "19:25",
    airport: "Terminal 2",
  },
  {
    id: "PR2457",
    airline: "Philippine Airlines",
    route: "General Santos International (GES) -> Manila (MNL)",
    date: "13 Feb 2026",
    time: "18:20",
    airport: "Terminal 2",
  },
];

export default function HomeScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [flightTab, setFlightTab] = useState<"departing" | "arriving">(
    "departing",
  );
  const heroRef = useRef<FlatList<number>>(null);

  const heroData = useMemo(() => [0, 1, 2], []);

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroWrap}>
        <FlatList
          ref={heroRef}
          data={heroData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => String(item)}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(
              e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
            );
            setActiveSlide(idx);
          }}
          renderItem={({ item }) => (
            <ImageBackground
              source={HERO_IMAGES[item]}
              style={[styles.heroSlide, { width: SCREEN_WIDTH }]}
              imageStyle={styles.heroImage}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.85)"]}
                locations={[0, 1]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.heroOverlay}>
                <View style={styles.heroContent}>
                  <ThemedText style={styles.heroTitle}>
                    SEE WHAT YOUR{`\n`}FLIGHT UNLOCKS.
                  </ThemedText>
                  <ThemedText style={styles.heroSubtitle}>
                    Airport perks, promos, and Duty Free offers
                  </ThemedText>
                  <View style={styles.heroSearchCard}>
                    <TextInput
                      placeholder="Flights, products or activities"
                      placeholderTextColor="#737373"
                      style={styles.heroInput}
                    />
                    <Pressable style={styles.heroSearchBtn}>
                      <ThemedText style={styles.heroSearchBtnText}>
                        Search
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              </View>
            </ImageBackground>
          )}
        />

        <Pressable
          onPress={() => {
            const next =
              activeSlide === 0 ? heroData.length - 1 : activeSlide - 1;
            heroRef.current?.scrollToOffset({
              offset: next * SCREEN_WIDTH,
              animated: true,
            });
            setActiveSlide(next);
          }}
          style={styles.navLeft}
        >
          <AppIcon name="chevron-left" size={24} color="#fff" />
        </Pressable>
        <Pressable
          onPress={() => {
            const next = (activeSlide + 1) % heroData.length;
            heroRef.current?.scrollToOffset({
              offset: next * SCREEN_WIDTH,
              animated: true,
            });
            setActiveSlide(next);
          }}
          style={styles.navRight}
        >
          <AppIcon name="chevron-right" size={24} color="#fff" />
        </Pressable>

        <View style={styles.dotsRow}>
          {heroData.map((dot) => (
            <Pressable
              key={dot}
              style={[styles.dot, activeSlide === dot && styles.dotActive]}
              onPress={() => {
                heroRef.current?.scrollToOffset({
                  offset: dot * SCREEN_WIDTH,
                  animated: true,
                });
                setActiveSlide(dot);
              }}
            />
          ))}
        </View>
      </View>

      <SectionTitle title="PROMOS FOR YOU" />
      <HorizontalCards images={PROMO_CARDS.map((c) => c.image)} tall />

      <View style={styles.flightCard}>
        <ThemedText style={styles.flightCardTitle}>
          CHECK YOUR FLIGHT
        </ThemedText>
        <ThemedText style={styles.flightCardSubtitle}>
          Find your flight and attach it to your trip
        </ThemedText>
        <View style={styles.tabsRow}>
          <Pressable
            style={[
              styles.tabBtn,
              flightTab === "departing" && styles.tabActive,
            ]}
            onPress={() => setFlightTab("departing")}
          >
            <AppIcon
              name="flight-takeoff"
              size={14}
              color={flightTab === "departing" ? "#1130bc" : "#5c6470"}
            />
            <ThemedText
              style={[
                styles.tabLabel,
                flightTab === "departing" && styles.tabLabelActive,
              ]}
            >
              Departing
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.tabBtn,
              flightTab === "arriving" && styles.tabActive,
            ]}
            onPress={() => setFlightTab("arriving")}
          >
            <AppIcon
              name="flight-land"
              size={14}
              color={flightTab === "arriving" ? "#1130bc" : "#5c6470"}
            />
            <ThemedText
              style={[
                styles.tabLabel,
                flightTab === "arriving" && styles.tabLabelActive,
              ]}
            >
              Arriving
            </ThemedText>
          </Pressable>
        </View>
        <TextInput
          placeholder="Flight Number"
          placeholderTextColor="#8b9099"
          style={styles.formInput}
        />
        <TextInput
          placeholder="mm/dd/yyyy"
          placeholderTextColor="#8b9099"
          style={styles.formInput}
        />
        <TextInput
          placeholder="Filipino Airlines"
          placeholderTextColor="#8b9099"
          style={styles.formInput}
        />
        <Pressable style={styles.searchFlightBtn}>
          <ThemedText style={styles.searchFlightBtnText}>Search</ThemedText>
        </Pressable>

        <View style={styles.flightList}>
          {FLIGHTS.map((flight) => (
            <Pressable
              key={flight.id}
              style={styles.flightItem}
              onPress={() =>
                router.push({
                  pathname: "/fly/[flightId]",
                  params: { flightId: flight.id },
                })
              }
            >
              <View style={styles.statusRow}>
                <AppIcon name="check-circle" size={12} color="#01BC1D" />
                <ThemedText style={styles.statusText}>On Time</ThemedText>
              </View>
              <ThemedText style={styles.airlineText}>
                {flight.airline}
              </ThemedText>
              <ThemedText style={styles.flightNumber}>{flight.id}</ThemedText>
              <ThemedText style={styles.routeText}>{flight.route}</ThemedText>
              <View style={styles.metaRow}>
                <Meta label="Date" value={flight.date} />
                <Meta label="Boarding Time" value={flight.time} />
                <Meta label="Airport" value={flight.airport} />
              </View>
            </Pressable>
          ))}
          <Link href="/fly" asChild>
            <Pressable style={styles.moreBtn}>
              <ThemedText style={styles.moreBtnText}>More Flights</ThemedText>
            </Pressable>
          </Link>
        </View>
      </View>

      <SectionTitle
        title="SHOP DUTY FREE"
        subtitle="Browse premium brands and reserve your duty-free shopping ahead of time"
      />
      <HorizontalProductCards />

      <View style={styles.rewardsWrap}>
        <Image
          source={require("@/assets/images/migration/MobileRewardsComingSoon.png")}
          style={styles.rewardsImage}
          resizeMode="contain"
        />
      </View>

      <SectionTitle
        title="GIFTS & MORE!"
        subtitle="Perfect gifts for last-minute shoppers. Reserve ahead and collect at the airport."
      />
      <HorizontalCards images={PRODUCT_CARDS.map((c) => c.image)} />
    </ScrollView>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <ThemedText style={styles.metaLabel}>{label}</ThemedText>
      <ThemedText style={styles.metaValue}>{value}</ThemedText>
    </View>
  );
}

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

function HorizontalCards({
  images,
  tall = false,
}: {
  images: number[];
  tall?: boolean;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = 250;
  const gap = 10;
  const itemSpan = cardWidth + gap;
  const maxIndex = Math.max(images.length - 1, 0);
  const fillRatio = images.length > 1 ? (activeIndex + 1) / images.length : 1;

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
        onMomentumScrollEnd={(event) => {
          const next = Math.round(event.nativeEvent.contentOffset.x / itemSpan);
          setActiveIndex(Math.max(0, Math.min(next, maxIndex)));
        }}
      >
        {images.map((image, idx) => (
          <Image
            key={idx}
            source={image}
            style={[styles.sliderCard, tall ? styles.sliderCardTall : null]}
          />
        ))}
      </ScrollView>
      <View style={styles.sliderBottom}>
        <View style={styles.track}>
          <View style={[styles.trackFill, { width: `${fillRatio * 100}%` }]} />
        </View>
        <View style={styles.sliderArrows}>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex - 1)}
            accessibilityLabel="Previous promo"
          >
            <AppIcon name="chevron-left" size={16} color={CircleArrowColors.icon} />
          </Pressable>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex + 1)}
            accessibilityLabel="Next promo"
          >
            <AppIcon name="chevron-right" size={16} color={CircleArrowColors.icon} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function HorizontalProductCards() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const products = [
    {
      id: "a",
      title: "Hawk's Nest Founder's Collection Kit",
      price: "₱5,821",
      image: require("@/assets/images/migration/hero-mobile-1.png"),
    },
    {
      id: "b",
      title: "Kokavi G 3",
      price: "₱4,740",
      image: require("@/assets/images/migration/hero-mobile-2.png"),
    },
  ];
  const cardWidth = 170;
  const gap = 10;
  const itemSpan = cardWidth + gap;
  const maxIndex = Math.max(products.length - 1, 0);
  const fillRatio =
    products.length > 1 ? (activeIndex + 1) / products.length : 1;

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
        onMomentumScrollEnd={(event) => {
          const next = Math.round(event.nativeEvent.contentOffset.x / itemSpan);
          setActiveIndex(Math.max(0, Math.min(next, maxIndex)));
        }}
      >
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Image source={product.image} style={styles.productImage} />
            <ThemedText style={styles.productTitle} numberOfLines={2}>
              {product.title}
            </ThemedText>
            <ThemedText style={styles.productPrice}>{product.price}</ThemedText>
            <Pressable style={styles.viewProductBtn}>
              <ThemedText style={styles.viewProductText}>
                View product
              </ThemedText>
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <View style={styles.sliderBottom}>
        <View style={styles.track}>
          <View style={[styles.trackFill, { width: `${fillRatio * 100}%` }]} />
        </View>
        <View style={styles.sliderArrows}>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex - 1)}
            accessibilityLabel="Previous product"
          >
            <AppIcon name="chevron-left" size={16} color={CircleArrowColors.icon} />
          </Pressable>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex + 1)}
            accessibilityLabel="Next product"
          >
            <AppIcon name="chevron-right" size={16} color={CircleArrowColors.icon} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#efefef" },
  pageContent: { paddingBottom: 92 },
  heroWrap: { position: "relative", marginBottom: 32, minHeight: 420 },
  heroSlide: { height: 420, minHeight: 420, justifyContent: "center" },
  heroImage: { resizeMode: "cover" },
  heroOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  heroContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 320,
    gap: 16,
  },
  heroTitle: {
    fontFamily: FontFamilies.header,
    color: "#fff",
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  heroSubtitle: {
    fontFamily: FontFamilies.body,
    marginTop: 2,
    color: "rgba(255,255,255,0.85)",
    fontSize: 18,
    lineHeight: 22,
    maxWidth: 280,
    textAlign: "center",
  },
  navLeft: {
    position: "absolute",
    left: 4,
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  navRight: {
    position: "absolute",
    right: 4,
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  heroSearchCard: {
    marginTop: 8,
    width: "100%",
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  heroInput: {
    fontFamily: FontFamilies.body,
    flex: 1,
    fontSize: 14,
    color: "#000",
    paddingVertical: 0,
  },
  heroSearchBtn: {
    height: 36,
    minWidth: 72,
    borderRadius: 8,
    backgroundColor: "#1130bc",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  heroSearchBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 14,
  },
  dotsRow: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#f8d300" },
  dotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#f8d300",
    borderWidth: 2,
    borderColor: "#fff4bb",
  },
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
  sliderWrap: { marginBottom: 32 },
  hScroll: { paddingHorizontal: 8, gap: 10 },
  sliderCard: {
    width: 250,
    height: 132,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
  sliderCardTall: { height: 142 },
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
  flightCard: {
    marginHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d8d8dd",
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: 18,
    marginBottom: 32,
  },
  flightCardTitle: {
    fontFamily: FontFamilies.header,
    color: "#1231bb",
    fontSize: 32,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  flightCardSubtitle: {
    fontFamily: FontFamilies.body,
    color: "#20252f",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  tabsRow: { flexDirection: "row", gap: 16, marginBottom: 10 },
  tabBtn: { flexDirection: "row", alignItems: "center", gap: 5, minHeight: 30 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#1130bc" },
  tabLabel: {
    fontFamily: FontFamilies.bodySemiBold,
    color: "#5c6470",
    fontSize: 12,
  },
  tabLabelActive: { color: "#1130bc" },
  formInput: {
    fontFamily: FontFamilies.body,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e4ea",
    marginBottom: 8,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  searchFlightBtn: {
    marginBottom: 10,
    height: 34,
    borderRadius: 6,
    backgroundColor: "#1130bc",
    alignItems: "center",
    justifyContent: "center",
  },
  searchFlightBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 12,
  },
  flightList: { gap: 8 },
  flightItem: {
    borderWidth: 1,
    borderColor: "#e2e4ea",
    borderRadius: 8,
    padding: 10,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  statusText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#01BC1D",
    fontSize: 10,
  },
  airlineText: {
    fontFamily: FontFamilies.body,
    marginTop: 4,
    fontSize: 11,
    color: "#272d35",
  },
  flightNumber: {
    fontFamily: FontFamilies.header,
    marginTop: 1,
    fontSize: 36 / 2,
    color: "#1f2430",
    letterSpacing: -0.4,
  },
  routeText: {
    fontFamily: FontFamilies.body,
    marginTop: 2,
    fontSize: 10,
    color: "#4b5563",
  },
  metaRow: { flexDirection: "row", marginTop: 8, gap: 8 },
  metaItem: { flex: 1 },
  metaLabel: { fontFamily: FontFamilies.body, fontSize: 9, color: "#7d8592" },
  metaValue: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 10,
    color: "#1f2430",
  },
  moreBtn: { alignSelf: "flex-end", paddingVertical: 6, paddingHorizontal: 4 },
  moreBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#1130bc",
    fontSize: 12,
  },
  productCard: {
    width: 170,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e3e5ea",
    backgroundColor: "#fff",
    padding: 8,
  },
  productImage: { width: "100%", height: 90, borderRadius: 8 },
  productTitle: {
    fontFamily: FontFamilies.body,
    marginTop: 6,
    fontSize: 11,
    lineHeight: 14,
  },
  productPrice: {
    fontFamily: FontFamilies.body,
    marginTop: 4,
    color: "#4b5563",
    fontSize: 10,
  },
  viewProductBtn: {
    marginTop: 8,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#1130bc",
    alignItems: "center",
    justifyContent: "center",
  },
  viewProductText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 11,
  },
  rewardsWrap: {
    width: "80%",
    alignSelf: "center",
    marginBottom: 32,
    overflow: "hidden",
    borderRadius: 10,
  },
  rewardsImage: {
    width: "100%",
    aspectRatio: 1.8,
    borderRadius: 10,
  },
});
