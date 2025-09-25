import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const { login, sendOTP, loading } = useAuth();

  const handleSendOTP = async () => {
    if (!phone.trim() || phone.length < 10) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    const success = await sendOTP(phone);
    if (success) {
      setOtpSent(true);
      Alert.alert(
        "Success",
        "OTP sent to your phone. Please check your messages."
      ); // Updated
    } else {
      Alert.alert(
        "Error",
        "Failed to send OTP. Please check your network connection and try again."
      ); // More helpful
    }
  };

  const handleLogin = async () => {
    if (!otp.trim() || otp.length < 6) {
      Alert.alert("Error", "Please enter the 6-digit OTP");
      return;
    }

    const success = await login(phone, otp);
    if (success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.appName}>EcoMitra</Text>
          <Text style={styles.subtitle}>Smart Waste Segregation System</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your 10-digit phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
            editable={!otpSent}
          />

          {!otpSent ? (
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Sending..." : "Send OTP"}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Verifying..." : "Verify & Login"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => setOtpSent(false)}
              >
                <Text style={styles.resendText}>Change Phone Number</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push("/(auth)/register" as any)}
          >
            <Text style={styles.registerText}>
              New user?{" "}
              <Text style={styles.registerTextBold}>Register Here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: Colors.text,
    marginBottom: 4,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  resendText: {
    color: Colors.primary,
    fontSize: 14,
  },
  registerLink: {
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  registerTextBold: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
