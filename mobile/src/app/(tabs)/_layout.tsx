/**
 * OffPay Tab Layout — Matching the Reference Bottom Tab Navigation
 * Tabs: Home (⌂), Accounts (💼), Cards (💳), More (•••)
 */

import { Tabs } from 'expo-router';
import { useColorScheme, Platform, View, StyleSheet, Text } from 'react-native';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const theme = Colors[scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0F4A3C',
        tabBarInactiveTintColor: '#9AA8BC',
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#1A2533',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: FontWeight.bold,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="⌂" color={focused ? '#0F4A3C' : color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="💼" color={focused ? '#0F4A3C' : color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Ledger',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="💳" color={focused ? '#0F4A3C' : color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="•••" color={focused ? '#0F4A3C' : color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, color, focused }: { icon: string; color: string; focused: boolean }) {
  return (
    <View style={tabStyles.container}>
      <Text style={[tabStyles.icon, { color, fontSize: icon === '•••' ? 14 : 20 }]}>
        {icon}
      </Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
  },
  icon: {
    fontWeight: '700',
  },
});
