import React from 'react';
import { Download, Play, Pause, Trash2 } from 'lucide-react';
import { RecordingData } from '../types/audio';
interface RecordingsListProps {
recordings: RecordingData[];
onDownload: (recording: RecordingData) => void;
onDelete: (index: number) => void;
}export const RecordingsList: React.FC<RecordingsListProps> = ({
recordings,
onDownload,
onDelete
}) => {const [playingIndex, setPlayingIndex] = React.useState<number | null>(null);
const handlePlay = (recording: RecordingData, index: number) => {
if (playingIndex === index) {
setPlayingIndex(null);
return;
}const audio = new Audio(recording.url);
audio.onended = () => setPlayingIndex(null);
audio.play();
setPlayingIndex(index);
};
if (recordings.length === 0) {
return (
<div className="text-center py-8">
<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
<Download className="w-8 h-8 text-purple-300" />
</div>
<h3 className="text-white/90 font-medium mb-2">No recordings yet</h3>
<p className="text-white/60 text-sm">Start recording to save your voice transformations</p>
</div>
);
}
return (
<div className="space-y-3">
<h3 className="text-white/90 font-semibold mb-4">Your Recordings</h3>
{recordings.map((recording, index) => (
<div key={recording.timestamp}
className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
<div className="flex items-center space-x-3">
<button
onClick={() => handlePlay(recording, index)}
className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-200">
{playingIndex === index ? (
<Pause className="w-4 h-4 text-white" />
):(
<Play className="w-4 h-4 text-white" />
)}
</button>
<div>
<div className="text-white/90 text-sm font-medium">
Recording #{recordings.length - index}
</div>
<div className="text-white/60 text-xs">
{new Date(recording.timestamp).toLocaleString()}
</div>
</div>
</div><div className="flex items-center space-x-2">
<button
onClick={() => onDownload(recording)}
className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
title="Download recording">
<Download className="w-4 h-4 text-white/70 group-hover:text-green-400" />
</button>
<button
onClick={() => onDelete(index)}
className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
title="Delete recording"
><Trash2 className="w-4 h-4 text-white/70 group-hover:text-red-400" />
</button>
</div>
</div>
))}
</div>
);
};
