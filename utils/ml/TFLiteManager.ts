// utils/ml/TFLiteManager.ts - API-based classification for your backend
class APITFLiteManager {
  private apiEndpoint = 'https://api.masksandmachetes.com/api/notifications/waste/classify-waste';
  private healthEndpoint = 'https://api.masksandmachetes.com/api/notifications/waste/health';
  private deviceId = 'TEST_ESP32';
  
  private log(message: string, ...args: any[]) {
    console.log(`[TFLiteManager] ${message}`, ...args);
  }

  async initialize(): Promise<boolean> {
    try {
      this.log('🔍 Checking API health...');
      
      const response = await fetch(this.healthEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const health = await response.json();
        this.log('✅ API is healthy:', health);
        return true;
      } else {
        this.log('❌ API health check failed:', response.status);
        return false;
      }
    } catch (error) {
      this.log('❌ API not reachable:', error);
      return false;
    }
  }

  async processImage(imageUri: string): Promise<any[]> {
    try {
      this.log('📤 Uploading image to waste classification API...');
      
      // Create FormData for image upload
      const formData = new FormData();
      
      // Add image file
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'waste.jpg',
      } as any);
      
      // Add device_id
      formData.append('device_id', this.deviceId);

      this.log(`Sending to: ${this.apiEndpoint}`);
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Don't set Content-Type - let fetch set it automatically for FormData
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.log('❌ API error response:', response.status, errorText);
        
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait 10 seconds before trying again.');
        }
        
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      this.log('✅ API response:', result);
      
      // Transform your API response to expected format
      const results = [];
      
      if (result.success && result.all_predictions) {
        // Convert all_predictions to array format
        for (const [label, confidence] of Object.entries(result.all_predictions)) {
          results.push({
            label: label,
            confidence: confidence as number,
            class: this.getClassIndex(label)
          });
        }
        
        // Sort by confidence (highest first)
        results.sort((a, b) => b.confidence - a.confidence);
      } else {
        // Fallback: use main category
        results.push({
          label: result.category || 'unknown',
          confidence: result.confidence || 0,
          class: this.getClassIndex(result.category || 'unknown')
        });
      }
      
      this.log('🗂️ Processed results:', results);
      return results;
      
    } catch (error) {
      this.log('❌ API classification failed:', error);
      throw error;
    }
  }

private getClassIndex(label: string): number {
  const classMap: { [key: string]: number } = {
    'biodegradable': 0,
    'non_biodegradable': 1,
    'toxic': 2
  };
  return classMap[label.toLowerCase()] || 0;
}

getModelClasses(): string[] {
  return ['biodegradable', 'non_biodegradable', 'toxic']; // ✅ Only 3 classes
}

  isReady(): boolean {
    return true; // API is always "ready" if initialized
  }

  hasModel(): boolean {
    return true;
  }


  getModelInfo(): { ready: boolean; classes: string[] } {
    return {
      ready: this.isReady(),
      classes: this.getModelClasses()
    };
  }

  getInitializationError(): string | null {
    return null;
  }

  dispose(): void {
    // Nothing to dispose for API-based implementation
  }
}

export default new APITFLiteManager();
