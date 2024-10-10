import React, { useRef } from 'react';
import { Text, Pressable, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColors } from '@/context/ColorContext';

interface AnimatedButtonProps {
  text: string;
  link: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  link,
  icon,
  style,
}) => {
  const { colors } = useColors();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const backgroundColorValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundColorValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
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
      Animated.timing(backgroundColorValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const backgroundColor = backgroundColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, colors.pressButton],
  });

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      height: 40,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      color: colors.textPrimary,
    },
  });

  return (
    <Link href={link} asChild>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      >
        <Animated.View
          style={[
            styles.button,
            { transform: [{ scale: scaleValue }], backgroundColor },
          ]}
        >
          {icon && icon}
          <Text style={styles.buttonText}>{text}</Text>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

export default AnimatedButton;
