'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { SAMPLE_HEROES } from '../lib/sample-data';
import { proxyImageUrl } from '../lib/api';
import HeroCard from '../components/HeroCard';
import {
  Search,
  Sparkles,
  Compass,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Award,
  Zap,
  BookOpen,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredResults = useMemo(() => {
    if (!query && activeFilter === 'ALL') {
      return SAMPLE_HEROES.slice(0, 6);
    }
    return SAMPLE_HEROES.filter((hero) => {
      const qLower = query.toLowerCase().trim();
      const matchesText =
        !qLower ||
        hero.name.toLowerCase().includes(qLower) ||
        (hero.name_local && hero.name_local.toLowerCase().includes(qLower)) ||
        hero.state.toLowerCase().includes(qLower) ||
        hero.primary_domain.toLowerCase().includes(qLower) ||
        hero.tagline.toLowerCase().includes(qLower) ||
        hero.short_bio.toLowerCase().includes(qLower);

      const matchesFilter =
        activeFilter === 'ALL' ||
        hero.primary_domain.toLowerCase().includes(activeFilter.toLowerCase()) ||
        (activeFilter === 'ANCIENT' && (hero.era?.toLowerCase().includes('ancient') || (hero.birth_year && hero.birth_year < 1000))) ||
        (activeFilter === 'FREEDOM' && hero.primary_domain.toLowerCase().includes('freedom')) ||
        (activeFilter === 'SCIENCE' && hero.primary_domain.toLowerCase().includes('science')) ||
        (activeFilter === 'TRIBAL' && (hero.primary_domain.toLowerCase().includes('tribal') || hero.tagline.toLowerCase().includes('tribal')));

      return matchesText && matchesFilter;
    });
  }, [query, activeFilter]);

  const spotlightHero = SAMPLE_HEROES[0];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. NATIONAL SEARCH ENGINE MASTHEAD */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1200px] h-[550px] bg-hero-glow pointer-events-none -z-10" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Sovereign Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
            <Zap className="w-4 h-4 text-saffron-400 animate-pulse" />
            <span>NATIONAL SEARCH ENGINE • ZERO QUERY-TIME FETCH LATENCY (&lt; 35MS)</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="font-cinematic text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15]">
              Search Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 via-amber-300 to-yellow-500 text-glow-saffron">Indian Hero</span> in National Memory
            </h1>
            <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto font-sans">
              From Ancient Pioneers (600 BCE) to Medieval Resistance, Tribal Revolutionaries, and Scientific Saviors — pre-indexed from Wikipedia & National Government Archives.
            </p>
          </div>

          {/* GOOGLE-STYLE SUPER SEARCH BAR */}
          <div className="max-w-3xl mx-auto relative mt-8">
            <div className="relative flex items-center rounded-2xl bg-slate-900/90 border-2 border-saffron-500/40 p-2 shadow-2xl backdrop-blur-xl focus-within:border-saffron-400 focus-within:shadow-saffron-glow transition-all">
              <Search className="w-6 h-6 text-saffron-400 ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/explore?q=${encodeURIComponent(query)}`;
                  }
                }}
                placeholder="Search by name, state, domain (e.g. Sushruta, Jagadish Chandra Bose, Netaji)..."
                className="w-full bg-transparent px-4 py-3 text-white text-base sm:text-lg focus:outline-none placeholder:text-slate-500"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-white/5 rounded-lg mr-2"
                >
                  Clear
                </button>
              )}
              <Link
                href={`/explore?q=${encodeURIComponent(query)}`}
                className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-saffron-400 to-amber-400 hover:from-saffron-300 hover:to-amber-300 transition-all text-sm shrink-0 shadow-saffron-glow"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Topic Filter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-500 uppercase tracking-wider font-mono mr-1">Quick Filters:</span>
              {[
                { id: 'ALL', label: 'All Era' },
                { id: 'ANCIENT', label: 'Ancient Pioneers (BCE/CE)' },
                { id: 'FREEDOM', label: 'Freedom Struggle' },
                { id: 'TRIBAL', label: 'Tribal Resistance' },
                { id: 'SCIENCE', label: 'Science & Medicine' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setActiveFilter(chip.id)}
                  className={`px-3 py-1.5 rounded-full border transition-all ${
                    activeFilter === chip.id
                      ? 'bg-saffron-500 text-slate-950 font-bold border-saffron-400 shadow-sm'
                      : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-saffron-500/40 hover:text-white'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Provenance Stat Badges */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/10 text-left">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
              <div className="text-2xl font-bold text-white font-cinematic">&lt; 35ms</div>
              <div className="text-xs text-slate-400 mt-0.5">Instant Local Index Search</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
              <div className="text-2xl font-bold text-saffron-400 font-cinematic">100% Free</div>
              <div className="text-xs text-slate-400 mt-0.5">Wikipedia + Gov Archives</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
              <div className="text-2xl font-bold text-emerald-400 font-cinematic">CC-Licensed</div>
              <div className="text-xs text-slate-400 mt-0.5">Wikimedia Safe Portraits</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
              <div className="text-2xl font-bold text-amber-300 font-cinematic">DPI Standard</div>
              <div className="text-xs text-slate-400 mt-0.5">Open API & Signage Engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH RESULTS GRID (Live Instant Filtering) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-semibold text-saffron-400 uppercase tracking-widest">
              {query || activeFilter !== 'ALL' ? 'SEARCH RESULTS' : 'FEATURED INDEXED HEROES'}
            </span>
            <h2 className="font-cinematic text-2xl sm:text-3xl font-bold text-white mt-1">
              {query ? `Results for "${query}"` : 'Explore National Heroes'}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredResults.length} Contributor{filteredResults.length === 1 ? '' : 's'} Found
          </span>
        </div>

        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredResults.map((hero) => (
              <HeroCard key={hero.slug} hero={hero} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-glass border border-white/10 space-y-4">
            <p className="text-slate-300 text-lg">No indexed figures found for your query.</p>
            <button
              onClick={() => {
                setQuery('');
                setActiveFilter('ALL');
              }}
              className="text-saffron-400 text-sm font-semibold hover:underline"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </section>

      {/* 3. SPOTLIGHT HERO SHOWCASE */}
      {spotlightHero && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-glass-card border border-white/15 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-950 border border-white/10 shadow-lg">
                <img
                  src={proxyImageUrl(spotlightHero.image_url)}
                  alt={spotlightHero.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-saffron-500/90 text-slate-950 font-mono">
                    NATIONAL SPOTLIGHT
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-saffron-400 uppercase tracking-widest">
                    {spotlightHero.state} • {spotlightHero.primary_domain}
                  </span>
                  <h2 className="font-cinematic text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                    {spotlightHero.name}
                  </h2>
                  {spotlightHero.name_local && (
                    <p className="text-lg text-saffron-300 font-indic font-medium">
                      {spotlightHero.name_local}
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <p className="text-sm sm:text-base italic text-slate-200">
                    “{spotlightHero.tagline}”
                  </p>
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {spotlightHero.short_bio}
                </p>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    href={`/heroes/${spotlightHero.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-950 bg-saffron-400 hover:bg-saffron-300 transition-colors text-sm shadow-saffron-glow"
                  >
                    <span>View Knowledge Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/banners?hero=${spotlightHero.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-saffron-400" />
                    <span>Generate Signage Banner</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
