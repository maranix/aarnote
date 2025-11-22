import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, onFocus, onBlur, ...props }: InputProps) {
  const [, setIsFocused] = useState(false);
  const borderColor = useSharedValue(Colors.dark.border);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderColor.value,
    };
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderColor.value = withTiming(Colors.dark.primary);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderColor.value = withTiming(Colors.dark.border);
    onBlur?.(e);
  };

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText style={styles.label} type="defaultSemiBold">
          {label}
        </ThemedText>
      )}
      <Animated.View
        style={[styles.inputContainer, animatedStyle, error ? styles.errorBorder : undefined]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.dark.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.md,
  },
  label: {
    marginBottom: Layout.spacing.xs,
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.dark.surfaceHighlight,
    overflow: 'hidden',
  },
  input: {
    padding: Layout.spacing.md,
    color: Colors.dark.text,
    fontSize: 16,
    fontFamily: 'System',
  },
  errorBorder: {
    borderColor: Colors.dark.error,
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: 12,
    marginTop: 4,
  },
});
