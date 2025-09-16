// utils/ml/ModelTypes.ts
export interface TensorInfo {
  name: string;
  shape: number[];
  dtype: string;
}

export interface ModelInfo {
  inputTensors: TensorInfo[];
  outputTensors: TensorInfo[];
}

export interface PredictionResult {
  output: Float32Array | number[];
  confidence?: number;
  processingTime: number;
}

export interface MLManagerConfig {
  modelPath: string;
  enableLogging?: boolean;
}
