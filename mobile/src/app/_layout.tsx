/**
 * OffPay Root Layout
 * Configures the app-wide navigation stack, theme provider, and splash screen.
 * Uses Expo Router's Stack for root-level navigation:
 *   - (tabs) group for the main bottom tab navigator
 *   - (auth) group for login/signup flow
 *   - Modal screens for send, receive, scan, etc.
 */

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, FontWeight, FontSize } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    // Hide splash after layout is mounted
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: 'slide_from_right',
        }}
      >
        {/* Main tab navigator */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Auth screens */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Modal screens */}
        <Stack.Screen
          name="send"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: true,
            headerTitle: 'Send Money',
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
            headerTitleStyle: {
              fontWeight: FontWeight.bold,
              fontSize: FontSize.md,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="receive"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: true,
            headerTitle: 'Receive Money',
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
            headerTitleStyle: {
              fontWeight: FontWeight.bold,
              fontSize: FontSize.md,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="scan-qr"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="payment-confirmation"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: true,
            headerTitle: 'Settlement Receipt',
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
            headerTitleStyle: {
              fontWeight: FontWeight.bold,
              fontSize: FontSize.md,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="logs"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: true,
            headerTitle: 'Live Telemetry Logs',
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
            headerTitleStyle: {
              fontWeight: FontWeight.bold,
              fontSize: FontSize.md,
            },
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </>
  );
}
