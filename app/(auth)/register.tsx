import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    householdMembers: '',
  });

  const { register, loading } = useAuth();

  const handleRegister = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Missing Information', 'Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.address.trim()) {
      Alert.alert('Missing Address', 'Please enter your complete address');
      return;
    }
    if (!formData.householdMembers.trim() || parseInt(formData.householdMembers) < 1) {
      Alert.alert('Invalid Input', 'Please enter number of household members (minimum 1)');
      return;
    }

    const registerData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      householdMembers: parseInt(formData.householdMembers) || 1,
    };

    const success = await register(registerData);
    
    if (success) {
      router.push({
        pathname: '/(auth)/otp',
        params: { phone: formData.phone }
      });
      Alert.alert('Success', 'OTP sent to your phone. Please verify to complete registration.');
    } else {
      Alert.alert('Registration Failed', 'Unable to send OTP. Please try again.');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#22C55E" />
      <LinearGradient
        colors={['#22C55E', '#16A34A', '#15803D']}
        style={styles.container}
      >
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Compact Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoIcon}>🌱</Text>
              </View>
              <Text style={styles.title}>Join Green_Bots</Text>
              <Text style={styles.subtitle}>Create your eco-friendly account</Text>
            </View>

            {/* Main Form Card */}
            <View style={styles.formContainer}>
              {/* Login Link */}
              <TouchableOpacity 
                style={styles.loginLink}
                onPress={() => router.push('/(auth)/login' as any)}
              >
                <Text style={styles.loginText}>
                  Already have an account? <Text style={styles.loginBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>

              {/* Form Fields */}
              <View style={styles.fieldsContainer}>
                {/* Name & Phone Row */}
                <View style={styles.row}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Your name"
                      placeholderTextColor="#9CA3AF"
                      value={formData.name}
                      onChangeText={(text) => setFormData(prev => ({...prev, name: text}))}
                      autoCapitalize="words"
                    />
                  </View>
                  
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>Phone</Text>
                    <View style={styles.phoneContainer}>
                      <Text style={styles.countryCode}>+91</Text>
                      <TextInput
                        style={styles.phoneInput}
                        placeholder="10-digit number"
                        placeholderTextColor="#9CA3AF"
                        value={formData.phone}
                        onChangeText={(text) => setFormData(prev => ({...prev, phone: text}))}
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>
                  </View>
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Email <Text style={styles.optional}>(Optional)</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Address & Members Row */}
                <View style={styles.row}>
                  <View style={[styles.inputContainer, { flex: 2 }]}>
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Your complete address"
                      placeholderTextColor="#9CA3AF"
                      value={formData.address}
                      onChangeText={(text) => setFormData(prev => ({...prev, address: text}))}
                      multiline={false}
                    />
                  </View>
                  
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.label}>Members</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="4"
                      placeholderTextColor="#9CA3AF"
                      value={formData.householdMembers}
                      onChangeText={(text) => setFormData(prev => ({...prev, householdMembers: text}))}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                </View>
              </View>

              {/* Create Account Button */}
              <TouchableOpacity
                style={[styles.createButton, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={loading ? ['#9CA3AF', '#6B7280'] : ['#22C55E', '#16A34A']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                  <Text style={styles.buttonIcon}>✨</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Terms */}
              <Text style={styles.terms}>
                By creating an account, you agree to our{'\n'}
                <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: height * 0.08,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  loginLink: {
    alignSelf: 'center',
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginBold: {
    fontWeight: '700',
    color: '#22C55E',
  },
  fieldsContainer: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  optional: {
    fontSize: 12,
    fontWeight: '500',
    color: '#22C55E',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FAFAFA',
    fontWeight: '500',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  createButton: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonIcon: {
    fontSize: 16,
  },
  terms: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '600',
    color: '#22C55E',
  },
});
