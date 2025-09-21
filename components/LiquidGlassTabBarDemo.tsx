import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LiquidGlassTabBar, { TabItem } from "./LiquidGlassTabBar";

/**
 * Demo component showcasing all LiquidGlassTabBar features
 * Use this component to test and demonstrate the tab bar capabilities
 */
const LiquidGlassTabBarDemo: React.FC = () => {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState("home");

  // Configuration presets
  const [configPreset, setConfigPreset] = useState("default");
  const [enableWobble, setEnableWobble] = useState(true);
  const [enableHaptics, setEnableHaptics] = useState(true);
  const [enableDynamicLighting, setEnableDynamicLighting] = useState(true);

  // Sample tabs with badges and different icons
  const demoTabs: TabItem[] = [
    {
      key: "home",
      label: "Home",
      icon: (
        <IconSymbol
          name="house.fill"
          size={activeTab === "home" ? 28 : 24}
          color={activeTab === "home" ? "#22C55E" : "#8E8E93"}
        />
      ),
      badge: 3,
    },
    {
      key: "scanner",
      label: "Scanner",
      icon: (
        <IconSymbol
          name="camera.fill"
          size={activeTab === "scanner" ? 28 : 24}
          color={activeTab === "scanner" ? "#22C55E" : "#8E8E93"}
        />
      ),
    },
    {
      key: "ai",
      label: "AI Live",
      icon: (
        <IconSymbol
          name="brain.head.profile"
          size={activeTab === "ai" ? 28 : 24}
          color={activeTab === "ai" ? "#22C55E" : "#8E8E93"}
        />
      ),
      badge: 12,
    },
    {
      key: "monitor",
      label: "Monitor",
      icon: (
        <IconSymbol
          name="chart.bar.fill"
          size={activeTab === "monitor" ? 28 : 24}
          color={activeTab === "monitor" ? "#22C55E" : "#8E8E93"}
        />
      ),
    },
    {
      key: "profile",
      label: "Profile",
      icon: (
        <IconSymbol
          name="person.circle.fill"
          size={activeTab === "profile" ? 28 : 24}
          color={activeTab === "profile" ? "#22C55E" : "#8E8E93"}
        />
      ),
      badge: 99,
    },
  ];

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
    Alert.alert("Tab Changed", `Switched to: ${tabKey}`, [{ text: "OK" }]);
  };

  const getConfigForPreset = (preset: string) => {
    switch (preset) {
      case "minimal":
        return {
          blurIntensity: 15,
          glassOpacity: 0.6,
          animationDuration: 400,
          elasticity: 1.0,
          refractionIntensity: 0.1,
        };
      case "dramatic":
        return {
          blurIntensity: 40,
          glassOpacity: 0.95,
          animationDuration: 800,
          elasticity: 1.8,
          refractionIntensity: 0.6,
        };
      default:
        return {
          blurIntensity: 25,
          glassOpacity: 0.85,
          animationDuration: 600,
          elasticity: 1.2,
          refractionIntensity: 0.3,
        };
    }
  };

  const config = getConfigForPreset(configPreset);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>🌊 LiquidGlassTabBar Demo</Text>
        <Text style={styles.subtitle}>
          Experience iOS 26 Liquid Glass Design
        </Text>

        {/* Current Tab Display */}
        <View style={styles.activeTabCard}>
          <Text style={styles.activeTabTitle}>Active Tab</Text>
          <Text style={styles.activeTabValue}>{activeTab}</Text>
        </View>

        {/* Configuration Controls */}
        <View style={styles.configSection}>
          <Text style={styles.sectionTitle}>⚙️ Configuration</Text>

          {/* Preset Selection */}
          <View style={styles.configGroup}>
            <Text style={styles.groupTitle}>Visual Presets</Text>

            {["default", "minimal", "dramatic"].map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetButton,
                  configPreset === preset && styles.presetButtonActive,
                ]}
                onPress={() => setConfigPreset(preset)}
              >
                <Text
                  style={[
                    styles.presetButtonText,
                    configPreset === preset && styles.presetButtonTextActive,
                  ]}
                >
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Feature Toggles */}
          <View style={styles.configGroup}>
            <Text style={styles.groupTitle}>Features</Text>

            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Enable Wobble Animation</Text>
              <Switch
                value={enableWobble}
                onValueChange={setEnableWobble}
                trackColor={{ false: "#767577", true: "#22C55E" }}
                thumbColor={enableWobble ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Dynamic Lighting</Text>
              <Switch
                value={enableDynamicLighting}
                onValueChange={setEnableDynamicLighting}
                trackColor={{ false: "#767577", true: "#22C55E" }}
                thumbColor={enableDynamicLighting ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Haptic Feedback</Text>
              <Switch
                value={enableHaptics}
                onValueChange={setEnableHaptics}
                trackColor={{ false: "#767577", true: "#22C55E" }}
                thumbColor={enableHaptics ? "#fff" : "#f4f3f4"}
              />
            </View>
          </View>

          {/* Current Settings Display */}
          <View style={styles.configGroup}>
            <Text style={styles.groupTitle}>Current Settings</Text>
            <Text style={styles.settingText}>
              Blur Intensity: {config.blurIntensity}
            </Text>
            <Text style={styles.settingText}>
              Glass Opacity: {config.glassOpacity}
            </Text>
            <Text style={styles.settingText}>
              Animation Duration: {config.animationDuration}ms
            </Text>
            <Text style={styles.settingText}>
              Elasticity: {config.elasticity}
            </Text>
            <Text style={styles.settingText}>
              Refraction: {config.refractionIntensity}
            </Text>
          </View>
        </View>

        {/* Feature Showcase */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>✨ Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>
              🌊 Liquid Physics with Spring Animations
            </Text>
            <Text style={styles.featureItem}>
              🔮 Multi-Layer Glassmorphism Effects
            </Text>
            <Text style={styles.featureItem}>
              💡 Dynamic Lighting & Refraction
            </Text>
            <Text style={styles.featureItem}>
              📱 Cross-Platform Optimization
            </Text>
            <Text style={styles.featureItem}>
              🎛️ Fully Customizable Properties
            </Text>
            <Text style={styles.featureItem}>
              🎯 Haptic Feedback Integration
            </Text>
            <Text style={styles.featureItem}>
              🏆 60fps Performance Guaranteed
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>📖 Instructions</Text>
          <Text style={styles.instructionText}>
            • Tap different tabs to see liquid animations{"\n"}• Try different
            visual presets for various effects{"\n"}• Toggle switches to
            enable/disable features{"\n"}• Notice the smooth spring physics and
            glassmorphism{"\n"}• Feel the haptic feedback on supported devices
          </Text>
        </View>

        {/* Add padding for tab bar */}
        <View style={styles.tabBarSpacer} />
      </ScrollView>

      {/* The Liquid Glass Tab Bar */}
      <LiquidGlassTabBar
        tabs={demoTabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
        colorScheme={colorScheme}
        activeTintColor="#22C55E"
        inactiveTintColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        blurIntensity={config.blurIntensity}
        glassOpacity={config.glassOpacity}
        animationDuration={config.animationDuration}
        elasticity={config.elasticity}
        enableWobble={enableWobble}
        enableHaptics={enableHaptics}
        enableDynamicLighting={enableDynamicLighting}
        refractionIntensity={config.refractionIntensity}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Extra padding for tab bar
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 30,
  },
  activeTabCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activeTabTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  activeTabValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22C55E",
    textTransform: "capitalize",
  },
  configSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  configGroup: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  configItem: {
    marginBottom: 20,
  },
  configLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
    marginBottom: 8,
  },
  presetButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  presetButtonActive: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
  },
  presetButtonTextActive: {
    color: "white",
  },
  settingText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  switchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
    flex: 1,
  },
  featuresSection: {
    marginBottom: 30,
  },
  featuresList: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureItem: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 8,
    lineHeight: 20,
  },
  instructionsSection: {
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 22,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabBarSpacer: {
    height: 100, // Space for the tab bar
  },
});

export default LiquidGlassTabBarDemo;
