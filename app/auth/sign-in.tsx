import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { AppIcon } from '@/components/ui/app-icon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Sign in – parity with companion-app /auth/sign-in (mobile).
 * Form (email, password), Google button, link to sign-up. TODO: backend auth.
 */
export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      // TODO: call loginApi when backend exists
      await new Promise((r) => setTimeout(r, 800));
      router.replace('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setError(null);
    setLoading(true);
    // TODO: getGoogleRedirectUrl() and redirect
    setTimeout(() => setLoading(false), 500);
    setError('Google sign-in: TODO backend.');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={[styles.title, { color: primary }]}>
          Sign In
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign in to keep everything ready for your next flight.
        </ThemedText>

        {error ? (
          <View style={styles.errorBox}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        ) : null}

        <TextInput
          placeholder="Email"
          placeholderTextColor="#687076"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          editable={!loading}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#687076"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          editable={!loading}
        />

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.primaryBtn, { backgroundColor: primary }, loading && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.primaryBtnText}>Sign In</ThemedText>
          )}
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>or</ThemedText>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          onPress={handleGoogle}
          disabled={loading}
          style={[styles.googleBtn, loading && styles.disabled]}
        >
          <AppIcon name="login" size={20} color="#11181C" />
          <ThemedText type="defaultSemiBold" style={styles.googleBtnText}>
            Continue with Google
          </ThemedText>
        </Pressable>

        <Link href="/auth/sign-up" asChild>
          <Pressable style={styles.linkWrap}>
            <ThemedText style={[styles.link, { color: primary }]}>
              Create account
            </ThemedText>
          </Pressable>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  scroll: { padding: 16, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#687076', marginBottom: 24 },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { fontSize: 14, color: '#dc2626' },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  disabled: { opacity: 0.7 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e4e4e7' },
  dividerText: { fontSize: 14, color: '#687076' },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  googleBtnText: { color: '#11181C' },
  linkWrap: { marginTop: 24, alignItems: 'center', minHeight: 44, justifyContent: 'center' },
  link: { fontSize: 16 },
});
