// types/react-native-fast-tflite.d.ts
declare module 'react-native-fast-tflite' {
  export interface TensorflowModel {
    inputs: Array<{
      name: string;
      shape: number[];
      dataType: string;
    }>;
    outputs: Array<{
      name: string;
      shape: number[];
      dataType: string;
    }>;
    run(inputData: Float32Array): Promise<Float32Array>;
  }

  export function loadTensorflowModel(
    source: any,
    delegate?: 'none' | 'gpu' | 'core-ml' | 'nnapi'
  ): Promise<TensorflowModel>;

  export function useTensorflowModel(
    source: any,
    delegate?: 'none' | 'gpu' | 'core-ml' | 'nnapi'
  ): TensorflowModel | null;
}
