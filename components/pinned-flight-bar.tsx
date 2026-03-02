import { StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Pinned flight strip – parity with companion-app PinnedFlightBar (mobile).
 * Shows when a flight is pinned; links to flight details. TODO: pin context/backend.
 */
export function PinnedFlightBar() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  // TODO: show when flight is pinned (context/state from Fly or backend)
  const pinnedFlight = null as { id: string; flightNumber: string; fromCode: string; toCode: string } | null;

  if (!pinnedFlight) return null;

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/fly/[flightId]', params: { flightId: pinnedFlight.id } })}
      style={[styles.bar, { backgroundColor: primary }]}
    >
      <AppIcon name="flight" size={18} color="#fff" />
      <ThemedText style={styles.text}>
        {pinnedFlight.flightNumber} {pinnedFlight.fromCode} → {pinnedFlight.toCode}
      </ThemedText>
      <AppIcon name="chevron-right" size={20} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  text: { flex: 1, color: '#fff', fontWeight: '600', fontSize: 14 },
});
