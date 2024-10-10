import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/context/ColorContext';

const AnimatedText = Animated.createAnimatedComponent(Text);

const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  screenPressed,
}: any) => {
  const { colors } = useColors();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  useEffect(() => {
    if (screenPressed) {
      inputRef.current?.blur();
    }
  }, [screenPressed]);

  const labelStyle = {
    position: 'absolute' as const,
    left: 10,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.textSecondary, colors.primary],
    }),
    backgroundColor: colors.background,
    paddingHorizontal: 5,
  };

  return (
    <View style={[styles.inputContainer, { borderColor: colors.border }]}>
      <AnimatedText style={labelStyle}>{label}</AnimatedText>
      <TextInput
        ref={inputRef}
        style={[styles.input, { color: colors.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        selectionColor={colors.primary}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.showButton}
          onPressIn={() => setIsPasswordVisible(true)}
          onPressOut={() => setIsPasswordVisible(false)}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            style={{ color: colors.border }}
            size={22}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingRight: 50,
  },
  showButton: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
});

export default FloatingLabelInput;
