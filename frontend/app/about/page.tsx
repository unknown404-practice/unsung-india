import { ShieldCheck, BookOpen, Globe, Award, Sparkles, Layers, Cpu } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>MISSION & DIGITAL PUBLIC INFRASTRUCTURE</span>
        </div>
        <h1 className="font-cinematic text-3xl sm:text-5xl font-bold text-white">
          About Unsung Heroes of India
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          An open, sovereign, multilingual digital asset dedicated to public history, national remembrance, and civic signage.
        </p>
      </div>

      {/* 1. Core DPI Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-glass border border-white/10 space-y-3">
          <Globe className="w-8 h-8 text-saffron-400" />
          <h3 className="font-cinematic text-lg font-bold text-white">Open Public Infrastructure</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Free from commercial paywalls and vendor enclosures. All structured metadata is published under open CC-BY 4.0 licensing with standardized OpenAPI endpoints.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-glass border border-white/10 space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <h3 className="font-cinematic text-lg font-bold text-white">Zero-Hallucination Standard</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every biographical entry is cross-verified against primary government archives, PIB historical releases, National Archives of India (NAI), and academic publications.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-glass border border-white/10 space-y-3">
          <Sparkles className="w-8 h-8 text-amber-400" />
          <h3 className="font-cinematic text-lg font-bold text-white">Automated Banner Factory</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Instantly turns verified history into 300 DPI print-ready posters and digital signage for metro rail networks, bus stations, schools, and civic displays.
          </p>
        </div>
      </div>

      {/* 2. Official Government & Archival Integrations */}
      <div className="p-8 rounded-2xl bg-glass-card border border-white/10 space-y-6">
        <h2 className="font-cinematic text-2xl font-bold text-white">
          Primary Historical Sources & Integration Blueprint
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <h4 className="font-bold text-saffron-400">Indian Culture Portal (Ministry of Culture)</h4>
            <p className="text-slate-400 text-xs">Primary reference for digitized rare manuscripts, paintings, and district archives.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <h4 className="font-bold text-saffron-400">National Archives of India (Abhilekh-Patal)</h4>
            <p className="text-slate-400 text-xs">Official search portal for declassified colonial gazettes and freedom struggle records.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <h4 className="font-bold text-saffron-400">Press Information Bureau (PIB)</h4>
            <p className="text-slate-400 text-xs">Verified feature series on lesser-known freedom fighters across all states.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <h4 className="font-bold text-saffron-400">CSIR Science Reporter & NIScPR</h4>
            <p className="text-slate-400 text-xs">Primary authoritative reference for unsung Indian botanists, physicists, and pioneers.</p>
          </div>
        </div>
      </div>

      {/* 3. Free-for-Lifetime Architecture */}
      <div className="p-8 rounded-2xl bg-glass border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-saffron-400">
          <Cpu className="w-5 h-5" />
          <h3 className="font-cinematic text-lg font-bold text-white">
            Free-Tier Lifetime Hosting Topology
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The entire application is designed to operate 100% free of hosting cost on modern managed free tiers: Next.js on <strong>Vercel Hobby</strong>, FastAPI on <strong>Render / Railway</strong>, and serverless Postgres on <strong>Neon / Supabase</strong>. Incremental Static Regeneration (ISR) ensures instantaneous page loads directly from edge CDN caches.
        </p>
      </div>
    </div>
  );
}
