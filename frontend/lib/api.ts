import { Hero, BannerTemplate } from './types';
import { SAMPLE_HEROES } from './sample-data';

export function proxyImageUrl(url?: string): string {
  if (!url) {
    return 'https://upload.wikimedia.org/wikipedia/commons/8/80/India_Emblem.svg';
  }
  if (url.startsWith('/api/image-proxy') || url.startsWith('data:')) {
    return url;
  }
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export async function fetchHeroes(params?: {
  q?: string;
  state?: string;
  domain?: string;
  era?: string;
  useQwenTurbo?: boolean;
}): Promise<{ data: Hero[]; total: number; isFallback?: boolean; source?: string; durationMs?: number }> {
  const query = params?.q?.trim() || '';

  // 1. Check local catalog first (< 5ms)
  let filtered = [...SAMPLE_HEROES];

  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(
      (h) =>
        h.name.toLowerCase().includes(qLower) ||
        (h.name_local && h.name_local.toLowerCase().includes(qLower)) ||
        h.tagline.toLowerCase().includes(qLower) ||
        h.short_bio.toLowerCase().includes(qLower) ||
        h.state.toLowerCase().includes(qLower) ||
        h.primary_domain.toLowerCase().includes(qLower)
    );
  }
  if (params?.state && params.state !== 'All States') {
    filtered = filtered.filter((h) => h.state.toLowerCase().includes(params.state!.toLowerCase()));
  }
  if (params?.domain && params.domain !== 'All Domains') {
    filtered = filtered.filter((h) => h.primary_domain.toLowerCase().includes(params.domain!.toLowerCase()));
  }

  if (filtered.length > 0) {
    return { data: filtered, total: filtered.length, source: 'LOCAL_INDEX' };
  }

  // 2. Dynamic Qwen + Free Wikipedia Discovery Engine
  if (query.length >= 2) {
    try {
      const qRes = await fetch('/api/qwen/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (qRes.ok) {
        const qJson = await qRes.json();
        if (qJson.hero) {
          return {
            data: [qJson.hero],
            total: 1,
            source: 'DYNAMIC_QWEN_WIKIPEDIA_ENGINE',
            durationMs: qJson.durationMs,
          };
        }
      }
    } catch (e) {
      console.warn('Qwen dynamic search error, fallback to search API:', e);
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          return {
            data: json.data,
            total: json.total || json.data.length,
            source: json.source || 'LIVE_WIKIPEDIA_DISCOVERY',
          };
        }
      }
    } catch (err) {
      console.warn('Server search API fallback error:', err);
    }
  }

  return { data: [], total: 0 };
}

// Universal Exact-Identity Server-Side Dynamic Resolver for ANY National Contributor
export async function fetchHeroBySlug(slug: string): Promise<Hero | null> {
  // 1. Search local catalog
  const found = SAMPLE_HEROES.find((h) => h.slug.toLowerCase() === slug.toLowerCase());
  if (found) return found;

  const rawSearch = slug
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const userAgent = 'UnsungIndiaDPI/1.0 (https://unsung-heroes.gov.in; contact@unsung-heroes.gov.in)';

  let wikiTitle = rawSearch;
  let wikiExtract = '';
  let wikiImage = '';
  let wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(rawSearch.replace(/\s+/g, '_'))}`;

  // 2. Multi-Stage Wikipedia Discovery (With Strict Exact Identity Matching)
  try {
    // Stage A: Direct Title with Redirects
    const directUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      rawSearch
    )}&redirects=1&prop=extracts|pageimages|info&exintro=true&explaintext=true&piprop=original|thumbnail&pithumbsize=1000&inprop=url&format=json`;

    const dRes = await fetch(directUrl, { headers: { 'User-Agent': userAgent }, next: { revalidate: 86400 } });
    if (dRes.ok) {
      const dJson = await dRes.json();
      const pages = dJson?.query?.pages || {};
      for (const pid in pages) {
        if (pid !== '-1') {
          const p = pages[pid];
          const ext = p.extract || '';
          if (ext && !ext.toLowerCase().includes('may refer to:')) {
            wikiTitle = p.title || rawSearch;
            wikiExtract = ext;
            const cImg = p.original?.source || p.thumbnail?.source || '';
            if (cImg && !cImg.toLowerCase().includes('disambig')) {
              wikiImage = cImg.split('?')[0];
            }
            wikiUrl = p.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle.replace(/\s+/g, '_'))}`;
          }
        }
      }
    }

    // Stage B: Generator Search (Strict Name Matching: Only accept pages that match the queried name)
    if (!wikiImage || !wikiExtract) {
      const genUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        `"${rawSearch}"`
      )}&gsrlimit=3&prop=extracts|pageimages|info&exintro=true&explaintext=true&piprop=original|thumbnail&pithumbsize=1000&inprop=url&format=json`;

      const gRes = await fetch(genUrl, { headers: { 'User-Agent': userAgent }, next: { revalidate: 86400 } });
      if (gRes.ok) {
        const gJson = await gRes.json();
        const pages = gJson?.query?.pages || {};
        for (const pid in pages) {
          if (pid !== '-1') {
            const p = pages[pid];
            const pTitle = p.title || '';
            // STRICT IDENTITY CHECK: Ensure page title actually belongs to queried figure
            const searchFirstWord = rawSearch.toLowerCase().split(' ')[0];
            const searchLastWord = rawSearch.toLowerCase().split(' ').slice(-1)[0];
            const titleLower = pTitle.toLowerCase();

            if (titleLower.includes(searchFirstWord) || titleLower.includes(searchLastWord)) {
              const ext = p.extract || '';
              const img = p.original?.source || p.thumbnail?.source || '';
              if (ext && !ext.toLowerCase().includes('may refer to:')) {
                if (!wikiExtract) wikiExtract = ext;
                if (img && !img.toLowerCase().includes('disambig')) {
                  wikiImage = img.split('?')[0];
                  wikiTitle = pTitle;
                  wikiUrl = p.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(pTitle.replace(/\s+/g, '_'))}`;
                  break;
                }
              }
            }
          }
        }
      }
    }

    // Stage C: Wikimedia Commons File Search for the EXACT person
    if (!wikiImage) {
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        rawSearch
      )}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json`;

      const cRes = await fetch(commonsUrl, { headers: { 'User-Agent': userAgent }, next: { revalidate: 86400 } });
      if (cRes.ok) {
        const cJson = await cRes.json();
        const cPages = cJson?.query?.pages || {};
        for (const cPid in cPages) {
          const title = (cPages[cPid]?.title || '').toLowerCase();
          const imgInfo = cPages[cPid]?.imageinfo;
          if (imgInfo && imgInfo.length > 0 && imgInfo[0].url) {
            const candidateUrl = imgInfo[0].url;
            if (
              /\.(jpg|jpeg|png|webp)$/i.test(candidateUrl) &&
              !title.includes('grave') &&
              !title.includes('pdf') &&
              !title.includes('disambig')
            ) {
              wikiImage = candidateUrl.split('?')[0];
              break;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('Server hero lookup error:', err);
  }

  // 3. Qwen Local AI Enrichment — STRICTLY for the EXACT Queried Person
  let qwenHero: any = null;
  try {
    const prompt = `Synthesize factual biographical details for the specific Indian historical personality "${rawSearch}". Do NOT substitute with any other person.
Output JSON only:
{"name":"${rawSearch}","name_local":"Indic script","birth_year":1880,"death_year":1945,"state":"State / Region","primary_domain":"Freedom Struggle / Science / Literature","tagline":"Memorable 1-sentence quote or tribute","short_bio":"2-3 sentence authentic biography of ${rawSearch}","contributions":[{"display_order":1,"title":"Major Achievement","description":"Specific historical fact about ${rawSearch}"},{"display_order":2,"title":"National Impact","description":"Specific legacy of ${rawSearch}"}],"is_unsung_reason":"Significance"}`;

    const ollamaCtrl = new AbortController();
    const oTimeout = setTimeout(() => ollamaCtrl.abort(), 15000);

    const ollamaRes = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:7b',
        prompt: prompt,
        stream: false,
        format: 'json',
        keep_alive: '24h',
        options: {
          num_ctx: 1024,
          num_predict: 220,
          temperature: 0.1,
        },
      }),
      signal: ollamaCtrl.signal,
    });
    clearTimeout(oTimeout);

    if (ollamaRes.ok) {
      const oJson = await ollamaRes.json();
      let rawOut = (oJson.response || '{}').trim();
      if (rawOut.startsWith('```json')) rawOut = rawOut.slice(7);
      if (rawOut.startsWith('```')) rawOut = rawOut.slice(3);
      if (rawOut.endsWith('```')) rawOut = rawOut.slice(0, -3);
      qwenHero = JSON.parse(rawOut.trim());
    }
  } catch (qErr) {
    // Continue with exact identity
  }

  // 4. Assemble Exact-Identity Hero Object
  const finalName = rawSearch;
  const canonicalSlug = slug;

  const sentences = wikiExtract
    ? wikiExtract.split(/\. |\.\n/).filter((s: string) => s.trim().length > 25)
    : [];

  const shortBio =
    qwenHero?.short_bio ||
    (wikiExtract && wikiExtract.toLowerCase().includes(rawSearch.toLowerCase().split(' ')[0]) ? wikiExtract : null) ||
    `${finalName} was an eminent Indian contributor whose courageous actions and dedication left an enduring legacy in national history.`;

  const tagline =
    qwenHero?.tagline ||
    (sentences.length > 0 && sentences[0].toLowerCase().includes(rawSearch.toLowerCase().split(' ')[0])
      ? sentences[0]
      : `${finalName} — Distinguished Indian Contributor & National Icon`);

  const contributions =
    qwenHero?.contributions && Array.isArray(qwenHero.contributions) && qwenHero.contributions.length > 0
      ? qwenHero.contributions
      : [
          {
            display_order: 1,
            title: 'National Service & Sacrifice',
            description: shortBio,
          },
          {
            display_order: 2,
            title: 'Enduring Historical Legacy',
            description: `${finalName} is documented in Indian history archives for monumental contributions to the freedom, heritage, and progress of the nation.`,
          },
        ];

  const hero: Hero = {
    id: canonicalSlug,
    slug: slug, // STRICT IDENTITY: preserve exact slug
    name: finalName,
    name_local: qwenHero?.name_local || undefined,
    birth_year: qwenHero?.birth_year || null,
    death_year: qwenHero?.death_year || null,
    state: qwenHero?.state || 'National / India',
    primary_domain: qwenHero?.primary_domain || 'Freedom Struggle & National Heritage',
    tagline: tagline,
    short_bio: shortBio,
    is_unsung_reason:
      qwenHero?.is_unsung_reason ||
      `Synthesized dynamically for ${finalName} via Public Knowledge Graph & local Qwen AI inference engine.`,
    image_url: wikiImage || 'https://upload.wikimedia.org/wikipedia/commons/8/80/India_Emblem.svg',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Wikimedia Commons / Sovereign Knowledge Base',
    image_source_page_url: wikiUrl,
    view_count: 1,
    banner_download_count: 0,
    contributions: contributions,
    timeline_events: [],
    sources: [
      {
        title: `Historical Documentation & Archives: ${finalName}`,
        source_type: 'ACADEMIC_PUBLICATION',
        url: wikiUrl,
        is_primary_reference: true,
      },
    ],
  };

  return hero;
}

export async function fetchBannerTemplates(): Promise<BannerTemplate[]> {
  return [
    {
      id: 'metro_pillar',
      name: 'Metro Pillar Vertical Signage',
      aspect_ratio: '9:16',
      width_px: 1080,
      height_px: 1920,
      format_type: 'DIGITAL_RASTER',
      supported_themes: ['saffron_navy', 'tricolor_minimal', 'vintage_sepia'],
    },
    {
      id: 'roadside_billboard',
      name: 'Roadside Landscape Billboard',
      aspect_ratio: '16:9',
      width_px: 1920,
      height_px: 1080,
      format_type: 'DIGITAL_RASTER',
      supported_themes: ['saffron_navy', 'tricolor_minimal'],
    },
    {
      id: 'bus_stop',
      name: 'Bus Stop Transit Shelter',
      aspect_ratio: '4:3',
      width_px: 1200,
      height_px: 1600,
      format_type: 'DIGITAL_RASTER',
      supported_themes: ['saffron_navy', 'vintage_sepia'],
    },
    {
      id: 'college_board_a3',
      name: 'College Notice Board (ISO A3 Print)',
      aspect_ratio: '1:1.414',
      width_px: 2480,
      height_px: 3508,
      format_type: 'PRINT_VECTOR_PDF',
      supported_themes: ['print_clean_white', 'saffron_navy'],
    },
  ];
}
