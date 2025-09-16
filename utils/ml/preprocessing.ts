// utils/ml/preprocessing.ts

/**
 * Normalize array values to 0-1 range
 */
export function normalize(data: number[]): Float32Array {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  return new Float32Array(data.map(val => (val - min) / range));
}

/**
 * Convert image data to model input format
 * Adjust this based on your specific model requirements
 */
export function preprocessImageData(
  imageData: number[], 
  targetWidth: number = 224, 
  targetHeight: number = 224
): Float32Array {
  // Assuming RGB image data
  const expectedSize = targetWidth * targetHeight * 3;
  
  if (imageData.length !== expectedSize) {
    throw new Error(`Expected image size ${expectedSize}, got ${imageData.length}`);
  }
  
  // Normalize pixel values to 0-1 range
  return new Float32Array(imageData.map(pixel => pixel / 255.0));
}

/**
 * Create sample input data for testing
 */
export function createSampleInput(shape: number[]): Float32Array {
  const size = shape.reduce((a, b) => a * b, 1);
  return new Float32Array(Array(size).fill(0).map(() => Math.random()));
}
