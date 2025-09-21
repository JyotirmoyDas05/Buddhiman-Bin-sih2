import { useColorScheme } from "@/hooks/use-color-scheme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import LiquidGlassTabBar, { TabItem } from "./LiquidGlassTabBar";

/**
 * Enhanced tab bar component that integrates LiquidGlassTabBar with Expo Router
 * Provides seamless navigation with advanced liquid glass animations
 */
const CustomLiquidTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const colorScheme = useColorScheme();

  // Define colors - make sure these are clearly visible
  const activeTintColor = "#22C55E"; // Green
  const inactiveTintColor = colorScheme === "dark" ? "#9CA3AF" : "#6B7280"; // Gray

  // Convert Expo Router tabs to LiquidGlassTabBar format
  // Use useMemo to ensure this recalculates when state.index changes
  const tabs: TabItem[] = useMemo(() => {
    return state.routes.map((route, index) => {
      const { options } = descriptors[route.key];
      const isFocused = state.index === index;

      // Get icon component from tab bar options
      const IconComponent = options.tabBarIcon;

      // Create the icon directly with the right colors
      const iconColor = isFocused ? activeTintColor : inactiveTintColor;

      const icon = IconComponent ? (
        <IconComponent
          focused={isFocused}
          color={iconColor}
          size={isFocused ? 28 : 24}
        />
      ) : (
        <View style={{ width: 24, height: 24, backgroundColor: "red" }} />
      );

      return {
        key: route.name,
        label: (options.tabBarLabel as string) || options.title || route.name,
        icon: icon, // Use the icon directly
        badge:
          typeof options.tabBarBadge === "number"
            ? options.tabBarBadge
            : undefined,
      };
    });
  }, [
    state.index,
    state.routes,
    descriptors,
    activeTintColor,
    inactiveTintColor,
  ]);

  const handleTabPress = (tabKey: string) => {
    const targetRoute = state.routes.find((route) => route.name === tabKey);
    if (!targetRoute) return;

    const event = navigation.emit({
      type: "tabPress",
      target: targetRoute.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(targetRoute.name, targetRoute.params);
    }
  };

  const activeTab = state.routes[state.index]?.name || "";

  return (
    <View style={styles.container}>
      <LiquidGlassTabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
        colorScheme={colorScheme}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        blurIntensity={30}
        glassOpacity={0.9}
        enableWobble={true}
        enableHaptics={true}
        enableDynamicLighting={true}
        refractionIntensity={0.4}
        animationDuration={650}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default CustomLiquidTabBar;
