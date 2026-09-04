import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchHeroBySlug, fetchHeroes, proxyImageUrl } from '../../../lib/api';
import HeroAudioPlayer from '../../../components/HeroAudioPlayer';
import {
  Sparkles,
  MapPin,
  Calendar,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  Share2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function HeroDetailPage({ params }: { params: { slug: string } }) {
  const hero = await fetchHeroBySlug(params.slug);

  if (!hero) {
    notFound();
  }

  const lifespan =
    hero.birth_year && hero.death_year
      ? `${hero.birth_year} – ${hero.death_year}`
      : hero.era || 'Historical Era';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back Navigation */}
      <div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-saffron-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to National Catalog</span>
        </Link>
      </div>

      {/* 1. HERO PROFILE MASTHEAD */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Portrait & Licensing Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-[#070B12] border border-white/15 shadow-2xl aspect-[4/5] flex items-center justify-center">
            <img
              src={proxyImageUrl(hero.image_url)}
              alt={hero.name}
              className="w-full h-full object-contain object-center p-3"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-full bg-slate-950/90 text-saffron-400 font-mono border border-saffron-500/30 shadow-md">
                {hero.state}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-950/90 text-slate-300 font-mono border border-white/10 shadow-md">
                {hero.primary_domain}
              </span>
            </div>
          </div>

          {/* Safe Licensing Badge Card */}
          <div className="p-4 rounded-xl bg-glass border border-white/5 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Image Rights & Provenance</span>
            </div>
            <p><strong>License:</strong> {hero.image_license}</p>
            <p className="line-clamp-2"><strong>Attribution:</strong> {hero.image_attribution}</p>
            {hero.image_source_page_url && (
              <a
                href={hero.image_source_page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-saffron-400 hover:underline pt-1"
              >
                <span>View Source Repository Asset</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Hero Biography & Identity (7 Cols) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-saffron-500/10 text-saffron-400 border border-saffron-500/30">
                {hero.primary_domain}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {lifespan}
              </span>
            </div>

            <h1 className="font-cinematic text-3xl sm:text-5xl font-bold text-white leading-tight">
              {hero.name}
            </h1>
            {hero.name_local && (
              <p className="text-xl sm:text-2xl text-saffron-300 font-indic font-medium">
                {hero.name_local}
              </p>
            )}
          </div>

          {/* Tagline */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-saffron-950/30 border border-saffron-500/20 shadow-inner">
            <p className="text-sm sm:text-base italic text-slate-200 leading-relaxed font-serif">
              “{hero.tagline}”
            </p>
          </div>

          {/* Multilingual Oral History Audio Player */}
          <HeroAudioPlayer hero={hero} />

          {/* Original Synthesized Biography */}
          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            <h3 className="font-cinematic text-lg font-semibold text-white">Biographical Narrative</h3>
            <p>{hero.short_bio}</p>
          </div>

          {/* Why are they Unsung? */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Why Was This Contribution Overlooked?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {hero.is_unsung_reason}
            </p>
          </div>

          {/* Banner Factory CTA */}
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href={`/banners?hero=${hero.slug}`}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-saffron-400 to-amber-400 hover:from-saffron-300 hover:to-amber-300 transition-all text-sm shadow-saffron-glow transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Public Signage Banner</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. KEY CONTRIBUTIONS CARDS */}
      {hero.contributions && hero.contributions.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="font-cinematic text-2xl font-bold text-white">
              Key Historical Contributions & Sacrifices
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hero.contributions.map((c, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-glass-card border border-white/10 space-y-3 relative overflow-hidden"
              >
                <div className="text-3xl font-cinematic font-bold text-saffron-500/30 absolute top-4 right-4">
                  0{idx + 1}
                </div>
                {c.title && (
                  <h3 className="font-cinematic text-base font-bold text-white pr-8">
                    {c.title}
                  </h3>
                )}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. CHRONOLOGICAL TIMELINE */}
      {hero.timeline_events && hero.timeline_events.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="font-cinematic text-2xl font-bold text-white">
              Chronological Timeline
            </h2>
          </div>

          <div className="relative border-l-2 border-saffron-500/30 ml-4 pl-6 space-y-8">
            {hero.timeline_events.map((t, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-saffron-500 border-4 border-background" />
                <div className="space-y-1">
                  <span className="text-xs font-mono font-semibold text-saffron-400">
                    {t.event_date || t.event_year}
                  </span>
                  <h4 className="text-base font-bold text-white">{t.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-300">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. VERIFIED PROVENANCE & PRIMARY SOURCES */}
      {hero.sources && hero.sources.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="font-cinematic text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>Authoritative Historical Sources & Provenance</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Every fact on this page is cross-referenced with official archives, PIB releases, or academic papers to ensure zero hallucinations.
            </p>
          </div>

          <div className="space-y-3">
            {hero.sources.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-glass border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {s.source_type}
                    </span>
                    {s.is_primary_reference && (
                      <span className="text-[10px] font-semibold text-saffron-400">
                        • Primary Reference
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">{s.title}</p>
                  {s.publisher_or_institution && (
                    <p className="text-xs text-slate-400">{s.publisher_or_institution}</p>
                  )}
                </div>

                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-saffron-400 bg-saffron-500/10 hover:bg-saffron-500/20 border border-saffron-500/20 transition-all self-start sm:self-auto"
                  >
                    <span>View Record</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
