import { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { GoogleIcon } from '@/components/GoogleIcon';
import { ThemedText } from '@/components/themed-text';
import { BACKGROUND, Colors, FontFamilies } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MAX_WIDTH = 400;
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, CARD_MAX_WIDTH);

type AuthView = 'sign-in' | 'sign-up';

type Props = Readonly<{
  onSignInSuccess?: () => void;
}>;

/**
 * Auth screen for Account tab when not authenticated.
 * Toggles between Sign In and Sign Up in place (no navigation). Layout/styling from companion_app.
 */
export function AccountAuthScreen({ onSignInSuccess }: Props) {
  const [view, setView] = useState<AuthView>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  const handleSignIn = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      // TODO: call login API when backend exists
      await new Promise((r) => setTimeout(r, 600));
      onSignInSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const validateSignUp = (): string | null => {
    if (!firstname.trim()) return 'First name is required.';
    if (!lastname.trim()) return 'Last name is required.';
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== passwordConfirmation) return 'Passwords do not match.';
    return null;
  };

  const handleSignUp = async () => {
    setError(null);
    const err = validateSignUp();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      // TODO: call register API when backend exists
      await new Promise((r) => setTimeout(r, 800));
      onSignInSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setError(null);
    setGoogleLoading(true);
    const message = view === 'sign-in' ? 'Google sign-in: coming soon.' : 'Google sign-up: coming soon.';
    setTimeout(() => {
      setGoogleLoading(false);
      setError(message);
    }, 400);
  };

  const isBusy = loading || googleLoading;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ThemedText style={[styles.title, { color: primary }]}>
            {view === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {view === 'sign-in'
              ? 'Sign in to keep everything ready for your next flight.'
              : 'Sign up to keep everything ready for your next flight.'}
          </ThemedText>
        </View>

        <View style={styles.cardBody}>
          {error ? (
            <View style={styles.errorBox}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          ) : null}

          {view === 'sign-up' && (
            <View style={styles.nameRow}>
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#687076"
                value={firstname}
                onChangeText={setFirstname}
                autoCapitalize="words"
                autoComplete="given-name"
                style={[styles.input, styles.inputHalf]}
                editable={!isBusy}
              />
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#687076"
                value={lastname}
                onChangeText={setLastname}
                autoCapitalize="words"
                autoComplete="family-name"
                style={[styles.input, styles.inputHalf]}
                editable={!isBusy}
              />
            </View>
          )}

          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#687076"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
            editable={!isBusy}
          />

          <View style={styles.passwordWrap}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#687076"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              autoComplete={view === 'sign-in' ? 'password' : 'new-password'}
              style={styles.passwordInput}
              editable={!isBusy}
            />
            <Pressable
              onPress={() => setPasswordVisible((v) => !v)}
              style={styles.passwordToggle}
              accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
              accessibilityRole="button">
              {passwordVisible ? (
                <EyeOff size={18} color="#6b7280" />
              ) : (
                <Eye size={18} color="#6b7280" />
              )}
            </Pressable>
          </View>

          {view === 'sign-up' && (
            <View style={styles.passwordWrap}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#687076"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry={!confirmPasswordVisible}
                autoComplete="new-password"
                style={styles.passwordInput}
                editable={!isBusy}
              />
              <Pressable
                onPress={() => setConfirmPasswordVisible((v) => !v)}
                style={styles.passwordToggle}
                accessibilityLabel={confirmPasswordVisible ? 'Hide password' : 'Show password'}
                accessibilityRole="button">
                {confirmPasswordVisible ? (
                  <EyeOff size={18} color="#6b7280" />
                ) : (
                  <Eye size={18} color="#6b7280" />
                )}
              </Pressable>
            </View>
          )}

          <Pressable
            onPress={view === 'sign-in' ? handleSignIn : handleSignUp}
            disabled={isBusy}
            style={[styles.primaryBtn, isBusy && styles.disabled]}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.primaryBtnText}>
                {view === 'sign-in' ? 'Sign In' : 'Sign Up'}
              </ThemedText>
            )}
          </Pressable>

          <Pressable
            onPress={handleGoogle}
            disabled={isBusy}
            style={[styles.googleBtn, isBusy && styles.disabled]}>
            {googleLoading ? (
              <ActivityIndicator color="#11181C" />
            ) : (
              <>
                <GoogleIcon size={20} />
                <ThemedText style={styles.googleBtnText}>
                  {view === 'sign-in' ? 'Sign in with Google' : 'Sign up with Google'}
                </ThemedText>
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.cardFooter}>
          <ThemedText style={styles.footerText}>
            {view === 'sign-in' ? "Don't have an account yet? " : 'Already have an account? '}
          </ThemedText>
          <Pressable hitSlop={8} onPress={() => setView(view === 'sign-in' ? 'sign-up' : 'sign-in')}>
            <ThemedText style={[styles.footerLink, { color: primary }]}>
              {view === 'sign-in' ? 'Sign Up' : 'Log In'}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    maxWidth: CARD_MAX_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingTop: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingBottom: 8,
  },
  title: {
    fontFamily: FontFamilies.header,
    fontSize: 24,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  cardBody: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  errorBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.5)',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  errorText: { fontSize: 14, color: '#dc2626' },
  nameRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  inputHalf: { flex: 1 },
  passwordWrap: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 44,
    fontSize: 16,
  },
  passwordToggle: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#ffd814',
  },
  primaryBtnText: {
    fontFamily: FontFamilies.bodySemiBold,
    color: '#fff',
    fontSize: 16,
  },
  disabled: { opacity: 0.7 },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    backgroundColor: BACKGROUND,
    gap: 8,
  },
  googleBtnText: {
    fontFamily: FontFamilies.bodySemiBold,
    color: '#11181C',
    fontSize: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 4,
  },
  footerText: { fontSize: 14, color: '#6b7280' },
  footerLink: {
    fontFamily: FontFamilies.bodySemiBold,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
