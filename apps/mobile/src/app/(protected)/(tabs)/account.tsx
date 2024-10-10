import { View, Text, Pressable } from 'react-native';
import React, { useContext } from 'react';
// import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';

import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/context/ColorContext';

const signOutUrl = process.env.EXPO_PUBLIC_API_URL_DEV + '/auth/signout-cookie';

const Account = () => {
  const { setAuthenticated, token, setToken } = useAuth();
  const { colors } = useColors();

  const menuItems = [
    {
      name: 'Settings',
      icon: (
        <Ionicons name="settings" size={24} style={{ marginHorizontal: 10 }} />
      ),
      action: () => {},
    },
    {
      name: 'Accounts',
      icon: (
        <MaterialCommunityIcons
          name="card-multiple"
          size={24}
          style={{ marginHorizontal: 10 }}
        />
      ),
      action: () => {},
    },
    {
      name: 'Signout',
      icon: (
        <Octicons name="sign-out" size={24} style={{ marginHorizontal: 10 }} />
      ),
      action: async () => {
        // setLoading(true);
        try {
          if (!token) {
            console.error('token does not exist');
            return;
          }

          const response = await fetch(signOutUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          setToken(null);
          setAuthenticated(false);
          await SecureStore.setItemAsync('authToken', '');

          // const data = await response.json();
        } catch (error) {
          console.error(error);
        } finally {
          // setLoading(false);
        }
      },
    },
  ];

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        margin: 10,
      }}
    >
      {/* <View
      >
        <View
          style={{
            borderRadius: '100%',
            backgroundColor: colors.accent,
          }}
        ></View>
      </View> */}
      {menuItems.map((item, index) => (
        <Pressable
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            backgroundColor: colors.secondary,
          }}
          onPress={item.action}
        >
          {item.icon}
          <Text
            style={{
              fontSize: 18,
              fontWeight: 400,
            }}
          >
            {item.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default Account;
