import React from 'react';
import { Mic, Square, RotateCcw } from 'lucide-react';
import { AudioState } from '../types/audio';

interface RecordingStageProps {
  audioState: AudioState;
  audioLevels: number[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  onReset: () => void;
}

export const RecordingStage: React.FC<RecordingStageProps> = ({
  audioState,
  audioLevels,
  onStartRecording,
  onStopRecording,
  onReset
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl animate-pulse" />
      
      <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {audioState.hasRecording ? 'Recording Complete!' : 'Record Your Voice'}
          </h2>
          <p className="text-white/70">
            {audioState.hasRecording 
              ? 'Great! Now choose an effect to transform your voice'
              : 'Click the microphone to start recording your voice'
            }
          </p>
        </div>

        {/* Waveform Visualizer */}
        <div className="relative mb-8">
          <div className="h-32 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl overflow-hidden border border-white/10">
            <div className="h-full flex items-center justify-center gap-1 px-4">
              {audioLevels.map((level, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-t rounded-full transition-all duration-75 ${
                    audioState.isRecording
                      ? 'from-purple-400 via-pink-400 to-blue-400 animate-pulse'
                      : audioState.hasRecording
                      ? 'from-green-400 to-emerald-500'
                      : 'from-gray-500 to-gray-600'
                  }`}
                  style={{
                    width: '3px',
                    height: `${Math.max(4, level * 100)}%`,
                    animationDelay: `${index * 20}ms`,
                  }}
                />
              ))}
            </div>
            
            {/* Overlay Effects */}
            {audioState.isRecording && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse" />
            )}
          </div>

          {/* Recording Timer */}
          {audioState.isRecording && (
            <div className="absolute top-4 right-4 bg-red-500/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-red-500/30">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-300 font-mono text-sm">
                  {formatTime(audioState.recordingDuration)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6">
          {!audioState.hasRecording ? (
            <button
              onClick={audioState.isRecording ? onStopRecording : onStartRecording}
              className={`group relative overflow-hidden rounded-full p-6 transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                audioState.isRecording
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-2xl shadow-red-500/50'
                  : 'bg-gradient-to-r from-purple-500 to-blue-600 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70'
              }`}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Ripple Effect */}
              {audioState.isRecording && (
                <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
              )}
              
              <div className="relative flex items-center space-x-3">
                {audioState.isRecording ? (
                  <>
                    <Square className="w-8 h-8 text-white" />
                    <span className="text-white font-semibold text-lg">Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 text-white" />
                    <span className="text-white font-semibold text-lg">Start Recording</span>
                  </>
                )}
              </div>
            </button>
          ) : (
            <button
              onClick={onReset}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 p-4 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center space-x-2">
                <RotateCcw className="w-6 h-6 text-white" />
                <span className="text-white font-medium">Record Again</span>
              </div>
            </button>
          )}
        </div>

        {/* Status Messages */}
        {audioState.isRecording && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-300 font-medium">Recording in progress...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};