import React, { useRef } from 'react';
import { Text, Pressable, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColors } from '@/context/ColorContext';

interface AnimatedLinkProps {
  text: string;
  link: string;
  style?: ViewStyle;
}

const AnimatedLink: React.FC<AnimatedLinkProps> = ({ text, link, style }) => {
  const { colors } = useColors();

  const scaleValue = useRef(new Animated.Value(1)).current;
  const colorValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.97,
        useNativeDriver: true,
      }),
      Animated.timing(colorValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(colorValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const textColor = colorValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, colors.textSecondary],
  });

  const styles = StyleSheet.create({
    link: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      height: 40,
    },
    linkText: {
      color: colors.primary,
    },
  });

  return (
    <Animated.View
      style={[styles.link, { transform: [{ scale: scaleValue }] }]}
    >
      <Link href={link} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.Text style={[styles.linkText, { color: textColor }]}>
          {text}
        </Animated.Text>
      </Link>
    </Animated.View>
  );
};

export default AnimatedLink;
