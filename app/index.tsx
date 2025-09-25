import { router } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function IndexScreen() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Navigate immediately without delay for seamless transition
      if (isAuthenticated) {
        console.log("🚀 User already logged in - going to main app");
        router.replace("/(tabs)");
      } else {
        console.log("🔐 No login found - going to register");
        router.replace("/(auth)/register");
      }
    }
  }, [isAuthenticated, loading]);

  // Return null to avoid any flash of content
  return null;
}
