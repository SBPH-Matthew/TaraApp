/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

/** TARA! primary blue – matches companion-app theme-color */
const tintColorLight = "#0B3BA7";
const tintColorDark = "#5B9AFF";

/** Companion-app: circle nav buttons – border secondary-foreground, icon muted-foreground */
export const CircleArrowColors = {
  border: "#7e7e7e",
  icon: "#6b7280",
} as const;

/** Slider/progress bar: track = bg-muted, fill = secondary-foreground */
export const TrackColors = {
  track: "#f4f4f5",
  fill: "#7e7e7e",
} as const;

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    primary: tintColorLight,
    muted: "#f4f4f5",
    border: "#e4e4e7",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    primary: tintColorDark,
    muted: "#27272a",
    border: "#3f3f46",
  },
};

/** App font families – Bungee (header) and Plus Jakarta Sans (body), loaded via expo-font */
export const FontFamilies = {
  /** Headings / display – Bungee */
  header: "Bungee_400Regular",
  /** Body text – Plus Jakarta Sans */
  body: "PlusJakartaSans_400Regular",
  bodySemiBold: "PlusJakartaSans_600SemiBold",
  bodyBold: "PlusJakartaSans_700Bold",
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
