import { AppIcon } from "@/components/ui/app-icon";
import { CircleArrowColors, FontFamilies, TrackColors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
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
  require("@/assets/images/migration/hero-mobile-1.png"),
  require("@/assets/images/migration/hero-mobile-2.png"),
  require("@/assets/images/migration/hero-mobile-3.png"),
  require("@/assets/images/migration/hero-mobile-4.png"),
];

const CATEGORIES = [
  {
    id: "frg",
    title: "Fragrances and Perfumes",
    image: require("@/assets/images/migration/frg.png"),
  },
  {
    id: "liq",
    title: "Liquors and Spirits",
    image: require("@/assets/images/migration/liq.png"),
  },
  {
    id: "duty",
    title: "Duty Free Picks",
    image: require("@/assets/images/migration/hero-mobile-2.png"),
  },
];

const BENEFITS = [
  { icon: "sell", label: "Duty Free pricing" },
  { icon: "redeem", label: "Travel-exclusive offers" },
  { icon: "flight", label: "Airport pickup options" },
  { icon: "verified-user", label: "Secure traveler validation" },
];

export default function ShopScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef<FlatList<number>>(null);
  const heroData = useMemo(() => [0, 1, 2, 3], []);

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
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.22)", "rgba(0,0,0,0.06)"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.heroShadeTop}
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.00)", "rgba(0,0,0,0.78)"]}
                locations={[0.15, 1]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.heroShadeBottom}
              />
            </ImageBackground>
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
        <Pressable
          style={styles.navRight}
          onPress={() => {
            const next = (activeSlide + 1) % heroData.length;
            heroRef.current?.scrollToOffset({
              offset: next * SCREEN_WIDTH,
              animated: true,
            });
            setActiveSlide(next);
          }}
        >
          <AppIcon name="chevron-right" size={24} color="#fff" />
        </Pressable>
      </View>

      <SectionHeader title="WHAT YOU CAN SHOP" />
      <HorizontalCategory cards={CATEGORIES} />

      <Image
        source={require("@/assets/images/migration/Airplane.png")}
        style={styles.airplane}
      />

      <View style={styles.blockTextWrap}>
        <ThemedText style={styles.blockTitle}>
          MORE ACCESS.{`\n`}MORE CONVENIENCE.{`\n`}SAME DUTY FREE{`\n`}
          EXPERIENCE.
        </ThemedText>
        <ThemedText style={styles.blockBody}>
          Enjoy Duty Free shopping without the long queues-browse ahead, choose
          your picks, and prep for pickup.
        </ThemedText>
        <Pressable style={styles.primaryBtn}>
          <ThemedText style={styles.primaryBtnText}>Shop Duty Free</ThemedText>
        </Pressable>
        <Pressable style={styles.secondaryBtn}>
          <ThemedText style={styles.secondaryBtnText}>How It Works</ThemedText>
        </Pressable>
      </View>

      <View style={styles.benefitsGrid}>
        {BENEFITS.map((benefit) => (
          <View key={benefit.label} style={styles.benefitItem}>
            <AppIcon name={benefit.icon as any} size={26} color="#1130bc" />
            <ThemedText style={styles.benefitLabel}>{benefit.label}</ThemedText>
          </View>
        ))}
      </View>

      <Image
        source={require("@/assets/images/migration/CoupleTraveller.png")}
        style={styles.peopleImage}
      />

      <SectionHeader title="WHO CAN SHOP DUTY-FREE?" />
      <View style={styles.whoCards}>
        <View style={styles.whoCard}>
          <AppIcon name="flight-takeoff" size={34} color="#1130bc" />
          <ThemedText style={styles.whoTitle}>Departing Passengers</ThemedText>
          <ThemedText style={styles.whoDesc}>Domestic Filipinos</ThemedText>
        </View>
        <View style={styles.whoCard}>
          <AppIcon name="flight-land" size={34} color="#1130bc" />
          <ThemedText style={styles.whoTitle}>Arriving Passengers</ThemedText>
          <ThemedText style={styles.whoDesc}>into the Philippines</ThemedText>
        </View>
      </View>

      <View style={styles.noteCard}>
        <ThemedText style={styles.noteTitle}>Not traveling today?</ThemedText>
        <ThemedText style={styles.noteText}>
          Browse products and availability by terminal.
        </ThemedText>
        <Link href="/shop" asChild>
          <Pressable style={styles.noteBtn}>
            <ThemedText style={styles.noteBtnText}>Shop Here</ThemedText>
          </Pressable>
        </Link>
      </View>

      <View style={styles.ctaBlock}>
        <ThemedText style={styles.ctaTitle}>
          SHOP DUTY FREE{`\n`}PHILIPPINES
        </ThemedText>
        <ThemedText style={styles.ctaSub}>
          Explore best-sellers and travel exclusives on Duty Free Philippines’
          official shop.
        </ThemedText>
        <Pressable style={styles.ctaBtn}>
          <ThemedText style={styles.ctaBtnText}>Shop Duty Free</ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    </View>
  );
}

function HorizontalCategory({
  cards,
}: {
  cards: { id: string; title: string; image: number }[];
}) {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = 160;
  const gap = 10;
  const itemSpan = cardWidth + gap;
  const maxIndex = Math.max(cards.length - 1, 0);
  const fillRatio = cards.length > 1 ? (activeIndex + 1) / cards.length : 1;

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
        {cards.map((card) => (
          <View key={card.id} style={styles.catCard}>
            <Image source={card.image} style={styles.catImage} />
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
  heroSlide: { height: 250, justifyContent: "center" },
  heroImage: { resizeMode: "cover" },
  heroShadeTop: {
    ...StyleSheet.absoluteFillObject,
  },
  heroShadeBottom: {
    ...StyleSheet.absoluteFillObject,
  },
  navLeft: {
    position: "absolute",
    left: 4,
    top: 110,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  navRight: {
    position: "absolute",
    right: 4,
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
  sliderWrap: { marginBottom: 32 },
  hScroll: { paddingHorizontal: 8, gap: 10 },
  catCard: {
    width: 160,
    borderRadius: 9,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  catImage: { width: "100%", height: 130 },
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
  airplane: { width: "100%", height: 160, marginTop: 4, resizeMode: "contain" },
  blockTextWrap: { paddingHorizontal: 8, marginTop: 10 },
  blockTitle: {
    fontFamily: FontFamilies.header,
    color: "#121621",
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  blockBody: {
    fontFamily: FontFamilies.body,
    marginTop: 8,
    color: "#1f2937",
    fontSize: 12,
    lineHeight: 17,
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
  benefitsGrid: {
    marginTop: 12,
    paddingHorizontal: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
  },
  benefitItem: { width: "50%", alignItems: "center", gap: 4 },
  benefitLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: "#111827",
    textAlign: "center",
  },
  peopleImage: {
    width: SCREEN_WIDTH - 16,
    height: 190,
    marginHorizontal: 8,
    marginTop: 18,
    borderRadius: 10,
  },
  whoCards: { paddingHorizontal: 8, gap: 10 },
  whoCard: {
    borderWidth: 1,
    borderColor: "#c9d2ff",
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 18,
    gap: 6,
  },
  whoTitle: {
    fontFamily: FontFamilies.bodyBold,
    color: "#1231bb",
    fontSize: 13,
  },
  whoDesc: { fontFamily: FontFamilies.body, color: "#6b7280", fontSize: 11 },
  noteCard: {
    marginHorizontal: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e7d282",
    borderRadius: 8,
    backgroundColor: "#fff7cc",
    padding: 10,
  },
  noteTitle: {
    fontFamily: FontFamilies.bodyBold,
    color: "#1f2937",
    fontSize: 11,
  },
  noteText: {
    fontFamily: FontFamilies.body,
    marginTop: 4,
    color: "#4b5563",
    fontSize: 11,
  },
  noteBtn: {
    marginTop: 8,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#1130bc",
    alignItems: "center",
    justifyContent: "center",
    width: 90,
  },
  noteBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 11,
  },
  ctaBlock: { marginTop: 22, paddingHorizontal: 8, alignItems: "center" },
  ctaTitle: {
    fontFamily: FontFamilies.header,
    textAlign: "center",
    color: "#1231bb",
    fontSize: 32,
    lineHeight: 38,
  },
  ctaSub: {
    fontFamily: FontFamilies.body,
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
    color: "#1f2937",
    maxWidth: 320,
  },
  ctaBtn: {
    marginTop: 10,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f8d300",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    paddingHorizontal: 18,
  },
  ctaBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#191919",
    fontSize: 12,
  },
});
