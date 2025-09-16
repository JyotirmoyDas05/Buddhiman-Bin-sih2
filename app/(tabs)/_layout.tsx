import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderTopColor: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)',
          borderTopWidth: 0.5,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          paddingTop: 8,
          position: 'absolute',
          backdropFilter: 'blur(20px)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => null,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 28 : 24} 
              name="house.fill" 
              color={color} 
            />
          ),
        }}
      />
<Tabs.Screen
  name="scanner"
  options={{
    title: 'Scanner',
    tabBarIcon: ({ color, focused }) => (
      <IconSymbol 
        size={focused ? 28 : 24} 
        name="camera.fill" 
        color={color} 
      />
    ),
  }}
/>
<Tabs.Screen
  name="live-scanner"  // New real-time scanner
  options={{
    title: 'Live AI',
    tabBarIcon: ({ color, focused }) => (
      <IconSymbol 
        size={focused ? 28 : 24} 
        name="brain.head.profile" 
        color={color} 
      />
    ),
    headerShown: false,
  }}
/>
      <Tabs.Screen
        name="monitor"
        options={{
          title: 'Monitor',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 28 : 24} 
              name="chart.bar.fill" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 28 : 24} 
              name="person.circle.fill" 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
