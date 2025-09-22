import CustomLiquidTabBar from "@/components/CustomLiquidTabBar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomLiquidTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
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
          title: "Scanner",
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
        name="live-scanner" // New real-time scanner
        options={{
          title: "Live AI",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 28 : 24}
              name="sparkles"
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="monitor"
        options={{
          title: "Monitor",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 28 : 24}
              name="chart.line.uptrend.xyaxis"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
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
