import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { StyleSheet, Text, TextProps } from 'react-native';

export type ThemedTextType =
  | 'default'
  | 'title'
  | 'defaultSemiBold'
  | 'subtitle'
  | 'link'
  | 'caption'
  | 'largeTitle';

interface ThemedTextProps extends TextProps {
  type?: ThemedTextType;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // We are prioritizing dark mode for this premium design
  const color = darkColor || Colors.dark.text;

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'largeTitle' ? styles.largeTitle : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: Layout.fontSize.md,
    lineHeight: 24,
    fontFamily: 'System', // Ideally use Inter if available, sticking to System for now
  },
  defaultSemiBold: {
    fontSize: Layout.fontSize.md,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  largeTitle: {
    fontSize: Layout.fontSize.xxxl,
    fontWeight: 'bold',
    lineHeight: 48,
  },
  subtitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: Layout.fontSize.md,
    color: Colors.dark.primary,
  },
  caption: {
    fontSize: Layout.fontSize.xs,
    color: Colors.dark.textSecondary,
  },
});
