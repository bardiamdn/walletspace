import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store'

import { Colors } from '@/constants/Colors';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import AnimatedLink from '@/components/AuthNavLink';
import SubmitButton from '@/components/AuthSubmitButton';
import { useAuth } from '@/context/AuthContext';

const signInUrl = process.env.EXPO_PUBLIC_API_URL_DEV + '/auth/signin';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [screenPressed, setScreenPressed] = useState<boolean>(false);
  const { setAuthenticated } = useAuth();

  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;


  const handleScreenPress = () => {
    setScreenPressed(true);
    setTimeout(() => setScreenPressed(false), 100);
  };

  const handleResponse = async (data: any, error?: Error) => {
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    if (data?.authInfo.token) {
      await SecureStore.setItemAsync('authToken', data.authInfo.token);
      
      setAuthenticated(true);
    } else {
      Alert.alert('Error', 'Unexpected response from server');
    }
  };

  return (
    <>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <Pressable onPress={handleScreenPress} style={{ flex: 1 }}>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Sign In</Text>
          <View style={styles.form}>
            <FloatingLabelInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              screenPressed={screenPressed}
            />
            <FloatingLabelInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              screenPressed={screenPressed}
            />
            <SubmitButton 
              text='Sign In' 
              method='POST' 
              url={signInUrl} 
              requestBody={{ email, password }} 
              onResponse={handleResponse} 
            />
          </View>
          <AnimatedLink text="Don't have an account? Register" link='/register' />
        </SafeAreaView>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
});

export default SignIn;
