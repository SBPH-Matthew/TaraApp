import { useState } from 'react';
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

const STEPS = ['Confirm', 'Reason & Email', 'Submit'];
const REASONS = [
  'I no longer use this app',
  'Privacy concerns',
  'I have another account',
  'Too many notifications',
  'Other',
];

/**
 * Delete account – parity with companion-app /delete-account (mobile).
 * StepIndicator (3 steps), form (reason, email, confirm), DataCategoryCard. TODO: backend.
 */
export default function DeleteAccountScreen() {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setLoading(true);
      // TODO: submitDeleteAccountRequest when backend exists
      setTimeout(() => {
        setLoading(false);
        router.replace('/');
      }, 800);
    }
  };

  const canProceed = step === 1 || (step === 2 && email.trim() && confirm === 'DELETE');

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={[styles.title, { color: primary }]}>
          Delete Account
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          This action cannot be undone. Your profile, trips, wishlist, and basket will be deleted.
        </ThemedText>

        {/* Step indicator */}
        <View style={styles.stepper}>
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <View key={label} style={styles.stepWrap}>
                {i > 0 ? <View style={[styles.stepLine, isCompleted && styles.stepLineDone]} /> : null}
                <View style={[
                  styles.stepCircle,
                  isActive && { backgroundColor: primary },
                  isCompleted && styles.stepCircleDone,
                ]}>
                  {isCompleted ? (
                    <AppIcon name="check" size={16} color={primary} />
                  ) : (
                    <ThemedText style={[styles.stepNum, isActive && styles.stepNumActive]}>
                      {stepNum}
                    </ThemedText>
                  )}
                </View>
                <ThemedText style={[styles.stepLabel, isActive && { color: primary }]}>{label}</ThemedText>
              </View>
            );
          })}
        </View>

        {step === 1 && (
          <View style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>What we delete</ThemedText>
            <ThemedText style={styles.cardText}>Account profile (name, email, DOB, country, mobile), saved flights/trips, wishlist, basket, auth tokens.</ThemedText>
            <ThemedText type="subtitle" style={[styles.cardTitle, { marginTop: 16 }]}>What we retain</ThemedText>
            <ThemedText style={styles.cardText}>Server logs (90 days), anonymised analytics, data required by law.</ThemedText>
          </View>
        )}

        {step === 2 && (
          <View style={styles.form}>
            <ThemedText style={styles.label}>Reason (optional)</ThemedText>
            <View style={styles.reasonList}>
              {REASONS.map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setReason(r)}
                  style={[styles.reasonBtn, reason === r && { borderColor: primary, backgroundColor: `${primary}15` }]}
                >
                  <ThemedText style={[styles.reasonText, reason === r && { color: primary }]}>{r}</ThemedText>
                </Pressable>
              ))}
            </View>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Your account email"
              placeholderTextColor="#687076"
              keyboardType="email-address"
              style={styles.input}
            />
            <ThemedText style={styles.label}>Type DELETE to confirm</ThemedText>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="DELETE"
              placeholderTextColor="#687076"
              style={styles.input}
              autoCapitalize="characters"
            />
          </View>
        )}

        <Pressable
          onPress={handleNext}
          disabled={!canProceed || loading}
          style={[styles.primaryBtn, { backgroundColor: primary }, (!canProceed || loading) && styles.disabled]}
        >
          <ThemedText style={styles.primaryBtnText}>
            {step === 1 ? 'Next' : loading ? 'Submitting…' : 'Submit request'}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  scroll: { paddingBottom: 120 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#687076', marginBottom: 24 },
  stepper: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  stepWrap: { flex: 1, alignItems: 'center', position: 'relative' },
  stepLine: { position: 'absolute', left: 0, right: '50%', top: 16, height: 2, backgroundColor: '#e4e4e7' },
  stepLineDone: { backgroundColor: '#0B3BA7' },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e4e4e7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: { backgroundColor: 'rgba(11,59,167,0.2)' },
  stepNum: { fontSize: 12, fontWeight: '600', color: '#687076' },
  stepNumActive: { color: '#fff' },
  stepLabel: { fontSize: 10, color: '#687076', marginTop: 8 },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  cardTitle: { marginBottom: 8 },
  cardText: { fontSize: 14, color: '#687076', lineHeight: 22 },
  form: { marginBottom: 24 },
  label: { fontSize: 12, color: '#687076', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  reasonList: { gap: 8, marginBottom: 16 },
  reasonBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  reasonText: { fontSize: 14 },
  primaryBtn: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  disabled: { opacity: 0.6 },
});
