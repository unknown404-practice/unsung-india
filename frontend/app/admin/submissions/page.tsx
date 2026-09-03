'use client';

import { useState } from 'react';
import { ShieldCheck, Check, X, Eye, ExternalLink, Filter, AlertCircle } from 'lucide-react';

interface MockSubmission {
  id: string;
  submitter_name: string;
  submitter_email: string;
  hero_name: string;
  hero_name_local?: string;
  state: string;
  primary_domain: string;
  birth_year?: number;
  death_year?: number;
  short_bio: string;
  key_contributions: string[];
  sources_text: string;
  image_url?: string;
  image_license_declared?: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
}

const INITIAL_SUBMISSIONS: MockSubmission[] = [
  {
    id: 'sub-001',
    submitter_name: 'Prof. Debabrata Roy',
    submitter_email: 'debabrata@jadavpur.edu',
    hero_name: 'Kushiram Bose',
    hero_name_local: 'ক্ষুদিরাম বসু',
    state: 'West Bengal',
    primary_domain: 'Freedom Struggle',
    birth_year: 1889,
    death_year: 1908,
    short_bio: 'One of the youngest revolutionaries of the Indian independence movement, martyred at age 18 in Muzaffarpur.',
    key_contributions: [
      'Member of Anushilan Samiti revolutionary society.',
      'Muzaffarpur conspiracy action against colonial magistrate Kingsford.',
      'Walked to the gallows smiling at age 18.'
    ],
    sources_text: 'National Archives of India (Muzaffarpur Conspiracy Case File); PIB Bengal Martyrs series.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Khudiram_Bose.jpg/600px-Khudiram_Bose.jpg',
    image_license_declared: 'PUBLIC_DOMAIN',
    status: 'SUBMITTED',
  },
  {
    id: 'sub-002',
    submitter_name: 'Dr. Kavitha Nair',
    submitter_email: 'kavitha.nair@kerala.ac.in',
    hero_name: 'Akkamma Cherian',
    hero_name_local: 'അക്കമ്മ ചെറിയാൻ',
    state: 'Kerala',
    primary_domain: 'Freedom Struggle',
    birth_year: 1909,
    death_year: 1982,
    short_bio: 'Indian independence activist from Travancore affectionately known as the "Jhansi Rani of Travancore" named by Mahatma Gandhi.',
    key_contributions: [
      'Led 20,000 demonstrators against the autocratic Diwan CP Ramaswamy Iyer.',
      'Dared the police inspector to shoot her first when troops opened fire on peaceful rally.'
    ],
    sources_text: 'Kerala State Archives gazetteer; PIB Women Freedom Fighters.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Akkamma_Cherian_1990_stamp_of_India.jpg/600px-Akkamma_Cherian_1990_stamp_of_India.jpg',
    image_license_declared: 'PUBLIC_DOMAIN',
    status: 'SUBMITTED',
  }
];

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<MockSubmission[]>(INITIAL_SUBMISSIONS);
  const [selectedSub, setSelectedSub] = useState<MockSubmission | null>(submissions[0]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleApprove = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'APPROVED' } : s))
    );
    if (selectedSub && selectedSub.id === id) {
      setSelectedSub({ ...selectedSub, status: 'APPROVED' });
    }
  };

  const handleReject = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'REJECTED' } : s))
    );
    if (selectedSub && selectedSub.id === id) {
      setSelectedSub({ ...selectedSub, status: 'REJECTED' });
    }
  };

  const filtered = submissions.filter((s) => {
    if (statusFilter === 'ALL') return true;
    return s.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-saffron-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>EDITORIAL MODERATION DESK</span>
          </div>
          <h1 className="font-cinematic text-2xl sm:text-4xl font-bold text-white mt-1">
            Community Submissions Queue
          </h1>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 text-xs">
          {['ALL', 'SUBMITTED', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === st
                  ? 'bg-saffron-500/20 border-saffron-500 text-saffron-300 font-semibold'
                  : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Queue on Left (5 Cols), Detail on Right (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Submissions List */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.map((s) => {
            const isSelected = selectedSub?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedSub(s)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-saffron-500/10 border-saffron-500/50 shadow-saffron-glow'
                    : 'bg-glass border-white/5 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-cinematic font-bold text-white text-base">
                    {s.hero_name}
                  </h3>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      s.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : s.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {s.state} • {s.primary_domain}
                </p>
                <p className="text-[11px] text-slate-500 mt-2">
                  Submitted by: {s.submitter_name} ({s.submitter_email})
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Submission Inspector */}
        {selectedSub && (
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-glass-card border border-white/15 space-y-6">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-semibold text-saffron-400 uppercase tracking-widest">
                  {selectedSub.state} • {selectedSub.primary_domain}
                </span>
                <h2 className="font-cinematic text-2xl font-bold text-white mt-1">
                  {selectedSub.hero_name}
                </h2>
                {selectedSub.hero_name_local && (
                  <p className="text-sm text-saffron-300 font-indic">
                    {selectedSub.hero_name_local}
                  </p>
                )}
              </div>
              <span
                className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                  selectedSub.status === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : selectedSub.status === 'REJECTED'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {selectedSub.status}
              </span>
            </div>

            {/* Biographical Narrative */}
            <div className="space-y-1">
              <h4 className="text-xs uppercase font-bold text-slate-400">Biographical Narrative</h4>
              <p className="text-sm text-slate-200 leading-relaxed">{selectedSub.short_bio}</p>
            </div>

            {/* Key Contributions */}
            <div className="space-y-1">
              <h4 className="text-xs uppercase font-bold text-slate-400">Key Contributions</h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {selectedSub.key_contributions.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>

            {/* Primary Provenance Citations */}
            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs">
              <h4 className="font-bold text-saffron-400 uppercase">Primary Provenance Verification</h4>
              <p className="text-slate-300">{selectedSub.sources_text}</p>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-white/5">
                Declared Image License: <strong>{selectedSub.image_license_declared}</strong>
              </div>
            </div>

            {/* Moderation Actions */}
            {selectedSub.status === 'SUBMITTED' && (
              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleApprove(selectedSub.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all text-xs sm:text-sm shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify Citations & Approve Hero</span>
                </button>
                <button
                  onClick={() => handleReject(selectedSub.id)}
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 transition-all text-xs sm:text-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
