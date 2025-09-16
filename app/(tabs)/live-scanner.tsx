// app/(tabs)/web-scanner.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebScannerScreen() {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js"></script>
  <style>
    body { 
      margin: 0; 
      background: #000; 
      overflow: hidden; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    }
    #video { 
      width: 100vw; 
      height: 100vh; 
      object-fit: cover; 
    }
    #canvas { 
      position: absolute; 
      top: 0; 
      left: 0; 
      width: 100vw; 
      height: 100vh; 
      pointer-events: none;
    }
    #results { 
      position: absolute; 
      top: 80px; 
      left: 20px; 
      right: 20px;
      color: white; 
      text-align: center;
      background: rgba(0,0,0,0.85); 
      padding: 20px; 
      border-radius: 15px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      display: none;
    }
    .prediction { 
      font-size: 24px; 
      font-weight: bold; 
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .confidence { 
      font-size: 16px; 
      opacity: 0.9; 
      margin-bottom: 4px;
    }
    .timestamp { 
      font-size: 12px; 
      opacity: 0.7;
    }
    .status-bar {
      position: absolute;
      top: 50px;
      left: 20px;
      right: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 100;
    }
    .status-indicator {
      background: rgba(0,0,0,0.8);
      padding: 8px 16px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22C55E;
      animation: pulse 2s infinite;
    }
    .status-text {
      color: white;
      font-size: 12px;
      font-weight: 600;
    }
    .fps-counter {
      background: rgba(0,0,0,0.8);
      color: #22C55E;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 18px;
      text-align: center;
      background: rgba(0,0,0,0.8);
      padding: 30px;
      border-radius: 15px;
      max-width: 80%;
    }
    .scan-frame {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 280px;
      height: 280px;
      border: 3px dashed #22C55E;
      border-radius: 20px;
      pointer-events: none;
      animation: scanPulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes scanPulse {
      0%, 100% { 
        border-color: #22C55E;
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
      }
      50% { 
        border-color: #34D399;
        box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
      }
    }
    .processing .scan-frame {
      border-color: #F59E0B;
      animation: processingPulse 0.5s ease-in-out infinite;
    }
    @keyframes processingPulse {
      0%, 100% { border-color: #F59E0B; }
      50% { border-color: #FBBF24; }
    }
  </style>
</head>
<body>
  <video id="video" autoplay muted playsinline webkit-playsinline></video>
  <canvas id="canvas"></canvas>
  
  <!-- Status Bar -->
  <div class="status-bar">
    <div class="status-indicator">
      <div class="status-dot" id="statusDot"></div>
      <div class="status-text" id="statusText">Initializing AI...</div>
    </div>
    <div class="fps-counter" id="fps">0 FPS</div>
  </div>

  <!-- Scan Frame -->
  <div class="scan-frame" id="scanFrame"></div>

  <!-- Results -->
  <div id="results"></div>

  <!-- Loading Screen -->
  <div class="loading" id="loading">
    🤖 Loading AI Model...<br>
    <small style="opacity: 0.7; margin-top: 10px; display: block;">
      Please wait while we initialize the waste classification system
    </small>
  </div>

  <script>
    let model = null;
    let isProcessing = false;
    let frameCount = 0;
    let lastFpsUpdate = Date.now();

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const fpsDiv = document.getElementById('fps');
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');
    const scanFrame = document.getElementById('scanFrame');

    // Replace with your actual server domain
    const MODEL_URL = 'https://api.masksandmachetes.com/api/notifications/models/model.json';


    async function loadModel() {
      try {
        console.log('🔄 Loading AI model from:', MODEL_URL);
        loadingDiv.innerHTML = '🔄 Downloading AI model...<br><small>This may take a moment</small>';
        statusText.textContent = 'Loading AI Model...';
        
        // Test if model URL is accessible
        console.log('🧪 Testing model URL accessibility...');
        const testResponse = await fetch(MODEL_URL.replace('.json', '.json'), { method: 'HEAD' });
        if (!testResponse.ok) {
          throw new Error(\`Model not accessible: HTTP \${testResponse.status}\`);
        }
        
        // Load the TensorFlow.js model (automatically loads all shard files)
        model = await tf.loadLayersModel(MODEL_URL);
        
        console.log('✅ AI model loaded successfully!');
        console.log('📊 Model input shape:', model.inputs[0].shape);
        console.log('📊 Model output shape:', model.outputs[0].shape);
        
        // Update UI
        loadingDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
        statusText.textContent = 'AI Ready';
        statusDot.style.background = '#22C55E';
        
        updateResults('Point camera at waste item', 'AI Model Ready - Start scanning!', '#22C55E');
        
      } catch (error) {
        console.error('❌ Model loading failed:', error);
        statusText.textContent = 'AI Load Failed';
        statusDot.style.background = '#EF4444';
        
        loadingDiv.innerHTML = \`
          <div style="color: #EF4444; text-align: center;">
            ❌ Failed to Load AI Model<br>
            <small style="margin-top: 10px; display: block;">
              Error: \${error.message}<br><br>
              Please check your internet connection<br>
              or try refreshing the page
            </small>
          </div>
        \`;
      }
    }

    async function setupCamera() {
      try {
        console.log('📷 Requesting camera access...');
        statusText.textContent = 'Requesting Camera...';
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment', // Use back camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        video.srcObject = stream;
        console.log('✅ Camera access granted');
        
        video.addEventListener('loadedmetadata', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          console.log(\`📐 Camera resolution: \${video.videoWidth}x\${video.videoHeight}\`);
          
          if (model) {
            statusText.textContent = 'AI Active';
            processFrames();
          } else {
            statusText.textContent = 'Waiting for AI...';
          }
        });
        
      } catch (error) {
        console.error('❌ Camera access failed:', error);
        statusText.textContent = 'Camera Failed';
        statusDot.style.background = '#EF4444';
        
        loadingDiv.innerHTML = \`
          <div style="color: #EF4444; text-align: center;">
            📷 Camera Access Denied<br>
            <small style="margin-top: 10px; display: block;">
              Please enable camera permission in your browser<br>
              and refresh the page to continue
            </small>
          </div>
        \`;
      }
    }

    async function processFrames() {
      if (!model || isProcessing || video.paused || video.ended || video.readyState !== 4) {
        requestAnimationFrame(processFrames);
        return;
      }

      isProcessing = true;
      document.body.classList.add('processing');
      
      try {
        // Draw current video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Create tensor from canvas (adjust size based on your model requirements)
        const tensor = tf.browser.fromPixels(canvas)
          .resizeNearestNeighbor([224, 224]) // Most waste classification models use 224x224
          .expandDims(0) // Add batch dimension
          .div(255.0); // Normalize to [0,1]

        // Run prediction
        const startTime = performance.now();
        const predictions = await model.predict(tensor).data();
        const inferenceTime = performance.now() - startTime;
        
        // Process results based on your model's output format
        let wasteType, confidence, color;
        
        if (predictions.length >= 2) {
          // Multi-class output: [biodegradable_prob, non_biodegradable_prob, ...]
          const biodegradableProb = predictions[0];
          const nonBiodegradableProb = predictions[1];
          
          if (biodegradableProb > nonBiodegradableProb) {
            wasteType = '🌱 Biodegradable';
            confidence = biodegradableProb * 100;
            color = '#22C55E';
          } else {
            wasteType = '🗑️ Non-biodegradable';
            confidence = nonBiodegradableProb * 100;
            color = '#EF4444';
          }
        } else {
          // Single output with sigmoid: [probability]
          const prob = predictions[0];
          if (prob > 0.5) {
            wasteType = '🌱 Biodegradable';
            confidence = prob * 100;
            color = '#22C55E';
          } else {
            wasteType = '🗑️ Non-biodegradable';
            confidence = (1 - prob) * 100;
            color = '#EF4444';
          }
        }
        
        // Update UI with results
        updateResults(
          wasteType, 
          \`\${confidence.toFixed(1)}% confident • \${inferenceTime.toFixed(0)}ms inference\`,
          color
        );
        
        // Clean up tensor memory
        tensor.dispose();
        updateFPS();
        
      } catch (error) {
        console.error('❌ Prediction error:', error);
        updateResults('⚠️ Processing Error', 'Model inference failed - trying again...', '#F59E0B');
      }
      
      isProcessing = false;
      document.body.classList.remove('processing');
      
      // Continue processing with delay for better performance
      setTimeout(() => requestAnimationFrame(processFrames), 750); // ~1.3 FPS for better performance
    }

    function updateResults(prediction, details, color) {
      resultsDiv.innerHTML = \`
        <div class="prediction" style="color: \${color}">\${prediction}</div>
        <div class="confidence">\${details}</div>
        <div class="timestamp">\${new Date().toLocaleTimeString()}</div>
      \`;
    }

    function updateFPS() {
      frameCount++;
      const now = Date.now();
      if (now - lastFpsUpdate >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
        fpsDiv.textContent = \`\${fps} FPS\`;
        frameCount = 0;
        lastFpsUpdate = now;
      }
    }

    // Initialize everything
    console.log('🚀 Starting WebView TensorFlow.js Waste Scanner...');
    console.log('🌐 TensorFlow.js version:', tf.version.tfjs);
    
    // Start model loading and camera setup in parallel
    Promise.all([
      loadModel(),
      setupCamera()
    ]).then(() => {
      console.log('✅ Initialization complete');
      
      // Start processing when both are ready
      const checkReady = setInterval(() => {
        if (model && video.readyState >= 3 && canvas.width > 0) {
          clearInterval(checkReady);
          console.log('🎬 Starting real-time processing...');
          processFrames();
        }
      }, 100);
    }).catch(error => {
      console.error('❌ Initialization failed:', error);
    });
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
<WebView
  source={{ html: htmlContent }}
  style={styles.webview}
  allowsInlineMediaPlayback={true}
  mediaPlaybackRequiresUserAction={false}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  allowsFullscreenVideo={false}
  startInLoadingState={false}
  scalesPageToFit={false}
  // ✅ Add these camera permission props
  allowsAccessibilitySupport={true}
  allowFileAccess={true}
  allowUniversalAccessFromFileURLs={true}
  mixedContentMode="compatibility"
  // ✅ Handle permission requests
  onPermissionRequest={(request:any) => {
    console.log('📷 Permission requested:', request.nativeEvent);
    request.nativeEvent.grant();
  }}
  onError={(error) => console.log('❌ WebView error:', error.nativeEvent)}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  webview: { 
    flex: 1 
  },
});
