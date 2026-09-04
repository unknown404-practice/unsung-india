'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchHeroes } from '../../lib/api';
import { Hero } from '../../lib/types';
import HeroCard from '../../components/HeroCard';
import { Search, MapPin, Filter, Layers, Zap, Globe, Sparkles, Cpu, Clock } from 'lucide-react';

const STATES = [
  'All States',
  'Assam',
  'West Bengal',
  'Kerala',
  'Tamil Nadu',
  'Meghalaya',
  'Jharkhand',
  'Maharashtra',
  'Telangana',
  'Karnataka',
  'Bihar',
  'Uttar Pradesh',
  'Odisha',
  'Punjab',
  'Gujarat',
];

const DOMAINS = [
  'All Domains',
  'Freedom Struggle',
  'Science & Tech',
  'Social Reform',
  'Medicine & Surgery',
  'Philosophy & Education',
  'Tribal Resistance',
];

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">Loading catalog...</div>}>
      <ExploreContent />
    </Suspense>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [useQwenTurbo, setUseQwenTurbo] = useState(true);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSource, setSearchSource] = useState<string>('LOCAL_INDEX');
  const [latencyMs, setLatencyMs] = useState<number | undefined>(undefined);

  const executeSearch = async (forceQwen?: boolean) => {
    setIsLoading(true);
    const useQwen = forceQwen !== undefined ? forceQwen : useQwenTurbo;
    const res = await fetchHeroes({
      q: searchQuery,
      state: selectedState,
      domain: selectedDomain,
      useQwenTurbo: useQwen,
    });
    setHeroes(res.data);
    setSearchSource(res.source || 'LOCAL_INDEX');
    setLatencyMs(res.durationMs);
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) executeSearch();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedState, selectedDomain]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>SOVEREIGN SEARCH & KNOWLEDGE ENGINE</span>
          </div>
          <button
            onClick={() => {
              const next = !useQwenTurbo;
              setUseQwenTurbo(next);
              if (searchQuery) executeSearch(next);
            }}
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              useQwenTurbo
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 border-white/10 hover:border-emerald-500/40 hover:text-emerald-300'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>⚡ QWEN 2.5 14B TURBO AI: {useQwenTurbo ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <h1 className="font-cinematic text-3xl sm:text-5xl font-bold text-white">
          National Search Engine
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Search for <strong>any Indian national hero</strong> across 3,000+ years of history — powered by local index, DuckDuckGo & your local <strong>Qwen 2.5 14B LLM</strong>.
        </p>
      </div>

      {/* Filter Matrix Controls */}
      <div className="p-6 rounded-2xl bg-glass border border-white/10 space-y-4 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch();
          }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          {/* Text Search Input */}
          <div className="md:col-span-6 relative flex items-center">
            <Search className="w-5 h-5 absolute left-3.5 text-saffron-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ANY hero (e.g. Netaji Subhas Chandra Bose, Lal Bahadur Shastri, APJ Abdul Kalam)..."
              className="w-full pl-11 pr-28 py-3.5 rounded-xl bg-slate-900/90 border border-saffron-500/30 text-white text-sm focus:outline-none focus:border-saffron-400 transition-colors placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-saffron-400 to-amber-400 hover:from-saffron-300 hover:to-amber-300 transition-all shadow-sm"
            >
              Search
            </button>
          </div>

          {/* State Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500 transition-colors"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500 transition-colors"
            >
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Results Counter & Search Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span>Showing {heroes.length} verified historical figures</span>
            {searchSource === 'LOCAL_QWEN_2_5_14B_AI_TURBO' && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Synthesized by Local Qwen 2.5 14B {latencyMs ? `(${latencyMs}ms)` : ''}
              </span>
            )}
            {searchSource === 'LOCAL_INDEX' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-saffron-500/10 text-saffron-400 border border-saffron-500/20">
                <Zap className="w-3 h-3" />
                Instant Local Index (&lt; 10ms)
              </span>
            )}
            {searchSource === 'LIVE_WIKIPEDIA_DISCOVERY' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Globe className="w-3 h-3" />
                Live Wikipedia & Government Archives
              </span>
            )}
          </div>
          {(searchQuery || selectedState !== 'All States' || selectedDomain !== 'All Domains') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedState('All States');
                setSelectedDomain('All Domains');
              }}
              className="text-saffron-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Heroes Grid */}
      {isLoading ? (
        <div className="p-16 text-center rounded-2xl bg-glass border border-white/10 space-y-4">
          <div className="w-10 h-10 border-2 border-saffron-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-300 text-sm font-medium">
            {useQwenTurbo
              ? 'Executing local Qwen 2.5 14B AI inference...'
              : 'Searching local archives & national knowledge graph...'}
          </p>
        </div>
      ) : heroes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {heroes.map((hero) => (
            <HeroCard key={hero.slug} hero={hero} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-glass border border-white/10 space-y-4">
          <p className="text-slate-300 text-lg">No national figures found matching your search term.</p>
          <p className="text-slate-500 text-sm">
            Try searching by alternative spellings or enable{' '}
            <strong className="text-emerald-400">⚡ Qwen 2.5 14B Turbo AI</strong> to synthesize in real-time.
          </p>
        </div>
      )}
    </div>
  );
}
