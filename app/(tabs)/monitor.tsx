import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function MonitorScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";

  // Animation references for progress bars
  const organicProgress = useRef(new Animated.Value(0)).current;
  const recyclableProgress = useRef(new Animated.Value(0)).current;
  const hazardousProgress = useRef(new Animated.Value(0)).current;

  // Target percentages
  const targetPercentages = {
    organic: 73,
    recyclable: 21,
    hazardous: 6,
  };

  // Animate progress bars on component mount
  useEffect(() => {
    const animateProgressBars = () => {
      Animated.stagger(200, [
        Animated.timing(organicProgress, {
          toValue: targetPercentages.organic,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(recyclableProgress, {
          toValue: targetPercentages.recyclable,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(hazardousProgress, {
          toValue: targetPercentages.hazardous,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]).start();
    };

    animateProgressBars();
  }, [
    organicProgress,
    recyclableProgress,
    hazardousProgress,
    targetPercentages.organic,
    targetPercentages.recyclable,
    targetPercentages.hazardous,
  ]);

  const handleDeviceAction = (action: string) => {
    Alert.alert(
      "Device Action",
      `${action} functionality will be available when IoT device is connected.`
    );
  };

  return (
    <SafeAreaProvider>
      <ThemedView
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0F172A" : "#F8FAFC" },
        ]}
      >
        <LinearGradient
          colors={isDark ? ["#0F172A", "#1E293B"] : ["#F8FAFC", "#E2E8F0"]}
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: insets.top + 10 },
            ]}
          >
            {/* Header */}
            <ThemedView
              style={[
                styles.headerCard,
                {
                  backgroundColor: isDark
                    ? "rgba(31, 41, 55, 0.8)"
                    : "rgba(255, 255, 255, 0.9)",
                },
              ]}
            >
              <ThemedView style={styles.headerContent}>
                <ThemedView>
                  <ThemedText
                    style={[
                      styles.headerTitle,
                      {
                        color: isDark ? "#F1F5F9" : "#1E293B",
                      },
                    ]}
                  >
                    Waste Monitor
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.headerSubtitle,
                      {
                        color: isDark ? "#94A3B8" : "#64748B",
                      },
                    ]}
                  >
                    Real-time device monitoring
                  </ThemedText>
                </ThemedView>
                <ThemedView
                  style={[
                    styles.deviceStatus,
                    {
                      backgroundColor: isDark
                        ? "rgba(34, 197, 94, 0.2)"
                        : "rgba(34, 197, 94, 0.15)",
                    },
                  ]}
                >
                  <ThemedView
                    style={[styles.statusDot, { backgroundColor: "#22C55E" }]}
                  />
                  <ThemedText style={[styles.statusText, { color: "#22C55E" }]}>
                    Online
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* Classification Status */}
            <ThemedView style={styles.section}>
              <ThemedText
                style={[
                  styles.sectionTitle,
                  {
                    color: isDark ? "#E2E8F0" : "#334155",
                  },
                ]}
              >
                Real-time Classification 🎯
              </ThemedText>

              <ThemedView
                style={[
                  styles.classificationCard,
                  {
                    backgroundColor: isDark
                      ? "rgba(31, 41, 55, 0.8)"
                      : "rgba(255, 255, 255, 0.9)",
                  },
                ]}
              >
                <ThemedView style={styles.classificationItem}>
                  <ThemedView style={styles.classificationLeft}>
                    <ThemedView
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: "rgba(34, 197, 94, 0.15)" },
                      ]}
                    >
                      <IconSymbol size={20} name="leaf.fill" color="#22C55E" />
                    </ThemedView>
                    <ThemedText
                      style={[
                        styles.categoryLabel,
                        {
                          color: isDark ? "#F1F5F9" : "#1E293B",
                        },
                      ]}
                    >
                      Organic
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.progressContainer}>
                    <ThemedView style={styles.progressSection}>
                      <AnimatedCounter
                        value={targetPercentages.organic}
                        suffix="%"
                        fontSize={12}
                        fontWeight="700"
                        color={isDark ? "#F1F5F9" : "#1E293B"}
                      />
                      <ThemedView
                        style={[
                          styles.progressBar,
                          {
                            backgroundColor: isDark ? "#374151" : "#F3F4F6",
                          },
                        ]}
                      >
                        <Animated.View
                          style={[
                            styles.progressFill,
                            {
                              backgroundColor: "#22C55E",
                              width: organicProgress.interpolate({
                                inputRange: [0, 100],
                                outputRange: ["0%", "100%"],
                                extrapolate: "clamp",
                              }),
                            },
                          ]}
                        />
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.classificationItem}>
                  <ThemedView style={styles.classificationLeft}>
                    <ThemedView
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                      ]}
                    >
                      <IconSymbol
                        size={20}
                        name="arrow.3.trianglepath"
                        color="#3B82F6"
                      />
                    </ThemedView>
                    <ThemedText
                      style={[
                        styles.categoryLabel,
                        {
                          color: isDark ? "#F1F5F9" : "#1E293B",
                        },
                      ]}
                    >
                      Recyclable
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.progressContainer}>
                    <ThemedView style={styles.progressSection}>
                      <AnimatedCounter
                        value={targetPercentages.recyclable}
                        suffix="%"
                        fontSize={12}
                        fontWeight="700"
                        color={isDark ? "#F1F5F9" : "#1E293B"}
                      />
                      <ThemedView
                        style={[
                          styles.progressBar,
                          {
                            backgroundColor: isDark ? "#374151" : "#F3F4F6",
                          },
                        ]}
                      >
                        <Animated.View
                          style={[
                            styles.progressFill,
                            {
                              backgroundColor: "#3B82F6",
                              width: recyclableProgress.interpolate({
                                inputRange: [0, 100],
                                outputRange: ["0%", "100%"],
                                extrapolate: "clamp",
                              }),
                            },
                          ]}
                        />
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.classificationItem}>
                  <ThemedView style={styles.classificationLeft}>
                    <ThemedView
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: "rgba(239, 68, 68, 0.15)" },
                      ]}
                    >
                      <IconSymbol
                        size={20}
                        name="exclamationmark.triangle.fill"
                        color="#EF4444"
                      />
                    </ThemedView>
                    <ThemedText
                      style={[
                        styles.categoryLabel,
                        {
                          color: isDark ? "#F1F5F9" : "#1E293B",
                        },
                      ]}
                    >
                      Hazardous
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.progressContainer}>
                    <ThemedView style={styles.progressSection}>
                      <AnimatedCounter
                        value={targetPercentages.hazardous}
                        suffix="%"
                        fontSize={12}
                        fontWeight="700"
                        color={isDark ? "#F1F5F9" : "#1E293B"}
                      />
                      <ThemedView
                        style={[
                          styles.progressBar,
                          {
                            backgroundColor: isDark ? "#374151" : "#F3F4F6",
                          },
                        ]}
                      >
                        <Animated.View
                          style={[
                            styles.progressFill,
                            {
                              backgroundColor: "#EF4444",
                              width: hazardousProgress.interpolate({
                                inputRange: [0, 100],
                                outputRange: ["0%", "100%"],
                                extrapolate: "clamp",
                              }),
                            },
                          ]}
                        />
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>

                <ThemedView
                  style={[
                    styles.accuracyBadge,
                    {
                      backgroundColor: isDark
                        ? "rgba(34, 197, 94, 0.2)"
                        : "rgba(34, 197, 94, 0.15)",
                    },
                  ]}
                >
                  <IconSymbol size={16} name="target" color="#22C55E" />
                  <ThemedView
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <AnimatedCounter
                      value="92.3"
                      suffix="% "
                      fontSize={16}
                      fontWeight="600"
                      color="#22C55E"
                    />
                    <ThemedText
                      style={[styles.accuracyText, { color: "#22C55E" }]}
                    >
                      Classification Accuracy
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* Weekly Stats */}
            <ThemedView style={styles.section}>
              <ThemedText
                style={[
                  styles.sectionTitle,
                  {
                    color: isDark ? "#E2E8F0" : "#334155",
                  },
                ]}
              >
                Weekly Overview 📊
              </ThemedText>
              <ThemedView style={styles.statsGrid}>
                <ThemedView
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: isDark
                        ? "rgba(31, 41, 55, 0.8)"
                        : "rgba(255, 255, 255, 0.9)",
                    },
                  ]}
                >
                  <AnimatedCounter
                    value="28.5"
                    suffix=" kg"
                    fontSize={20}
                    fontWeight="700"
                    color={isDark ? "#F1F5F9" : "#1E293B"}
                    style={{ marginBottom: 4 }}
                  />
                  <ThemedText
                    style={[
                      styles.statLabel,
                      {
                        color: isDark ? "#94A3B8" : "#64748B",
                      },
                    ]}
                  >
                    Total Sorted
                  </ThemedText>
                </ThemedView>

                <ThemedView
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: isDark
                        ? "rgba(31, 41, 55, 0.8)"
                        : "rgba(255, 255, 255, 0.9)",
                    },
                  ]}
                >
                  <AnimatedCounter
                    value="21.2"
                    suffix=" kg"
                    fontSize={20}
                    fontWeight="700"
                    color={isDark ? "#F1F5F9" : "#1E293B"}
                    style={{ marginBottom: 4 }}
                  />
                  <ThemedText
                    style={[
                      styles.statLabel,
                      {
                        color: isDark ? "#94A3B8" : "#64748B",
                      },
                    ]}
                  >
                    Recycled
                  </ThemedText>
                </ThemedView>

                <ThemedView
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: isDark
                        ? "rgba(31, 41, 55, 0.8)"
                        : "rgba(255, 255, 255, 0.9)",
                    },
                  ]}
                >
                  <AnimatedCounter
                    value="74"
                    suffix="%"
                    fontSize={20}
                    fontWeight="700"
                    color={isDark ? "#F1F5F9" : "#1E293B"}
                    style={{ marginBottom: 4 }}
                  />
                  <ThemedText
                    style={[
                      styles.statLabel,
                      {
                        color: isDark ? "#94A3B8" : "#64748B",
                      },
                    ]}
                  >
                    Efficiency
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* Device Controls */}
            <ThemedView style={styles.section}>
              <ThemedText
                style={[
                  styles.sectionTitle,
                  {
                    color: isDark ? "#E2E8F0" : "#334155",
                  },
                ]}
              >
                Device Controls 🎮
              </ThemedText>

              <Pressable
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: isDark
                      ? "rgba(31, 41, 55, 0.8)"
                      : "rgba(255, 255, 255, 0.9)",
                  },
                ]}
                onPress={() => handleDeviceAction("Calibrate Sensors")}
              >
                <ThemedView
                  style={[
                    styles.controlIcon,
                    { backgroundColor: "rgba(34, 197, 94, 0.15)" },
                  ]}
                >
                  <IconSymbol size={20} name="gear" color="#22C55E" />
                </ThemedView>
                <ThemedText
                  style={[
                    styles.controlButtonText,
                    {
                      color: isDark ? "#F1F5F9" : "#1E293B",
                    },
                  ]}
                >
                  Calibrate Sensors
                </ThemedText>
                <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
              </Pressable>

              <Pressable
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: isDark
                      ? "rgba(31, 41, 55, 0.8)"
                      : "rgba(255, 255, 255, 0.9)",
                  },
                ]}
                onPress={() => handleDeviceAction("Manual Override")}
              >
                <ThemedView
                  style={[
                    styles.controlIcon,
                    { backgroundColor: "rgba(245, 158, 11, 0.15)" },
                  ]}
                >
                  <IconSymbol
                    size={20}
                    name="hand.raised.fill"
                    color="#F59E0B"
                  />
                </ThemedView>
                <ThemedText
                  style={[
                    styles.controlButtonText,
                    {
                      color: isDark ? "#F1F5F9" : "#1E293B",
                    },
                  ]}
                >
                  Manual Override
                </ThemedText>
                <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
              </Pressable>

              <Pressable
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: isDark
                      ? "rgba(31, 41, 55, 0.8)"
                      : "rgba(255, 255, 255, 0.9)",
                  },
                ]}
                onPress={() => handleDeviceAction("System Diagnostics")}
              >
                <ThemedView
                  style={[
                    styles.controlIcon,
                    { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                  ]}
                >
                  <IconSymbol size={20} name="stethoscope" color="#3B82F6" />
                </ThemedView>
                <ThemedText
                  style={[
                    styles.controlButtonText,
                    {
                      color: isDark ? "#F1F5F9" : "#1E293B",
                    },
                  ]}
                >
                  System Diagnostics
                </ThemedText>
                <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
              </Pressable>
            </ThemedView>

            <ThemedView style={{ height: Platform.OS === "ios" ? 100 : 80 }} />
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "400",
  },
  deviceStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  classificationCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  classificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  classificationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    width: 38,
    height: 38,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressContainer: {
    flex: 1.5,
    paddingLeft: 8,
  },
  progressSection: {
    alignItems: "flex-end",
    gap: 4,
  },
  progressBar: {
    height: 8,
    width: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
  },
  accuracyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 16,
    marginTop: 12,
  },
  accuracyText: {
    fontSize: 16,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  controlIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  controlButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
});
