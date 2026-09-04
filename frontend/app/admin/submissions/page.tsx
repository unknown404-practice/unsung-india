'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  Eye,
  ExternalLink,
  Filter,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Edit3,
  Globe,
  Share2,
  Volume2
} from 'lucide-react';
import Link from 'next/link';

interface SubmissionRecord {
  id: string;
  submitter_name: string;
  submitter_email: string;
  hero_name: string;
  hero_name_local?: string;
  state: string;
  primary_domain: string;
  birth_year?: number | null;
  death_year?: number | null;
  short_bio: string;
  key_contributions: string[];
  sources_text: string;
  image_url?: string | null;
  image_license_declared?: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
  approved_hero_slug?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<SubmissionRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Edit / Override fields for publishing
  const [overrideSlug, setOverrideSlug] = useState('');
  const [overrideTagline, setOverrideTagline] = useState('');
  const [overrideUnsungReason, setOverrideUnsungReason] = useState('');
  const [overrideImageUrl, setOverrideImageUrl] = useState('');

  // Rejection modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const data: SubmissionRecord[] = await res.json();
        setSubmissions(data);
        if (data.length > 0 && !selectedSub) {
          setSelectedSub(data[0]);
          initOverrides(data[0]);
        }
      }
    } catch (err) {
      console.error('Error loading submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const initOverrides = (sub: SubmissionRecord) => {
    const defaultSlug = sub.hero_name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');
    setOverrideSlug(sub.approved_hero_slug || defaultSlug);
    setOverrideTagline(
      `${sub.hero_name} was an inspirational pioneer from ${sub.state} who contributed crucially to ${sub.primary_domain}.`
    );
    setOverrideUnsungReason(
      `Despite their monumental sacrifices for ${sub.state} and the Indian nation, their story was overshadowed in national school textbooks.`
    );
    setOverrideImageUrl(sub.image_url || '');
  };

  const handleSelect = (sub: SubmissionRecord) => {
    setSelectedSub(sub);
    initOverrides(sub);
    setActionSuccessMsg(null);
  };

  const handleApprove = async () => {
    if (!selectedSub) return;
    setIsProcessing(true);
    setActionSuccessMsg(null);

    try {
      const payload = {
        slug: overrideSlug,
        tagline: overrideTagline,
        is_unsung_reason: overrideUnsungReason,
        image_url: overrideImageUrl || selectedSub.image_url,
      };

      const res = await fetch(`/api/submissions/${selectedSub.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        setActionSuccessMsg(`Successfully published ${selectedSub.hero_name} to live catalog!`);
        // Refresh local list
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === selectedSub.id
              ? { ...s, status: 'APPROVED', approved_hero_slug: result.published_hero?.slug || overrideSlug }
              : s
          )
        );
        setSelectedSub((prev) =>
          prev
            ? { ...prev, status: 'APPROVED', approved_hero_slug: result.published_hero?.slug || overrideSlug }
            : null
        );
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to approve submission.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error occurred while approving.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSub) return;
    setIsProcessing(true);

    try {
      const res = await fetch(`/api/submissions/${selectedSub.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejection_reason: rejectionReason || undefined }),
      });

      if (res.ok) {
        setShowRejectModal(false);
        setRejectionReason('');
        setActionSuccessMsg(`Submission marked as REJECTED.`);
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === selectedSub.id ? { ...s, status: 'REJECTED', rejection_reason: rejectionReason } : s
          )
        );
        setSelectedSub((prev) => (prev ? { ...prev, status: 'REJECTED' } : null));
      } else {
        alert('Failed to reject submission.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error occurred while rejecting.');
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingCount = submissions.filter((s) => s.status === 'SUBMITTED').length;
  const approvedCount = submissions.filter((s) => s.status === 'APPROVED').length;
  const rejectedCount = submissions.filter((s) => s.status === 'REJECTED').length;

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
            <span>EDITORIAL MODERATION & CURATION DESK</span>
          </div>
          <h1 className="font-cinematic text-2xl sm:text-4xl font-bold text-white mt-1">
            Community Nominations Queue
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Review community-submitted unsung heroes, inspect provenance, and one-click publish directly into the national live catalog with oral narration and poster templates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubmissions}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh submissions"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-saffron-400' : ''}`} />
          </button>
          
          <Link
            href="/suggest"
            className="px-4 py-2 rounded-xl bg-saffron-500/20 border border-saffron-500/40 text-saffron-300 hover:bg-saffron-500/30 text-xs font-semibold transition-all"
          >
            + Nominate Hero
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
        {[
          { id: 'ALL', label: 'All Submissions', count: submissions.length },
          { id: 'SUBMITTED', label: 'Pending Review', count: pendingCount, highlight: pendingCount > 0 },
          { id: 'APPROVED', label: 'Approved & Published', count: approvedCount },
          { id: 'REJECTED', label: 'Rejected', count: rejectedCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              statusFilter === tab.id
                ? 'bg-saffron-500/20 border-saffron-500 text-saffron-300 shadow-saffron-glow'
                : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                tab.highlight
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : statusFilter === tab.id
                  ? 'bg-saffron-500/30 text-saffron-200'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: Queue on Left (5 Cols), Detail on Right (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Submissions List */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-glass rounded-2xl border border-white/5 text-slate-400 text-xs space-y-2">
              <Clock className="w-8 h-8 text-slate-500 mx-auto" />
              <p>No submissions found under the selected filter.</p>
            </div>
          ) : (
            filtered.map((s) => {
              const isSelected = selectedSub?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelect(s)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-saffron-500/10 border-saffron-500/60 shadow-saffron-glow'
                      : 'bg-glass border-white/5 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                        {s.image_url ? (
                          <img
                            src={`/api/image-proxy?url=${encodeURIComponent(s.image_url)}`}
                            alt={s.hero_name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {s.hero_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="font-cinematic font-bold text-white text-sm">
                        {s.hero_name}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        s.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : s.status === 'REJECTED'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {s.status === 'SUBMITTED' ? 'PENDING' : s.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-1">
                    {s.state} • {s.primary_domain} {s.birth_year ? `(${s.birth_year} - ${s.death_year || '?'})` : ''}
                  </p>

                  <p className="text-[11px] text-slate-500 mt-2 flex items-center justify-between border-t border-white/5 pt-2">
                    <span>By: {s.submitter_name}</span>
                    <span>{new Date(s.created_at).toLocaleDateString()}</span>
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Submission Inspector */}
        {selectedSub ? (
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-glass-card border border-white/15 space-y-6 shadow-2xl">
            {/* Top Status & Identity */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-white/15 shrink-0 shadow-lg">
                  {selectedSub.image_url ? (
                    <img
                      src={`/api/image-proxy?url=${encodeURIComponent(selectedSub.image_url)}`}
                      alt={selectedSub.hero_name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-cinematic font-bold text-xl">
                      {selectedSub.hero_name.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs font-semibold text-saffron-400 uppercase tracking-widest">
                    {selectedSub.state} • {selectedSub.primary_domain}
                  </span>
                  <h2 className="font-cinematic text-2xl sm:text-3xl font-bold text-white mt-0.5">
                    {selectedSub.hero_name}
                  </h2>
                  {selectedSub.hero_name_local && (
                    <p className="text-sm text-saffron-300/90 font-indic mt-0.5">
                      {selectedSub.hero_name_local}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-full uppercase ${
                    selectedSub.status === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : selectedSub.status === 'REJECTED'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {selectedSub.status === 'SUBMITTED' ? 'PENDING EDITORIAL REVIEW' : selectedSub.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ID: {selectedSub.id}</span>
              </div>
            </div>

            {/* Success Message Banner */}
            {actionSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{actionSuccessMsg}</span>
                </div>
                {selectedSub.approved_hero_slug && (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/heroes/${selectedSub.approved_hero_slug}`}
                      className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                    >
                      View Live Hero Page
                    </Link>
                    <Link
                      href={`/banners?hero=${selectedSub.approved_hero_slug}`}
                      className="px-3 py-1 rounded-lg bg-slate-900 text-emerald-300 border border-emerald-500/30 hover:bg-slate-800 transition-colors"
                    >
                      Poster Studio
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Submitter Provenance */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">Submitted By:</span>
                <span className="font-semibold text-slate-200">{selectedSub.submitter_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Submitter Email:</span>
                <span className="font-mono text-slate-300">{selectedSub.submitter_email}</span>
              </div>
            </div>

            {/* Narrative Bio */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-400 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Biographical Summary</span>
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-white/5">
                {selectedSub.short_bio}
              </p>
            </div>

            {/* Key Contributions */}
            {selectedSub.key_contributions && selectedSub.key_contributions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-400">
                  Documented Milestones ({selectedSub.key_contributions.length})
                </h4>
                <ul className="space-y-1.5">
                  {selectedSub.key_contributions.map((c, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-white/5">
                      <span className="w-4 h-4 rounded-full bg-saffron-500/20 text-saffron-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Primary Source Provenance */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Primary Archival Citations</span>
              </h4>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-mono leading-relaxed">
                {selectedSub.sources_text || 'None explicitly provided.'}
              </div>
            </div>

            {/* Editorial Enrichment & Pre-Publish Tuning */}
            {selectedSub.status !== 'REJECTED' && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-400 flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editorial Pre-Publish Customization</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Catalog URL Slug</label>
                    <input
                      type="text"
                      value={overrideSlug}
                      disabled={selectedSub.status === 'APPROVED'}
                      onChange={(e) => setOverrideSlug(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white font-mono text-xs focus:border-saffron-500 focus:outline-none"
                      placeholder="e.g. khudiram-bose"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Portrait URL (Wikimedia)</label>
                    <input
                      type="text"
                      value={overrideImageUrl}
                      onChange={(e) => setOverrideImageUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white font-mono text-xs focus:border-saffron-500 focus:outline-none"
                      placeholder="https://upload.wikimedia.org/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Catchy Hero Tagline</label>
                  <input
                    type="text"
                    value={overrideTagline}
                    onChange={(e) => setOverrideTagline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs focus:border-saffron-500 focus:outline-none"
                    placeholder="Short 1-line impact statement"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Why They Remained Unsung</label>
                  <input
                    type="text"
                    value={overrideUnsungReason}
                    onChange={(e) => setOverrideUnsungReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs focus:border-saffron-500 focus:outline-none"
                    placeholder="Reason for historical omission"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/10">
              {selectedSub.status === 'APPROVED' ? (
                <div className="flex items-center gap-3 w-full">
                  <Link
                    href={`/heroes/${selectedSub.approved_hero_slug || overrideSlug}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-saffron-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-saffron-400 transition-all shadow-saffron-glow"
                  >
                    <Globe className="w-4 h-4" />
                    <span>View Published Hero Page</span>
                  </Link>
                  <Link
                    href={`/banners?hero=${selectedSub.approved_hero_slug || overrideSlug}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 border border-saffron-500/40 text-saffron-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Open in Poster Studio</span>
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Proposal</span>
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isProcessing ? 'Publishing to Catalog...' : 'Approve & Publish to Catalog'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 rounded-2xl bg-glass border border-white/10 text-center text-slate-400 space-y-3">
            <Eye className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-cinematic font-bold text-white text-lg">Select a Nomination</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click any hero submission on the left to inspect documentation, edit metadata, and publish into the live national database.
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-cinematic font-bold text-white text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span>Reject Submission</span>
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Provide editorial feedback explaining why this submission cannot be accepted at this time:
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-red-500 focus:outline-none"
              placeholder="e.g. Insufficient primary source documentation or conflicting regional records."
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="px-5 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
