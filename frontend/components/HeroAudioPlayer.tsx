'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Languages,
  Sparkles,
  Radio,
  Sliders,
} from 'lucide-react';
import { Hero } from '../lib/types';

interface HeroAudioPlayerProps {
  hero: Hero;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', label: 'English (Indian Accent)', lang: 'en', flag: '🇮🇳' },
  { code: 'hi-IN', label: 'Hindi (हिंदी)', lang: 'hi', flag: '🇮🇳' },
  { code: 'bn-IN', label: 'Bengali (বাংলা)', lang: 'bn', flag: '🇮🇳' },
  { code: 'ta-IN', label: 'Tamil (தமிழ்)', lang: 'ta', flag: '🇮🇳' },
  { code: 'te-IN', label: 'Telugu (తెలుగు)', lang: 'te', flag: '🇮🇳' },
  { code: 'mr-IN', label: 'Marathi (मराठी)', lang: 'mr', flag: '🇮🇳' },
  { code: 'gu-IN', label: 'Gujarati (ગુજરાતી)', lang: 'gu', flag: '🇮🇳' },
  { code: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)', lang: 'kn', flag: '🇮🇳' },
];

export default function HeroAudioPlayer({ hero }: HeroAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeVoiceName, setActiveVoiceName] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textToReadRef = useRef<string>('');

  // Prepare full narration script
  useEffect(() => {
    const lifespan =
      hero.birth_year && hero.death_year
        ? `lived from ${hero.birth_year} to ${hero.death_year}`
        : hero.era || 'a historical era';

    const contribsSummary =
      hero.contributions && hero.contributions.length > 0
        ? hero.contributions
            .map((c, i) => `Achievement ${i + 1}: ${c.title}. ${c.description}`)
            .join(' ')
        : '';

    const script = `National hero narration: ${hero.name}. ${
      hero.name_local ? `In native script, ${hero.name_local}.` : ''
    } From ${hero.state}. Domain: ${hero.primary_domain}. Timeline: ${lifespan}. Tagline: ${
      hero.tagline
    }. Biography: ${hero.short_bio}. Key Contributions: ${contribsSummary}. Historical Significance: ${
      hero.is_unsung_reason
    }.`;

    textToReadRef.current = script;
  }, [hero]);

  // Load available system voices
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update active voice when language changes
  useEffect(() => {
    const prefix = selectedLang.split('-')[0];
    const match =
      availableVoices.find((v) => v.lang.toLowerCase() === selectedLang.toLowerCase()) ||
      availableVoices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
      availableVoices.find((v) => v.lang.toLowerCase().includes('in')) ||
      availableVoices[0];

    if (match) {
      setActiveVoiceName(match.name);
    }
  }, [selectedLang, availableVoices]);

  // Handle Play / Resume / Pause
  const handlePlayPause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Start fresh playback
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToReadRef.current);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;
    utterance.volume = isMuted ? 0 : 1.0;

    // Pick best matching voice
    const prefix = selectedLang.split('-')[0];
    const voice =
      availableVoices.find((v) => v.lang.toLowerCase() === selectedLang.toLowerCase()) ||
      availableVoices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
      availableVoices.find((v) => v.lang.toLowerCase().includes('in')) ||
      availableVoices[0];

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = selectedLang;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setProgressPercent(10);
    };

    utterance.onboundary = (event) => {
      if (textToReadRef.current.length > 0) {
        const charIndex = event.charIndex;
        const totalChars = textToReadRef.current.length;
        const pct = Math.min(100, Math.round((charIndex / totalChars) * 100));
        setProgressPercent(pct);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgressPercent(100);
      setTimeout(() => setProgressPercent(0), 1500);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis notice:', e);
      setIsPlaying(false);
      setIsPaused(false);
      setProgressPercent(0);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setProgressPercent(0);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      handleStop();
      setTimeout(handlePlayPause, 100);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-saffron-950/20 border border-saffron-500/30 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-saffron-500/15 border border-saffron-500/30 flex items-center justify-center text-saffron-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-cinematic text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Oral History Narration</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
                MULTILINGUAL TTS
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Listen to the complete heroic story in your chosen Indic voice.
            </p>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-saffron-400" />
          <select
            value={selectedLang}
            onChange={(e) => {
              setSelectedLang(e.target.value);
              if (isPlaying) {
                handleStop();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-saffron-500 transition-all font-medium"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-950 text-white">
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Playback Controls & Progress */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        {/* Main Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePlayPause}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              isPlaying && !isPaused
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-saffron-500 hover:bg-saffron-400 text-slate-950 shadow-saffron-500/20'
            }`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Narration</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isPaused ? 'Resume Story' : 'Listen to Story'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-all disabled:opacity-40"
            title="Reset playback"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Presets */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-[11px] font-mono text-slate-300">
            {[0.8, 1.0, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  playbackSpeed === spd
                    ? 'bg-saffron-500 text-slate-950 font-bold'
                    : 'hover:text-white hover:bg-slate-800'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Audio Visualizer Waves when playing */}
        <div className="flex items-center gap-1.5 h-6">
          {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-saffron-400 transition-all duration-300 ${
                isPlaying && !isPaused ? 'animate-pulse' : 'opacity-30'
              }`}
              style={{
                height: isPlaying && !isPaused ? `${Math.max(20, (h * (i % 2 === 0 ? 1 : 0.7)))}%` : '20%',
                animationDelay: `${i * 80}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Track */}
      {progressPercent > 0 && (
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-saffron-500 to-emerald-400 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Voice Info */}
      {activeVoiceName && (
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
          <span>Active Synthesizer: {activeVoiceName}</span>
          <span>Speed: {playbackSpeed}x</span>
        </div>
      )}
    </div>
  );
}
