import { useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Mock flight – replace with API when backend exists */
const MOCK_FLIGHTS: Record<string, { airline: string; flightNumber: string; fromCity: string; fromCode: string; toCity: string; toCode: string; status: string; boardingTime: string; departureTime: string; gateLabel: string; terminalLabel: string }> = {
  pr103: {
    airline: 'Philippine Airlines',
    flightNumber: 'PR 103',
    fromCity: 'Manila',
    fromCode: 'MNL',
    toCity: 'Tokyo Narita',
    toCode: 'NRT',
    status: 'On Time',
    boardingTime: '08:30 AM',
    departureTime: '08:30 AM',
    gateLabel: '6',
    terminalLabel: 'NAIA Terminal 2',
  },
  '5j812': {
    airline: 'Cebu Pacific',
    flightNumber: '5J 812',
    fromCity: 'Manila',
    fromCode: 'MNL',
    toCity: 'Hong Kong',
    toCode: 'HKG',
    status: 'On Time',
    boardingTime: '10:05 AM',
    departureTime: '10:05 AM',
    gateLabel: '12',
    terminalLabel: 'NAIA Terminal 3',
  },
};

const TIMELINE_STEPS = [
  { id: 'checkin', title: 'Check In', time: '04:30 AM', caption: '4 hours before departure' },
  { id: 'boarding', title: 'Boarding', time: '07:45 AM', caption: '45 minutes before departure' },
  { id: 'departure', title: 'Departure', time: '08:30 AM', caption: 'Gate closes shortly before' },
];

/**
 * Flight details – parity with companion-app /fly/$flightId (mobile).
 * Flight card, timeline (Check In, Boarding, Departure), Attach to trip. TODO: backend.
 */
export default function FlightDetailsScreen() {
  const { flightId } = useLocalSearchParams<{ flightId: string }>();
  const [attached, setAttached] = useState(false);
  const [attachLoading, setAttachLoading] = useState(false);
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  const flight = flightId ? MOCK_FLIGHTS[flightId] ?? MOCK_FLIGHTS.pr103 : MOCK_FLIGHTS.pr103;

  const handleAttachToTrip = () => {
    setAttachLoading(true);
    setTimeout(() => {
      setAttached(true);
      setAttachLoading(false);
    }, 600);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <AppIcon name="schedule" size={16} color="#01BC1D" />
            <ThemedText style={styles.statusText}>{flight.status}</ThemedText>
          </View>
          <ThemedText style={styles.airline}>{flight.airline}</ThemedText>
          <ThemedText style={[styles.flightNumber, { color: primary }]}>{flight.flightNumber}</ThemedText>
          <ThemedText style={styles.route}>
            {flight.fromCity} ({flight.fromCode}) → {flight.toCity} ({flight.toCode})
          </ThemedText>
          <View style={styles.details}>
            <View><ThemedText style={styles.detailLabel}>Boarding</ThemedText><ThemedText type="defaultSemiBold">{flight.boardingTime}</ThemedText></View>
            <View><ThemedText style={styles.detailLabel}>Gate</ThemedText><ThemedText type="defaultSemiBold">{flight.gateLabel}</ThemedText></View>
            <View><ThemedText style={styles.detailLabel}>Airport</ThemedText><ThemedText type="defaultSemiBold">{flight.terminalLabel}</ThemedText></View>
          </View>
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Timeline</ThemedText>
        {TIMELINE_STEPS.map((step, i) => (
          <View key={step.id} style={styles.timelineRow}>
            <View style={[styles.timelineDot, { backgroundColor: primary }]} />
            {i < TIMELINE_STEPS.length - 1 ? <View style={styles.timelineLine} /> : null}
            <View style={styles.timelineContent}>
              <ThemedText type="defaultSemiBold">{step.title}</ThemedText>
              <ThemedText style={styles.timelineTime}>{step.time}</ThemedText>
              <ThemedText style={styles.timelineCaption}>{step.caption}</ThemedText>
            </View>
          </View>
        ))}

        <Pressable
          onPress={handleAttachToTrip}
          disabled={attached || attachLoading}
          style={[
            styles.attachBtn,
            { backgroundColor: primary },
            (attached || attachLoading) && styles.attachBtnDisabled,
          ]}
        >
          <ThemedText style={styles.attachBtnText}>
            {attached ? 'Added to trip' : attachLoading ? 'Adding…' : 'Attach to trip'}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  scroll: { padding: 16, paddingBottom: 120 },
  card: {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusText: { fontSize: 16, fontWeight: 'bold', color: '#01BC1D' },
  airline: { fontSize: 18, marginTop: 8 },
  flightNumber: { fontSize: 28, fontWeight: '600', marginTop: 4 },
  route: { fontSize: 14, color: '#687076', marginTop: 8 },
  details: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 16 },
  detailLabel: { fontSize: 12, color: '#687076', marginBottom: 2 },
  sectionTitle: { marginBottom: 16 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 6, marginRight: 12 },
  timelineLine: { position: 'absolute', left: 5, top: 18, bottom: -8, width: 2, backgroundColor: '#e4e4e7' },
  timelineContent: { flex: 1 },
  timelineTime: { fontSize: 14, color: '#687076', marginTop: 2 },
  timelineCaption: { fontSize: 12, color: '#687076', marginTop: 2 },
  attachBtn: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  attachBtnDisabled: { opacity: 0.7 },
  attachBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
