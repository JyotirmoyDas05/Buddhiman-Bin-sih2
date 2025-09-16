import { Colors } from '@/constants/Colors';
import { WasteEntry } from '@/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WasteTypeCardProps {
  type: WasteEntry['type'];
  title: string;
  description: string;
  points: number;
  selected?: boolean;
  onSelect: (type: WasteEntry['type']) => void;
}

export function WasteTypeCard({ type, title, description, points, selected, onSelect }: WasteTypeCardProps) {
  const getColor = () => {
    switch (type) {
      case 'biodegradable': return Colors.biodegradable;
      case 'recyclable': return Colors.recyclable;
      case 'hazardous': return Colors.hazardous;
      case 'general': return Colors.general;
      default: return Colors.primary;
    }
  };

  const color = getColor();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: selected ? color : Colors.border },
        selected && { backgroundColor: `${color}10` }
      ]}
      onPress={() => onSelect(type)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={[styles.title, selected && { color }]}>{title}</Text>
        <Text style={[styles.points, { color }]}>+{points} pts</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  points: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 24,
    lineHeight: 20,
  },
});