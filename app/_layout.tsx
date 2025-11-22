import { useAuthStore } from '@/store/authStore';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

function RootLayoutNav() {
  const { session, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      router.replace('/(app)');
    } else if (!session && segments[0] !== '(auth)') {
      // This is handled by the (app)/_layout.tsx
    }
  }, [session, segments, isLoading, router]);

  return <Slot />;
}

export default function RootLayout() {
  return <RootLayoutNav />;
}
