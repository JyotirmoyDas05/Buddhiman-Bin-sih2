export const MODEL_CONFIG = {
  INPUT_SIZE: 224,
  CHANNELS: 3,
  PROCESS_EVERY_N_FRAMES: 3,
  CONFIDENCE_THRESHOLD: 0.6,
} as const;

export const CLASS_NAMES = [
  'biodegradable',
  'non_biodegradable', 
  'toxic'
] as const;

export const CLASS_COLORS = {
  biodegradable: '#4CAF50',
  non_biodegradable: '#FF9800',
  toxic: '#F44336',
} as const;
