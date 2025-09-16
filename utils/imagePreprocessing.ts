import * as tf from '@tensorflow/tfjs';
import { MODEL_CONFIG } from './constants';

export const preprocessImage = (imageTensor: tf.Tensor3D): tf.Tensor4D => {
  return tf.tidy(() => {
    // Resize to model input size (224x224)
    const resized = tf.image.resizeBilinear(
      imageTensor, 
      [MODEL_CONFIG.INPUT_SIZE, MODEL_CONFIG.INPUT_SIZE]
    );
    
    // Normalize to 0-1 range (matching your Python /255.0)
    const normalized = resized.div(255.0);
    
    // Add batch dimension
    const batched = normalized.expandDims(0) as tf.Tensor4D;
    
    return batched;
  });
};

export const postprocessPrediction = (
  prediction: tf.Tensor, 
  classNames: readonly string[]
): { classIndex: number; confidence: number; className: string } => {
  const probabilities = prediction.dataSync();
  const maxIndex = probabilities.indexOf(Math.max(...probabilities));
  
  return {
    classIndex: maxIndex,
    confidence: probabilities[maxIndex],
    className: classNames[maxIndex],
  };
};
