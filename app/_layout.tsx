import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../stores/useAuthStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function RootLayout() {
  const token = useAuthStore((s) => s.token);
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => { setIsReady(true); }, []);

  useEffect(() => {
    if (!isReady) return;
    const authenticated = isAuthenticated();
    const inLogin = segments[0] === 'login';
    if (!authenticated && !inLogin) {
      router.replace('/login');
    } else if (authenticated && inLogin) {
      router.replace('/(tabs)');
    }
  }, [isReady, segments, token]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="pedido/[id]"
          options={{
            headerShown: true,
            title: 'Detalhes do Pedido',
            headerStyle: { backgroundColor: '#FFF7ED' },
            headerTintColor: '#F97316',
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </QueryClientProvider>
  );
}
