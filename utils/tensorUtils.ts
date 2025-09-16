import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

export const initializeTensorFlow = async (): Promise<void> => {
  try {
    await tf.ready();
    console.log('TensorFlow.js initialized');
    console.log('Backend:', tf.getBackend());
  } catch (error) {
    console.error('Failed to initialize TensorFlow.js:', error);
    throw error;
  }
};

export const loadModel = async (modelPath: string): Promise<tf.LayersModel> => {
  try {
    const model = await tf.loadLayersModel(modelPath);
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
};

export const disposeModel = (model: tf.LayersModel | null): void => {
  if (model) {
    model.dispose();
    console.log('Model disposed');
  }
};
