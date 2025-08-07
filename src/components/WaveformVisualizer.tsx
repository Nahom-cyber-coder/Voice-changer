import React from 'react';
interface WaveformVisualizerProps {
audioLevels: number[];
isActive: boolean;}
export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
audioLevels,
isActive
}) => {return (
<div className="relative w-full h-32 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
<div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
<div className="relative h-full flex items-center justify-center gap-1 px-4">
{audioLevels.map((level, index) => (
<div
key={index}
className={`bg-gradient-to-t from-purple-400 to-blue-400 rounded-full transition-all duration-75 ${
isActive ? 'opacity-100' : 'opacity-30'
}`}
style={{
width: '3px',
height: `${Math.max(4, level * 100)}%`,
transform: `scaleY(${isActive ? 1 : 0.3})`,}}
/>))}
</div>
{!isActive && (
<div className="absolute inset-0 flex items-center justify-center">
<div className="text-white/60 text-sm font-medium">
Click "Start Voice Changer" to see waveform
</div>
</div>
)}{isActive && (
<div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse" />
)}
</div>);
};
