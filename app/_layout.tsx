import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

function RootLayoutNav() {
  const { session, isLoading, initializeSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      router.replace('/(app)');
    } else if (!session && segments[0] !== '(auth)') {
      // This is handled by the (app)/_layout.tsx
    }
  }, [session, segments, isLoading, router]);

  const theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.dark.background,
      card: Colors.dark.surface,
      text: Colors.dark.text,
      border: Colors.dark.border,
      primary: Colors.dark.primary,
    },
  };

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
        <Slot
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.dark.background },
          }}
        />
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}
