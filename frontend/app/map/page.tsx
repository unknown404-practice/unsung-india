import { fetchHeroes } from '../../lib/api';
import IndiaHeritageMap from '../../components/IndiaHeritageMap';
import { Compass, Sparkles, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HeritageMapPage() {
  const { data: heroes } = await fetchHeroes('', '', '', '', '', 1, 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Masthead */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>GEOGRAPHIC CIVILIZATIONAL ARCHIVE</span>
        </div>
        <h1 className="font-cinematic text-3xl sm:text-5xl font-bold text-white">
          National Heritage & Soil Map
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
          Explore the sacred lands and regions of Bharat. Click any State or Union Territory to discover the indigenous freedom fighters, mathematicians, surgeons, and pioneers who shaped our civilizational heritage.
        </p>
      </div>

      {/* Interactive Map Component */}
      <IndiaHeritageMap heroes={heroes} />
    </div>
  );
}
