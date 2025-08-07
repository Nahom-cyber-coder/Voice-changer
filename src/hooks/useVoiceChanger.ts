import { useCallback, useRef, useState, useEffect } from 'react';
import { VoiceEffect, AudioState, RecordingData } from '../types/audio';

export const useVoiceChanger = () => {
const [audioState, setAudioState] = useState<AudioState>({
isRecording: false,
isProcessing: false,
hasRecording: false,
currentEffect: null,
volume: 0.8,
recordingDuration: 0,});
const [currentRecording, setCurrentRecording] = useState<RecordingData | null>(null);
const [audioLevels, setAudioLevels] = useState<number[]>(new Array(64).fill(0));
const [error, setError] = useState<string | null>(null);
const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const streamRef = useRef<MediaStream | null>(null);
const audioContextRef = useRef<AudioContext | null>(null);
const analyserRef = useRef<AnalyserNode | null>(null);
const animationFrameRef = useRef<number>();
const recordingStartTimeRef = useRef<number>(0);
const durationIntervalRef = useRef<NodeJS.Timeout>();
const initializeAudioContext = useCallback(async () => {
try {
const stream = await navigator.mediaDevices.getUserMedia({ 
audio: {
echoCancellation: false,
noiseSuppression: false,
autoGainControl: false,
sampleRate: 44100
}
});streamRef.current = stream;
audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
const source = audioContextRef.current.createMediaStreamSource(stream);
analyserRef.current = audioContextRef.current.createAnalyser();
analyserRef.current.fftSize = 256;
analyserRef.current.smoothingTimeConstant = 0.8;
source.connect(analyserRef.current);
return true;
} catch (err) {
setError('Failed to access microphone. Please check permissions.');
return false;}
}, []);
const startAudioLevelMonitoring = useCallback(() => {
const updateLevels = () => {
if (!analyserRef.current) return;
const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
analyserRef.current.getByteFrequencyData(dataArray);
const levels = Array.from(dataArray.slice(0, 64)).map(value => value / 255);
setAudioLevels(levels);
if (audioState.isRecording) {
animationFrameRef.current = requestAnimationFrame(updateLevels);}
};
updateLevels();
}, [audioState.isRecording]);
const startRecording = useCallback(async () => {
setError(null);
const initialized = await initializeAudioContext();
if (!initialized || !streamRef.current) return;
try {const mediaRecorder = new MediaRecorder(streamRef.current, {
mimeType: 'audio/webm;codecs=opus'
});
const chunks: Blob[] = [];
mediaRecorder.ondataavailable = (event) => {
if (event.data.size > 0) {
chunks.push(event.data);}
};
mediaRecorder.onstop = () => {
const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
const url = URL.createObjectURL(blob);
const duration = (Date.now() - recordingStartTimeRef.current) / 1000;
const recording: RecordingData = {
originalBlob: blob,
originalUrl: url,
duration,
timestamp: Date.now()};
setCurrentRecording(recording);
setAudioState(prev => ({ 
...prev, 
isRecording: false, 
hasRecording: true,
recordingDuration: 0
}));
if (durationIntervalRef.current) {
clearInterval(durationIntervalRef.current);}};
mediaRecorder.start();
mediaRecorderRef.current = mediaRecorder;
recordingStartTimeRef.current = Date.now();
setAudioState(prev => ({ ...prev, isRecording: true }));
startAudioLevelMonitoring();
durationIntervalRef.current = setInterval(() => {
const elapsed = (Date.now() - recordingStartTimeRef.current) / 1000;
setAudioState(prev => ({ ...prev, recordingDuration: elapsed }));
}, 100);
} catch (err) {
setError('Failed to start recording');
console.error('Recording error:', err);}
}, [initializeAudioContext, startAudioLevelMonitoring]);
const stopRecording = useCallback(() => {
if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
mediaRecorderRef.current.stop();
mediaRecorderRef.current = null;
}
if (animationFrameRef.current) {
cancelAnimationFrame(animationFrameRef.current);}
if (durationIntervalRef.current) {
clearInterval(durationIntervalRef.current);}
if (streamRef.current) {
streamRef.current.getTracks().forEach(track => track.stop());}
setAudioLevels(new Array(64).fill(0));}, []);
const applyVoiceEffect = useCallback(async (effect: VoiceEffect) => {
if (!currentRecording) return;
setAudioState(prev => ({ ...prev, isProcessing: true }));
try {const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
const arrayBuffer = await currentRecording.originalBlob.arrayBuffer();
const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
const pitchRatio = effect.settings.pitch || 1;
const newSampleRate = audioBuffer.sampleRate;
const newLength = Math.floor(audioBuffer.length / pitchRatio);
const offlineContext = new OfflineAudioContext(
audioBuffer.numberOfChannels,
audioBuffer.length,
newSampleRate
);const source = offlineContext.createBufferSource();
source.buffer = audioBuffer;
if (effect.settings.pitch && effect.settings.pitch !== 1) {
source.playbackRate.value = effect.settings.pitch;}
let currentNode: AudioNode = source;
if (effect.settings.filter) {
const filter = offlineContext.createBiquadFilter();
filter.type = effect.settings.filter.type;
filter.frequency.value = effect.settings.filter.frequency;
filter.Q.value = effect.settings.filter.Q;
currentNode.connect(filter);
currentNode = filter;}
if (effect.settings.distortion) {
const waveshaper = offlineContext.createWaveShaper();
const samples = 44100;
const curve = new Float32Array(samples);
const deg = Math.PI / 180;
const amount = effect.settings.distortion * 50;
for (let i = 0; i < samples; i++) {
const x = (i * 2) / samples - 1;
curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));}
waveshaper.curve = curve;
waveshaper.oversample = '4x';
currentNode.connect(waveshaper);
currentNode = waveshaper;}
if (effect.settings.delay) {
const delay = offlineContext.createDelay(1);
const feedback = offlineContext.createGain();
const delayGain = offlineContext.createGain();
const dryGain = offlineContext.createGain();
delay.delayTime.value = effect.settings.delay;
feedback.gain.value = 0.4;
delayGain.gain.value = 0.5;
dryGain.gain.value = 0.7;
currentNode.connect(dryGain);
currentNode.connect(delay);
delay.connect(feedback);
feedback.connect(delay);
delay.connect(delayGain);
const mixer = offlineContext.createGain();
dryGain.connect(mixer);
delayGain.connect(mixer);
currentNode = mixer;}
if (effect.settings.reverb) {
const convolver = offlineContext.createConvolver();
const reverbGain = offlineContext.createGain();
const dryGain = offlineContext.createGain();
const impulseLength = offlineContext.sampleRate * 2;
const impulse = offlineContext.createBuffer(2, impulseLength, offlineContext.sampleRate);
for (let channel = 0; channel < 2; channel++) {
const channelData = impulse.getChannelData(channel);
for (let i = 0; i < impulseLength; i++) {
const decay = Math.pow(1 - i / impulseLength, 2);
channelData[i] = (Math.random() * 2 - 1) * decay * effect.settings.reverb;}
}
convolver.buffer = impulse;
reverbGain.gain.value = effect.settings.reverb;
dryGain.gain.value = 1 - effect.settings.reverb;
const mixer = offlineContext.createGain();
currentNode.connect(dryGain);
currentNode.connect(convolver);
convolver.connect(reverbGain);
dryGain.connect(mixer);
reverbGain.connect(mixer);
currentNode = mixer;}
currentNode.connect(offlineContext.destination);
source.start();
const processedBuffer = await offlineContext.startRendering();
const processedBlob = audioBufferToWav(processedBuffer);
const processedUrl = URL.createObjectURL(processedBlob);
setCurrentRecording(prev => prev ? {...prev,
processedBlob,
processedUrl
} : null);
setAudioState(prev => ({ ...prev, 
isProcessing: false, 
currentEffect: effect.id 
}));
} catch (err) {
setError('Failed to process audio. Please try again.');
setAudioState(prev => ({ ...prev, isProcessing: false }));
console.error('Processing error:', err);}}, [currentRecording]);
const audioBufferToWav = (buffer: AudioBuffer): Blob => {
const numberOfChannels = buffer.numberOfChannels;
const sampleRate = buffer.sampleRate;
const format = 1; 
const bitDepth = 16;
const bytesPerSample = bitDepth / 8;
const blockAlign = numberOfChannels * bytesPerSample;
const byteRate = sampleRate * blockAlign;
const dataSize = buffer.length * blockAlign;
const bufferSize = 44 + dataSize;
const arrayBuffer = new ArrayBuffer(bufferSize);
const view = new DataView(arrayBuffer);
const writeString = (offset: number, string: string) => {
for (let i = 0; i < string.length; i++) {
view.setUint8(offset + i, string.charCodeAt(i));}
};
writeString(0, 'RIFF');
view.setUint32(4, bufferSize - 8, true);
writeString(8, 'WAVE');
writeString(12, 'fmt ');
view.setUint32(16, 16, true);
view.setUint16(20, format, true);
view.setUint16(22, numberOfChannels, true);
view.setUint32(24, sampleRate, true);
view.setUint32(28, byteRate, true);
view.setUint16(32, blockAlign, true);
view.setUint16(34, bitDepth, true);
writeString(36, 'data');
view.setUint32(40, dataSize, true);
let offset = 44;
for (let i = 0; i < buffer.length; i++) {
for (let channel = 0; channel < numberOfChannels; channel++) {
const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
view.setInt16(offset, intSample, true);
offset += 2;}}
return new Blob([arrayBuffer], { type: 'audio/wav' });
};
const downloadRecording = useCallback((isProcessed: boolean = false) => {
if (!currentRecording) return;
const blob = isProcessed && currentRecording.processedBlob 
? currentRecording.processedBlob 
: currentRecording.originalBlob;
const url = isProcessed && currentRecording.processedUrl 
? currentRecording.processedUrl 
: currentRecording.originalUrl;
const a = document.createElement('a');
a.href = url;
a.download = `voice-recording-${isProcessed ? 'processed' : 'original'}-${Date.now()}.${isProcessed ? 'wav' : 'webm'}`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
}, [currentRecording]);
const resetRecording = useCallback(() => {
if (currentRecording) {
URL.revokeObjectURL(currentRecording.originalUrl);
if (currentRecording.processedUrl) {
URL.revokeObjectURL(currentRecording.processedUrl);}}
setCurrentRecording(null);
setAudioState(prev => ({ ...prev, 
hasRecording: false, 
currentEffect: null,
recordingDuration: 0
}));
}, [currentRecording]);
useEffect(() => {
return () => {
if (animationFrameRef.current) {
cancelAnimationFrame(animationFrameRef.current);}
if (durationIntervalRef.current) {
clearInterval(durationIntervalRef.current);}
if (streamRef.current) {
streamRef.current.getTracks().forEach(track => track.stop());}
if (audioContextRef.current) {
audioContextRef.current.close();}};}, []);
return {
audioState,
currentRecording,
audioLevels,
error,
startRecording,
stopRecording,
applyVoiceEffect,
downloadRecording,
resetRecording};
};
