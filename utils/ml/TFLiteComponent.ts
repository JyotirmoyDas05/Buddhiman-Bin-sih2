// utils/ml/TFLiteComponent.ts - Enhanced error handling and module availability check
let TFLiteViewComponent: any = null;
let isModuleAvailable = false;
let moduleCheckPerformed = false;

const checkTurboModuleAvailability = (): boolean => {
  if (moduleCheckPerformed) {
    return isModuleAvailable;
  }

  try {
    const { TurboModuleRegistry } = require('react-native');
    
    // Check if the TurboModule is registered
    const tfliteModule = TurboModuleRegistry.get('Tflite');
    if (tfliteModule) {
      console.log('✅ TFLite TurboModule found and registered');
      isModuleAvailable = true;
    } else {
      console.warn('⚠️ TFLite TurboModule not found - native module not registered');
      isModuleAvailable = false;
    }
  } catch (error) {
    console.warn('⚠️ TurboModuleRegistry not available or error checking module:', error);
    isModuleAvailable = false;
  }

  moduleCheckPerformed = true;
  return isModuleAvailable;
};

export const getTFLiteView = () => {
  // Return null immediately if module isn't available
  if (!checkTurboModuleAvailability()) {
    return null;
  }

  if (!TFLiteViewComponent) {
    try {
      const { RNTFLiteView } = require('react-native-fast-tflite');
      TFLiteViewComponent = RNTFLiteView;
      console.log('✅ TFLite component loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load TFLite component:', error);
      isModuleAvailable = false;
      return null;
    }
  }
  
  return TFLiteViewComponent;
};

export const isTFLiteAvailable = (): boolean => {
  return checkTurboModuleAvailability();
};

export const getTFLiteStatus = (): { available: boolean; error?: string } => {
  const available = checkTurboModuleAvailability();
  
  if (!available) {
    return {
      available: false,
      error: 'TensorFlow Lite native module is not properly installed or registered. This may be due to a missing spec directory in react-native-fast-tflite v1.6.0.'
    };
  }
  
  return { available: true };
};
