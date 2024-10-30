import { View, Text, useColorScheme } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';

const Notification = () => {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'];

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: activeColor.textPrimary }}>
        Notification Center
      </Text>
    </View>
  );
};

export default Notification;
