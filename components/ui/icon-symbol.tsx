// Tab icon bridge using Lucide icons across platforms.

import { AppIcon } from '@/components/ui/app-icon';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type ViewStyle } from 'react-native';

type MappedName = ComponentProps<typeof AppIcon>['name'];
type IconSymbolName = keyof typeof MAPPING;

/**
 * Tab/nav icon names mapped to AppIcon names.
 */
const MAPPING: Record<string, MappedName> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'luggage': 'luggage',
  'store.fill': 'store',
  'gift.fill': 'card-giftcard',
  'person.fill': 'person',
};

/**
 * IconSymbol keeps existing tab icon names while rendering Lucide via AppIcon.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return <AppIcon color={color} size={size} name={MAPPING[name] ?? 'help'} style={style} />;
}
