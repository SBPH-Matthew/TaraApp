import { AppIcon } from "@/components/ui/app-icon";
import { CircleArrowColors, FontFamilies, TrackColors } from "@/constants/theme";
import { Link } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HERO_IMAGES = [
  require("@/assets/images/migration/SpeedregaloBanner.png"),
  require("@/assets/images/migration/hero-mobile-3.png"),
  require("@/assets/images/migration/hero-mobile-4.png"),
];

const CATEGORY_CARDS = [
  {
    id: "c1",
    title: "Gift Baskets & Hampers",
    image: require("@/assets/images/migration/GiftHampers.png"),
  },
  {
    id: "c2",
    title: "Personalized Gifts",
    image: require("@/assets/images/migration/PersonalizedGifts.png"),
  },
  {
    id: "c3",
    title: "Bags & Accessories",
    image: require("@/assets/images/migration/BagsAccessories.png"),
  },
];

export default function GiftsScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef<FlatList<number>>(null);
  const heroData = useMemo(() => [0, 1, 2], []);

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroWrap}>
        <FlatList
          ref={heroRef}
          horizontal
          pagingEnabled
          data={heroData}
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
            />
          )}
        />
        <Pressable
          style={styles.navLeft}
          onPress={() => {
            const next =
              activeSlide === 0 ? heroData.length - 1 : activeSlide - 1;
            heroRef.current?.scrollToOffset({
              offset: next * SCREEN_WIDTH,
              animated: true,
            });
            setActiveSlide(next);
          }}
        >
          <AppIcon name="chevron-left" size={24} color="#fff" />
        </Pressable>
      </View>

      <SectionHeader title="SHOP BY CATEGORY" />
      <HorizontalCategories />

      <Link href="/gifts/all" asChild>
        <Pressable style={styles.viewAllRow}>
          <ThemedText style={styles.viewAllText}>View All Products</ThemedText>
          <AppIcon name="arrow-forward" size={14} color="#1130bc" />
        </Pressable>
      </Link>

      <Image
        source={require("@/assets/images/migration/SpeedregaloAIImage.png")}
        style={styles.familyImage}
      />

      <SectionHeader
        title="SPEEDREGALO GIFTS"
        subtitle="Perfect gifts for last-minute shoppers. Reserve ahead and collect at the airport."
      />
      <View style={styles.deliveryCards}>
        <View style={styles.deliveryCard}>
          <AppIcon name="flight" size={38} color="#1130bc" />
          <ThemedText style={styles.deliveryText}>
            Collect at the Airport
          </ThemedText>
        </View>
        <View style={styles.deliveryCard}>
          <AppIcon name="local-shipping" size={38} color="#1130bc" />
          <ThemedText style={styles.deliveryText}>Home Delivery</ThemedText>
        </View>
      </View>

      <View style={styles.noteCard}>
        <ThemedText style={styles.noteText}>
          Flying in or out of the Philippines?{`\n`}Shop duty-free and
          speedregalo perks across airlines and airport promos.
        </ThemedText>
        <Pressable style={styles.noteBtn}>
          <ThemedText style={styles.noteBtnText}>Shop Here</ThemedText>
        </Pressable>
      </View>

      <SectionHeader title="BROWSE GIFTS & MORE!" />
      <HorizontalCategories />
      <Link href="/gifts/all" asChild>
        <Pressable style={styles.viewAllRow}>
          <ThemedText style={styles.viewAllText}>View All Products</ThemedText>
          <AppIcon name="arrow-forward" size={14} color="#1130bc" />
        </Pressable>
      </Link>

      <View style={styles.readyBlock}>
        <ThemedText style={styles.readyTitle}>
          READY TO SEND{`\n`}SOMETHING{`\n`}MEMORABLE?
        </ThemedText>
        <ThemedText style={styles.readySub}>
          Shop curated gifts, build custom boxes, or launch your corporate
          gifting program today.
        </ThemedText>
        <Pressable style={styles.readyBtn}>
          <ThemedText style={styles.readyBtnText}>Shop SpeedRegalo</ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function SectionHeader({
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
        <ThemedText style={styles.sectionSub}>{subtitle}</ThemedText>
      ) : null}
    </View>
  );
}

function HorizontalCategories() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = 160;
  const gap = 10;
  const itemSpan = cardWidth + gap;
  const maxIndex = Math.max(CATEGORY_CARDS.length - 1, 0);
  const fillRatio =
    CATEGORY_CARDS.length > 1 ? (activeIndex + 1) / CATEGORY_CARDS.length : 1;

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
        {CATEGORY_CARDS.map((card) => (
          <View key={card.id} style={styles.catCard}>
            <Image source={card.image} style={styles.catImage} />
            <ThemedText style={styles.catTitle}>{card.title}</ThemedText>
          </View>
        ))}
      </ScrollView>
      <View style={styles.sliderBottom}>
        <View style={styles.track}>
          <View style={[styles.trackFill, { width: `${fillRatio * 100}%` }]} />
        </View>
        <View style={styles.arrows}>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex - 1)}
            accessibilityLabel="Previous category"
          >
            <AppIcon name="chevron-left" size={16} color={CircleArrowColors.icon} />
          </Pressable>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex + 1)}
            accessibilityLabel="Next category"
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
  content: { paddingBottom: 92 },
  heroWrap: { position: "relative" },
  heroSlide: { height: 250 },
  heroImage: { resizeMode: "cover" },
  navLeft: {
    position: "absolute",
    left: 4,
    top: 110,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: { paddingHorizontal: 8, marginTop: 12, marginBottom: 20 },
  sectionTitle: {
    fontFamily: FontFamilies.header,
    color: "#1231bb",
    fontSize: 32,
    letterSpacing: -0.4,
  },
  sectionSub: { marginTop: 4, color: "#20252f", fontSize: 16, lineHeight: 22 },
  sliderWrap: { marginBottom: 32 },
  hScroll: { paddingHorizontal: 8, gap: 10 },
  catCard: {
    width: 160,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e4e6eb",
  },
  catImage: { width: "100%", height: 96 },
  catTitle: { fontSize: 11, padding: 6, fontWeight: "600" },
  sliderBottom: {
    paddingHorizontal: 8,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  track: {
    width: 248,
    height: 3,
    borderRadius: 2,
    backgroundColor: TrackColors.track,
    overflow: "hidden",
  },
  trackFill: { height: 3, backgroundColor: TrackColors.fill },
  arrows: { flexDirection: "row", gap: 6 },
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
    marginRight: 8,
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: { color: "#1130bc", fontWeight: "700", fontSize: 12 },
  familyImage: {
    width: SCREEN_WIDTH - 16,
    height: 180,
    marginHorizontal: 8,
    marginTop: 14,
    borderRadius: 10,
  },
  deliveryCards: { paddingHorizontal: 8, gap: 10, marginTop: 4 },
  deliveryCard: {
    borderWidth: 1,
    borderColor: "#b7c4ff",
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 92,
    gap: 6,
  },
  deliveryText: { color: "#1130bc", fontWeight: "700", fontSize: 12 },
  noteCard: {
    marginHorizontal: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e7d282",
    borderRadius: 8,
    backgroundColor: "#fff7cc",
    padding: 10,
  },
  noteText: { color: "#374151", fontSize: 11, lineHeight: 16 },
  noteBtn: {
    marginTop: 8,
    width: 90,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#1130bc",
    alignItems: "center",
    justifyContent: "center",
  },
  noteBtnText: { color: "#fff", fontWeight: "700", fontSize: 11 },
  readyBlock: { marginTop: 22, alignItems: "center", paddingHorizontal: 14 },
  readyTitle: {
    fontFamily: FontFamilies.header,
    textAlign: "center",
    color: "#20252f",
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.4,
  },
  readySub: {
    marginTop: 8,
    textAlign: "center",
    color: "#111827",
    fontSize: 12,
  },
  readyBtn: {
    marginTop: 12,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f8d300",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 132,
    paddingHorizontal: 18,
  },
  readyBtnText: { color: "#161616", fontWeight: "700", fontSize: 12 },
});
