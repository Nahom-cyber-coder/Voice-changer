import { useCallback, useRef, useState, useEffect } from 'react';
import { VoiceEffect, AudioState, RecordingData } from '../types/audio';
export const useAudioProcessor = () => {
const [audioState, setAudioState] = useState<AudioState>({
isListening: false,
isRecording: false,
isPlaying: false,
currentEffect: 'original',
volume: 0.8,
pitch: 1.0,
formant: 1.0,
});const [recordings, setRecordings] = useState<RecordingData[]>([]);
const [audioLevels, setAudioLevels] = useState<number[]>(new Array(50).fill(0));
const [error, setError] = useState<string | null>(null);
const audioContextRef = useRef<AudioContext | null>(null);
const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
const destinationNodeRef = useRef<MediaStreamAudioDestinationNode | null>(null);
const analyserNodeRef = useRef<AnalyserNode | null>(null);
const gainNodeRef = useRef<GainNode | null>(null);
const pitchShifterRef = useRef<ScriptProcessorNode | null>(null);
const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const streamRef = useRef<MediaStream | null>(null);
const animationFrameRef = useRef<number>();
const initializeAudio = useCallback(async () => {
try {setError(null);
const stream = await navigator.mediaDevices.getUserMedia({ 
audio: {echoCancellation: false,
noiseSuppression: false,
autoGainControl: false,
sampleRate: 44100
}});
streamRef.current = stream;
audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
const audioContext = audioContextRef.current;
sourceNodeRef.current = audioContext.createMediaStreamSource(stream);
destinationNodeRef.current = audioContext.createMediaStreamDestination();
analyserNodeRef.current = audioContext.createAnalyser();
gainNodeRef.current = audioContext.createGain();
analyserNodeRef.current.fftSize = 256;
analyserNodeRef.current.smoothingTimeConstant = 0.8;
sourceNodeRef.current.connect(analyserNodeRef.current);
analyserNodeRef.current.connect(gainNodeRef.current);
gainNodeRef.current.connect(destinationNodeRef.current);
startAudioLevelMonitoring();
setAudioState(prev => ({ ...prev, isListening: true }));
return true;
} catch (err) {
setError('Failed to access microphone. Please check permissions.');
console.error('Audio initialization error:', err);
return false;
}}, []);
const startAudioLevelMonitoring = useCallback(() => {
const updateAudioLevels = () => {
if (!analyserNodeRef.current) return;
const dataArray = new Uint8Array(analyserNodeRef.current.frequencyBinCount);
analyserNodeRef.current.getByteFrequencyData(dataArray);
const levels = Array.from(dataArray.slice(0, 50)).map(value => value / 255);
setAudioLevels(levels);
animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
};updateAudioLevels();
}, []);
const applyVoiceEffect = useCallback((effect: VoiceEffect) => {
if (!audioContextRef.current || !sourceNodeRef.current || !destinationNodeRef.current) return;
const audioContext = audioContextRef.current;
sourceNodeRef.current.disconnect();
if (pitchShifterRef.current) {
pitchShifterRef.current.disconnect();
pitchShifterRef.current = null;}
let currentNode: AudioNode = sourceNodeRef.current;
if (effect.settings.pitch && effect.settings.pitch !== 1) {
const pitchShifter = audioContext.createScriptProcessor(4096, 1, 1);
const pitchRatio = effect.settings.pitch;
pitchShifter.onaudioprocess = (e) => {
const inputBuffer = e.inputBuffer.getChannelData(0);
const outputBuffer = e.outputBuffer.getChannelData(0);
for (let i = 0; i < outputBuffer.length; i++) {
const sampleIndex = Math.floor(i / pitchRatio);
outputBuffer[i] = sampleIndex < inputBuffer.length ? inputBuffer[sampleIndex] : 0;}};
currentNode.connect(pitchShifter);
currentNode = pitchShifter;
pitchShifterRef.current = pitchShifter;}
if (effect.settings.filter) {
const filter = audioContext.createBiquadFilter();
filter.type = effect.settings.filter.type;
filter.frequency.value = effect.settings.filter.frequency;
filter.Q.value = effect.settings.filter.Q;
currentNode.connect(filter);
currentNode = filter;}
if (effect.settings.distortion) {
const waveshaper = audioContext.createWaveShaper();
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
const delay = audioContext.createDelay();
const feedback = audioContext.createGain();
const delayGain = audioContext.createGain();
delay.delayTime.value = effect.settings.delay;
feedback.gain.value = 0.3;
delayGain.gain.value = 0.3;
currentNode.connect(delay);
currentNode.connect(delayGain);
delay.connect(feedback);
feedback.connect(delay);
delay.connect(delayGain);
currentNode = delayGain;}
currentNode.connect(analyserNodeRef.current!);
analyserNodeRef.current!.connect(gainNodeRef.current!);
gainNodeRef.current!.connect(destinationNodeRef.current);
setAudioState(prev => ({ ...prev, currentEffect: effect.id }));
}, []);
const startRecording = useCallback(() => {
if (!destinationNodeRef.current) return;
try {const mediaRecorder = new MediaRecorder(destinationNodeRef.current.stream, {
mimeType: 'audio/webm;codecs=opus'
});
const chunks: Blob[] = [];
mediaRecorder.ondataavailable = (event) => {
if (event.data.size > 0) {
chunks.push(event.data);}};
mediaRecorder.onstop = () => {
const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
const url = URL.createObjectURL(blob);
const recording: RecordingData = {
blob,
url,
duration: 0,
timestamp: Date.now()
};
setRecordings(prev => [recording, ...prev]);
};
mediaRecorder.start();
mediaRecorderRef.current = mediaRecorder;
setAudioState(prev => ({ ...prev, isRecording: true }));
} catch (err) {
setError('Failed to start recording');
console.error('Recording error:', err);}
}, []);
const stopRecording = useCallback(() => {
if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
mediaRecorderRef.current.stop();
mediaRecorderRef.current = null;
setAudioState(prev => ({ ...prev, isRecording: false }));}
}, []);
const downloadRecording = useCallback((recording: RecordingData) => {
const a = document.createElement('a');
a.href = recording.url;
a.download = `voice-recording-${new Date(recording.timestamp).toISOString()}.webm`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
}, []);
const setVolume = useCallback((volume: number) => {
if (gainNodeRef.current) {
gainNodeRef.current.gain.value = volume;}
setAudioState(prev => ({ ...prev, volume }));
}, []);
const cleanup = useCallback(() => {
if (animationFrameRef.current) {
cancelAnimationFrame(animationFrameRef.current);}
if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
mediaRecorderRef.current.stop();}
if (streamRef.current) {
streamRef.current.getTracks().forEach(track => track.stop());}
if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
audioContextRef.current.close();}
setAudioState(prev => ({ ...prev, isListening: false, isRecording: false }));
}, []);
useEffect(() => {
return cleanup;
}, [cleanup]);
return {
audioState,
recordings,
audioLevels,
error,
initializeAudio,
applyVoiceEffect,
startRecording,
stopRecording,
downloadRecording,
setVolume,
cleanup};
};
