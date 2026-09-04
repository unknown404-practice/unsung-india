import { fetchHeroes } from '../../lib/api';
import TimelineExplorer from '../../components/TimelineExplorer';
import { Clock, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  const { data: heroes } = await fetchHeroes('', '', '', '', '', 1, 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Masthead */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>CHRONOLOGICAL CIVILIZATIONAL TIMELINE</span>
        </div>
        <h1 className="font-cinematic text-3xl sm:text-5xl font-bold text-white">
          3,000-Year Timeline of Indian Greatness
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
          A seamless journey across three millennia of Indian civilizational heritage. From ancient surgeons and astronomers to the 1857 martyrs, INA revolutionaries, and modern Digital India pioneers.
        </p>
      </div>

      {/* Interactive Timeline Explorer */}
      <TimelineExplorer heroes={heroes} />
    </div>
  );
}
