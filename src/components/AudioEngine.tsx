import React from 'react';
import { Cpu, Zap, Settings, Waves } from 'lucide-react';
export const AudioEngine: React.FC = () => {
return (
<div className="relative">
<div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
<div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
<div className="text-center mb-6">
<div className="flex items-center justify-center space-x-3 mb-4">
<div className="p-3 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl">
<Cpu className="w-8 h-8 text-white" />
</div>
<h3 className="text-2xl font-bold text-white">Audio Processing Engine</h3>
</div>
<p className="text-white/70">
Powered by advanced Web Audio API technology
</p>
</div>
<div className="grid md:grid-cols-3 gap-6">
<div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
<div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl w-fit mx-auto mb-3">
<Waves className="w-6 h-6 text-purple-300" />
</div>
<h4 className="text-white font-semibold mb-2">Real-time Processing</h4>
<p className="text-white/60 text-sm">
Advanced DSP algorithms for instant voice transformation
</p>
</div>
<div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
<div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl w-fit mx-auto mb-3">
<Zap className="w-6 h-6 text-green-300" />
</div>
<h4 className="text-white font-semibold mb-2">High Performance</h4>
<p className="text-white/60 text-sm">
Optimized for low latency and crystal clear audio quality
</p>
</div>
<div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
<div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl w-fit mx-auto mb-3">
<Settings className="w-6 h-6 text-orange-300" />
</div>
<h4 className="text-white font-semibold mb-2">Advanced Effects</h4>
<p className="text-white/60 text-sm">
Pitch shifting, filtering, distortion, and reverb processing
</p>
</div>
</div>
<div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-2xl border border-indigo-500/20">
<h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
<Cpu className="w-4 h-4" />
<span>Technical Specifications</span>
</h4>
<div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
<div>
<strong className="text-white/90">Sample Rate:</strong> 44.1 kHz
</div>
<div>
<strong className="text-white/90">Bit Depth:</strong> 16-bit
</div>
<div>
<strong className="text-white/90">Processing:</strong> Real-time DSP
</div>
<div>
<strong className="text-white/90">Latency:</strong> &lt; 10ms
</div>
</div>
</div>
</div>
</div>);
};
