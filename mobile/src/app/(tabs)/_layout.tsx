/**
 * OffPay Tab Layout
 * Bottom tab navigator: Home, History, Account, Settings
 * Uses custom icons and the OffPay green accent color.
 */

import { Tabs } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { Colors, BorderRadius, FontSize, FontWeight } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const theme = Colors[scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            },
            android: {
              elevation: 12,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: FontWeight.semibold,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={focused ? '⌂' : '⌂'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="☰" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="◉" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="⚙" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, color, focused }: { icon: string; color: string; focused: boolean }) {
  return (
    <ThemedTabIcon style={{ color, fontSize: focused ? 24 : 22, opacity: focused ? 1 : 0.7 }}>
      {icon}
    </ThemedTabIcon>
  );
}

// Minimal text component for tab icons to avoid circular imports
import { Text, type TextStyle } from 'react-native';
function ThemedTabIcon({ style, children }: { style: TextStyle; children: string }) {
  return <Text style={style}>{children}</Text>;
}
