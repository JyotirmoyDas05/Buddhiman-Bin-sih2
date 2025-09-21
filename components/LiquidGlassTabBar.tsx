import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import {
  ColorSchemeName,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Spring configuration
const SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 120,
  overshootClamping: false,
};

const LIQUID_CONFIG = {
  damping: 8,
  mass: 0.8,
  stiffness: 80,
  overshootClamping: false,
};

export interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface LiquidGlassTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  colorScheme?: ColorSchemeName;

  // Customization props
  backgroundColor?: string;
  activeTintColor?: string;
  inactiveTintColor?: string;
  blurIntensity?: number;
  glassOpacity?: number;

  // Animation configuration
  animationDuration?: number;
  elasticity?: number;
  enableWobble?: boolean;
  enableHaptics?: boolean;
  /** How long (ms) the scale/enlarge animation should take for the icon when a tab activates */
  scaleDuration?: number;
  /** How big the icon should grow when active (1 = same size, 1.3 = 30% larger) */
  scaleAmount?: number;

  // Lighting and refraction
  enableDynamicLighting?: boolean;
  refractionIntensity?: number;

  // Style overrides
  style?: ViewStyle;
  tabBarHeight?: number;
  /**
   * Extra height to add on top of safe-area inset to avoid overlap with system nav bars.
   * Useful to tweak if you have gesture nav or want extra spacing for large icons.
   */
  extraHeight?: number;
}

const LiquidGlassTabBar: React.FC<LiquidGlassTabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  colorScheme = "light",
  backgroundColor,
  activeTintColor = "#007AFF",
  inactiveTintColor = "#8E8E93",
  blurIntensity = 25,
  glassOpacity = 0.85,
  animationDuration = 600,
  elasticity = 1.2,
  enableWobble = true,
  enableHaptics = true,
  enableDynamicLighting = true,
  refractionIntensity = 0.3,
  style,
  tabBarHeight = Platform.OS === "ios" ? 85 : 65,
  extraHeight = 8,
  scaleDuration = 220,
  scaleAmount = 1.3,
}) => {
  const isDark = colorScheme === "dark";

  const insets = useSafeAreaInsets();
  // Effective height includes base tabBarHeight + bottom inset + optional extraHeight
  const effectiveTabBarHeight =
    tabBarHeight + Math.max(0, insets.bottom) + extraHeight;

  // Calculate active index
  const activeIndex = useMemo(() => {
    const index = tabs.findIndex((tab) => tab.key === activeTab);
    return index !== -1 ? index : 0;
  }, [activeTab, tabs]);

  // Calculate tab width
  const tabWidth = useMemo(() => SCREEN_WIDTH / tabs.length, [tabs.length]);

  // Animation values - all at top level
  const translateX = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const liquidWave = useSharedValue(0);
  const lightingGradient = useSharedValue(0);

  // Fixed tab animations for up to 5 tabs
  const tab0Scale = useSharedValue(1);
  const tab1Scale = useSharedValue(1);
  const tab2Scale = useSharedValue(1);
  const tab3Scale = useSharedValue(1);
  const tab4Scale = useSharedValue(1);

  const tab0Glow = useSharedValue(0);
  const tab1Glow = useSharedValue(0);
  const tab2Glow = useSharedValue(0);
  const tab3Glow = useSharedValue(0);
  const tab4Glow = useSharedValue(0);

  // Helper functions
  const getTabScale = (index: number) => {
    switch (index) {
      case 0:
        return tab0Scale;
      case 1:
        return tab1Scale;
      case 2:
        return tab2Scale;
      case 3:
        return tab3Scale;
      case 4:
        return tab4Scale;
      default:
        return tab0Scale;
    }
  };

  const getTabGlow = (index: number) => {
    switch (index) {
      case 0:
        return tab0Glow;
      case 1:
        return tab1Glow;
      case 2:
        return tab2Glow;
      case 3:
        return tab3Glow;
      case 4:
        return tab4Glow;
      default:
        return tab0Glow;
    }
  };

  // Update animations when active tab changes
  useEffect(() => {
    const targetPosition = activeIndex * tabWidth;

    // Animate selection indicator
    translateX.value = withSpring(targetPosition, SPRING_CONFIG);

    // Liquid wave effect
    liquidWave.value = withSequence(
      withTiming(1, { duration: 150 }),
      withSpring(0, LIQUID_CONFIG)
    );

    // Glow effect
    glowOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0.3, { duration: 200 }),
      withTiming(0, { duration: 300 })
    );

    // Dynamic lighting
    if (enableDynamicLighting) {
      lightingGradient.value = withSpring(
        activeIndex / Math.max(tabs.length - 1, 1),
        SPRING_CONFIG
      );
    }

    // Reset all tab animations
    tab0Scale.value = 1;
    tab1Scale.value = 1;
    tab2Scale.value = 1;
    tab3Scale.value = 1;
    tab4Scale.value = 1;

    tab0Glow.value = 0;
    tab1Glow.value = 0;
    tab2Glow.value = 0;
    tab3Glow.value = 0;
    tab4Glow.value = 0;

    // Animate active tab
    const activeTabScale = getTabScale(activeIndex);
    const activeTabGlow = getTabGlow(activeIndex);

    // Faster, configurable scale animation: scale up quickly then return to 1.
    activeTabScale.value = withSequence(
      withTiming(enableWobble ? scaleAmount : Math.min(scaleAmount, 1.15), {
        duration: scaleDuration,
      }),
      withTiming(1, {
        duration: Math.max(120, Math.round(scaleDuration * 0.9)),
      })
    );

    activeTabGlow.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 400 })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, tabWidth, enableWobble, enableDynamicLighting, tabs.length]);

  // Handle tab press
  const handleTabPress = (tabKey: string, index: number) => {
    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Visual feedback
    const pressedTabScale = getTabScale(index);
    pressedTabScale.value = withSequence(
      withTiming(0.9, { duration: 50 }),
      withSpring(1, SPRING_CONFIG)
    );

    onTabPress(tabKey);
  };

  // Animated styles
  const selectionIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scaleX: 1 + liquidWave.value * 0.1 },
        { scaleY: 1 + liquidWave.value * 0.05 },
      ],
      shadowOpacity: 0.2 + glowOpacity.value * 0.3,
      shadowRadius: 8 + liquidWave.value * 8,
    };
  });

  const dynamicLightingStyle = useAnimatedStyle(() => {
    if (!enableDynamicLighting) {
      return { opacity: 0 };
    }

    return {
      opacity: 0.4,
      transform: [{ translateX: lightingGradient.value * SCREEN_WIDTH * 0.5 }],
    };
  });

  return (
    // Container uses the effective height and a slightly translucent background so the
    // BlurView acts as a backdrop for any moving content (scrolling) behind the tab bar.
    <View style={[styles.container, style, { height: effectiveTabBarHeight }]}>
      {/* Glass Background */}
      {/* Backdrop blur — kept absolutely positioned and pointerEvents none so it blurs
          content that scrolls or moves behind the tab bar. */}
      <BlurView
        intensity={blurIntensity}
        tint={isDark ? "dark" : "light"}
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: `${
              isDark ? "rgba(20,20,20," : "rgba(255,255,255,"
            }${glassOpacity})`,
          },
        ]}
        pointerEvents="none"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={
          isDark
            ? ["rgba(28, 28, 30, 0.85)", "rgba(44, 44, 46, 0.9)"]
            : ["rgba(255, 255, 255, 0.85)", "rgba(248, 248, 248, 0.9)"]
        }
        style={StyleSheet.absoluteFillObject}
      />

      {/* Dynamic Lighting Effect */}
      {enableDynamicLighting && (
        <Animated.View style={[styles.lightingOverlay, dynamicLightingStyle]}>
          <LinearGradient
            colors={["transparent", "rgba(255, 255, 255, 0.2)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      )}

      {/* Selection Indicator */}
      <Animated.View
        style={[
          styles.selectionIndicator,
          selectionIndicatorStyle,
          {
            width: tabWidth - 16,
            left: 8,
            backgroundColor: activeTintColor,
            shadowColor: activeTintColor,
          },
        ]}
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TabButton
            key={tab.key}
            tab={tab}
            index={index}
            isActive={tab.key === activeTab}
            activeTintColor={activeTintColor}
            inactiveTintColor={inactiveTintColor}
            tabScale={getTabScale(index)}
            tabGlow={getTabGlow(index)}
            onPress={() => handleTabPress(tab.key, index)}
            tabWidth={tabWidth}
            isDark={isDark}
          />
        ))}
      </View>
    </View>
  );
};

// Individual tab button component
interface TabButtonProps {
  tab: TabItem;
  index: number;
  isActive: boolean;
  activeTintColor: string;
  inactiveTintColor: string;
  tabScale: SharedValue<number>;
  tabGlow: SharedValue<number>;
  onPress: () => void;
  tabWidth: number;
  isDark: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  tab,
  index,
  isActive,
  activeTintColor,
  inactiveTintColor,
  tabScale,
  tabGlow,
  onPress,
  tabWidth,
  isDark,
}) => {
  const tabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: tabScale.value }],
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      // Keep icon fully opaque; use tabGlow only to drive shadow/glow intensity.
      opacity: 1,
      shadowOpacity: tabGlow.value * 0.5,
      shadowRadius: 12 + tabGlow.value * 8,
    };
  });

  const tintColor = isActive ? activeTintColor : inactiveTintColor;

  return (
    <TouchableOpacity
      style={[styles.tab, { width: tabWidth }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.tabContent, tabAnimatedStyle]}>
        <Animated.View
          style={[
            styles.tabIconContainer,
            glowAnimatedStyle,
            {
              shadowColor: activeTintColor,
            },
          ]}
        >
          {tab.icon}
        </Animated.View>

        <Text
          style={[
            styles.tabLabel,
            {
              color: tintColor,
              fontWeight: isActive ? "600" : "400",
            },
          ]}
          numberOfLines={1}
        >
          {tab.label}
        </Text>

        {tab.badge !== undefined && tab.badge > 0 && (
          <View style={[styles.badge, { backgroundColor: activeTintColor }]}>
            <Text style={styles.badgeText}>
              {tab.badge > 99 ? "99+" : tab.badge.toString()}
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  lightingOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.5,
    pointerEvents: "none",
    zIndex: 0,
  },

  selectionIndicator: {
    position: "absolute",
    top: 8,
    height: 4,
    borderRadius: 2,
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  tabsContainer: {
    flexDirection: "row",
    height: "100%",
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    zIndex: 3,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  tabIconContainer: {
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0,
        shadowRadius: 8,
      },
    }),
    zIndex: 4,
    elevation: 8,
  },

  tabLabel: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -12,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
});

export default LiquidGlassTabBar;
