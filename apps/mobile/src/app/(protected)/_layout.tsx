import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
//   const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="(tabs)" options={{ title: 'landing', headerShown: false }} />
      {/* <Stack.Screen name="signin" options={{ title: 'Signin' }} /> */}
      {/* <Stack.Screen name="register" options={{ title: 'Register' }} /> */}
    </Stack>
  );
}
