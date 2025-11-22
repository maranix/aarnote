import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  onClear?: () => void;
}

export function SearchBar({ style, onClear, value, ...props }: SearchBarProps) {
  const borderColor = useSharedValue(Colors.dark.border);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderColor.value,
    };
  });

  const handleFocus = () => {
    borderColor.value = withTiming(Colors.dark.primary);
  };

  const handleBlur = () => {
    borderColor.value = withTiming(Colors.dark.border);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <Ionicons name="search" size={20} color={Colors.dark.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search notes..."
        placeholderTextColor={Colors.dark.textSecondary}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        {...props}
      />
      {value ? (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={Colors.dark.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.dark.surfaceHighlight,
    paddingHorizontal: Layout.spacing.md,
    height: 48,
  },
  icon: {
    marginRight: Layout.spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    marginLeft: Layout.spacing.sm,
  },
});
