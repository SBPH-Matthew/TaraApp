import { AppIcon } from '@/components/ui/app-icon';
import { BACKGROUND, FontFamilies } from '@/constants/theme';
import { Link } from "expo-router";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";

/**
 * Mobile top bar with safe-area handling and floating search input.
 * Search is positioned to overlap the lower boundary of the blue app bar.
 */
export function MobileHeader() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.wrap}>
        <View style={styles.topBlue}>
          <View style={styles.row}>
            <Pressable style={styles.departBtn}>
              <ThemedText style={styles.departLabel}>Departing</ThemedText>
              <View style={styles.termRow}>
                <ThemedText style={styles.termText}>NAIA Terminal 1</ThemedText>
                <AppIcon
                  name="keyboard-arrow-down"
                  size={20}
                  color="#fff"
                />
              </View>
            </Pressable>

            <View style={styles.actions}>
              <Link href="/basket" asChild>
                <Pressable
                  style={({ pressed }) => [
                    styles.iconBtn,
                    pressed && styles.pressed,
                  ]}
                  accessibilityLabel="Cart"
                >
                  <AppIcon
                    name="shopping-basket"
                    size={20}
                    color="#fff"
                  />
                </Pressable>
              </Link>
              <Pressable
                style={({ pressed }) => [
                  styles.iconBtn,
                  pressed && styles.pressed,
                ]}
                accessibilityLabel="Notifications"
              >
                <AppIcon
                  name="notifications-none"
                  size={20}
                  color="#fff"
                />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.searchFloatingWrap} pointerEvents="box-none">
          <View style={styles.searchWrap}>
            <TextInput
              placeholder="Search Products"
              placeholderTextColor="#7a7f8c"
              style={styles.searchInput}
            />
            <AppIcon
              name="search"
              size={42 / 2}
              color="#6b7280"
              style={styles.searchIcon}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#1130bc",
  },
  wrap: {
    backgroundColor: BACKGROUND,
    // paddingBottom: 32,
  },
  topBlue: {
    backgroundColor: "#1130bc",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  departBtn: { height: 56, justifyContent: "center" },
  departLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    lineHeight: 15,
    color: "rgba(255,255,255,0.8)",
  },
  termRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  termText: {
    fontFamily: FontFamilies.bodyBold,
    color: "#fff",
    fontSize: 18,
    lineHeight: 22,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 6 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchFloatingWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -8,
    transform: [{ translateY: 16 }],
    paddingHorizontal: 24,
  },
  searchWrap: {
    position: "relative",
    borderWidth: 1,
    borderColor: "#d5d9e2",
    borderRadius: 6,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    fontFamily: FontFamilies.body,
    height: 45,
    borderRadius: 6,
    paddingLeft: 10,
    paddingRight: 34,
    fontSize: 24 / 2,
    color: "#111827",
  },
  searchIcon: { position: "absolute", right: 10, top: 12 },
  pressed: { opacity: 0.8 },
});
