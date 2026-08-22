/**
 * OffPay Tab Layout
 * Floating glass bottom tab navigator: Home, History, Account, Settings
 * Features glowing active state pills, custom neo-banking icons, and emerald branding.
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
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 68,
          paddingBottom: Platform.OS === 'ios' ? 26 : 10,
          paddingTop: 10,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -6 },
              shadowOpacity: 0.18,
              shadowRadius: 16,
            },
            android: {
              elevation: 16,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xxs + 1,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.4,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Vault',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="⌂" label="Vault" color={color} focused={focused} activeColor={theme.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Ledger',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="☰" label="Ledger" color={color} focused={focused} activeColor={theme.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Identity',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="◉" label="Identity" color={color} focused={focused} activeColor={theme.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'System',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="⚙" label="System" color={color} focused={focused} activeColor={theme.primary} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  icon,
  color,
  focused,
  activeColor,
}: {
  icon: string;
  label: string;
  color: string;
  focused: boolean;
  activeColor: string;
}) {
  return (
    <View style={tabStyles.container}>
      <Text style={[tabStyles.icon, { color, fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.65 }]}>
        {icon}
      </Text>
      {focused && (
        <View style={[tabStyles.activeDot, { backgroundColor: activeColor }]} />
      )}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  icon: {
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
