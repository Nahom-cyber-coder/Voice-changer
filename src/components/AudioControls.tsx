import React from 'react';
import { Mic, MicOff, Square, Circle, Volume2, Settings } from 'lucide-react';
import { AudioState } from '../types/audio';
interface AudioControlsProps {
audioState: AudioState;
onToggleListening: () => void;
onStartRecording: () => void;
onStopRecording: () => void;
onVolumeChange: (volume: number) => void;}
export const AudioControls: React.FC<AudioControlsProps> = ({
audioState,
onToggleListening,
onStartRecording,
onStopRecording,
onVolumeChange
}) => {
return (
<div className="flex flex-col space-y-6">
<div className="flex items-center justify-center space-x-4">
<button
onClick={onToggleListening}
className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
audioState.isListening
? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25'
: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25'
}`}
>
{audioState.isListening ? (
<>
<MicOff className="w-5 h-5" />
<span>Stop Voice Changer</span>
</>
) : (
<>
<Mic className="w-5 h-5" />
<span>Start Voice Changer</span>
</>
)}
</button>

{audioState.isListening && (
<button
onClick={audioState.isRecording ? onStopRecording : onStartRecording}
className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
audioState.isRecording
? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
: 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
}`}
>
{audioState.isRecording ? (
<>
<Square className="w-4 h-4" />
<span>Stop Recording</span>
</>
) :
(<>
<Circle className="w-4 h-4" />
<span>Record</span>
</>)
}
</button>)}
</div>
{audioState.isListening && (
<div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
<Volume2 className="w-5 h-5 text-white/70" />
<div className="flex-1">
<input
type="range"
min="0"
max="1"
step="0.1"
value={audioState.volume}
onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
/>
</div>
<span className="text-white/70 text-sm min-w-[3rem]">
{Math.round(audioState.volume * 100)}%
</span>
</div>)}
{audioState.isRecording && (
<div className="flex items-center justify-center space-x-2 p-3 bg-red-500/20 rounded-xl border border-red-500/30">
<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
<span className="text-red-300 text-sm font-medium">Recording in progress...</span>
</div>)}
</div>);};
