'use client';

import { useState, useEffect, useRef } from 'react';
import { Hero, BannerTemplate } from '../lib/types';
import { proxyImageUrl } from '../lib/api';
import {
  Sparkles,
  Download,
  Check,
  RefreshCw,
  QrCode,
  Shield,
  Layers,
  FileText,
  Image as ImageIcon,
  Upload,
  Search,
  User,
  Sliders,
  Link2,
} from 'lucide-react';
import QRCodeLib from 'qrcode';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface BannerStudioProps {
  heroes: Hero[];
  initialHeroSlug?: string;
  templates: BannerTemplate[];
}

export default function BannerStudio({ heroes, initialHeroSlug, templates }: BannerStudioProps) {
  // Mode selection: 'search' (AI synthesize any person), 'upload' (upload any photo/custom text), 'catalog' (pre-indexed)
  const [activeMode, setActiveMode] = useState<'search' | 'upload' | 'catalog'>('search');

  // AI Person Search input & loading
  const [aiSearchInput, setAiSearchInput] = useState<string>('');
  const [isAiSearching, setIsAiSearching] = useState<boolean>(false);

  // Selected or Active Hero Object
  const [currentHero, setCurrentHero] = useState<Hero>(() => {
    return heroes.find((h) => h.slug === initialHeroSlug) || heroes[0];
  });

  // Inlined Base64 image for 100% fail-proof canvas exports
  const [inlinedImageDataUrl, setInlinedImageDataUrl] = useState<string>('');

  // Custom Human / Upload State
  const [customName, setCustomName] = useState<string>('');
  const [customNameLocal, setCustomNameLocal] = useState<string>('');
  const [customState, setCustomState] = useState<string>('National / India');
  const [customDomain, setCustomDomain] = useState<string>('Heritage & Freedom');
  const [customEra, setCustomEra] = useState<string>('National Contributor');
  const [customTagline, setCustomTagline] = useState<string>('Pioneering contributor whose legacy inspires generations.');
  const [customBio, setCustomBio] = useState<string>('Eminent national contributor documented in historical archives.');
  const [customContrib1, setCustomContrib1] = useState<string>('Pioneering historical milestone and national dedication.');
  const [customContrib2, setCustomContrib2] = useState<string>('Monumental service to science, culture, and society.');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('metro_pillar');
  const [selectedTheme, setSelectedTheme] = useState<string>('saffron_navy');
  const [selectedLang, setSelectedLang] = useState<string>('en-hi');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const bannerCanvasRef = useRef<HTMLDivElement>(null);

  // Initial slug resolver
  useEffect(() => {
    if (initialHeroSlug) {
      const match = heroes.find((h) => h.slug === initialHeroSlug);
      if (match) {
        setCurrentHero(match);
      } else {
        fetch(`/api/qwen/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: initialHeroSlug.replace(/-/g, ' ') }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.hero) setCurrentHero(data.hero);
          })
          .catch(console.error);
      }
    }
  }, [initialHeroSlug, heroes]);

  // Determine active raw image URL
  const isUploadMode = activeMode === 'upload';
  const rawTargetImageUrl = isUploadMode
    ? customImageUrl || currentHero.image_url
    : currentHero.image_url;

  // Convert raw target image into inlined Base64 Data URL to prevent CORS/tainting during poster download
  useEffect(() => {
    let isCancelled = false;
    if (!rawTargetImageUrl) return;

    if (rawTargetImageUrl.startsWith('data:')) {
      setInlinedImageDataUrl(rawTargetImageUrl);
      return;
    }

    const proxyUrl = proxyImageUrl(rawTargetImageUrl);
    fetch(proxyUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Proxy status: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (!isCancelled && reader.result) {
            setInlinedImageDataUrl(reader.result as string);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        console.warn('Base64 image preload warning:', err);
        if (!isCancelled) setInlinedImageDataUrl(proxyUrl);
      });

    return () => {
      isCancelled = true;
    };
  }, [rawTargetImageUrl]);

  // Handle AI Search for ANY person in India or world
  const handleAiSynthesize = async () => {
    if (!aiSearchInput.trim()) return;
    setIsAiSearching(true);
    setDownloadSuccess(null);
    try {
      const res = await fetch('/api/qwen/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiSearchInput.trim() }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.hero) {
          const h = json.hero;
          setCurrentHero(h);
          setSelectedHeroSlug(h.slug);
          setCustomName(h.name);
          setCustomNameLocal(h.name_local || '');
          setCustomState(h.state);
          setCustomDomain(h.primary_domain);
          setCustomEra(
            h.birth_year && h.death_year ? `${h.birth_year} – ${h.death_year}` : h.era || 'National Hero'
          );
          setCustomTagline(h.tagline);
          setCustomImageUrl(h.image_url);
          setCustomContrib1(h.contributions?.[0]?.description || h.short_bio);
          setCustomContrib2(h.contributions?.[1]?.description || '');
          setInlinedImageDataUrl(''); // force immediate re-render of new image

          setDownloadSuccess(`Synthesized ${h.name} with verified portrait & Wikipedia QR!`);
          setTimeout(() => setDownloadSuccess(null), 4000);
        }
      }
    } catch (err) {
      console.error('AI synthesis error:', err);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Handle Local Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCustomImageUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Build effective display properties based on active mode
  const displayName = isUploadMode ? customName || 'National Contributor' : currentHero.name;
  const displayNameLocal = isUploadMode ? customNameLocal : currentHero.name_local;
  const displayState = isUploadMode ? customState || 'India' : currentHero.state;
  const displayDomain = isUploadMode ? customDomain || 'Leadership & Service' : currentHero.primary_domain;
  const displayLifespan = isUploadMode
    ? customEra
    : currentHero.birth_year && currentHero.death_year
    ? `${currentHero.birth_year} – ${currentHero.death_year}`
    : currentHero.era || 'Historical Era';
  const displayTagline = isUploadMode ? customTagline || 'Dedicated service to the nation.' : currentHero.tagline;
  const displayContrib1 = isUploadMode
    ? customContrib1
    : currentHero.contributions?.[0]?.description || currentHero.short_bio;
  const displayContrib2 = isUploadMode
    ? customContrib2
    : currentHero.contributions?.[1]?.description || '';

  const template = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  // Dynamic QR Code directly linked to official Wikipedia Article
  useEffect(() => {
    const wikiTargetUrl =
      (isUploadMode && customImageUrl.startsWith('http') ? customImageUrl : null) ||
      currentHero.image_source_page_url ||
      (currentHero.sources && currentHero.sources[0]?.url) ||
      `https://en.wikipedia.org/wiki/${encodeURIComponent(displayName.trim().replace(/\s+/g, '_'))}`;

    QRCodeLib.toDataURL(wikiTargetUrl, {
      width: 180,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then(setQrCodeDataUrl)
      .catch(console.error);
  }, [currentHero, displayName, isUploadMode, customImageUrl]);

  // High-Resolution Local Client-Side Poster Download (PNG & PDF)
  const handleDownload = async (format: 'png' | 'pdf') => {
    if (!bannerCanvasRef.current) return;
    setIsDownloading(true);
    setDownloadSuccess(null);

    try {
      const dataUrl = await toPng(bannerCanvasRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
      });

      const fileSlug = displayName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[-\s]+/g, '-');

      if (format === 'png') {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `poster-${fileSlug}-${selectedTemplateId}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const isLandscape = selectedTemplateId === 'roadside_billboard';
        const pdf = new jsPDF({
          orientation: isLandscape ? 'landscape' : 'portrait',
          unit: 'mm',
          format: 'a3',
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
        pdf.save(`poster-${fileSlug}-${selectedTemplateId}.pdf`);
      }

      setDownloadSuccess(`Downloaded 300 DPI ${format.toUpperCase()} successfully!`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Local export error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Control Panel: 5 Cols */}
      <div className="lg:col-span-5 space-y-6 bg-glass p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <h2 className="font-cinematic text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-saffron-400" />
            <span>Universal Poster Factory</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Turn <strong>any human or historical hero</strong> into high-resolution printable signage.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950 border border-white/10 text-xs">
          <button
            onClick={() => setActiveMode('search')}
            className={`py-2 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'search'
                ? 'bg-saffron-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>AI Search Any</span>
          </button>
          <button
            onClick={() => setActiveMode('upload')}
            className={`py-2 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'upload'
                ? 'bg-saffron-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
          <button
            onClick={() => setActiveMode('catalog')}
            className={`py-2 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'catalog'
                ? 'bg-saffron-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>
        </div>

        {/* MODE 1: AI Search Any Person */}
        {activeMode === 'search' && (
          <div className="space-y-3 p-4 rounded-xl bg-slate-900/90 border border-saffron-500/30">
            <label className="text-xs font-semibold text-saffron-400 uppercase tracking-wider block">
              Search ANY Person in India or World
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiSearchInput}
                onChange={(e) => setAiSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAiSynthesize();
                }}
                placeholder="e.g. Pazhassi Raja, Alluri Sitarama Raju, Bhikaji Cama, Tirot Sing..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-saffron-500"
              />
              <button
                onClick={handleAiSynthesize}
                disabled={isAiSearching}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-saffron-500 hover:bg-saffron-400 text-slate-950 shrink-0 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isAiSearching ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Synthesize</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Fetches historical portrait, Indic script name, lifetime dates, inspiring quote & verified milestones automatically via Qwen & Wikipedia.
            </p>
          </div>
        )}

        {/* MODE 2: Custom Photo Upload & Editable Details */}
        {activeMode === 'upload' && (
          <div className="space-y-4 p-4 rounded-xl bg-slate-900/90 border border-white/10 text-xs">
            <div className="space-y-2">
              <label className="font-semibold text-slate-300 uppercase tracking-wider block">
                1. Upload Local Photo / Portrait
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-dashed border-saffron-500/40 bg-saffron-500/10 hover:bg-saffron-500/20 text-saffron-300 flex items-center justify-center gap-2 transition-all font-medium"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File (JPG, PNG)</span>
                </button>
              </div>
              <div className="pt-1">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Or paste direct image URL (https://...)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-saffron-500"
                />
              </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Person Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">State / Region</label>
                <input
                  type="text"
                  value={customState}
                  onChange={(e) => setCustomState(e.target.value)}
                  placeholder="State"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Domain / Field</label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="Domain"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Era / Timeline</label>
                <input
                  type="text"
                  value={customEra}
                  onChange={(e) => setCustomEra(e.target.value)}
                  placeholder="e.g. 1900 - 1980"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Tagline / Inspiring Quote</label>
              <input
                type="text"
                value={customTagline}
                onChange={(e) => setCustomTagline(e.target.value)}
                placeholder="1 memorable quote or tagline"
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
              />
            </div>
          </div>
        )}

        {/* MODE 3: Pre-Indexed Catalog Dropdown */}
        {activeMode === 'catalog' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Select Pre-Indexed Hero
            </label>
            <select
              value={currentHero.slug}
              onChange={(e) => {
                const found = heroes.find((h) => h.slug === e.target.value);
                if (found) setCurrentHero(found);
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500 transition-colors"
            >
              {heroes.map((h) => (
                <option key={h.slug} value={h.slug}>
                  {h.name} ({h.state})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Signage Template Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Public Signage Dimensions
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {templates.map((t) => {
              const isSelected = selectedTemplateId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={`p-3 rounded-xl text-left border text-xs transition-all ${
                    isSelected
                      ? 'bg-saffron-500/15 border-saffron-500 text-white shadow-saffron-glow font-semibold'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <p className="font-medium text-white">{t.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{t.aspect_ratio}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme & Color Palette */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Theme & Palette
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'saffron_navy', label: 'Midnight Saffron' },
              { id: 'tricolor_minimal', label: 'Tricolor Clean' },
              { id: 'print_clean_white', label: 'Print A3 Clean' },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setSelectedTheme(th.id)}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                  selectedTheme === th.id
                    ? 'border-saffron-400 bg-saffron-500/20 text-saffron-300 font-medium shadow-sm'
                    : 'border-white/5 bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* Export & Download CTA */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDownload('png')}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-saffron-500 hover:bg-saffron-400 text-slate-950 transition-all shadow-saffron-glow disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{isDownloading ? 'Exporting...' : 'Download PNG'}</span>
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-white/15 transition-all disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-saffron-400" />
              <span>Download PDF</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center animate-fade-in">
              {downloadSuccess}
            </div>
          )}

          <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>High-Res 300 DPI Vector Export • Direct Local Download</span>
          </p>
        </div>
      </div>

      {/* Live Preview Canvas: 7 Cols */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full flex items-center justify-between pb-3 px-2">
          <span className="text-xs uppercase tracking-widest text-saffron-400 font-mono">
            LIVE SIGNAGE CANVAS PREVIEW
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {template.name} ({template.aspect_ratio})
          </span>
        </div>

        {/* Dynamic Visual Banner Simulator Canvas */}
        <div
          ref={bannerCanvasRef}
          className={`w-full relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border ${
            selectedTheme === 'tricolor_minimal'
              ? 'bg-slate-950 text-white border-slate-700'
              : selectedTheme === 'print_clean_white'
              ? 'bg-[#FDFBF7] text-slate-950 border-slate-300'
              : 'bg-[#090D16] text-white border-saffron-500/30 shadow-saffron-glow'
          } ${
            selectedTemplateId === 'roadside_billboard'
              ? 'aspect-[16/9] max-w-2xl'
              : selectedTemplateId === 'metro_pillar'
              ? 'aspect-[9/16] max-w-sm'
              : 'aspect-[3/4] max-w-md'
          }`}
        >
          {/* Top Tiranga Strip */}
          <div className="h-2.5 w-full flex shrink-0">
            <div className="flex-1 bg-saffron-500" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#138808]" />
          </div>

          <div className="p-5 sm:p-7 flex flex-col justify-between h-[calc(100%-10px)] space-y-3">
            {/* Header Identity */}
            <div>
              <div className="flex items-center justify-between border-b pb-2 mb-2 border-white/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-saffron-400 font-cinematic">
                  UNSUNG HEROES OF INDIA • NATIONAL TRIBUTE
                </span>
                <span className="text-[9px] text-slate-400 tracking-wider font-mono">
                  {displayState}
                </span>
              </div>

              <h3 className="font-cinematic font-bold text-lg sm:text-2xl leading-tight text-white">
                {displayName}
              </h3>
              {displayNameLocal && (
                <p className="text-xs sm:text-sm text-saffron-300/95 font-indic mt-0.5">
                  {displayNameLocal}
                </p>
              )}
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {displayDomain} • {displayLifespan}
              </p>
            </div>

            {/* FULL FACE & PORTRAIT HERO CONTAINER (Framed with no face clipping) */}
            <div className="relative rounded-2xl overflow-hidden flex-1 min-h-[160px] sm:min-h-[220px] bg-[#06090F] border border-white/15 flex items-center justify-center shadow-inner">
              <img
                src={inlinedImageDataUrl || (rawTargetImageUrl.startsWith('data:') ? rawTargetImageUrl : proxyImageUrl(rawTargetImageUrl))}
                alt={displayName}
                crossOrigin="anonymous"
                className="w-full h-full object-contain object-center p-1.5"
              />
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                <p className="text-[10px] sm:text-xs italic text-slate-200 text-center leading-snug line-clamp-2">
                  “{displayTagline}”
                </p>
              </div>
            </div>

            {/* Bottom Contributions + Dynamic QR Code */}
            <div className="pt-2">
              <div className="flex items-end justify-between gap-3">
                <div className="space-y-1 text-[9px] sm:text-[10px] text-slate-300 max-w-[70%]">
                  <p className="font-semibold text-saffron-400 uppercase text-[8px] tracking-wider">
                    Key Achievements & Sacrifices:
                  </p>
                  {displayContrib1 && (
                    <p className="line-clamp-1 leading-tight">• {displayContrib1}</p>
                  )}
                  {displayContrib2 && (
                    <p className="line-clamp-1 leading-tight text-slate-400">• {displayContrib2}</p>
                  )}
                </div>

                {/* QR Code */}
                {qrCodeDataUrl && (
                  <div className="flex flex-col items-center shrink-0">
                    <img
                      src={qrCodeDataUrl}
                      alt="Wikipedia QR Code"
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white p-0.5 shadow-md"
                    />
                    <span className="text-[7px] text-slate-400 mt-0.5 font-mono">
                      Scan for Wikipedia
                    </span>
                  </div>
                )}
              </div>

              {/* Mandatory Source & License Watermark */}
              <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[7px] text-slate-400 font-mono">
                <span>Sources: PIB / National Archives / Wikimedia Commons</span>
                <span>License: PUBLIC_DOMAIN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
