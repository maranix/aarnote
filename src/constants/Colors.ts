/**
 * Premium Dark Theme Color Palette
 * Designed for a sleek, modern, and minimal aesthetic.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Additions for premium feel (though focused on dark mode)
    surface: '#f9f9f9',
    border: '#e0e0e0',
    primary: '#007AFF',
    error: '#FF3B30',
    success: '#34C759',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#000000', // Deep black for OLED
    surface: '#1C1C1E', // Dark gray for cards
    surfaceHighlight: '#2C2C2E',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#0A84FF', // iOS Blue
    primaryForeground: '#FFFFFF',
    error: '#FF453A',
    success: '#32D74B',
    border: 'rgba(255, 255, 255, 0.1)',
    glass: 'rgba(30, 30, 30, 0.6)', // For glassmorphism
    glassBorder: 'rgba(255, 255, 255, 0.08)',
  },
};
