/**
 * OffPay Tab Layout — Vector SVG Bottom Tab Navigation
 * Tabs: Home, Accounts, Ledger, More
 */

import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { SvgIcon, type IconName } from '@/components/SvgIcons';
import { useTheme } from '@/hooks/use-theme';
import { FontWeight } from '@/constants/theme';

export default function TabLayout() {
  const theme = useTheme();

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
          marginTop: 3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabSvgIcon iconName="home" color={focused ? theme.primary : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color, focused }) => (
            <TabSvgIcon iconName="accounts" color={focused ? theme.primary : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Ledger',
          tabBarIcon: ({ color, focused }) => (
            <TabSvgIcon iconName="cards" color={focused ? theme.primary : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <TabSvgIcon iconName="more" color={focused ? theme.primary : color} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabSvgIcon({ iconName, color }: { iconName: IconName; color: string }) {
  return (
    <View style={tabStyles.container}>
      <SvgIcon name={iconName} size={22} color={color} />
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
  },
});
