import { Link, Stack, Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ThemedText } from '@/components/ThemedText';
// import { Pressable } from 'react-native';

export default function TabLayout() {
//   const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index" options={{ title: 'landing' }} />
      {/* <Stack.Screen name="signin" options={{ title: 'Signin' }} /> */}
      <Stack.Screen name="register" options={{ title: 'Register' }} />
    </Stack>
  );
}
