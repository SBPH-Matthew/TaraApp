import { AppIcon } from "@/components/ui/app-icon";
import {
  BACKGROUND,
  CircleArrowColors,
  FontFamilies,
  TrackColors,
} from "@/constants/theme";
import { SHOP_CATEGORY_IDS_AND_LABELS } from "@/constants/shop";
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

// Web: flex snap-x snap-mandatory gap-4, card min-w-[78%] aspect-325/235 snap-center
const CATEGORY_CARD_GAP = 16;
const CATEGORY_CARD_WIDTH = SCREEN_WIDTH * 0.78;
const CATEGORY_CARD_HEIGHT = CATEGORY_CARD_WIDTH * (235 / 325);

const HERO_IMAGES = [
  require("@/assets/images/migration/hero-mobile-1.png"),
  require("@/assets/images/migration/hero-mobile-2.png"),
  require("@/assets/images/migration/hero-mobile-3.png"),
  require("@/assets/images/migration/hero-mobile-4.png"),
];

const CATEGORY_IMAGES: Record<string, number> = {
  fragrance: require("@/assets/images/migration/frg.png"),
  pasalubong: require("@/assets/images/migration/pp.png"),
  liquor: require("@/assets/images/migration/liq.png"),
  snacks: require("@/assets/images/migration/cs.png"),
  fashion: require("@/assets/images/migration/fa.png"),
  local: require("@/assets/images/migration/lp.png"),
  gadgets: require("@/assets/images/migration/ele.png"),
  toys: require("@/assets/images/migration/toys.png"),
};

const CATEGORIES = SHOP_CATEGORY_IDS_AND_LABELS.map((c) => ({
  id: c.id,
  title: c.label,
  image: CATEGORY_IMAGES[c.id] ?? require("@/assets/images/migration/hero-mobile-1.png"),
}));

const BENEFIT_ICON_COLOR = "#1e1e1e";
const BENEFITS = [
  { icon: "tag", label: "Duty Free pricing" },
  { icon: "briefcase", label: "Travel-exclusive offers" },
  { icon: "flight", label: "Airport pickup options" },
  { icon: "badge-check", label: "Secure traveler validation" },
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
          keyExtractor={String}
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

      <SectionHeader title="WHAT YOU CAN SHOP" />
      <HorizontalCategory cards={CATEGORIES} />

      <View style={styles.airplaneWrap}>
        <Image
          source={require("@/assets/images/migration/Airplane.png")}
          style={styles.airplane}
          resizeMode="contain"
        />
      </View>

      <View style={styles.blockTextWrap}>
        <ThemedText style={styles.blockTitle}>
          <ThemedText style={[styles.blockTitle, styles.blockTitleForeground]}>
            MORE ACCESS.{`\n`}MORE CONVENIENCE.{`\n`}
          </ThemedText>
          <ThemedText style={[styles.blockTitle, styles.blockTitlePrimary]}>
            SAME DUTY FREE{`\n`}EXPERIENCE.
          </ThemedText>
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
            <AppIcon
              name={benefit.icon as any}
              size={40}
              color={BENEFIT_ICON_COLOR}
              strokeWidth={1}
            />
            <ThemedText style={styles.benefitLabel}>{benefit.label}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.peopleImageWrap}>
        <Image
          source={require("@/assets/images/migration/CoupleTraveller.png")}
          style={styles.peopleImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.whoSectionHeader}>
        <ThemedText style={styles.whoSectionTitle}>
          WHO CAN SHOP DUTY-FREE?
        </ThemedText>
      </View>
      <View style={styles.whoCards}>
        <View style={styles.whoCard}>
          <AppIcon name="flight-takeoff" size={80} color="#1130bc" strokeWidth={1} />
          <View style={styles.whoCardTextWrap}>
            <ThemedText style={styles.whoTitle}>Departing Passengers</ThemedText>
            <ThemedText style={styles.whoDesc}>Domestic Filipinos</ThemedText>
          </View>
        </View>
        <View style={styles.whoCard}>
          <AppIcon name="flight-land" size={80} color="#1130bc" strokeWidth={1} />
          <View style={styles.whoCardTextWrap}>
            <ThemedText style={styles.whoTitle}>Arriving Passengers</ThemedText>
            <ThemedText style={styles.whoDesc}>into the Philippines</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.noteCard}>
        <View style={styles.noteCardTextWrap}>
          <ThemedText style={styles.noteTitle}>Not traveling today?</ThemedText>
          <ThemedText style={styles.noteText}>
            Browse local deals and curated gift sets in minutes.
          </ThemedText>
        </View>
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
  const itemSpan = CATEGORY_CARD_WIDTH + CATEGORY_CARD_GAP;
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
        snapToInterval={itemSpan}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const next = Math.round(event.nativeEvent.contentOffset.x / itemSpan);
          setActiveIndex(Math.max(0, Math.min(next, maxIndex)));
        }}
      >
        {cards.map((card) => (
          <ImageBackground
            key={card.id}
            source={card.image}
            style={[
              styles.catCard,
              {
                width: CATEGORY_CARD_WIDTH,
                height: CATEGORY_CARD_HEIGHT,
              },
            ]}
            imageStyle={styles.catImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={[
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0.2)",
                "rgba(0,0,0,0.65)",
              ]}
              locations={[0, 0.5, 1]}
              style={StyleSheet.absoluteFillObject}
            />
            <ThemedText style={styles.catLabel} numberOfLines={2}>
              {card.title}
            </ThemedText>
          </ImageBackground>
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
            <AppIcon
              name="chevron-left"
              size={16}
              color={CircleArrowColors.icon}
            />
          </Pressable>
          <Pressable
            style={styles.circleArrow}
            onPress={() => goTo(activeIndex + 1)}
            accessibilityLabel="Next category"
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

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: BACKGROUND },
  content: { paddingBottom: 92 },
  heroWrap: {
    position: "relative",
    marginBottom: 32,
    minHeight: 420,
  },
  heroSlide: {
    height: 420,
    minHeight: 420,
    justifyContent: "center",
  },
  heroImage: { resizeMode: "cover" },
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
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f8d300",
  },
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
  sliderWrap: { marginBottom: 32 },
  hScroll: { paddingHorizontal: 8, gap: CATEGORY_CARD_GAP },
  catCard: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  catImage: {
    width: "100%",
    height: "100%",
  },
  catLabel: {
    position: "absolute",
    bottom: 12,
    left: 12,
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
    color: "#fde047",
    maxWidth: "85%",
  },
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
  benefitsGrid: {
    marginTop: 40,
    marginBottom: 40,
    paddingHorizontal: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 24,
    rowGap: 36,
  },
  benefitItem: {
    width: "47%",
    alignItems: "center",
    gap: 10,
  },
  benefitLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: "#1e1e1e",
    textAlign: "center",
  },
  peopleImageWrap: {
    width: SCREEN_WIDTH - 16,
    aspectRatio: 1,
    marginHorizontal: 8,
    marginTop: 18,
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  peopleImage: {
    width: "100%",
    height: "100%",
  },
  whoSectionHeader: {
    paddingHorizontal: 8,
    marginTop: 12,
    marginBottom: 24,
  },
  whoSectionTitle: {
    fontFamily: FontFamilies.header,
    color: "#1e1e1e",
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.4,
  },
  whoCards: {
    paddingHorizontal: 8,
    gap: 16,
    flexDirection: "column",
  },
  whoCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0, 31, 205, 0.3)",
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  whoCardTextWrap: {
    alignItems: "center",
    gap: 4,
  },
  whoTitle: {
    fontFamily: FontFamilies.bodyBold,
    color: "#001fcd",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  whoDesc: {
    fontFamily: FontFamilies.body,
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  noteCard: {
    marginHorizontal: 8,
    marginTop: 10,
    marginBottom: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderWidth: 1,
    borderColor: "#ffd814",
    borderRadius: 12,
    backgroundColor: "#FFF8D5",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  noteCardTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  noteTitle: {
    fontFamily: FontFamilies.bodyBold,
    color: "#1e1e1e",
    fontSize: 14,
  },
  noteText: {
    fontFamily: FontFamilies.body,
    marginTop: 2,
    color: "#6b7280",
    fontSize: 12,
  },
  noteBtn: {
    height: 36,
    borderRadius: 6,
    backgroundColor: "#1130bc",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  noteBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 14,
  },
  ctaBlock: { marginTop: 48, paddingHorizontal: 8, alignItems: "center" },
  ctaTitle: {
    fontFamily: FontFamilies.header,
    textAlign: "center",
    color: "#001fcd",
    fontSize: 32,
    lineHeight: 40,
  },
  ctaSub: {
    fontFamily: FontFamilies.body,
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
    color: "#1e1e1e",
    maxWidth: 320,
  },
  ctaBtn: {
    marginTop: 24,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffd814",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  ctaBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#1e1e1e",
    fontSize: 16,
  },
});
