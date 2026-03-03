import { AppIcon } from "@/components/ui/app-icon";
import { BACKGROUND, CircleArrowColors, FontFamilies, TrackColors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import {
    Dimensions,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CATEGORY_CARD_GAP = 16;
const CATEGORY_CARD_WIDTH = SCREEN_WIDTH * 0.78;
const CATEGORY_CARD_HEIGHT = CATEGORY_CARD_WIDTH * (235 / 325);

const HERO_IMAGE = require("@/assets/images/migration/SpeedregaloBanner.png");

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
  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroWrap}>
        <ImageBackground
          source={HERO_IMAGE}
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
      </View>

      <SectionHeader title="SHOP BY CATEGORY" />
      <HorizontalCategories />

      <View style={styles.familyImageWrap}>
        <Image
          source={require("@/assets/images/migration/SpeedregaloAIImage.png")}
          style={styles.familyImage}
          resizeMode="cover"
        />
      </View>

      <SectionHeader
        title="SPEEDREGALO GIFTS"
        subtitle="Perfect gifts for last-minute shoppers. Reserve ahead and collect at the airport."
      />
      <View style={styles.deliveryCards}>
        <View style={styles.deliveryCard}>
          <AppIcon name="flight" size={80} color="#1130bc" strokeWidth={1} />
          <ThemedText style={styles.deliveryText}>
            Collect at the Airport
          </ThemedText>
        </View>
        <View style={styles.deliveryCard}>
          <AppIcon name="local-shipping" size={80} color="#1130bc" strokeWidth={1} />
          <ThemedText style={styles.deliveryText}>Home Delivery</ThemedText>
        </View>
      </View>

      <View style={styles.noteCard}>
        <View style={styles.noteCardTextWrap}>
          <ThemedText style={styles.noteTitle}>
            Flying in or out of the Philippines?
          </ThemedText>
          <ThemedText style={styles.noteText}>
            Shop duty-free and speedregalo perks across airlines and airport
            promos.
          </ThemedText>
        </View>
        <Pressable style={styles.noteBtn}>
          <ThemedText style={styles.noteBtnText}>Shop Here</ThemedText>
        </Pressable>
      </View>

      <View style={styles.browseSectionWrap}>
        <SectionHeader title="BROWSE GIFTS & MORE!" />
        <HorizontalCategories />
      </View>

      <View style={styles.readyBlock}>
        <ThemedText style={styles.readyTitle}>
          READY TO SEND SOMETHING MEMORABLE?
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
  const itemSpan = CATEGORY_CARD_WIDTH + CATEGORY_CARD_GAP;
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
        snapToInterval={itemSpan}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const next = Math.round(event.nativeEvent.contentOffset.x / itemSpan);
          setActiveIndex(Math.max(0, Math.min(next, maxIndex)));
        }}
      >
        {CATEGORY_CARDS.map((card) => (
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
      <Link href="/gifts/all" asChild>
        <Pressable style={styles.viewAllRow}>
          <ThemedText style={styles.viewAllText}>View All Products</ThemedText>
          <AppIcon name="arrow-forward" size={14} color="#1130bc" />
        </Pressable>
      </Link>
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
  sectionHeader: { paddingHorizontal: 8, marginTop: 12, marginBottom: 20 },
  browseSectionWrap: { marginTop: 32 },
  sectionTitle: {
    fontFamily: FontFamilies.header,
    color: "#1231bb",
    fontSize: 32,
    letterSpacing: -0.4,
  },
  sectionSub: { marginTop: 4, color: "#20252f", fontSize: 16, lineHeight: 22 },
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
  familyImageWrap: {
    width: SCREEN_WIDTH - 32,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 40,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  familyImage: {
    width: "100%",
    height: "100%",
  },
  deliveryCards: {
    flexDirection: "column",
    paddingHorizontal: 8,
    gap: 16,
    marginTop: 8,
  },
  deliveryCard: {
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
  deliveryText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#001fcd",
    fontSize: 14,
    lineHeight: 20,
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
    lineHeight: 18,
  },
  noteText: {
    fontFamily: FontFamilies.body,
    marginTop: 2,
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 16,
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
  readyBlock: {
    marginTop: 22,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  readyTitle: {
    fontFamily: FontFamilies.header,
    textAlign: "center",
    color: "#000",
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.4,
    textTransform: "uppercase",
  },
  readySub: {
    marginTop: 4,
    textAlign: "center",
    color: "#000",
    fontSize: 20,
    lineHeight: 28,
  },
  readyBtn: {
    marginTop: 32,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#FFE01B",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  readyBtnText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#000",
    fontSize: 16,
  },
});
