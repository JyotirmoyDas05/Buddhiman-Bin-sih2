import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import AnimatedSplashScreen from "../components/AnimatedSplashScreen";
import { AuthProvider } from "../contexts/AuthContext";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // Add custom fonts here if needed
  });
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Ensure our animated splash shows immediately
    console.log("RootLayout: Component mounted, splash should be visible");
  }, []);

  const handleAnimationFinish = async () => {
    console.log("RootLayout: Animation finished, hiding splash");
    setIsSplashVisible(false);
    await SplashScreen.hideAsync();
  };

  // Always show animated splash screen first
  if (isSplashVisible) {
    return <AnimatedSplashScreen onAnimationFinish={handleAnimationFinish} />;
  }

  // Wait for fonts to load before showing main app
  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#4CAF50" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
