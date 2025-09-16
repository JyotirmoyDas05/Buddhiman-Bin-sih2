// app/(tabs)/scanner.tsx - API-integrated waste classification scanner
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TFLiteManager from '../../utils/ml/TFLiteManager';

const Scanner: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [tfReady, setTfReady] = useState(false);
  const [lastPrediction, setLastPrediction] = useState<any>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    initializeAPI();
  }, []);

  const initializeAPI = async () => {
    try {
      console.log('🗂️ Initializing waste classification API...');
      const success = await TFLiteManager.initialize();
      setTfReady(success);
      
      if (success) {
        const info = TFLiteManager.getModelInfo();
        console.log('✅ Waste classification API ready!', info);
      } else {
        const error = TFLiteManager.getInitializationError();
        Alert.alert(
          'API Connection Error', 
          `Failed to connect to classification service: ${error}`,
          [{ text: 'Continue', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('❌ API initialization error:', error);
    }
  };

  const processFrame = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsScanning(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: true,
      });

      if (!photo?.uri) {
        throw new Error('Failed to capture image');
      }

      // Resize image for API processing
      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 224, height: 224 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      console.log('📷 Image captured and resized to 224x224, sending to API...');
      
      // Classify the waste using your API
      const results = await TFLiteManager.processImage(manipResult.uri);
      handleClassificationResults(results);
      
    } catch (error:any) {
      console.error('❌ API classification error:', error);
      
      if (error.message.includes('Rate limit exceeded')) {
        Alert.alert('Please Wait', 'You can only classify waste once every 10 seconds. Please wait and try again.');
      } else {
        Alert.alert('Classification Error', 'Failed to classify waste. Please check your internet connection and try again.');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleClassificationResults = (results: any[]) => {
    try {
      console.log('🗂️ API classification results:', results);
      
      setLastPrediction({ 
        output: results, 
        processingTime: Date.now(),
        type: 'api_classification',
        method: 'api' 
      });
      
      if (results && results.length > 0) {
        const topResult = results[0];
        const confidence = topResult.confidence || 0;
        const wasteType = topResult.label || 'Unknown';
        
        // Get appropriate emoji and disposal advice
        const wasteInfo = getWasteInfo(wasteType, confidence);
        
        Alert.alert(
          `${wasteInfo.emoji} AI Waste Classification`,
          `Type: ${wasteType}\nConfidence: ${(confidence * 100).toFixed(1)}%\nMethod: API Classification\n\n${wasteInfo.advice}`,
          [
            { text: 'OK', style: 'default' },
            { text: 'Scan Again', onPress: takeSinglePhoto, style: 'default' }
          ]
        );
      }
      
    } catch (error) {
      console.error('❌ Error handling classification results:', error);
      Alert.alert('Processing Error', 'Failed to interpret classification results');
    }
  };

  const getWasteInfo = (wasteType: string, confidence: number) => {
    const type = wasteType.toLowerCase();
    
    if (type.includes('biodegradable') && !type.includes('non_')) {
      return {
        emoji: '🌱',
        advice: confidence > 0.7 ? 
          'Safe to compost! This waste will decompose naturally.' : 
          'Likely biodegradable - consider composting if possible.'
      };
    } else if (type.includes('non_biodegradable') || type.includes('degradable')) {
      return {
        emoji: '♻️',
        advice: confidence > 0.7 ? 
          'Non-biodegradable waste! Please dispose in appropriate recycling bin.' : 
          'Likely non-biodegradable - check your local recycling guidelines.'
      };
    } else if (type.includes('toxic')) {
      return {
        emoji: '⚠️',
        advice: confidence > 0.7 ? 
          'TOXIC WASTE! Requires special disposal - contact local hazardous waste facility.' : 
          'Potentially toxic - handle with care and dispose safely.'
      };
    } else {
      return {
        emoji: '🗂️',
        advice: 'Classification uncertain - please verify disposal method.'
      };
    }
  };

  const takeSinglePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera permission is required for waste classification');
      return;
    }

    if (!tfReady) {
      Alert.alert('API Not Ready', 'Please wait for the classification service to connect');
      return;
    }

    await processFrame();
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    if (!permission) return false;
    
    if (!permission.granted) {
      const result = await requestPermission();
      return result.granted;
    }
    return true;
  };

  const toggleCameraFacing = () => {
    setFacing((current: CameraType) => (current === 'back' ? 'front' : 'back'));
  };

  const getStatusMessage = () => {
    if (tfReady) return '🚀 AI Ready';
    return '🔄 Connecting to API...';
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.message}>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>📷 Camera access is required for waste classification</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.statusText, { color: tfReady ? '#00FF00' : '#FFA500' }]}>
            {getStatusMessage()}
          </Text>
          {lastPrediction && (
            <Text style={styles.lastScanText}>
              Last scan: API Classification
            </Text>
          )}
          <Text style={styles.instructionText}>
            Point camera at waste item to classify with AI
          </Text>
        </View>

        {/* Camera Container */}
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            animateShutter={false}
          />
          
          {/* Scan Overlay */}
          <View style={styles.scanOverlay}>
            <View style={[styles.scanFrame, { borderColor: tfReady ? '#00FF00' : '#FFA500' }]} />
            
            {isScanning && (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator size="large" color="#00FF00" />
                <Text style={styles.scanningText}>
                  Running AI classification...
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.flipButton]}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.controlButtonText}>🔄 Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton, 
              styles.captureButton,
              { opacity: tfReady && !isScanning ? 1 : 0.5 }
            ]}
            onPress={takeSinglePhoto}
            disabled={!tfReady || isScanning}
          >
            <Text style={styles.captureButtonText}>
              {isScanning ? 'AI Processing...' : '🚀 Scan Waste'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    width: '100%',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lastScanText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 8,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
    marginBottom: 120,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: '#00FF00',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scanningIndicator: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
  },
  scanningText: {
    color: '#00FF00',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  controlButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    minWidth: 90,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  flipButton: {
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#555',
  },
  captureButton: {
    backgroundColor: '#00FF00',
    minWidth: 120,
    borderWidth: 2,
    borderColor: '#00CC00',
  },
  controlButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  captureButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    color: '#FFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Scanner;
