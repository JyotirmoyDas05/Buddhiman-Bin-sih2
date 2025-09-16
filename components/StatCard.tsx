import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  style?: ViewStyle;
}

export function StatCard({ title, value, subtitle, color = Colors.primary, style }: StatCardProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.colorBar, { backgroundColor: color }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorBar: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textLight,
  },
});