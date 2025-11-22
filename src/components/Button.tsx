import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  style,
  icon,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getBackgroundColor = () => {
    if (disabled) return Colors.dark.surfaceHighlight;
    switch (variant) {
      case 'primary':
        return Colors.dark.primary;
      case 'secondary':
        return Colors.dark.surfaceHighlight;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      default:
        return Colors.dark.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return Colors.dark.textSecondary;
    switch (variant) {
      case 'primary':
        return Colors.dark.primaryForeground;
      case 'outline':
        return Colors.dark.primary;
      case 'ghost':
        return Colors.dark.textSecondary;
      default:
        return Colors.dark.text;
    }
  };

  const getBorderWidth = () => {
    return variant === 'outline' ? 1 : 0;
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      style={[
        styles.container,
        getPadding(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: Colors.dark.primary,
          borderWidth: getBorderWidth(),
          opacity: disabled ? 0.6 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon}
          <ThemedText
            type="defaultSemiBold"
            style={{
              color: getTextColor(),
              marginLeft: icon ? 8 : 0,
              fontSize: size === 'lg' ? 18 : 16,
            }}
          >
            {title}
          </ThemedText>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
