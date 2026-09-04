'use client';

import { useState } from 'react';
import { Send, ShieldAlert, CheckCircle2, AlertCircle, FileText, Image as ImageIcon, Link as LinkIcon, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function SuggestHeroPage() {
  const [formData, setFormData] = useState({
    submitter_name: '',
    submitter_email: '',
    hero_name: '',
    hero_name_local: '',
    state: '',
    primary_domain: 'Freedom Struggle',
    birth_year: '',
    death_year: '',
    short_bio: '',
    key_contribution_1: '',
    key_contribution_2: '',
    key_contribution_3: '',
    sources_text: '',
    image_url: '',
    image_license_declared: 'PUBLIC_DOMAIN',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const key_contributions = [
      formData.key_contribution_1,
      formData.key_contribution_2,
      formData.key_contribution_3,
    ].filter((c) => c.trim().length > 0);

    const payload = {
      submitter_name: formData.submitter_name.trim(),
      submitter_email: formData.submitter_email.trim(),
      hero_name: formData.hero_name.trim(),
      hero_name_local: formData.hero_name_local ? formData.hero_name_local.trim() : null,
      state: formData.state.trim(),
      primary_domain: formData.primary_domain,
      birth_year: formData.birth_year ? parseInt(formData.birth_year) : null,
      death_year: formData.death_year ? parseInt(formData.death_year) : null,
      short_bio: formData.short_bio.trim(),
      key_contributions,
      sources_text: formData.sources_text.trim(),
      image_url: formData.image_url.trim() || null,
      image_license_declared: formData.image_license_declared,
    };

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setTrackingId(data.submission?.id || 'sub-registered');
        setSubmitSuccess(true);
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMessage(err.error || 'Failed to submit proposal. Please verify all required fields.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error while submitting. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs font-semibold">
          <Send className="w-3.5 h-3.5" />
          <span>CROWDSOURCED PUBLIC ARCHIVE</span>
        </div>
        <h1 className="font-cinematic text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Nominate an Unsung Hero
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Help India document forgotten figures from your district or state. Every submission is archived in our editorial moderation queue, rigorously fact-checked against primary sources, and published into the national digital catalog with Indic voice narration and poster generator support.
        </p>
      </div>

      {submitSuccess ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-glass border border-emerald-500/40 text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-cinematic text-2xl sm:text-3xl font-bold text-white">
              Nomination Successfully Submitted!
            </h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
              Thank you for contributing to India’s permanent oral and historical archive. Your proposal has been queued for editorial review.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <span className="text-slate-400">Archival Tracking ID:</span>
            <span className="font-bold text-emerald-400">{trackingId}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="/admin/submissions"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-saffron-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-saffron-400 transition-all shadow-saffron-glow"
            >
              Open Editorial Moderation Desk
            </a>
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setFormData({
                  submitter_name: '',
                  submitter_email: '',
                  hero_name: '',
                  hero_name_local: '',
                  state: '',
                  primary_domain: 'Freedom Struggle',
                  birth_year: '',
                  death_year: '',
                  short_bio: '',
                  key_contribution_1: '',
                  key_contribution_2: '',
                  key_contribution_3: '',
                  sources_text: '',
                  image_url: '',
                  image_license_declared: 'PUBLIC_DOMAIN',
                });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors border border-white/10"
            >
              Nominate Another Hero
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 bg-glass p-6 sm:p-10 rounded-2xl border border-white/10 shadow-2xl">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submitter Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-400 border-b border-white/10 pb-2">
              1. Contributor Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.submitter_name}
                  onChange={(e) => setFormData({ ...formData, submitter_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                  placeholder="e.g. Dr. Rajesh Sharma"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Your Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.submitter_email}
                  onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                  placeholder="e.g. rajesh@university.ac.in"
                />
              </div>
            </div>
          </div>

          {/* Hero Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-400 border-b border-white/10 pb-2">
              2. Historical Hero Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Hero Full Name (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.hero_name}
                  onChange={(e) => setFormData({ ...formData, hero_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                  placeholder="e.g. Bina Das"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Name in Local Indic Script (Optional)</label>
                <input
                  type="text"
                  value={formData.hero_name_local}
                  onChange={(e) => setFormData({ ...formData, hero_name_local: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                  placeholder="e.g. বীণা দাস"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">State / Region of Activity *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                  placeholder="e.g. West Bengal, Assam, Tamil Nadu"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Primary Domain *</label>
                <select
                  value={formData.primary_domain}
                  onChange={(e) => setFormData({ ...formData, primary_domain: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                >
                  <option value="Freedom Struggle">Freedom Struggle</option>
                  <option value="Science & Discovery">Science & Discovery</option>
                  <option value="Medicine & Health">Medicine & Health</option>
                  <option value="Mathematics & Astronomy">Mathematics & Astronomy</option>
                  <option value="Social Reform & Education">Social Reform & Education</option>
                  <option value="Music, Arts & Literature">Music, Arts & Literature</option>
                  <option value="Tribal Resistance">Tribal Resistance</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Birth Year (Approx / Exact)</label>
                <input
                  type="number"
                  value={formData.birth_year}
                  onChange={(e) => setFormData({ ...formData, birth_year: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                  placeholder="1911"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Death Year (Approx / Exact)</label>
                <input
                  type="number"
                  value={formData.death_year}
                  onChange={(e) => setFormData({ ...formData, death_year: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                  placeholder="1986"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Biographical Narrative (Original Summary) *</label>
              <textarea
                required
                rows={4}
                value={formData.short_bio}
                onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500 leading-relaxed"
                placeholder="Write a concise 100-250 word summary of their life, contributions, sacrifices, and historical significance..."
              />
            </div>
          </div>

          {/* Key Contributions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-400 border-b border-white/10 pb-2">
              3. Key Contributions / Milestones
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                required
                value={formData.key_contribution_1}
                onChange={(e) => setFormData({ ...formData, key_contribution_1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                placeholder="Milestone 1 *: e.g. Attempted assassination of Bengal Governor Stanley Jackson at University of Calcutta convocation (1932)."
              />
              <input
                type="text"
                value={formData.key_contribution_2}
                onChange={(e) => setFormData({ ...formData, key_contribution_2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                placeholder="Milestone 2: e.g. Active leader in Chhatri Sangha (Female Students Association) organizing youth resistance."
              />
              <input
                type="text"
                value={formData.key_contribution_3}
                onChange={(e) => setFormData({ ...formData, key_contribution_3: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                placeholder="Milestone 3: e.g. Awarded Padma Shri (1960) for lifelong social work in Kolkata."
              />
            </div>
          </div>

          {/* Wikimedia Portrait */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-400 border-b border-white/10 pb-2 flex items-center justify-between">
              <span>4. Wikimedia Commons Portrait (Optional)</span>
              <span className="text-[11px] text-slate-400 font-normal">Public Domain / CC-BY</span>
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => {
                    setFormData({ ...formData, image_url: e.target.value });
                    setImagePreviewError(false);
                  }}
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500 font-mono text-xs"
                  placeholder="https://upload.wikimedia.org/wikipedia/commons/..."
                />
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>

              {formData.image_url && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden relative bg-slate-800 shrink-0 border border-white/10">
                    {!imagePreviewError ? (
                      <img
                        src={`/api/image-proxy?url=${encodeURIComponent(formData.image_url)}`}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                        onError={() => setImagePreviewError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-white">Live Image Proxy Preview</p>
                    <p className="text-[11px] text-slate-400">
                      {imagePreviewError
                        ? 'Image could not be loaded via proxy. Check URL.'
                        : 'Image successfully verified for high-resolution rendering.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary Sourcing */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-400 border-b border-white/10 pb-2">
              5. Primary Citations & Provenance *
            </h3>
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                To guarantee zero-hallucination standards, provide verifiable references (National Archives of India, State Gazetteers, PIB Historical Series, or published scholarly monographs).
              </span>
            </div>
            <textarea
              required
              rows={3}
              value={formData.sources_text}
              onChange={(e) => setFormData({ ...formData, sources_text: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500 leading-relaxed"
              placeholder="e.g. National Archives of India; 'Shrinkhal Jhankar' autobiography by Bina Das; Calcutta Police Special Branch Dossier (1932)."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-saffron-400 to-amber-400 hover:from-saffron-300 hover:to-amber-300 transition-all text-sm shadow-saffron-glow cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Archiving into Moderation Desk...' : 'Submit Hero for Editorial Review'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
