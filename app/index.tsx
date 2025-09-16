import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';

export default function IndexScreen() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Small delay to prevent flash
      setTimeout(() => {
        if (isAuthenticated) {
          console.log('🚀 User already logged in - going to main app');
          router.replace('/(tabs)');
        } else {
          console.log('🔐 No login found - going to register');
          router.replace('/(auth)/register');
        }
      }, 500); // Half second delay for smooth transition
    }
  }, [isAuthenticated, loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WasteSmart</Text>
      <Text style={styles.subtitle}>Smart Waste Segregation System</Text>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Checking login status...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 14,
  },
});
