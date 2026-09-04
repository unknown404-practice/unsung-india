import { NextRequest, NextResponse } from 'next/server';
import { generateHistoricalSynthesis } from '@/lib/cloud-ai';

interface WikiResolvedData {
  wikiTitle: string;
  wikiExtract: string;
  wikiImage: string;
  wikiUrl: string;
}

// Global In-Memory Search Cache (< 1ms instant retrieval)
const SEARCH_CACHE = new Map<string, any>();

async function fetchDynamicHeroImageAndDetails(query: string): Promise<WikiResolvedData> {
  let wikiTitle = '';
  let wikiExtract = '';
  let wikiImage = '';
  let wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`;

  const userAgent = 'UnsungIndiaDPI/1.0 (https://unsung-heroes.gov.in; contact@unsung-heroes.gov.in)';

  try {
    const directUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      query
    )}&redirects=1&prop=extracts|pageimages|images|info&exintro=true&explaintext=true&piprop=original|thumbnail&pithumbsize=1000&inprop=url&format=json`;

    const genUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      `"${query}"`
    )}&gsrlimit=3&prop=extracts|pageimages|info&exintro=true&explaintext=true&piprop=original|thumbnail&pithumbsize=1000&inprop=url&format=json`;

    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      query
    )}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json`;

    // Fire all 3 Wikipedia endpoints concurrently
    const [dRes, gRes, cRes] = await Promise.allSettled([
      fetch(directUrl, { headers: { 'User-Agent': userAgent }, next: { revalidate: 86400 } }),
      fetch(genUrl, { headers: { 'User-Agent': userAgent }, next: { revalidate: 86400 } }),
      fetch(commonsUrl, { headers: { 'User-Agent': userAgent }, next: { revalidate: 86400 } }),
    ]);

    // Parse Direct
    if (dRes.status === 'fulfilled' && dRes.value.ok) {
      const dJson = await dRes.value.json();
      const pages = dJson?.query?.pages || {};
      for (const pid in pages) {
        if (pid !== '-1') {
          const p = pages[pid];
          const ext = p.extract || '';
          if (ext && !ext.toLowerCase().includes('may refer to:')) {
            wikiTitle = p.title || query;
            wikiExtract = ext;
            const candidateImg = p.original?.source || p.thumbnail?.source || '';
            if (candidateImg && !candidateImg.toLowerCase().includes('disambig')) {
              wikiImage = candidateImg.split('?')[0];
            }
            wikiUrl = p.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle.replace(/\s+/g, '_'))}`;
          }
        }
      }
    }

    // Parse Generator if needed
    if ((!wikiImage || !wikiExtract) && gRes.status === 'fulfilled' && gRes.value.ok) {
      const gJson = await gRes.value.json();
      const pages = gJson?.query?.pages || {};
      for (const pid in pages) {
        if (pid !== '-1') {
          const p = pages[pid];
          const ext = p.extract || '';
          const img = p.original?.source || p.thumbnail?.source || '';
          if (ext && !ext.toLowerCase().includes('may refer to:')) {
            if (!wikiTitle) wikiTitle = p.title;
            if (!wikiExtract) wikiExtract = ext;
            if (img && !img.toLowerCase().includes('disambig') && !wikiImage) {
              wikiImage = img.split('?')[0];
              wikiTitle = p.title;
              wikiExtract = ext;
              wikiUrl = p.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(p.title.replace(/\s+/g, '_'))}`;
              break;
            }
          }
        }
      }
    }

    // Parse Commons Image if needed
    if (!wikiImage && cRes.status === 'fulfilled' && cRes.value.ok) {
      const cJson = await cRes.value.json();
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
  } catch (err) {
    console.warn('Wikipedia fast discovery notice:', err);
  }

  return { wikiTitle, wikiExtract, wikiImage, wikiUrl };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const normKey = query.toLowerCase().trim();

    // 1. Instant Memory Cache Return (< 1ms)
    if (SEARCH_CACHE.has(normKey)) {
      return NextResponse.json(SEARCH_CACHE.get(normKey));
    }

    const startTime = Date.now();

    // 2. High-Speed Parallel Wikipedia Discovery (< 200ms)
    const wikiData = await fetchDynamicHeroImageAndDetails(query);
    const { wikiTitle, wikiExtract, wikiImage, wikiUrl } = wikiData;

    const finalName = wikiTitle || query;
    const slug = finalName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[-\s]+/g, '-');

    const imageUrl =
      wikiImage ||
      'https://upload.wikimedia.org/wikipedia/commons/4/44/Subhas_Chandra_Bose_NRB.jpg';

    // Extract Domain
    let domain = 'National Heritage & Cultural Icon';
    const ext = wikiExtract.toLowerCase();
    if (/\b(music|musician|singing|singer|vocalist|shehnai|sitar|sarod|tabla|flute|carnatic|hindustani|ragas?)\b/i.test(ext)) {
      domain = 'Classical Indian Music & Performing Arts';
    } else if (/\b(physicist|physics|chemist|chemistry|scientist|science|nobel prize in physics|nobel prize in chemistry|laboratory|botanist)\b/i.test(ext)) {
      domain = 'Scientific Discovery & Modern Research';
    } else if (/\b(mathematician|mathematics|number theory|infinite series|algebra|astronomer|astronomy)\b/i.test(ext)) {
      domain = 'Mathematics & Infinite Series';
    } else if (/\b(surgeon|surgery|doctor|physician|ayurveda|sushruta|charaka|medicine|medical)\b/i.test(ext)) {
      domain = 'Medicine & Surgical Science';
    } else if (/\b(freedom fighter|rebellion|revolt|armed struggle|british raj|colonial rule|indian national army|martyr|azad hind|revolutionary)\b/i.test(ext)) {
      domain = 'Freedom Struggle & Armed Revolution';
    } else if (/\b(social reformer|social reform|women's education|sati|untouchability|brahmo samaj|arya samaj)\b/i.test(ext)) {
      domain = 'Social Reform & Human Dignity';
    } else if (/\b(poet|poetry|novel|writer|author|literature|gitanjali|philosopher)\b/i.test(ext)) {
      domain = 'Literature, Poetry & Philosophy';
    }

    // Extract Years
    const yearMatch = wikiExtract.match(/\b(1[4-9]\d\d|20\d\d)\b.*?–.*?\b(1[5-9]\d\d|20\d\d)\b/);
    let birthYear: number | undefined = undefined;
    let deathYear: number | undefined = undefined;
    if (yearMatch) {
      const y1 = parseInt(yearMatch[1], 10);
      const y2 = parseInt(yearMatch[2], 10);
      if (!isNaN(y1)) birthYear = y1;
      if (!isNaN(y2)) deathYear = y2;
    }

    // Extract State
    let state = 'National / India';
    const stateKeywords = [
      'West Bengal',
      'Bengal',
      'Tamil Nadu',
      'Madras',
      'Maharashtra',
      'Bombay',
      'Andhra Pradesh',
      'Punjab',
      'Kerala',
      'Karnataka',
      'Mysore',
      'Odisha',
      'Orissa',
      'Bihar',
      'Gujarat',
      'Meghalaya',
      'Assam',
      'Uttar Pradesh',
    ];
    for (const sk of stateKeywords) {
      if (wikiExtract.includes(sk)) {
        state = sk.replace('Madras', 'Tamil Nadu').replace('Bombay', 'Maharashtra').replace('Orissa', 'Odisha').replace('Mysore', 'Karnataka');
        break;
      }
    }

    const shortBio = wikiExtract
      ? wikiExtract.split('. ').slice(0, 3).join('. ') + '.'
      : `${finalName} was an eminent Indian contributor whose monumental legacy shaped our national history.`;

    // 3. Multi-Cloud AI Synthesis (OpenRouter, NVIDIA NIM, HuggingFace, Groq, or Local Ollama)
    let aiEnhancedTagline = tagline;
    let aiEnhancedContributions = [
      {
        id: '1',
        display_order: 1,
        title: 'Historic National Contribution',
        description: `Dedicated their life to ${domain.toLowerCase()}, leaving an enduring impact on Indian history.`,
      },
      {
        id: '2',
        display_order: 2,
        title: 'National & Global Impact',
        description: `Pioneered advancements in ${domain.toLowerCase()} that continue to inspire generations.`,
      },
    ];
    let aiEnhancedUnsungReason = `Their remarkable contributions to ${domain.toLowerCase()} played a foundational role in India's progress.`;
    let aiSource = 'LIVE_WIKIPEDIA_PARALLEL_DISCOVERY';

    try {
      const aiResult = await generateHistoricalSynthesis({
        name: finalName,
        state,
        domain,
        bio: shortBio,
      });

      if (aiResult) {
        if (aiResult.tagline) aiEnhancedTagline = aiResult.tagline;
        if (aiResult.unsung_reason) aiEnhancedUnsungReason = aiResult.unsung_reason;
        if (aiResult.contributions && aiResult.contributions.length > 0) {
          aiEnhancedContributions = aiResult.contributions;
        }
        aiSource = aiResult.provider;
      }
    } catch (aiErr) {
      console.warn('Cloud AI synthesis fallback:', aiErr);
    }

    const dynamicHero = {
      id: slug,
      slug,
      name: finalName,
      name_local: finalName,
      birth_year: birthYear,
      death_year: deathYear,
      era: birthYear && deathYear ? `${birthYear} – ${deathYear}` : 'Historical Era',
      state,
      primary_domain: domain,
      tagline: aiEnhancedTagline,
      short_bio: shortBio,
      image_url: imageUrl,
      source_attribution: wikiUrl,
      unsung_level: 'Legendary',
      contributions: aiEnhancedContributions,
      is_unsung_reason: aiEnhancedUnsungReason,
    };

    const durationMs = Date.now() - startTime;

    const responsePayload = {
      hero: dynamicHero,
      duration_ms: durationMs,
      source: aiSource,
    };

    // Cache in Memory (< 1ms next time)
    SEARCH_CACHE.set(normKey, responsePayload);

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error('Fast search API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
