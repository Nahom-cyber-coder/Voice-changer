export interface VoiceEffect {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  settings: {
    pitch?: number;
    formant?: number;
    reverb?: number;
    delay?: number;
    distortion?: number;
    filter?: {
      type: 'lowpass' | 'highpass' | 'bandpass';
      frequency: number;
      Q: number;
    };
  };
}

export interface AudioState {
  isRecording: boolean;
  isProcessing: boolean;
  hasRecording: boolean;
  currentEffect: string | null;
  volume: number;
  recordingDuration: number;
}

export interface RecordingData {
  originalBlob: Blob;
  originalUrl: string;
  processedBlob?: Blob;
  processedUrl?: string;
  duration: number;
  timestamp: number;
}