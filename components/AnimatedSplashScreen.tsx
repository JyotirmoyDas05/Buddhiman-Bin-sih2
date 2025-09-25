import * as SplashScreen from "expo-splash-screen";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "../hooks/use-color-scheme";

interface AnimatedSplashScreenProps {
  onAnimationFinish: () => void;
}

const AnimatedSplashScreen = ({
  onAnimationFinish,
}: AnimatedSplashScreenProps) => {
  const animation = useRef<LottieView>(null);
  const colorScheme = useColorScheme();
  const [showFallback, setShowFallback] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);

  const animationSource =
    colorScheme === "dark"
      ? require("../assets/animated/Splash_Icon_Animation_dark.json")
      : require("../assets/animated/Splash_Icon_Animation_light.json");

  const handleAnimationFinish = useCallback(() => {
    console.log("AnimatedSplashScreen: Animation finished, hiding splash");
    // Immediate transition for seamless experience
    onAnimationFinish();
  }, [onAnimationFinish]);

  const onLottieLoad = () => {
    console.log("AnimatedSplashScreen: Lottie animation loaded successfully");
    setAnimationLoaded(true);
    // Start animation immediately for faster loading
    animation.current?.play();
  };

  const onLottieError = (error: any) => {
    console.error("AnimatedSplashScreen: Lottie animation failed:", error);
    setShowFallback(true);
    setTimeout(handleAnimationFinish, 2000);
  };

  useEffect(() => {
    console.log(
      "AnimatedSplashScreen: Component mounted, starting animation..."
    );

    // Keep splash screen visible until our animation is ready
    SplashScreen.preventAutoHideAsync();

    // Fallback timer - if Lottie doesn't load, show fallback after 1 second
    const fallbackTimer = setTimeout(() => {
      if (!animationLoaded) {
        console.log(
          "AnimatedSplashScreen: Lottie didn't load, showing fallback"
        );
        setShowFallback(true);
        // Finish after showing fallback for 2 seconds
        setTimeout(handleAnimationFinish, 2000);
      }
    }, 1000);

    // Emergency timer - always finish after 5 seconds maximum
    const emergencyTimer = setTimeout(() => {
      console.log("AnimatedSplashScreen: Emergency timeout triggered");
      handleAnimationFinish();
    }, 5000);

    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(emergencyTimer);
    };
  }, [animationLoaded, handleAnimationFinish]);

  // Emergency fallback: if nothing happens within 4 seconds, finish anyway
  useEffect(() => {
    const emergencyTimer = setTimeout(() => {
      console.log("AnimatedSplashScreen: Emergency fallback triggered");
      handleAnimationFinish();
    }, 4000);

    return () => clearTimeout(emergencyTimer);
  }, [handleAnimationFinish]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme === "dark" ? "#000000" : "#FFFFFF" },
      ]}
    >
      {showFallback ? (
        <View style={styles.fallbackContainer}>
          <Text
            style={[
              styles.fallbackText,
              { color: colorScheme === "dark" ? "#FFFFFF" : "#000000" },
            ]}
          >
            EcoMitra
          </Text>
        </View>
      ) : (
        <LottieView
          ref={animation}
          source={animationSource}
          autoPlay={false}
          loop={false}
          onAnimationFinish={handleAnimationFinish}
          onAnimationLoaded={onLottieLoad}
          onAnimationFailure={onLottieError}
          style={styles.animation}
          resizeMode="cover"
          renderMode="AUTOMATIC"
          cacheComposition={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  animation: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AnimatedSplashScreen;
