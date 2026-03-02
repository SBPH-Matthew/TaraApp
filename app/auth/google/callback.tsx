import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type CallbackState = 'processing' | 'error' | 'idle';

/**
 * Google auth callback – mobile parity flow for redirect/error states.
 * Handles callback params and forwards user back to sign-in for now.
 */
export default function GoogleCallbackScreen() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;
  const params = useLocalSearchParams<{
    code?: string;
    error?: string;
    error_description?: string;
  }>();
  const [state, setState] = useState<CallbackState>('processing');

  const message = useMemo(() => {
    if (params.error) {
      return params.error_description ?? 'Google sign-in was cancelled or denied.';
    }
    if (params.code) {
      return 'We received your Google authorization. Finishing sign-in...';
    }
    return 'No callback parameters were received. Please try Google sign-in again.';
  }, [params.code, params.error, params.error_description]);

  useEffect(() => {
    if (params.error) {
      setState('error');
      return;
    }

    if (!params.code) {
      setState('idle');
      return;
    }

    setState('processing');
    const timer = setTimeout(() => {
      router.replace('/auth/sign-in');
    }, 1200);

    return () => clearTimeout(timer);
  }, [params.code, params.error]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        {state === 'processing' ? (
          <>
            <ActivityIndicator size="large" color={primary} />
            <ThemedText style={[styles.title, { color: primary }]}>Google Sign-in</ThemedText>
            <ThemedText style={styles.subtitle}>{message}</ThemedText>
          </>
        ) : (
          <>
            <AppIcon
              name={state === 'error' ? 'error-outline' : 'info-outline'}
              size={40}
              color={state === 'error' ? '#dc2626' : primary}
            />
            <ThemedText style={[styles.title, { color: state === 'error' ? '#dc2626' : primary }]}>Google Sign-in</ThemedText>
            <ThemedText style={styles.subtitle}>{message}</ThemedText>
          </>
        )}

        {state !== 'processing' ? (
          <>
            <Link href="/auth/sign-in" asChild>
              <Pressable style={({ pressed }) => [styles.primaryBtn, { backgroundColor: primary }, pressed && styles.pressed]}>
                <ThemedText style={styles.primaryBtnText}>Back to Sign In</ThemedText>
              </Pressable>
            </Link>
            <Link href="/auth/sign-up" asChild>
              <Pressable style={({ pressed }) => [styles.secondaryBtn, { borderColor: primary }, pressed && styles.pressed]}>
                <ThemedText style={[styles.secondaryBtnText, { color: primary }]}>Create an account</ThemedText>
              </Pressable>
            </Link>
          </>
        ) : null}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 64 },
  card: {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 14,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  title: { marginTop: 12, fontSize: 22, fontWeight: '700' },
  subtitle: { marginTop: 8, color: '#687076', textAlign: 'center', lineHeight: 21, fontSize: 14 },
  primaryBtn: {
    marginTop: 20,
    width: '100%',
    minHeight: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  secondaryBtn: {
    marginTop: 10,
    width: '100%',
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontWeight: '600', fontSize: 15 },
  pressed: { opacity: 0.85 },
});
