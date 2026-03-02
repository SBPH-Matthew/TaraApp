import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Mock: replace with attachTripApi when backend exists */
type UserFlight = {
  id: string;
  flight_number: string | null;
  origin_airport_code: string | null;
  destination_airport_code: string | null;
  origin_country: string | null;
  destination_country: string | null;
  created_at: string;
};

const MOCK_FLIGHTS: UserFlight[] = [];

function formatDateAdded(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '—';
  }
}

function TripCard({
  flight,
  tint,
}: {
  flight: UserFlight;
  tint: string;
}) {
  const origin = flight.origin_country ?? '—';
  const dest = flight.destination_country ?? '—';

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/fly/[flightId]', params: { flightId: flight.id } })}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <ThemedText type="defaultSemiBold">{flight.flight_number ?? '—'}</ThemedText>
      <ThemedText style={[styles.route, { color: Colors.light.icon }]}>
        {origin} ({flight.origin_airport_code ?? '—'}) → {dest} ({flight.destination_airport_code ?? '—'})
      </ThemedText>
      <View style={styles.cardGrid}>
        <View>
          <ThemedText style={styles.label}>Date Added</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.value}>
            {formatDateAdded(flight.created_at)}
          </ThemedText>
        </View>
        <View>
          <ThemedText style={styles.label}>Origin</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.value}>{origin}</ThemedText>
        </View>
        <View>
          <ThemedText style={styles.label}>Destination</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.value}>{dest}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

/**
 * My Trips – parity with companion-app /profile/trips (mobile).
 * Loading, empty (No trips yet + Add a Flight), list of TripCard.
 */
export default function TripsScreen() {
  const [flights, setFlights] = useState<UserFlight[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;

  useEffect(() => {
    const t = setTimeout(() => {
      setFlights(MOCK_FLIGHTS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={[styles.title, { color: tint }]}>
          My Trips
        </ThemedText>
        <Link href="/fly" asChild>
          <Pressable style={({ pressed }) => [styles.addLink, pressed && styles.pressed]}>
            <ThemedText style={[styles.addLinkText, { color: tint }]}>
              Add a Flight
            </ThemedText>
            <AppIcon name="flight" size={16} color={tint} />
          </Pressable>
        </Link>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={tint} />
          <ThemedText style={[styles.muted, styles.centeredText]}>
            Loading your trips…
          </ThemedText>
        </View>
      ) : flights.length === 0 ? (
        <View style={styles.centered}>
          <View style={styles.emptyIcon}>
            <AppIcon name="flight" size={40} color={Colors.light.icon} />
          </View>
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No trips yet
          </ThemedText>
          <ThemedText style={[styles.muted, styles.emptySubtitle]}>
            Attach a flight from the Fly page to see your upcoming trips here.
          </ThemedText>
          <Link href="/fly" asChild>
            <Pressable style={[styles.addButton, { backgroundColor: tint }]}>
              <ThemedText style={styles.addButtonText}>Add a Flight</ThemedText>
              <AppIcon name="flight" size={16} color="#fff" />
            </Pressable>
          </Link>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {flights.map((f) => (
            <TripCard key={f.id} flight={f} tint={tint} />
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  addLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
  addLinkText: { fontSize: 14, fontWeight: '600' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  centeredText: { marginTop: 16 },
  muted: { fontSize: 14, color: '#687076' },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { marginTop: 24 },
  emptySubtitle: { marginTop: 8, textAlign: 'center', maxWidth: 320 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 24,
    minHeight: 44,
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 96, gap: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#fff',
  },
  cardPressed: { opacity: 0.9 },
  route: { fontSize: 14, marginTop: 4 },
  cardGrid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  label: { fontSize: 12, color: '#687076', marginBottom: 2 },
  value: { fontSize: 14 },
});
