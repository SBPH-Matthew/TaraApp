import { Stack } from 'expo-router';

/**
 * Profile stack – companion-app parity routes under /profile/*.
 */
export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="edit" options={{ title: 'Edit profile' }} />
      <Stack.Screen name="wishlist" options={{ title: 'Wishlist' }} />
      <Stack.Screen name="orders" options={{ title: 'My orders' }} />
      <Stack.Screen name="payment" options={{ title: 'Payment methods' }} />
    </Stack>
  );
}
