import { AppIcon } from "@/components/ui/app-icon";
import { BACKGROUND, CircleArrowColors, FontFamilies, TrackColors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
  DUTY_FREE_SHOP_URL,
  type DutyFreeProduct,
  getDutyFreeProductUrl,
  useFeaturedProducts,
} from "@/services/dutyFreeProducts";
import {
  GIFT_PLACEHOLDER_IMAGE,
  SPEEDREGALO_COLLECTIONS_URL,
  getSpeedRegaloProductUrl,
  useStorefrontProducts,
} from "@/services/shopifyStorefront";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PRODUCT_CARD_WIDTH = SCREEN_WIDTH * 0.72;

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

const FLIGHTS = [
  {
    id: "Z2328",
    airline: "Philippine AirAsia",
    route: "Ninoy Aquino International (MNL) -> Davao (DVO)",
    date: "13 Feb 2026",
    time: "18:05",
    gate: "Gate 7",
    airport: "Terminal 2",
  },
  {
    id: "T8512",
    airline: "AirSWIFT",
    route: "Ninoy Aquino International (MNL) -> El Nido (ENI)",
    date: "13 Feb 2026",
    time: "19:25",
    gate: "Gate 12",
    airport: "Terminal 2",
  },
  {
    id: "PR2457",
    airline: "Philippine Airlines",
    route: "General Santos International (GES) -> Manila (MNL)",
    date: "13 Feb 2026",
    time: "18:20",
    gate: "Gate 3",
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
        <View style={styles.flightCardHeader}>
          <ThemedText style={styles.flightCardTitle}>
            CHECK YOUR FLIGHT
          </ThemedText>
          <ThemedText style={styles.flightCardSubtitle}>
            Find your flight and attach it to your trip for personalized
            recommendations
          </ThemedText>
        </View>

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
              size={24}
              color={flightTab === "departing" ? "#001fcd" : "#6b7280"}
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
              size={24}
              color={flightTab === "arriving" ? "#001fcd" : "#6b7280"}
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

        <View style={styles.formGroup}>
          <TextInput
            placeholder="Flight Number"
            placeholderTextColor="#6b7280"
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
          <Pressable style={styles.searchFlightBtn}>
            <ThemedText style={styles.searchFlightBtnText}>Search</ThemedText>
          </Pressable>
        </View>

        <View style={styles.flightList}>
          {FLIGHTS.map((flight) => {
            const [from, to] = flight.route.split(" -> ");
            return (
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
                  <AppIcon name="check-circle" size={16} color="#01BC1D" />
                  <ThemedText style={styles.statusText}>On Time</ThemedText>
                </View>
                <ThemedText style={styles.airlineText}>
                  {flight.airline}
                </ThemedText>
                <ThemedText style={styles.flightNumber}>
                  {flight.id}
                </ThemedText>
                <View style={styles.routeRow}>
                  <ThemedText style={styles.routeFromTo}>{from}</ThemedText>
                  <AppIcon name="arrow-forward" size={16} color="#1e1e1e" />
                  <ThemedText style={styles.routeFromTo}>{to}</ThemedText>
                </View>
                <View style={styles.detailGrid}>
                  <View style={styles.detailRow}>
                    <Meta label="Date" value={flight.date} />
                    <Meta
                      label={
                        flightTab === "departing"
                          ? "Boarding Time"
                          : "Arrival Time"
                      }
                      value={flight.time}
                    />
                  </View>
                  <View style={styles.detailRow}>
                    <Meta label="Gate" value={flight.gate} />
                    <Meta label="Airport" value={flight.airport} />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Link href="/fly" asChild>
          <Pressable style={styles.moreFlightsBtn}>
            <ThemedText style={styles.moreFlightsText}>
              More Flights
            </ThemedText>
            <AppIcon name="arrow-forward" size={16} color="#001fcd" />
          </Pressable>
        </Link>
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
      <HorizontalGiftCards />
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
  viewMoreHref,
}: {
  title: string;
  subtitle?: string;
  viewMoreHref?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {subtitle ? (
        <ThemedText style={styles.sectionSubtitle}>{subtitle}</ThemedText>
      ) : null}
      {viewMoreHref ? (
        <Link href={viewMoreHref as "/shop"} asChild>
          <Pressable style={styles.viewMoreRow}>
            <ThemedText style={styles.viewMoreText}>View More</ThemedText>
            <AppIcon name="arrow-forward" size={16} color="#1130bc" />
          </Pressable>
        </Link>
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

const FALLBACK_DUTY_FREE: DutyFreeProduct[] = [
  {
    id: "fallback-1",
    name: "Hawk's Nest Founder's Collection Kit",
    price: "$34.20",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80",
    slug: "hawks-nest-founders-collection",
  },
  {
    id: "fallback-2",
    name: "Kokavi G 3",
    price: "$108.00",
    image:
      "https://images.unsplash.com/photo-1585386959984-a41552231606?auto=format&fit=crop&w=900&q=80",
    slug: "kokavi-g-3",
  },
];

const DUTY_FREE_PAGE_SIZE = 8;

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80";

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
      ? { uri: imageError ? PLACEHOLDER_IMAGE : (item.image || PLACEHOLDER_IMAGE) }
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
            <ThemedText style={styles.viewProductText}>View product</ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function HorizontalProductCards() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: featuredProducts, isSuccess } = useFeaturedProducts();
  const products = useMemo((): DutyFreeProduct[] => {
    if (isSuccess && featuredProducts && featuredProducts.length > 0) {
      return featuredProducts.slice(0, DUTY_FREE_PAGE_SIZE);
    }
    return FALLBACK_DUTY_FREE;
  }, [isSuccess, featuredProducts]);

  const gap = 10;
  const itemSpan = PRODUCT_CARD_WIDTH + gap;
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
          <ProductCard
            key={product.id}
            item={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            }}
            width={PRODUCT_CARD_WIDTH}
            onPress={() =>
              Linking.openURL(getDutyFreeProductUrl(product.slug))
            }
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
      <Pressable
        style={styles.viewAllRow}
        onPress={() => Linking.openURL(DUTY_FREE_SHOP_URL)}
      >
        <ThemedText style={styles.viewAllText}>View More</ThemedText>
        <AppIcon name="arrow-forward" size={14} color="#1130bc" />
      </Pressable>
    </View>
  );
}

const GIFT_PAGE_SIZE = 12;

function HorizontalGiftCards() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    data: storefrontGifts,
    isSuccess,
    isError,
    error,
  } = useStorefrontProducts("az", GIFT_PAGE_SIZE);
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

  const errorMessage = isError && error ? (error as Error).message : null;

  return (
    <View style={styles.sliderWrap}>
      {errorMessage ? (
        <ThemedText style={styles.giftFetchError} type="default">
          {errorMessage}
        </ThemedText>
      ) : null}
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
          <View style={[styles.trackFill, { width: `${fillRatio * 100}%` }]} />
        </View>
        <View style={styles.sliderArrows}>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex - 1)}
            accessibilityLabel="Previous gift"
          >
            <AppIcon name="chevron-left" size={16} color={CircleArrowColors.icon} />
          </Pressable>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex + 1)}
            accessibilityLabel="Next gift"
          >
            <AppIcon name="chevron-right" size={16} color={CircleArrowColors.icon} />
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

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: BACKGROUND },
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
  viewMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 2,
    alignSelf: "flex-start",
  },
  viewMoreText: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
    color: "#1130bc",
  },
  sliderWrap: { marginBottom: 32 },
  giftFetchError: {
    fontSize: 12,
    color: "#b91c1c",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
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
  flightCard: {
    marginHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e4",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 32,
  },
  flightCardHeader: {
    marginBottom: 24,
  },
  flightCardTitle: {
    fontFamily: FontFamilies.header,
    color: "#001fcd",
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.4,
  },
  flightCardSubtitle: {
    fontFamily: FontFamilies.body,
    color: "#1e1e1e",
    fontSize: 18,
    lineHeight: 24,
    marginTop: 4,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 48,
    marginBottom: 24,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#001fcd",
  },
  tabLabel: {
    fontFamily: FontFamilies.bodySemiBold,
    color: "#6b7280",
    fontSize: 16,
  },
  tabLabelActive: { color: "#001fcd" },
  formGroup: {
    gap: 12,
    marginBottom: 24,
  },
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
  searchFlightBtn: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#001fcd",
    alignItems: "center",
    justifyContent: "center",
  },
  searchFlightBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 16,
  },
  flightList: { gap: 16 },
  flightItem: {
    borderWidth: 1,
    borderColor: "#e4e4e4",
    borderRadius: 12,
    padding: 20,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#01BC1D",
    fontSize: 16,
  },
  airlineText: {
    fontFamily: FontFamilies.body,
    marginTop: 4,
    fontSize: 18,
    color: "#1e1e1e",
  },
  flightNumber: {
    fontFamily: FontFamilies.header,
    marginTop: 2,
    fontSize: 40,
    lineHeight: 44,
    color: "#1e1e1e",
    letterSpacing: -0.4,
  },
  routeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  routeFromTo: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 16,
    color: "#1e1e1e",
    flexShrink: 1,
  },
  detailGrid: {
    marginTop: 12,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: { flex: 1 },
  metaLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: "#7d8592",
  },
  metaValue: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: "#1e1e1e",
    marginTop: 2,
  },
  moreFlightsBtn: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 24,
    paddingHorizontal: 4,
  },
  moreFlightsText: {
    fontFamily: FontFamilies.bodySemiBold,
    color: "#001fcd",
    fontSize: 16,
  },
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
  rewardsWrap: {
    width: "100%",
    paddingHorizontal: 12,
    marginBottom: 32,
    alignItems: "center",
    alignSelf: "stretch",
  },
  rewardsImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
});
