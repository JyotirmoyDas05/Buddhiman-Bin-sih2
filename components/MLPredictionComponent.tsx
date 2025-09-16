// components/ml/MLPredictionComponent.tsx - Updated for react-native-fast-tflite
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loadTensorflowModel } from 'react-native-fast-tflite';

type ModelStatus = 'loading' | 'ready' | 'error';

const MLPredictionComponent: React.FC = () => {
  const [modelStatus, setModelStatus] = useState<ModelStatus>('loading');
  const [prediction, setPrediction] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [model, setModel] = useState<any>(null);

  // Option 1: Using the hook (recommended for React components)
  // const model = useTensorflowModel(require('../../assets/model.tflite'));

  useEffect(() => {
    initializeModel();
  }, []);

  const initializeModel = async () => {
    try {
      setModelStatus('loading');
      console.log('🚀 Initializing TFLite model...');
      
      // Option 1: Load from bundle assets
      const loadedModel = await loadTensorflowModel(
        require('../../assets/model.tflite') // Update path to your model
      );

      // Option 2: Load from file URI (if you have the model downloaded)
      // const loadedModel = await loadTensorflowModel({
      //   url: 'file:///path/to/your/model.tflite'
      // });

      // Option 3: Load from remote URL
      // const loadedModel = await loadTensorflowModel({
      //   url: 'https://your-domain.com/model.tflite'
      // });

      if (loadedModel) {
        setModel(loadedModel);
        setModelStatus('ready');
        console.log('✅ Model loaded successfully!');
        
        // Log model information
        console.log('Model inputs:', loadedModel.inputs);
        console.log('Model outputs:', loadedModel.outputs);
      } else {
        throw new Error('Failed to load model');
      }
      
    } catch (error) {
      console.error('❌ Model initialization error:', error);
      setModelStatus('error');
      Alert.alert('Model Error', `Failed to load model: ${error}`);
    }
  };

  const runPrediction = useCallback(async () => {
    if (modelStatus !== 'ready' || !model) {
      Alert.alert('Model Not Ready', 'Please wait for the model to load');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('🚀 Starting prediction...');
      
      const startTime = Date.now();

      // Prepare your input data based on your model's requirements
      // This is just an example - replace with your actual input preparation
      const inputShape = model.inputs[0].shape; // e.g., [1, 224, 224, 3]
      const inputSize = inputShape.reduce((a: number, b: number) => a * b, 1);
      
      // Create dummy input data for testing
      // Replace this with your actual image/data preprocessing
      const inputData = new Float32Array(inputSize);
      for (let i = 0; i < inputSize; i++) {
        inputData[i] = Math.random(); // Random values for testing
      }

      // Run inference
      const outputData = await model.run(inputData);
      
      const processingTime = Date.now() - startTime;
      
      console.log('📊 Model output:', outputData);
      console.log(`⚡ Processing time: ${processingTime}ms`);

      // Process the output based on your model type
      // This example assumes classification - adjust for your use case
      const processedResults = processOutput(outputData);
      
      setPrediction({ 
        output: processedResults, 
        processingTime 
      });

      // Show results
      if (processedResults && processedResults.length > 0) {
        const topResult = processedResults[0];
        Alert.alert(
          'Prediction Complete!',
          `Result: ${topResult.label}\nConfidence: ${(topResult.confidence * 100).toFixed(1)}%\nTime: ${processingTime}ms`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Prediction Complete!', `Model inference successful!\nTime: ${processingTime}ms`);
      }

    } catch (error) {
      console.error('❌ Prediction error:', error);
      Alert.alert('Prediction Error', `Failed to run inference: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  }, [modelStatus, model]);

  // Helper function to process model output
  const processOutput = (outputData: Float32Array) => {
    // This is model-specific - adjust based on your model's output format
    // Example for classification:
    const results = [];
    const outputArray = Array.from(outputData);
    
    // Find top predictions (assuming classification model)
    const topIndices = outputArray
      .map((score, index) => ({ score, index }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Top 3 predictions

    for (const item of topIndices) {
      results.push({
        label: `Class ${item.index}`, // Replace with actual labels if available
        confidence: item.score,
        index: item.index
      });
    }

    return results;
  };

  const getStatusColor = (): string => {
    switch (modelStatus) {
      case 'loading': return '#FFA500';
      case 'ready': return '#00FF00';
      case 'error': return '#FF0000';
      default: return '#888888';
    }
  };

  const getStatusText = (): string => {
    switch (modelStatus) {
      case 'loading': return 'Loading Model...';
      case 'ready': return '✅ Model Ready';
      case 'error': return '❌ Model Error';
      default: return 'Unknown Status';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.statusText, { color: getStatusColor() }]}>
        {getStatusText()}
      </Text>

      {modelStatus === 'loading' && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}

      {model && modelStatus === 'ready' && (
        <View style={styles.modelInfo}>
          <Text style={styles.modelInfoText}>
            Model loaded successfully!
          </Text>
          <Text style={styles.modelInfoText}>
            Inputs: {model.inputs?.length || 0} | Outputs: {model.outputs?.length || 0}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button, 
          { opacity: modelStatus !== 'ready' || isProcessing ? 0.5 : 1 }
        ]}
        onPress={runPrediction}
        disabled={modelStatus !== 'ready' || isProcessing}
      >
        <Text style={styles.buttonText}>
          {isProcessing ? "Processing..." : "Run Prediction"}
        </Text>
      </TouchableOpacity>

      {prediction && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Prediction Result:</Text>
          <Text style={styles.resultText}>
            Processing Time: {prediction.processingTime}ms
          </Text>
          {prediction.output && prediction.output.length > 0 && (
            <>
              <Text style={styles.resultText}>Top Results:</Text>
              {prediction.output.slice(0, 3).map((result: any, index: number) => (
                <Text key={index} style={styles.resultData}>
                  {index + 1}. {result.label}: {(result.confidence * 100).toFixed(1)}%
                </Text>
              ))}
            </>
          )}
        </View>
      )}

      {modelStatus === 'error' && (
        <TouchableOpacity style={styles.retryButton} onPress={initializeModel}>
          <Text style={styles.retryButtonText}>Retry Model Loading</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  loader: {
    marginBottom: 20,
  },
  modelInfo: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  modelInfoText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#2d5a2d',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
  },
  resultData: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginLeft: 10,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MLPredictionComponent;
