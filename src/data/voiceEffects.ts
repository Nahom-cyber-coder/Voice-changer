import { VoiceEffect } from '../types/audio';

export const voiceEffects: VoiceEffect[] = [
  {
    id: 'robot',
    name: 'Robot',
    icon: 'Bot',
    description: 'Mechanical robotic voice with digital distortion',
    color: 'from-cyan-400 to-blue-600',
    settings: {
      pitch: 0.8,
      distortion: 0.6,
      filter: {
        type: 'bandpass',
        frequency: 1000,
        Q: 10
      }
    }
  },
  {
    id: 'chipmunk',
    name: 'Chipmunk',
    icon: 'Smile',
    description: 'High-pitched squeaky voice effect',
    color: 'from-yellow-400 to-orange-500',
    settings: {
      pitch: 1.8,
      formant: 1.4
    }
  },
  {
    id: 'deep',
    name: 'Deep Voice',
    icon: 'Volume2',
    description: 'Lower pitch for a deeper, more dramatic voice',
    color: 'from-red-500 to-pink-600',
    settings: {
      pitch: 0.6,
      formant: 0.8,
      filter: {
        type: 'lowpass',
        frequency: 2000,
        Q: 1
      }
    }
  },
  {
    id: 'alien',
    name: 'Alien',
    icon: 'Zap',
    description: 'Otherworldly voice with modulation effects',
    color: 'from-green-400 to-emerald-600',
    settings: {
      pitch: 1.2,
      distortion: 0.4,
      delay: 0.1,
      filter: {
        type: 'highpass',
        frequency: 800,
        Q: 5
      }
    }
  },
  {
    id: 'echo',
    name: 'Echo',
    icon: 'Radio',
    description: 'Spacious echo effect with natural reverb',
    color: 'from-purple-400 to-indigo-600',
    settings: {
      delay: 0.3,
      reverb: 0.7
    }
  },
  {
    id: 'phone',
    name: 'Phone Call',
    icon: 'Phone',
    description: 'Vintage telephone call simulation',
    color: 'from-gray-400 to-slate-600',
    settings: {
      filter: {
        type: 'bandpass',
        frequency: 1500,
        Q: 2
      },
      distortion: 0.2
    }
  },
  {
    id: 'monster',
    name: 'Monster',
    icon: 'Skull',
    description: 'Scary monster voice with heavy distortion',
    color: 'from-red-600 to-black',
    settings: {
      pitch: 0.4,
      distortion: 0.8,
      filter: {
        type: 'lowpass',
        frequency: 800,
        Q: 3
      }
    }
  },
  {
    id: 'helium',
    name: 'Helium',
    icon: 'Wind',
    description: 'Light and airy helium balloon effect',
    color: 'from-pink-300 to-rose-400',
    settings: {
      pitch: 2.2,
      formant: 1.6
    }
  }
];