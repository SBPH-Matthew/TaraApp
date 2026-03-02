import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Tab = 'departing' | 'arriving';
type Flight = {
  id: string;
  airline: string;
  flightNumber: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  status: string;
  date: string;
  boardingTime: string;
  arrivalTime: string;
  gateLabel: string;
  terminalLabel: string;
  beltNumber?: string;
};

/** Mock flights – replace with useAviationStackFlights when backend exists */
const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'pr103',
    airline: 'Philippine Airlines',
    flightNumber: 'PR 103',
    fromCity: 'Manila',
    fromCode: 'MNL',
    toCity: 'Tokyo Narita',
    toCode: 'NRT',
    status: 'On Time',
    date: '2026-02-10',
    boardingTime: '08:30 AM',
    arrivalTime: '08:30 AM',
    gateLabel: '6',
    terminalLabel: 'NAIA Terminal 2',
  },
  {
    id: '5j812',
    airline: 'Cebu Pacific',
    flightNumber: '5J 812',
    fromCity: 'Manila',
    fromCode: 'MNL',
    toCity: 'Hong Kong',
    toCode: 'HKG',
    status: 'On Time',
    date: '2026-02-10',
    boardingTime: '10:05 AM',
    arrivalTime: '10:05 AM',
    gateLabel: '12',
    terminalLabel: 'NAIA Terminal 3',
  },
];

function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function FlightCard({
  flight,
  tab,
  onPress,
  primary,
}: {
  flight: Flight;
  tab: Tab;
  onPress: () => void;
  primary: string;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.cardStatus}>
        <AppIcon name="schedule" size={16} color="#01BC1D" />
        <ThemedText style={styles.statusText}>{flight.status}</ThemedText>
      </View>
      <ThemedText style={styles.airline}>{flight.airline}</ThemedText>
      <ThemedText style={[styles.flightNumber, { color: primary }]}>{flight.flightNumber}</ThemedText>
      <View style={styles.route}>
        <ThemedText type="defaultSemiBold">
          {flight.fromCity} ({flight.fromCode})
        </ThemedText>
        <AppIcon name="arrow-forward" size={16} color="#11181C" />
        <ThemedText type="defaultSemiBold">
          {flight.toCity} ({flight.toCode})
        </ThemedText>
      </View>
      <View style={styles.details}>
        <View>
          <ThemedText style={styles.detailLabel}>Date</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.detailValue}>
            {formatShortDate(flight.date)}
          </ThemedText>
        </View>
        <View>
          <ThemedText style={styles.detailLabel}>{tab === 'departing' ? 'Boarding Time' : 'Arrival Time'}</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.detailValue}>
            {tab === 'departing' ? flight.boardingTime : flight.arrivalTime}
          </ThemedText>
        </View>
        <View>
          <ThemedText style={styles.detailLabel}>{tab === 'departing' ? 'Gate' : 'Belt'}</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.detailValue}>
            {tab === 'departing' ? flight.gateLabel : (flight.beltNumber ?? '—')}
          </ThemedText>
        </View>
        <View>
          <ThemedText style={styles.detailLabel}>Airport</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.detailValue}>{flight.terminalLabel}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

/**
 * Fly – parity with companion-app /fly (mobile).
 * Header, Departing/Arriving tabs, optional search, FlyPageFlightList (mobile list). Mock data.
 */
export default function FlyIndexScreen() {
  const [tab, setTab] = useState<Tab>('departing');
  const [search, setSearch] = useState('');
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  const filteredFlights = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return MOCK_FLIGHTS;
    return MOCK_FLIGHTS.filter(
      (f) =>
        f.flightNumber.toLowerCase().includes(term) ||
        f.airline.toLowerCase().includes(term) ||
        f.fromCity.toLowerCase().includes(term) ||
        f.toCity.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText style={[styles.headerTitle, { color: primary }]}>
          CHECK YOUR FLIGHT
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Unlock personalized picks, perfect pickup timing, terminal-specific perks, and keep all your QR passes and bookings in one place.
        </ThemedText>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            onPress={() => setTab('departing')}
            style={[styles.tab, tab === 'departing' && styles.tabActive]}
          >
            <AppIcon name="flight-takeoff" size={18} color={tab === 'departing' ? primary : '#687076'} />
            <ThemedText style={[styles.tabText, tab === 'departing' && { color: primary }]}>
              Departing
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setTab('arriving')}
            style={[styles.tab, tab === 'arriving' && styles.tabActive]}
          >
            <AppIcon name="flight-land" size={18} color={tab === 'arriving' ? primary : '#687076'} />
            <ThemedText style={[styles.tabText, tab === 'arriving' && { color: primary }]}>
              Arriving
            </ThemedText>
          </Pressable>
        </View>

        <TextInput
          placeholder="Flight number or route"
          placeholderTextColor="#687076"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {filteredFlights.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
              No flights to display
            </ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Try adjusting your search or date. Flights are loaded from live data.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredFlights.slice(0, 6).map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                tab={tab}
                onPress={() => router.push({ pathname: '/fly/[flightId]', params: { flightId: flight.id } })}
                primary={primary}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  scrollContent: { padding: 16, paddingBottom: 120 },
  headerTitle: { fontSize: 28, fontWeight: '600' },
  headerSubtitle: { fontSize: 14, marginTop: 8, color: '#687076' },
  tabs: { flexDirection: 'row', gap: 24, marginTop: 24 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minHeight: 44,
  },
  tabActive: { borderBottomColor: '#0B3BA7' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#687076' },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  empty: {
    marginTop: 24,
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 14 },
  emptySubtitle: { fontSize: 14, color: '#687076', marginTop: 8, textAlign: 'center' },
  list: { marginTop: 24, gap: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#fff',
  },
  pressed: { opacity: 0.9 },
  cardStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusText: { fontSize: 16, fontWeight: 'bold', color: '#01BC1D' },
  airline: { fontSize: 18, marginTop: 4 },
  flightNumber: { fontSize: 32, fontWeight: '600', marginTop: 4 },
  route: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  details: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 16 },
  detailLabel: { fontSize: 12, color: '#687076', marginBottom: 2 },
  detailValue: { fontSize: 14 },
});
