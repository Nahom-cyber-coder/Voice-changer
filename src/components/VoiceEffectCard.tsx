import React from 'react';
import * as LucideIcons from 'lucide-react';
import { VoiceEffect } from '../types/audio';
interface VoiceEffectCardProps {
effect: VoiceEffect;
isActive: boolean;
isDisabled: boolean;
onClick: () => void;
}export const VoiceEffectCard: React.FC<VoiceEffectCardProps> = ({
effect,
isActive,
isDisabled,
onClick
}) => {
const IconComponent = (LucideIcons as any)[effect.icon];
return (
<button
onClick={onClick}
disabled={isDisabled}
className={`group relative p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
isActive
? 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-xl shadow-purple-500/25'
: 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
} ${
isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer'
}`}
>
<div className="flex flex-col items-center text-center space-y-3">
<div className={`p-3 rounded-xl ${
isActive 
? 'bg-white/20' 
: 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/30 group-hover:to-blue-500/30'
} transition-all duration-300`}>
<IconComponent 
className={`w-6 h-6 ${
isActive ? 'text-white' : 'text-purple-300'
}`} 
/>
</div>
<div>
<h3 className={`font-semibold text-sm ${
isActive ? 'text-white' : 'text-white/90'
}`}>
{effect.name}
</h3>
<p className={`text-xs mt-1 ${
isActive ? 'text-white/80' : 'text-white/60'}`}>
{effect.description}
</p>
</div>
</div>{isActive && (
<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 to-blue-400/20 animate-pulse" />)}
</button>);
};
