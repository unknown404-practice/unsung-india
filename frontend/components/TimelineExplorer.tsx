'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen,
  MapPin,
  ChevronRight,
  Sliders,
  Award,
} from 'lucide-react';
import { Hero } from '../lib/types';
import { proxyImageUrl } from '../lib/api';

interface TimelineExplorerProps {
  heroes: Hero[];
}

const EPOCHS = [
  {
    id: 'all',
    name: 'Complete 3,000-Year History',
    timeRange: '1500 BCE – Present',
    description: 'The complete unbroken civilizational continuum of Indian knowledge, defense, and freedom.',
    color: '#FF9933',
  },
  {
    id: 'ancient',
    name: 'Ancient & Classical Wisdom',
    timeRange: '1500 BCE – 1000 CE',
    description: 'Pioneers of surgery, mathematics, astronomy, and classical Indic philosophies.',
    color: '#FACC15',
  },
  {
    id: 'medieval',
    name: 'Medieval Sovereignty & Resistance',
    timeRange: '1000 CE – 1750 CE',
    description: 'Kings, queens, and commanders who defended indigenous civilizational autonomy.',
    color: '#FB923C',
  },
  {
    id: 'early_revolts',
    name: 'Tribal & Anti-Colonial Uprisings',
    timeRange: '1750 – 1856',
    description: 'First armed revolts by tribal, peasant, and princely leaders against British East India Company.',
    color: '#4ADE80',
  },
  {
    id: '1857_war',
    name: 'The 1857 War of Independence',
    timeRange: '1857 – 1858',
    description: 'The monumental nationwide armed uprising that shook the foundation of British colonial occupation.',
    color: '#F87171',
  },
  {
    id: 'freedom_struggle',
    name: 'Armed Revolution & National Freedom',
    timeRange: '1858 – 1947',
    description: 'The heroic era of INA, revolutionaries, and nationwide satyagraha leading to Indian Independence.',
    color: '#38BDF8',
  },
  {
    id: 'modern_dpi',
    name: 'Modern Science, Industry & DPI',
    timeRange: '1947 – Present',
    description: 'Foundational architects of atomic energy, space exploration, Green/White revolutions, and digital infrastructure.',
    color: '#A855F7',
  },
];

export default function TimelineExplorer({ heroes }: TimelineExplorerProps) {
  const [selectedEpochId, setSelectedEpochId] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('All');

  const domains = [
    'All',
    'Freedom Struggle',
    'Science & Tech',
    'Medicine & Surgery',
    'Education & Reform',
    'Mathematics',
  ];

  const selectedEpoch = EPOCHS.find((e) => e.id === selectedEpochId) || EPOCHS[0];

  // Filter heroes according to epoch
  const filteredHeroes = heroes.filter((hero) => {
    const birth = hero.birth_year || 1900;
    const eraStr = (hero.era || '').toLowerCase();

    // Domain filter
    if (domainFilter !== 'All') {
      if (!hero.primary_domain.toLowerCase().includes(domainFilter.toLowerCase())) {
        return false;
      }
    }

    if (selectedEpochId === 'all') return true;
    if (selectedEpochId === 'ancient') return birth < 1000 || eraStr.includes('ancient');
    if (selectedEpochId === 'medieval') return (birth >= 1000 && birth < 1750) || eraStr.includes('medieval');
    if (selectedEpochId === 'early_revolts') return (birth >= 1750 && birth < 1850) || eraStr.includes('tribal') || eraStr.includes('revolt');
    if (selectedEpochId === '1857_war') return eraStr.includes('1857') || (birth >= 1810 && birth <= 1840 && hero.primary_domain.includes('Freedom'));
    if (selectedEpochId === 'freedom_struggle') return (birth >= 1850 && birth <= 1930) && (hero.primary_domain.includes('Freedom') || eraStr.includes('freedom') || eraStr.includes('ina'));
    if (selectedEpochId === 'modern_dpi') return birth >= 1880 && (hero.primary_domain.includes('Science') || hero.primary_domain.includes('Medicine') || hero.primary_domain.includes('Industry'));

    return true;
  });

  return (
    <div className="space-y-12">
      {/* Epochs Navigation Carousel */}
      <div className="rounded-2xl bg-glass-card border border-white/10 p-6 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-saffron-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Clock className="w-4 h-4" />
            <span>3,000-YEAR CHRONOLOGICAL CONTINUUM</span>
          </div>
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-saffron-500"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  Domain: {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Epoch Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EPOCHS.map((ep) => {
            const isSelected = selectedEpochId === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => setSelectedEpochId(ep.id)}
                className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-saffron-500/15 border-saffron-500 text-white shadow-saffron-glow ring-1 ring-saffron-400'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: ep.color }}
                  />
                  <span className="text-[10px] font-mono text-saffron-400 bg-black/40 px-2 py-0.5 rounded-full">
                    {ep.timeRange}
                  </span>
                </div>
                <div>
                  <h4 className="font-cinematic text-sm font-bold text-white leading-tight">
                    {ep.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {ep.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Epoch Showcase Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-saffron-950/30 border border-saffron-500/30 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-saffron-400" />
            <h2 className="font-cinematic text-2xl sm:text-3xl font-bold text-white">
              {selectedEpoch.name}
            </h2>
          </div>
          <p className="text-xs text-saffron-300 font-mono">
            Timeline: {selectedEpoch.timeRange}
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {selectedEpoch.description}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-3xl sm:text-4xl font-mono font-bold text-white block">
            {filteredHeroes.length}
          </span>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
            Chronological Figures
          </span>
        </div>
      </div>

      {/* Vertical Interactive Chronological Timeline Cards */}
      <div className="relative border-l-2 border-saffron-500/30 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
        {filteredHeroes.map((hero, idx) => {
          const lifespan =
            hero.birth_year && hero.death_year
              ? `${hero.birth_year} – ${hero.death_year}`
              : hero.era || 'Historical Era';

          return (
            <div key={hero.id} className="relative group">
              {/* Timeline Pin Indicator */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-5 h-5 rounded-full bg-slate-950 border-2 border-saffron-400 flex items-center justify-center group-hover:scale-125 group-hover:bg-saffron-500 transition-all shadow-saffron-glow">
                <div className="w-2 h-2 rounded-full bg-saffron-400 group-hover:bg-slate-950" />
              </div>

              {/* Timeline Hero Card */}
              <div className="rounded-2xl bg-glass-card border border-white/10 p-5 sm:p-7 shadow-xl hover:border-saffron-500/40 transition-all flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Hero Portrait */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shrink-0 flex items-center justify-center shadow-md">
                  <img
                    src={proxyImageUrl(hero.image_url)}
                    alt={hero.name}
                    className="w-full h-full object-contain object-center p-1 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Hero Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-saffron-500/15 text-saffron-300 border border-saffron-500/30">
                      {hero.primary_domain}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {lifespan}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5" />
                      {hero.state}
                    </span>
                  </div>

                  <h3 className="font-cinematic text-xl sm:text-2xl font-bold text-white group-hover:text-saffron-300 transition-colors">
                    {hero.name}
                  </h3>
                  {hero.name_local && (
                    <p className="text-sm text-saffron-300/85 font-indic">
                      {hero.name_local}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                    {hero.short_bio}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/heroes/${hero.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-saffron-400 hover:bg-saffron-300 px-4 py-2 rounded-xl transition-all shadow-saffron-glow"
                    >
                      <span>Read Complete Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/banners?hero=${hero.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-white/10 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
                      <span>Make Banner</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
