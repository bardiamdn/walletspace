import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, Text, View } from 'react-native';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from 'react-native';
import { ColorProvider } from '@/context/ColorContext';

SplashScreen.preventAutoHideAsync();

const layout: React.FC = () => {
  const colorScheme = useColorScheme();
  // const queryClient = new QueryClient();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <QueryClientProvider client={queryClient}> */}
      <ColorProvider>
        <AuthProvider>
          <StatusBar />
          <RootNavigation />
        </AuthProvider>
      </ColorProvider>
      {/* </QueryClientProvider> */}
    </ThemeProvider>
  );
};

function RootNavigation() {
  const { authenticated } = useAuth();
  const router = useRouter();
  const [routeName, setRouteName] = useState<
    '(protected)' | '(auth)' | undefined
  >();

  useEffect(() => {
    setRouteName(authenticated ? '(protected)' : '(auth)');
    if (routeName !== undefined) {
      router.replace(routeName);
      SplashScreen.hideAsync();
    }
  }, [authenticated, routeName]);

  if (routeName === undefined) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name={routeName}
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default layout;
