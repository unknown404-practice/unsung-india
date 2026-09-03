'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, ArrowRight, User } from 'lucide-react';
import { Hero } from '../lib/types';
import { proxyImageUrl } from '../lib/api';

interface HeroCardProps {
  hero: Hero;
}

export default function HeroCard({ hero }: HeroCardProps) {
  const [imgError, setImgError] = useState(false);

  const lifespan =
    hero.birth_year && hero.death_year
      ? `${hero.birth_year} – ${hero.death_year}`
      : hero.era || 'Historical Era';

  return (
    <div className="group relative rounded-2xl bg-glass-card overflow-hidden transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between border border-white/10 shadow-xl">
      {/* Glow Accent on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-saffron-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Top Image & Portrait Section */}
      <div>
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#070B12] flex items-center justify-center border-b border-white/5">
          {!imgError ? (
            <img
              src={proxyImageUrl(hero.image_url)}
              alt={hero.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain object-center p-2 group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 p-6 text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-saffron-500/10 border border-saffron-500/30 flex items-center justify-center text-saffron-400">
                <User className="w-8 h-8" />
              </div>
              <span className="text-xs font-cinematic font-bold text-saffron-300 uppercase tracking-wider">
                {hero.name}
              </span>
            </div>
          )}

          {/* Badges: State & Domain */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/85 backdrop-blur-md text-saffron-400 border border-saffron-500/30 shadow-md">
              <MapPin className="w-3 h-3" />
              {hero.state}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-950/85 backdrop-blur-md text-slate-300 border border-white/10 shadow-md">
              {hero.primary_domain}
            </span>
          </div>

          {/* Lifespan pill */}
          <div className="absolute bottom-2.5 left-3">
            <span className="text-[11px] font-mono tracking-wider text-slate-300 bg-slate-950/90 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10 shadow-sm">
              {lifespan}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-3">
          <div>
            <h3 className="font-cinematic text-lg sm:text-xl font-bold text-white group-hover:text-saffron-400 transition-colors leading-snug">
              {hero.name}
            </h3>
            {hero.name_local && (
              <p className="text-sm text-saffron-300/80 font-indic mt-0.5">
                {hero.name_local}
              </p>
            )}
          </div>

          <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {hero.tagline}
          </p>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-5 sm:p-6 pt-0 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
        <Link
          href={`/heroes/${hero.slug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white hover:text-saffron-400 transition-colors"
        >
          <span>Read Story</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href={`/banners?hero=${hero.slug}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-saffron-300 bg-saffron-500/10 hover:bg-saffron-500/20 border border-saffron-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
          <span>Make Banner</span>
        </Link>
      </div>
    </div>
  );
}
