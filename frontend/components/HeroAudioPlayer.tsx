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
  CheckCircle2,
  Download,
} from 'lucide-react';
import { Hero } from '../lib/types';

interface HeroAudioPlayerProps {
  hero: Hero;
}

const SUPPORTED_LANGUAGES = [
  { code: 'hi', label: 'Hindi (हिंदी)', flag: '🇮🇳', scriptName: 'हिंदी' },
  { code: 'bn', label: 'Bengali (বাংলা)', flag: '🇮🇳', scriptName: 'বাংলা' },
  { code: 'ta', label: 'Tamil (தமிழ்)', flag: '🇮🇳', scriptName: 'தமிழ்' },
  { code: 'te', label: 'Telugu (తెలుగు)', flag: '🇮🇳', scriptName: 'తెలుగు' },
  { code: 'mr', label: 'Marathi (मराठी)', flag: '🇮🇳', scriptName: 'मराठी' },
  { code: 'gu', label: 'Gujarati (ગુજરાતી)', flag: '🇮🇳', scriptName: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳', scriptName: 'ಕನ್ನಡ' },
  { code: 'en', label: 'English (Indian Accent)', flag: '🇮🇳', scriptName: 'English' },
];

export default function HeroAudioPlayer({ hero }: HeroAudioPlayerProps) {
  const [selectedLang, setSelectedLang] = useState('hi');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const [indicSubtitles, setIndicSubtitles] = useState<string>('');
  const [audioChunks, setAudioChunks] = useState<string[]>([]);
  const [sentenceList, setSentenceList] = useState<string[]>([]);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Load / Prepare Audio Data whenever hero or language changes
  const prepareAudioStream = async (targetLang: string) => {
    setIsLoadingAudio(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero, lang: targetLang }),
      });

      if (res.ok) {
        const data = await res.json();
        setIndicSubtitles(data.spokenText || '');
        setSentenceList(data.sentences || []);
        setAudioChunks(data.audioUrls || []);
        setActiveSentenceIndex(0);
      }
    } catch (err) {
      console.error('Audio preparation notice:', err);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  useEffect(() => {
    handleStop();
    prepareAudioStream(selectedLang);
  }, [hero.id, selectedLang]);

  // Handle Play / Resume / Pause
  const handlePlayPause = async () => {
    if (isPlaying && !isPaused) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        setIsPaused(true);
      }
      return;
    }

    if (isPaused && audioElementRef.current) {
      audioElementRef.current.play();
      setIsPaused(false);
      return;
    }

    // If audio chunks not loaded yet, load them first
    if (audioChunks.length === 0) {
      await prepareAudioStream(selectedLang);
    }

    if (audioChunks.length > 0) {
      playSentence(0);
    }
  };

  const playSentence = (index: number) => {
    if (index >= audioChunks.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveSentenceIndex(0);
      return;
    }

    setActiveSentenceIndex(index);
    setIsPlaying(true);
    setIsPaused(false);

    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }

    const audio = new Audio(audioChunks[index]);
    audio.playbackRate = playbackSpeed;

    audio.onended = () => {
      playSentence(index + 1);
    };

    audio.onerror = () => {
      console.warn('Audio chunk playback notice, moving to next');
      playSentence(index + 1);
    };

    audioElementRef.current = audio;
    audio.play().catch((e) => {
      console.warn('Audio play notice:', e);
      setIsPlaying(false);
    });
  };

  const handleStop = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSentenceIndex(0);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = speed;
    }
  };

  const currentLanguageObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-saffron-950/20 border border-saffron-500/30 p-5 shadow-2xl space-y-4">
      {/* Header & Multilingual Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-saffron-500/15 border border-saffron-500/30 flex items-center justify-center text-saffron-400 shadow-sm">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-cinematic text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Oral History Narration</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                FLUENT INDIC SPEECH
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Listen to the complete heroic story spoken fluently in native Indian languages.
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-saffron-400" />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-saffron-500/40 text-xs text-white focus:outline-none focus:border-saffron-400 transition-all font-semibold shadow-inner"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-950 text-white font-medium">
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Spoken Text & Live Subtitles in Selected Indic Script */}
      {indicSubtitles && (
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-saffron-400 font-mono">
            <span>Live Subtitles ({currentLanguageObj.scriptName})</span>
            {isPlaying && (
              <span className="flex items-center gap-1 text-emerald-400 animate-pulse">
                <CheckCircle2 className="w-3 h-3" />
                <span>Speaking sentence {activeSentenceIndex + 1} of {sentenceList.length}</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-indic">
            {sentenceList.length > 0 ? (
              sentenceList.map((sentence, idx) => (
                <span
                  key={idx}
                  className={`transition-all duration-300 rounded px-1 ${
                    isPlaying && idx === activeSentenceIndex
                      ? 'bg-saffron-500/25 text-saffron-200 font-semibold border-b border-saffron-400'
                      : 'opacity-85'
                  }`}
                >
                  {sentence}{' '}
                </span>
              ))
            ) : (
              <span>{indicSubtitles}</span>
            )}
          </p>
        </div>
      )}

      {/* Audio Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Main Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            disabled={isLoadingAudio}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              isPlaying && !isPaused
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-saffron-500 hover:bg-saffron-400 text-slate-950 shadow-saffron-500/20'
            } disabled:opacity-50`}
          >
            {isLoadingAudio ? (
              <span>Loading Audio...</span>
            ) : isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Narration</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isPaused ? 'Resume Narration' : `Listen in ${currentLanguageObj.scriptName}`}</span>
              </>
            )}
          </button>

          {/* Stop / Reset Button */}
          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-all disabled:opacity-40"
            title="Stop & Reset"
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

        {/* Dynamic Sound Waveform Bars */}
        <div className="flex items-center gap-1.5 h-6">
          {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-saffron-400 transition-all duration-300 ${
                isPlaying && !isPaused ? 'animate-pulse' : 'opacity-30'
              }`}
              style={{
                height: isPlaying && !isPaused ? `${Math.max(20, h * (i % 2 === 0 ? 1 : 0.7))}%` : '20%',
                animationDelay: `${i * 80}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
