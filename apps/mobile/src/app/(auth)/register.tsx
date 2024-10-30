import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
  useColorScheme,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import AnimatedLink from '@/components/AuthNavLink';
import SubmitButton from '@/components/AuthSubmitButton';
import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/context/ColorContext';

const registerUrl = process.env.EXPO_PUBLIC_API_URL_DEV + '/auth/register';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [screenPressed, setScreenPressed] = useState<boolean>(false);
  const { authenticated, setAuthenticated } = useAuth();

  const colorScheme = useColorScheme();
  const { colors } = useColors();

  const handleScreenPress = () => {
    setScreenPressed(true);
    setTimeout(() => setScreenPressed(false), 100); // Reset the state after a short delay
  };

  const handleResponse = async (data: any, error?: Error) => {
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    if (data?.authInfo.token) {
      Alert.alert('Success', 'Sign in after confirming your email');
    } else {
      Alert.alert('Error', 'Unexpected response from server');
    }
  };

  return (
    <>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Pressable onPress={handleScreenPress} style={{ flex: 1 }}>
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Register
          </Text>
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
              text="Register"
              method="POST"
              url={registerUrl}
              requestBody={{ email, password }}
              onResponse={handleResponse}
            />
          </View>
          <AnimatedLink
            link={'/signin'}
            text={'Already have an account? Sign in'}
          ></AnimatedLink>
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
  button: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default SignIn;
