import React from 'react';
import { Play, Pause, Download, Loader, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { VoiceEffect, AudioState, RecordingData } from '../types/audio';

interface EffectsStageProps {
  effects: VoiceEffect[];
  audioState: AudioState;
  currentRecording: RecordingData | null;
  onApplyEffect: (effect: VoiceEffect) => void;
  onDownload: (isProcessed: boolean) => void;
}

export const EffectsStage: React.FC<EffectsStageProps> = ({
  effects,
  audioState,
  currentRecording,
  onApplyEffect,
  onDownload
}) => {
  const [playingAudio, setPlayingAudio] = React.useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState<'original' | 'processed' | null>(null);

  const playAudio = (url: string, type: 'original' | 'processed') => {
    // Stop any currently playing audio
    if (playingAudio) {
      playingAudio.pause();
      playingAudio.currentTime = 0;
      setPlayingAudio(null);
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    }

    // If clicking the same audio that was playing, just stop
    if (currentlyPlaying === type && isPlaying) {
      return;
    }

    const audio = new Audio(url);
    audio.onended = () => {
      setIsPlaying(false);
      setPlayingAudio(null);
      setCurrentlyPlaying(null);
    };
    
    audio.onerror = () => {
      console.error('Error playing audio');
      setIsPlaying(false);
      setPlayingAudio(null);
      setCurrentlyPlaying(null);
    };
    
    audio.play().then(() => {
      setPlayingAudio(audio);
      setIsPlaying(true);
      setCurrentlyPlaying(type);
    }).catch(err => {
      console.error('Failed to play audio:', err);
    });
  };

  const stopAudio = () => {
    if (playingAudio) {
      playingAudio.pause();
      playingAudio.currentTime = 0;
      setPlayingAudio(null);
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    }
  };

  if (!audioState.hasRecording) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Playback Controls */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl" />
        
        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
          <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span>Preview & Download</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Original Audio */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Original Recording</span>
              </h4>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => playAudio(currentRecording!.originalUrl, 'original')}
                  disabled={!currentRecording}
                  className={`p-3 rounded-full transition-all duration-200 transform hover:scale-105 ${
                    currentlyPlaying === 'original' && isPlaying
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500'
                  }`}
                >
                  {currentlyPlaying === 'original' && isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>
                
                <button
                  onClick={() => onDownload(false)}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                
                <span className="text-white/70 text-sm">
                  {Math.round(currentRecording!.duration)}s
                </span>
                
                {currentlyPlaying === 'original' && isPlaying && (
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 text-xs">Playing</span>
                  </div>
                )}
              </div>
            </div>

            {/* Processed Audio */}
            <div className={`rounded-2xl p-4 border transition-all duration-300 ${
              currentRecording?.processedUrl 
                ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20' 
                : 'bg-white/5 border-white/10 opacity-50'
            }`}>
              <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentRecording?.processedUrl ? 'bg-purple-400' : 'bg-gray-400'
                }`}></div>
                <span>Transformed Voice</span>
              </h4>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => currentRecording?.processedUrl && playAudio(currentRecording.processedUrl, 'processed')}
                  disabled={!currentRecording?.processedUrl}
                  className={`p-3 rounded-full transition-all duration-200 transform hover:scale-105 ${
                    currentRecording?.processedUrl
                      ? currentlyPlaying === 'processed' && isPlaying
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {currentlyPlaying === 'processed' && isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>
                
                <button
                  onClick={() => onDownload(true)}
                  disabled={!currentRecording?.processedUrl}
                  className={`p-3 rounded-full transition-all duration-200 transform hover:scale-105 ${
                    currentRecording?.processedUrl
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                
                <span className="text-white/70 text-sm">
                  {currentRecording?.processedUrl ? `${Math.round(currentRecording.duration)}s` : 'No effect applied'}
                </span>
                
                {currentlyPlaying === 'processed' && isPlaying && (
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-400 text-xs">Playing</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Effects Grid */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl" />
        
        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Voice Effect</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {effects.map((effect) => {
              const IconComponent = (LucideIcons as any)[effect.icon];
              const isActive = audioState.currentEffect === effect.id;
              const isProcessing = audioState.isProcessing;
              
              return (
                <button
                  key={effect.id}
                  onClick={() => onApplyEffect(effect)}
                  disabled={isProcessing}
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    isActive
                      ? `bg-gradient-to-br ${effect.color} shadow-2xl`
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                  } ${
                    isProcessing ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer'
                  }`}
                >
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${effect.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  {/* Processing Overlay */}
                  {isProcessing && audioState.currentEffect === effect.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  
                  <div className="relative flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/30 group-hover:to-blue-500/30'
                    }`}>
                      <IconComponent 
                        className={`w-6 h-6 ${
                          isActive ? 'text-white' : 'text-purple-300'
                        }`} 
                      />
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold text-sm ${
                        isActive ? 'text-white' : 'text-white/90'
                      }`}>
                        {effect.name}
                      </h4>
                      <p className={`text-xs mt-1 ${
                        isActive ? 'text-white/80' : 'text-white/60'
                      }`}>
                        {effect.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Processing Status */}
          {audioState.isProcessing && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/30">
                <Loader className="w-4 h-4 text-purple-300 animate-spin" />
                <span className="text-purple-300 font-medium">Processing your voice...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};