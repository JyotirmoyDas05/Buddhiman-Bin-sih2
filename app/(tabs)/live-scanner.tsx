import { Camera, CameraView } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export default function LiveScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastPrediction, setLastPrediction] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [modelStatus, setModelStatus] = useState<string>('Loading...');
  const [webViewReady, setWebViewReady] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const cameraRef = useRef<CameraView>(null);
  const webViewRef = useRef<WebView>(null);
  const scanningRef = useRef<NodeJS.Timeout | null>(null);

  const consoleRedirectScript = `
    (function() {
      const originalLog = console.log;
      const originalError = console.error;
      
      window.addEventListener('error', function(e) {
        originalError('Uncaught error:', e.error);
        return true;
      });
      
      console.log = function(...args) {
        try {
          originalLog.apply(console, args);
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'console_log',
            level: 'log',
            message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
          }));
        } catch (e) {
          originalError('Console log error:', e);
        }
      };
      
      console.error = function(...args) {
        try {
          originalError.apply(console, args);
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'console_log',
            level: 'error',
            message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
          }));
        } catch (e) {
          originalError('Console error error:', e);
        }
      };
      
      console.log('🚀 Console redirection initialized');
    })();
    true;
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/ort.min.js"></script>
    </head>
    <body>
        <div style="color: white; padding: 10px; background: #333;">
            <h3>Waste Classifier - Keras Model</h3>
            <p id="status">Initializing...</p>
        </div>
        
        <script>
            let session = null;
            // 🔥 FIXED: Your exact class names from Keras training
            const classNames = ['biodegradable', 'non_biodegradable', 'toxic'];
            
            function updateStatus(message) {
                try {
                    console.log('📊 STATUS:', message);
                    const statusEl = document.getElementById('status');
                    if (statusEl) {
                        statusEl.textContent = message;
                    }
                } catch (e) {
                    console.error('Status update error:', e);
                }
            }
            
            function log(message) {
                try {
                    console.log('🔍 DEBUG:', message);
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'debug_log',
                        message: message
                    }));
                } catch (e) {
                    console.error('Log error:', e);
                }
            }

            // No need for softmax - Keras model already includes it
            function normalizeOutput(predictions) {
                // Just ensure they sum to 1 (they should already from Keras softmax)
                const sum = predictions.reduce((a, b) => a + b, 0);
                return sum > 0 ? predictions.map(p => p / sum) : predictions;
            }

            async function initModel() {
                try {
                    updateStatus('Loading Keras ONNX model...');
                    log('🚀 Starting Keras model initialization');
                    
                    // 🔥 FIXED: Use your Keras model instead
                    const modelUrl = 'https://raw.githubusercontent.com/BhairabMahanta/sih2/master/assets/models/waste_classifier.onnx';
                    
                    log('📥 Downloading Keras model from: ' + modelUrl);
                    const response = await fetch(modelUrl, { 
                        cache: 'no-cache',
                        mode: 'cors'
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to download model: ' + response.status);
                    }
                    
                    const arrayBuffer = await response.arrayBuffer();
                    log('✅ Keras model downloaded: ' + arrayBuffer.byteLength + ' bytes');
                    
                    updateStatus('Creating ONNX session...');
                    session = await ort.InferenceSession.create(arrayBuffer, {
                        executionProviders: ['wasm']
                    });
                    
                    log('✅ ONNX session created');
                    log('📥 Input names: [' + session.inputNames.join(', ') + ']');
                    log('📤 Output names: [' + session.outputNames.join(', ') + ']');
                    
                    updateStatus('Keras Model ready ✅');
                    
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'model_ready',
                        status: 'success',
                        inputNames: session.inputNames,
                        outputNames: session.outputNames
                    }));
                    
                } catch (error) {
                    const errorMsg = error.message || error.toString();
                    log('❌ Keras model initialization failed: ' + errorMsg);
                    updateStatus('Error: ' + errorMsg);
                    
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'model_ready',
                        status: 'error',
                        message: errorMsg
                    }));
                }
            }

            async function preprocessImage(imageDataUrl) {
                return new Promise((resolve, reject) => {
                    try {
                        log('🖼️ Starting Keras image preprocessing...');
                        
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const img = new Image();
                        
                        img.onload = () => {
                            try {
                                log('📏 Original image: ' + img.width + 'x' + img.height);
                                
                                canvas.width = 224;
                                canvas.height = 224;
                                ctx.drawImage(img, 0, 0, 224, 224);
                                
                                const imageData = ctx.getImageData(0, 0, 224, 224);
                                const data = imageData.data;
                                
                                // 🔥 FIXED: Keras/TensorFlow preprocessing (simpler than PyTorch)
                                // Keras ImageDataGenerator uses rescale=1./255 (simple 0-1 normalization)
                                const float32Data = new Float32Array(1 * 224 * 224 * 3);
                                
                                // Convert to HWC format (Height-Width-Channel) for TensorFlow
                                for (let h = 0; h < 224; h++) {
                                    for (let w = 0; w < 224; w++) {
                                        const pixelIndex = (h * 224 + w) * 4;
                                        const outputIndex = h * 224 * 3 + w * 3;
                                        
                                        // Simple 0-1 normalization (matching your training)
                                        float32Data[outputIndex] = data[pixelIndex] / 255.0;         // R
                                        float32Data[outputIndex + 1] = data[pixelIndex + 1] / 255.0; // G
                                        float32Data[outputIndex + 2] = data[pixelIndex + 2] / 255.0; // B
                                    }
                                }
                                
                                // 🔥 FIXED: Use HWC shape [1, 224, 224, 3] for TensorFlow/Keras
                                const tensor = new ort.Tensor('float32', float32Data, [1, 224, 224, 3]);
                                log('✅ Keras tensor created: [' + tensor.dims.join(',') + ']');
                                
                                resolve(tensor);
                            } catch (error) {
                                log('❌ Error in Keras image processing: ' + error.message);
                                reject(error);
                            }
                        };
                        
                        img.onerror = (error) => {
                            log('❌ Error loading image: ' + error);
                            reject(new Error('Failed to load image'));
                        };
                        
                        img.crossOrigin = 'anonymous';
                        img.src = imageDataUrl;
                        
                    } catch (error) {
                        log('❌ Error in preprocessImage: ' + error.message);
                        reject(error);
                    }
                });
            }

            async function runInference(imageDataUrl) {
                try {
                    log('🔍 Starting Keras inference...');
                    
                    if (!session) {
                        throw new Error('Model session not ready');
                    }

                    const inputTensor = await preprocessImage(imageDataUrl);
                    
                    log('🧮 Running Keras model inference...');
                    const startTime = performance.now();
                    
                    const inputName = session.inputNames[0];
                    const feeds = {};
                    feeds[inputName] = inputTensor;
                    
                    const results = await session.run(feeds);
                    
                    const endTime = performance.now();
                    log('⏱️ Keras inference took: ' + (endTime - startTime).toFixed(2) + 'ms');
                    
                    // Find output tensor
                    const outputNames = session.outputNames;
                    let outputTensor = null;
                    let usedOutputName = '';
                    
                    for (let i = 0; i < outputNames.length; i++) {
                        const name = outputNames[i];
                        if (results[name]) {
                            outputTensor = results[name];
                            usedOutputName = name;
                            break;
                        }
                    }
                    
                    if (!outputTensor) {
                        log('❌ Available output keys: [' + Object.keys(results).join(', ') + ']');
                        throw new Error('No valid output tensor found. Available: ' + Object.keys(results).join(', '));
                    }
                    
                    log('✅ Using output tensor: ' + usedOutputName);
                    
                    const predictions = Array.from(outputTensor.data);
                    log('📊 Keras predictions (already softmax): [' + predictions.map(v => v.toFixed(4)).join(', ') + ']');
                    
                    // Normalize just to be safe
                    const probabilities = normalizeOutput(predictions);
                    
                    let maxIndex = 0;
                    let maxValue = probabilities[0];
                    
                    for (let i = 1; i < probabilities.length; i++) {
                        if (probabilities[i] > maxValue) {
                            maxValue = probabilities[i];
                            maxIndex = i;
                        }
                    }

                    const className = classNames[maxIndex] || 'Unknown_' + maxIndex;
                    log('🎯 Keras prediction: ' + className + ', Confidence: ' + (maxValue * 100).toFixed(2) + '%');

                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'inference_result',
                        class: maxIndex,
                        className: className,
                        confidence: maxValue,
                        allPredictions: probabilities,
                        rawPredictions: predictions
                    }));
                    
                } catch (error) {
                    const errorMsg = error.message || error.toString();
                    log('❌ Keras inference error: ' + errorMsg);
                    
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'inference_error',
                        message: errorMsg
                    }));
                }
            }

            function handleMessage(data) {
                try {
                    if (data.type === 'run_inference') {
                        log('📨 Received Keras inference request');
                        runInference(data.imageDataUrl).catch(e => {
                            log('❌ Async Keras inference error: ' + e.message);
                        });
                    }
                } catch (error) {
                    log('❌ Message handling error: ' + error.message);
                }
            }

            window.addEventListener('message', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleMessage(data);
                } catch (error) {
                    log('❌ Window message parsing error: ' + error.message);
                }
            });

            document.addEventListener('message', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleMessage(data);
                } catch (error) {
                    log('❌ Document message parsing error: ' + error.message);
                }
            });

            function safeInit() {
                try {
                    log('🚀 Starting Keras model safe initialization...');
                    initModel().catch(e => {
                        log('❌ Async Keras init error: ' + e.message);
                    });
                } catch (e) {
                    log('❌ Keras init error: ' + e.message);
                }
            }

            if (document.readyState === 'complete') {
                safeInit();
            } else {
                window.addEventListener('load', safeInit);
            }
        </script>
    </body>
    </html>
  `;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error: any) {
        console.error('Camera permission error:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  const addDebugLog = (message: string, level: string = 'log') => {
    try {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp}] ${message}`;
      setDebugLogs(prev => [...prev.slice(-20), logEntry]);
      
      if (level === 'error') {
        console.error('[WebView]', message);
      } else {
        console.log('[WebView]', message);
      }
    } catch (error) {
      console.error('Debug log error:', error);
    }
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'console_log':
          addDebugLog(`${data.level.toUpperCase()}: ${data.message}`, data.level);
          break;
          
        case 'debug_log':
          addDebugLog(data.message);
          break;
          
        case 'model_ready':
          if (data.status === 'success') {
            setModelStatus('Keras Model ready ✅');
            setWebViewReady(true);
            addDebugLog('✅ Keras model loaded successfully');
            addDebugLog(`📥 Inputs: [${data.inputNames?.join(', ') || 'unknown'}]`);
            addDebugLog(`📤 Outputs: [${data.outputNames?.join(', ') || 'unknown'}]`);
            
            setTimeout(() => {
              startScanning();
            }, 1000);
            
          } else {
            setModelStatus(`Error: ${data.message}`);
            addDebugLog(`❌ Keras model error: ${data.message}`, 'error');
          }
          break;
          
        case 'inference_result':
          setLastPrediction(data.className || `Class: ${data.class}`);
          setConfidence(data.confidence);
          addDebugLog(`🎯 ${data.className || 'Class ' + data.class}: ${(data.confidence * 100).toFixed(1)}%`);
          break;
          
        case 'inference_error':
          addDebugLog(`❌ Inference failed: ${data.message}`, 'error');
          break;
      }
    } catch (error: any) {
      addDebugLog(`❌ Message parsing error: ${error.message}`, 'error');
    }
  };

  const captureAndAnalyze = async () => {
    try {
      if (!cameraRef.current || !webViewReady) {
        addDebugLog('⚠️ Camera or WebView not ready');
        return;
      }

      addDebugLog('📸 Capturing photo...');
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        skipProcessing: true,
      });

      if (photo?.base64) {
        const imageDataUrl = `data:image/jpeg;base64,${photo.base64}`;
        addDebugLog('📤 Sending image for Keras inference...');
        
        webViewRef.current?.postMessage(JSON.stringify({
          type: 'run_inference',
          imageDataUrl: imageDataUrl
        }));
      } else {
        addDebugLog('❌ Failed to capture photo - no base64 data', 'error');
      }
    } catch (error: any) {
      addDebugLog(`❌ Capture error: ${error.message}`, 'error');
    }
  };

  const startScanning = () => {
    try {
      if (!webViewReady) {
        addDebugLog('⚠️ Cannot start scanning - WebView not ready');
        return;
      }
      
      addDebugLog('▶️ Starting automatic Keras scanning...');
      setIsScanning(true);
      
      setTimeout(() => {
        captureAndAnalyze().catch(e => {
          addDebugLog(`❌ Initial capture error: ${e.message}`, 'error');
        });
      }, 500);
      
      scanningRef.current = setInterval(() => {
        captureAndAnalyze().catch(e => {
          addDebugLog(`❌ Interval capture error: ${e.message}`, 'error');
        });
      }, 2500) as unknown as NodeJS.Timeout;
    } catch (error: any) {
      addDebugLog(`❌ Start scanning error: ${error.message}`, 'error');
    }
  };

  const stopScanning = () => {
    try {
      addDebugLog('⏹️ Stopping scanning...');
      setIsScanning(false);
      if (scanningRef.current) {
        clearInterval(scanningRef.current as unknown as number);
        scanningRef.current = null;
      }
    } catch (error: any) {
      addDebugLog(`❌ Stop scanning error: ${error.message}`, 'error');
    }
  };

  useEffect(() => {
    return () => {
      try {
        if (scanningRef.current) {
          clearInterval(scanningRef.current as unknown as number);
        }
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Requesting camera permission...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Camera access denied. Please enable camera permissions.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing="back" 
      />
      
      <View style={styles.uiOverlay} pointerEvents="box-none">
        <View style={styles.scanFrame} pointerEvents="none" />
        
        <View style={styles.resultsContainer} pointerEvents="box-none">
          <Text style={styles.resultText}>
            {lastPrediction || 'No detection'}
          </Text>
          <Text style={styles.confidenceText}>
            Confidence: {(confidence * 100).toFixed(1)}%
          </Text>
          <Text style={[styles.statusText, { 
            color: webViewReady ? '#00ff00' : 
                   modelStatus.includes('Error') ? '#ff3030' : '#ff9900' 
          }]}>
            Status: {modelStatus}
          </Text>
          <Text style={styles.scanningStatusText}>
            {isScanning ? '🔄 Keras Scanning Active' : '⏸️ Scanning Paused'}
          </Text>
          
          {debugLogs.length > 0 && (
            <View style={styles.debugContainer}>
              <ScrollView style={styles.debugScrollView} showsVerticalScrollIndicator={false}>
                {debugLogs.slice(-4).map((log, index) => (
                  <Text key={index} style={styles.debugText}>
                    {log}
                  </Text>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer} pointerEvents="box-none">
          <TouchableOpacity
            style={[
              styles.button, 
              isScanning ? styles.buttonStop : styles.buttonStart,
              !webViewReady && styles.buttonDisabled
            ]}
            onPress={isScanning ? stopScanning : startScanning}
            disabled={!webViewReady}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isScanning ? '⏹️ STOP' : '▶️ START'}
            </Text>
            <Text style={styles.buttonSubText}>
              {isScanning ? 'Stop live scanning' : 'Start live scanning'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.hiddenWebView}
        onMessage={handleWebViewMessage}
        injectedJavaScript={consoleRedirectScript}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        mixedContentMode="compatibility"
        onError={(error) => addDebugLog(`WebView Error: ${error.nativeEvent.description}`, 'error')}
        onLoadStart={() => addDebugLog('WebView loading started')}
        onLoadEnd={() => addDebugLog('WebView loading finished')}
        onHttpError={(error) => addDebugLog(`HTTP Error: ${error.nativeEvent.statusCode}`, 'error')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  camera: { 
    flex: 1,
    width: '100%',
    height: '100%',
  },
  uiOverlay: { 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  scanFrame: {
    position: 'absolute',
    top: height * 0.25,
    left: width * 0.1,
    right: width * 0.1,
    height: width * 0.8,
    borderWidth: 3,
    borderColor: '#00ff00',
    borderRadius: 15,
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  resultsContainer: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    borderRadius: 15,
    maxHeight: height * 0.4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resultText: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  confidenceText: { 
    color: '#00ff00', 
    fontSize: 16, 
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 5,
  },
  statusText: { 
    fontSize: 12, 
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  scanningStatusText: {
    color: '#ffcc00',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugContainer: { 
    marginTop: 8, 
    maxHeight: 80,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 8,
  },
  debugScrollView: { 
    maxHeight: 70 
  },
  debugText: { 
    color: '#ccc', 
    fontSize: 8, 
    marginTop: 1,
    lineHeight: 12,
  },
  buttonContainer: { 
    position: 'absolute', 
    bottom: 100, 
    left: 40, 
    right: 40,
    alignItems: 'center',
  },
  button: { 
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    minWidth: 160,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    borderWidth: 2,
  },
  buttonStart: {
    backgroundColor: '#00AA00',
    borderColor: '#00ff00',
  },
  buttonStop: { 
    backgroundColor: '#FF3030',
    borderColor: '#ff6060',
  },
  buttonDisabled: {
    backgroundColor: '#666',
    borderColor: '#888',
    opacity: 0.6,
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  buttonSubText: {
    color: 'white',
    fontSize: 11,
    marginTop: 3,
    opacity: 0.9,
  },
  messageText: { 
    color: 'white', 
    fontSize: 18, 
    textAlign: 'center', 
    marginTop: 150,
    paddingHorizontal: 30,
  },
  hiddenWebView: {
    position: 'absolute',
    top: -2000,
    left: -2000,
    width: 1,
    height: 1,
    opacity: 0,
  },
});
