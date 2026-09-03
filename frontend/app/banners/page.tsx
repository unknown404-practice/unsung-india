import { fetchHeroes, fetchBannerTemplates } from '../../lib/api';
import BannerStudio from '../../components/BannerStudio';
import { Sparkles, Layers, ShieldCheck } from 'lucide-react';

export default async function BannersPage({
  searchParams,
}: {
  searchParams: { hero?: string };
}) {
  const { data: heroes } = await fetchHeroes();
  const templates = await fetchBannerTemplates();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Masthead */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTOMATED SIGNAGE ENGINE</span>
        </div>
        <h1 className="font-cinematic text-3xl sm:text-5xl font-bold text-white">
          Public Banner Factory Studio
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
          Instantly generate publication-ready digital signage and high-resolution 300 DPI vector PDFs for metro stations, roadside billboards, bus shelters, and college notice boards across India.
        </p>
      </div>

      {/* Interactive Banner Studio */}
      <BannerStudio
        heroes={heroes}
        initialHeroSlug={searchParams.hero}
        templates={templates}
      />
    </div>
  );
}
