import React from 'react';
import { Mic, Sparkles, Github, Heart } from 'lucide-react';
import { useVoiceChanger } from './hooks/useVoiceChanger';
import { voiceEffects } from './data/voiceEffects';
import { RecordingStage } from './components/RecordingStage';
import { EffectsStage } from './components/EffectsStage';
import { AudioEngine } from './components/AudioEngine';
function App() {
const {
audioState,
currentRecording,
audioLevels,
error,
startRecording,
stopRecording,
applyVoiceEffect,
downloadRecording,
resetRecording
} = useVoiceChanger();
return (
<div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
<div className="absolute inset-0">
<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
</div>
<div className="relative z-10">
<header className="text-center py-12 px-4">
<div className="flex items-center justify-center space-x-4 mb-6">
<div className="relative">
<div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl blur-lg opacity-75 animate-pulse" />
<div className="relative p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl shadow-2xl">
<Mic className="w-10 h-10 text-white" />
</div>
</div>
<div>
<h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
Voice<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Changer</span>
</h1>
<div className="flex items-center justify-center space-x-2">
<span className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Pro</span>
<Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
</div>
</div>
</div>
<p className="text-white/80 text-xl max-w-3xl mx-auto leading-relaxed">
Transform your voice with professional-grade audio effects. Record, process, and download your creations with cutting-edge Web Audio API technology.
</p>
</header>
<div className="max-w-7xl mx-auto px-4 pb-12">
<div className="space-y-12">
{error && (
<div className="relative">
<div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl" />
<div className="relative p-6 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl text-red-300 text-center">
<div className="flex items-center justify-center space-x-2">
<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
<span className="font-medium">{error}</span>
</div>
</div>
</div>
)}
<RecordingStage
audioState={audioState}
audioLevels={audioLevels}
onStartRecording={startRecording}
onStopRecording={stopRecording}
onReset={resetRecording}/>
<EffectsStage
effects={voiceEffects}
audioState={audioState}
currentRecording={currentRecording}
onApplyEffect={applyVoiceEffect}
onDownload={downloadRecording}/>
<AudioEngine />
</div>
</div>}
<footer className="text-center py-8 px-4 border-t border-white/10 mt-12">
<div className="flex items-center justify-center space-x-4 text-white/60 text-sm mb-4">
<span>Made with</span>
<Heart className="w-4 h-4 text-red-400 animate-pulse" />
<span>by</span>
<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-semibold">
Nahom Beletew
</span>
</div>
<div className="flex items-center justify-center space-x-6 text-white/50 text-xs">
<div className="flex items-center space-x-2">
<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
<span>Powered by Web Audio API</span>
</div>
<span>•</span>
<a 
href="https://github.com" 
className="flex items-center space-x-1 hover:text-white/80 transition-colors"
>
<Github className="w-4 h-4" />
<span>Open Source</span>
</a>
</div>
</footer>
</div>
</div>);}
export default App;
