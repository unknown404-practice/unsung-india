'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Compass,
  Sparkles,
  ArrowRight,
  User,
  Volume2,
  Calendar,
  Layers,
  ChevronRight,
  Search,
  RefreshCw,
  Award,
} from 'lucide-react';
import { Hero } from '../lib/types';
import HeroCard from './HeroCard';
import { proxyImageUrl } from '../lib/api';

interface IndiaHeritageMapProps {
  heroes: Hero[];
}

const INDIAN_STATES_REGIONS = [
  { id: 'all', name: 'All India', region: 'National', count: 25, color: '#FF9933' },
  { id: 'andhra-pradesh', name: 'Andhra Pradesh', region: 'South', count: 6, color: '#4ADE80' },
  { id: 'west-bengal', name: 'West Bengal', region: 'East', count: 8, color: '#38BDF8' },
  { id: 'maharashtra', name: 'Maharashtra', region: 'West', count: 7, color: '#FB923C' },
  { id: 'tamil-nadu', name: 'Tamil Nadu', region: 'South', count: 7, color: '#A855F7' },
  { id: 'karnataka', name: 'Karnataka', region: 'South', count: 5, color: '#818CF8' },
  { id: 'punjab', name: 'Punjab', region: 'North', count: 5, color: '#FACC15' },
  { id: 'kerala', name: 'Kerala', region: 'South', count: 6, color: '#34D399' },
  { id: 'odisha', name: 'Odisha', region: 'East', count: 5, color: '#2DD4BF' },
  { id: 'bihar', name: 'Bihar', region: 'East', count: 5, color: '#60A5FA' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', region: 'North', count: 6, color: '#FBBF24' },
  { id: 'gujarat', name: 'Gujarat', region: 'West', count: 6, color: '#FB7185' },
  { id: 'meghalaya', name: 'Meghalaya', region: 'Northeast', count: 3, color: '#E879F9' },
  { id: 'assam', name: 'Assam', region: 'Northeast', count: 5, color: '#F472B6' },
  { id: 'jharkhand', name: 'Jharkhand', region: 'East', count: 5, color: '#34D399' },
  { id: 'madhya-pradesh', name: 'Madhya Pradesh', region: 'Central', count: 4, color: '#C084FC' },
];

export default function IndiaHeritageMap({ heroes }: IndiaHeritageMapProps) {
  const [selectedState, setSelectedState] = useState<string>('andhra-pradesh');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [stateHeroes, setStateHeroes] = useState<Hero[]>([]);
  const [isLoadingState, setIsLoadingState] = useState(false);

  // Dynamic AI Hero Search inside Map
  const [aiCustomQuery, setAiCustomQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);

  const regions = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast'];

  const filteredStates = INDIAN_STATES_REGIONS.filter((st) => {
    if (st.id === 'all') return true;
    const matchRegion = selectedRegion === 'All' || st.region === selectedRegion;
    const matchSearch =
      !searchFilter || st.name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchRegion && matchSearch;
  });

  const activeStateObj =
    INDIAN_STATES_REGIONS.find((s) => s.id === selectedState) || INDIAN_STATES_REGIONS[0];

  // Fetch state figures dynamically via Qwen + Wikipedia state resolver
  useEffect(() => {
    if (selectedState === 'all') {
      setStateHeroes(heroes);
      return;
    }

    setIsLoadingState(true);
    const queryState = activeStateObj.name;

    fetch(`/api/qwen/state-heroes?state=${encodeURIComponent(queryState)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.heroes && data.heroes.length > 0) {
          setStateHeroes(data.heroes);
        } else {
          // Fallback to local catalog filter
          const fallback = heroes.filter((h) =>
            h.state.toLowerCase().includes(queryState.toLowerCase())
          );
          setStateHeroes(fallback);
        }
      })
      .catch(() => {
        const fallback = heroes.filter((h) =>
          h.state.toLowerCase().includes(queryState.toLowerCase())
        );
        setStateHeroes(fallback);
      })
      .finally(() => {
        setIsLoadingState(false);
      });
  }, [selectedState, heroes, activeStateObj.name]);

  // Handle Dynamic AI Search for any figure to place on map
  const handleAiStateSearch = async () => {
    if (!aiCustomQuery.trim()) return;
    setIsAiSearching(true);
    try {
      const res = await fetch('/api/qwen/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiCustomQuery.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.hero) {
          setStateHeroes((prev) => [data.hero, ...prev.filter((h) => h.slug !== data.hero.slug)]);
        }
      }
    } catch (e) {
      console.error('AI state search error:', e);
    } finally {
      setIsAiSearching(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Interactive Map & State Explorer Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Region Filter & Interactive State Grid (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-glass-card border border-white/10 p-6 space-y-5 shadow-2xl">
          <div className="space-y-2 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-saffron-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Compass className="w-4 h-4" />
              <span>GEOGRAPHIC HERITAGE EXPLORER</span>
            </div>
            <h3 className="font-cinematic text-xl font-bold text-white">
              Explore by State & Sacred Soil
            </h3>
            <p className="text-xs text-slate-400">
              Click any State to instantly discover the unsung revolutionaries, scientists, and martyrs of that land.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedRegion === r
                    ? 'bg-saffron-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search State (e.g. Andhra, Bengal, Punjab)..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-saffron-500 placeholder:text-slate-500"
            />
          </div>

          {/* State Badges Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredStates.map((st) => {
              const isSelected = selectedState === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedState(st.id)}
                  className={`p-3 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-saffron-500/15 border-saffron-500 text-white shadow-saffron-glow font-bold ring-1 ring-saffron-400'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-900 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: st.color }}
                    />
                    <span className="truncate">{st.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-saffron-400 bg-black/40 px-2 py-0.5 rounded-full">
                    {st.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Map Visualizer & State Spotlight (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-glass-card border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Tiranga Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Spotlight Masthead */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-saffron-400" />
                <h2 className="font-cinematic text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide">
                  {activeStateObj.name}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Region: {activeStateObj.region} India • Discovered Contributors:{' '}
                <span className="text-saffron-400 font-bold font-mono text-sm">
                  {stateHeroes.length} Heroes
                </span>
              </p>
            </div>

            <Link
              href={`/explore?state=${encodeURIComponent(activeStateObj.name)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-500/15 hover:bg-saffron-500/25 border border-saffron-500/30 text-saffron-300 text-xs font-semibold transition-all shadow-sm"
            >
              <span>Explore All {activeStateObj.name} Heroes</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* AI Quick Search inside State Map */}
          <div className="flex gap-2">
            <input
              type="text"
              value={aiCustomQuery}
              onChange={(e) => setAiCustomQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiStateSearch()}
              placeholder={`Search or add any unsung hero from ${activeStateObj.name}...`}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white focus:outline-none focus:border-saffron-500 placeholder:text-slate-500"
            />
            <button
              onClick={handleAiStateSearch}
              disabled={isAiSearching || !aiCustomQuery.trim()}
              className="px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-saffron-glow transition-all disabled:opacity-50"
            >
              {isAiSearching ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Discover</span>
            </button>
          </div>

          {/* Visual Geographic State Card Showcase */}
          {isLoadingState ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-saffron-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">
                Discovering national figures from {activeStateObj.name} via Qwen AI...
              </p>
            </div>
          ) : stateHeroes.length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                <Award className="w-4 h-4 text-saffron-400" />
                <span>Featured Heroes from {activeStateObj.name}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stateHeroes.slice(0, 4).map((h) => (
                  <div
                    key={h.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-white/10 hover:border-saffron-500/40 transition-all flex items-center gap-3.5 group shadow-lg"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-white/10 flex items-center justify-center">
                      <img
                        src={proxyImageUrl(h.image_url)}
                        alt={h.name}
                        className="w-full h-full object-contain object-center p-1 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <h5 className="font-cinematic text-sm font-bold text-white group-hover:text-saffron-300 transition-colors truncate">
                        {h.name}
                      </h5>
                      <p className="text-[11px] text-saffron-400/90 font-mono truncate">
                        {h.primary_domain}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <Link
                          href={`/heroes/${h.slug}`}
                          className="text-saffron-400 hover:text-saffron-300 font-semibold flex items-center gap-1"
                        >
                          <span>Read Story</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <Link
                          href={`/banners?hero=${h.slug}`}
                          className="text-slate-400 hover:text-white"
                        >
                          Banner
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-white/10 space-y-3">
              <Compass className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300">
                Discovering more local heroes from {activeStateObj.name}...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Full Hero Grid for Selected Soil */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-cinematic text-xl font-bold text-white flex items-center gap-2">
            <span>All Contributors from {activeStateObj.name}</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
              {stateHeroes.length} Figures
            </span>
          </h3>
          <span className="text-xs text-slate-400">Click any card to read story or generate poster</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stateHeroes.map((hero) => (
            <HeroCard key={hero.id} hero={hero} />
          ))}
        </div>
      </div>
    </div>
  );
}
