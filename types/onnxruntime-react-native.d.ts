// types/onnxruntime-react-native.d.ts
declare module 'onnxruntime-react-native' {
  export class InferenceSession {
    static create(uri: string): Promise<InferenceSession>;
    run(feeds: Record<string, Tensor>): Promise<Record<string, Tensor>>;
  }

  export class Tensor {
    constructor(type: string, data: Float32Array | Uint8Array, dims: number[]);
    data: Float32Array | Uint8Array;
    dims: number[];
    type: string;
  }
}
