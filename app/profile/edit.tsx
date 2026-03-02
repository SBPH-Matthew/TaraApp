import { useReducer } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type FormState = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  email: string;
  mobile: string;
};
type FormAction =
  | { type: 'SET_FIRST_NAME'; payload: string }
  | { type: 'SET_LAST_NAME'; payload: string }
  | { type: 'SET_DATE_OF_BIRTH'; payload: string }
  | { type: 'SET_COUNTRY'; payload: string }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_MOBILE'; payload: string };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIRST_NAME': return { ...state, firstName: action.payload };
    case 'SET_LAST_NAME': return { ...state, lastName: action.payload };
    case 'SET_DATE_OF_BIRTH': return { ...state, dateOfBirth: action.payload };
    case 'SET_COUNTRY': return { ...state, country: action.payload };
    case 'SET_EMAIL': return { ...state, email: action.payload };
    case 'SET_MOBILE': return { ...state, mobile: action.payload };
    default: return state;
  }
}

/**
 * Edit profile – parity with companion-app /profile/edit (mobile).
 * Form: first/last name, DOB, country, email, mobile. TODO: backend.
 */
export default function ProfileEditScreen() {
  const [form, dispatch] = useReducer(formReducer, {
    firstName: '',
    lastName: '',
    dateOfBirth: 'December 01, 1999',
    country: 'Philippines',
    email: '',
    mobile: '+639672656602',
  });
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  const handleSave = () => {
    // TODO: call backend to update profile
    router.replace('/profile');
  };

  const handleCancel = () => {
    router.replace('/profile');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={[styles.title, { color: primary }]}>
          Personal Information
        </ThemedText>

        <View style={styles.row}>
          <View style={styles.half}>
            <ThemedText style={styles.label}>First Name</ThemedText>
            <TextInput
              value={form.firstName}
              onChangeText={(v) => dispatch({ type: 'SET_FIRST_NAME', payload: v })}
              style={styles.input}
              placeholder="First name"
              placeholderTextColor="#687076"
            />
          </View>
          <View style={styles.half}>
            <ThemedText style={styles.label}>Last Name</ThemedText>
            <TextInput
              value={form.lastName}
              onChangeText={(v) => dispatch({ type: 'SET_LAST_NAME', payload: v })}
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor="#687076"
            />
          </View>
        </View>

        <ThemedText style={styles.label}>Date of Birth</ThemedText>
        <TextInput
          value={form.dateOfBirth}
          onChangeText={(v) => dispatch({ type: 'SET_DATE_OF_BIRTH', payload: v })}
          style={styles.input}
          placeholder="Date of birth"
          placeholderTextColor="#687076"
        />

        <ThemedText style={styles.label}>Country of Origin</ThemedText>
        <TextInput
          value={form.country}
          onChangeText={(v) => dispatch({ type: 'SET_COUNTRY', payload: v })}
          style={styles.input}
          placeholder="Country"
          placeholderTextColor="#687076"
        />

        <ThemedText style={styles.label}>Email Address</ThemedText>
        <TextInput
          value={form.email}
          onChangeText={(v) => dispatch({ type: 'SET_EMAIL', payload: v })}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor="#687076"
        />

        <ThemedText style={styles.label}>Mobile Number</ThemedText>
        <TextInput
          value={form.mobile}
          onChangeText={(v) => dispatch({ type: 'SET_MOBILE', payload: v })}
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="Mobile"
          placeholderTextColor="#687076"
        />

        <Pressable onPress={handleSave} style={[styles.primaryBtn, { backgroundColor: primary }]}>
          <ThemedText style={styles.primaryBtnText}>Save</ThemedText>
        </Pressable>
        <Pressable onPress={handleCancel} style={styles.secondaryBtn}>
          <ThemedText type="defaultSemiBold">Cancel</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16 },
  scroll: { padding: 16, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 24 },
  label: { fontSize: 12, color: '#687076', marginBottom: 6 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', gap: 16 },
  half: { flex: 1 },
  primaryBtn: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryBtn: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
});
