const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure model files are served as assets
config.resolver.assetExts.push('bin', 'json', 'tflite', 'onnx', 'html');
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Handle large model files
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Allow large model files
      if (req.url.endsWith('.bin')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
