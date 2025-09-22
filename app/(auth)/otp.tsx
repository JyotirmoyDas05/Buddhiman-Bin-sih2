import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../contexts/AuthContext";

export default function OTPScreen() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { login, sendOTP, loading } = useAuth();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit OTP");
      return;
    }

    const success = await login(phone || "", otp);
    if (success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) {
      Alert.alert(
        "Wait",
        `Please wait ${formatTime(timeLeft)} before requesting a new OTP`
      );
      return;
    }

    const success = await sendOTP(phone || "");
    if (success) {
      setTimeLeft(300);
      setOtp("");
      Alert.alert("Success", "New OTP sent to your phone");
    } else {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We have sent a 6-digit code to{"\n"}
          <Text style={styles.phoneNumber}>+91 {phone}</Text>
        </Text>

        <TextInput
          style={styles.otpInput}
          placeholder="000000"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {timeLeft > 0 ? (
            <Text style={styles.timerText}>
              Resend OTP in {formatTime(timeLeft)}
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.changeNumberButton}
          onPress={() => router.back()}
        >
          <Text style={styles.changeNumberText}>Change Phone Number</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.textSecondary,
    marginBottom: 40,
    lineHeight: 22,
  },
  phoneNumber: {
    fontWeight: "600",
    color: Colors.primary,
  },
  otpInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 30,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  resendText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  changeNumberButton: {
    alignItems: "center",
  },
  changeNumberText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
