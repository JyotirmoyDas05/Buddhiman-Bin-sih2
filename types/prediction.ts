export interface WastePrediction {
  class: 'biodegradable' | 'non_biodegradable' | 'toxic';
  confidence: number;
  timestamp: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectionResult {
  prediction: WastePrediction;
  boundingBox?: BoundingBox;
}
