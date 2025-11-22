import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';

interface GlassViewProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

export function GlassView({
  style,
  intensity = 20,
  tint = 'dark',
  children,
  ...props
}: GlassViewProps) {
  if (Platform.OS === 'android') {
    // Android fallback since BlurView support can be inconsistent or require specific setup
    // Using a semi-transparent background instead
    return (
      <View style={[styles.androidContainer, style]} {...props}>
        {children}
      </View>
    );
  }

  return (
    <BlurView intensity={intensity} tint={tint} style={[styles.container, style]} {...props}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.dark.glass,
    borderColor: Colors.dark.glassBorder,
    borderWidth: 1,
  },
  androidContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
});
