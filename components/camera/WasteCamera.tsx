import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useWasteClassification } from '../../hooks/useWasteClassification';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { PredictionOverlay } from './PredictionOverlay';

export const WasteCamera: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const { classifyImage, isProcessing, lastPrediction, isReady: isModelReady } = useWasteClassification();
  const cameraRef = useRef<CameraView>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureAndAnalyze = async () => {
    if (!cameraRef.current || isCapturing || isProcessing || !isModelReady) {
      console.log('⏸️ Capture blocked - busy or not ready');
      return;
    }

    setIsCapturing(true);
    console.log('📸 Starting capture...');
    
    try {
      // Fast capture with optimization flags
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,        // Low quality for speed
        base64: false,       // No base64 encoding
        skipProcessing: true, // Skip expo processing for speed
      });
      
      console.log('✅ Photo captured:', photo.uri);
      
      if (photo?.uri) {
        // Lightweight image processing
        const response = await fetch(photo.uri);
        const imageData = await response.arrayBuffer();
        const imageTensor = decodeJpeg(new Uint8Array(imageData));
        
        console.log('🔍 Starting classification...');
        await classifyImage(imageTensor as tf.Tensor3D);
        
        // Clean up
        imageTensor.dispose();
        console.log('✅ Classification complete');
      }
    } catch (error) {
      console.error('❌ Capture/processing error:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return <LoadingSpinner message="Requesting camera permission..." />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isModelReady) {
    return <LoadingSpinner message="Loading AI model..." />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      />
      
      <PredictionOverlay
        prediction={lastPrediction}
        isProcessing={isProcessing || isCapturing}
      />
      
      {/* Manual capture button */}
      <View style={styles.captureContainer}>
        <TouchableOpacity
          style={[
            styles.captureButton, 
            (isCapturing || isProcessing) && styles.captureButtonDisabled
          ]}
          onPress={captureAndAnalyze}
          disabled={isCapturing || isProcessing}
        >
          <Text style={styles.captureButtonText}>
            {isCapturing ? '📸 Capturing...' : 
             isProcessing ? '🔍 Analyzing...' : 
             '📸 Scan Waste'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Status indicator */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {!isModelReady ? 'Model not ready' :
           isCapturing ? 'Capturing image...' :
           isProcessing ? 'Analyzing waste...' :
           lastPrediction ? `Last: ${lastPrediction.class} (${(lastPrediction.confidence * 100).toFixed(1)}%)` :
           'Ready to scan'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    margin: 20,
  },
  permissionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 150,
  },
  captureButtonDisabled: {
    backgroundColor: '#666',
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    textAlign: 'center',
  },
});
