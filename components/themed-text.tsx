import { StyleSheet, Text, type TextProps } from 'react-native';

import { FontFamilies } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'header';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'header' ? styles.header : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: FontFamilies.header,
    fontSize: 32,
    lineHeight: 32,
  },
  header: {
    fontFamily: FontFamilies.header,
  },
  subtitle: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 20,
  },
  link: {
    fontFamily: FontFamilies.body,
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
