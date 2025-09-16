import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WastePrediction } from '../../types/prediction';
import { CLASS_COLORS } from '../../utils/constants';

interface PredictionOverlayProps {
  prediction: WastePrediction | null;
  isProcessing: boolean;
}

export const PredictionOverlay: React.FC<PredictionOverlayProps> = ({
  prediction,
  isProcessing,
}) => {
  // Force immediate re-render when prediction changes
  useLayoutEffect(() => {
    if (prediction) {
      console.log('🚀 IMMEDIATE UI UPDATE - New prediction:', prediction);
    }
  }, [prediction]);

  // Force immediate re-render when processing state changes  
  useLayoutEffect(() => {
    console.log('🚀 IMMEDIATE UI UPDATE - Processing state:', isProcessing);
  }, [isProcessing]);

  if (!prediction && !isProcessing) {
    return (
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
        <Text style={styles.processingText}>Ready to scan</Text>
      </View>
    );
  }

  const backgroundColor = prediction 
    ? CLASS_COLORS[prediction.class] 
    : 'rgba(0, 0, 0, 0.7)';

  return (
    <View style={[styles.overlay, { backgroundColor }]}>
      {isProcessing ? (
        <Text style={styles.processingText}>🔍 Processing...</Text>
      ) : prediction ? (
        <>
          <Text style={styles.classText}>
            🎯 {prediction.class.replace('_', ' ').toUpperCase()}
          </Text>
          <Text style={styles.confidenceText}>
            Confidence: {(prediction.confidence * 100).toFixed(1)}%
          </Text>
          <Text style={styles.timestampText}>
            {new Date(prediction.timestamp).toLocaleTimeString()}
          </Text>
        </>
      ) : (
        <Text style={styles.processingText}>No prediction available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 80,
  },
  classText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confidenceText: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  timestampText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
    textAlign: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
