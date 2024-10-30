import React, { useRef, useState } from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColors } from '@/context/ColorContext';

interface SubmitButtonProps {
  text: string;
  url: string;
  method: 'POST' | 'GET' | 'PATCH' | 'DELETE';
  requestBody?: object;
  onResponse?: (data: any, error?: Error) => void;
  style?: ViewStyle;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  url,
  method,
  requestBody,
  onResponse,
  style,
}) => {
  const { colors } = useColors();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const backgroundColorValue = useRef(new Animated.Value(0)).current;
  const [textColor, setTextColor] = useState<string>(colors.textReverse);
  const [loading, setLoading] = useState(false);

  const handlePressIn = () => {
    setTextColor(colors.textPrimary);
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
    setTextColor(colors.textReverse);
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (onResponse) {
        onResponse(data, undefined);
      }
    } catch (error) {
      if (onResponse) {
        onResponse(undefined, error as Error);
      }
    } finally {
      setLoading(false);
    }
  };

  const backgroundColor = backgroundColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primaryButton, colors.pressButton],
  });

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 40,
      height: 40,
      borderRadius: 5,
      borderColor: colors.border,
    },
    buttonText: {
      color: textColor,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleSubmit}
      style={[style, styles.container]}
    >
      <Animated.View
        style={[
          styles.button,
          { transform: [{ scale: scaleValue }], backgroundColor },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.textReverse} />
        ) : (
          <Animated.Text style={styles.buttonText}>{text}</Animated.Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default SubmitButton;
