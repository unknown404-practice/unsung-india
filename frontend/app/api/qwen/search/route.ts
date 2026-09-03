import { NextRequest, NextResponse } from 'next/server';

interface WikiResolvedData {
  wikiTitle: string;
  wikiExtract: string;
  wikiImage: string;
  wikiUrl: string;
}

async function fetchDynamicHeroImageAndDetails(query: string): Promise<WikiResolvedData> {
  let wikiTitle = '';
  let wikiExtract = '';
  let wikiImage = '';
  let wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`;

  const userAgent = 'UnsungIndiaDPI/1.0 (https://unsung-heroes.gov.in; contact@unsung-heroes.gov.in)';

  try {
    // Stage 1: Direct Wikipedia Action API with Redirects
    const directUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      query
    )}&redirects=1&prop=extracts|pageimages|images|info&exintro=true&explaintext=true&piprop=original|thumbnail&pithumbsize=1000&inprop=url&format=json`;

    const dRes = await fetch(directUrl, { headers: { 'User-Agent': userAgent }, next: { revalidate: 86400 } });
    if (dRes.ok) {
      const dJson = await dRes.json();
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
          } else if (ext.toLowerCase().includes('may refer to:')) {
            const lines = ext.split('\n').filter((l: string) => l.trim() && !l.toLowerCase().includes('may refer to'));
            const targetLine = lines.find((l: string) => /indian|freedom|leader|physicist|king|queen|rebel|poet|scholar/i.test(l)) || lines[0];
            if (targetLine) {
              const cleaned = targetLine.split(/\(|,/)[0].trim();
              if (cleaned && cleaned.toLowerCase() !== query.toLowerCase()) {
                return await fetchDynamicHeroImageAndDetails(cleaned);
              }
            }
          }
        }
      }
    }

    // Stage 2: Article Generator Search
    if (!wikiImage || !wikiExtract) {
      const genUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        `"${query}"`
      )}&gsrlimit=3&prop=extracts|pageimages|info&exintro=true&explaintext=true&piprop=original|thumbnail&pithumbsize=1000&inprop=url&format=json`;

      const gRes = await fetch(genUrl, { headers: { 'User-Agent': userAgent }, next: { revalidate: 86400 } });
      if (gRes.ok) {
        const gJson = await gRes.json();
        const pages = gJson?.query?.pages || {};
        for (const pid in pages) {
          if (pid !== '-1') {
            const p = pages[pid];
            const ext = p.extract || '';
            const img = p.original?.source || p.thumbnail?.source || '';
            if (ext && !ext.toLowerCase().includes('may refer to:')) {
              if (!wikiTitle) wikiTitle = p.title;
              if (!wikiExtract) wikiExtract = ext;
              if (img && !img.toLowerCase().includes('disambig')) {
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
    }

    // Stage 3: Wikimedia Commons Direct Historical File Search (finds portraits, stamps, memorials)
    if (!wikiImage) {
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        query
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
    console.warn('Dynamic image & wiki resolution notice:', err);
  }

  return { wikiTitle, wikiExtract, wikiImage, wikiUrl };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query?.trim();
    const model = body.model || 'qwen2.5:7b';

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const startTime = Date.now();

    // 1. Parallel Resolution: Live Wikipedia + Wikimedia Image Search & Qwen Ollama Synthesis
    const wikiPromise = fetchDynamicHeroImageAndDetails(query);

    const prompt = `Synthesize Indian personality "${query}". Output JSON only:
{"name":"${query}","name_local":"Indic script","birth_year":1880,"death_year":1945,"state":"State","primary_domain":"Freedom Struggle / Science / Literature","tagline":"Memorable 1-sentence quote","short_bio":"2-3 sentence biography","contributions":[{"display_order":1,"title":"Milestone 1","description":"Specific fact"}],"is_unsung_reason":"Historical significance"}`;

    const ollamaPromise = (async () => {
      try {
        const ollamaController = new AbortController();
        const timeout = setTimeout(() => ollamaController.abort(), 25000);

        const res = await fetch('http://127.0.0.1:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: model,
            prompt: prompt,
            stream: false,
            format: 'json',
            keep_alive: '24h',
            options: {
              num_ctx: 1024,
              num_predict: 200,
              temperature: 0.1,
              top_k: 20,
              top_p: 0.8,
            },
          }),
          signal: ollamaController.signal,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const json = await res.json();
          let raw = (json.response || '{}').trim();
          if (raw.startsWith('```json')) raw = raw.slice(7);
          if (raw.startsWith('```')) raw = raw.slice(3);
          if (raw.endsWith('```')) raw = raw.slice(0, -3);
          return JSON.parse(raw.trim());
        }
      } catch (err) {
        console.warn('Ollama generation notice:', err);
      }
      return null;
    })();

    const [wikiData, parsedHero] = await Promise.all([wikiPromise, ollamaPromise]);

    const durationMs = Date.now() - startTime;

    const { wikiTitle, wikiExtract, wikiImage, wikiUrl } = wikiData;
    const finalName = parsedHero?.name || wikiTitle || query;
    const slug = finalName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[-\s]+/g, '-');

    let imageUrl =
      wikiImage ||
      'https://upload.wikimedia.org/wikipedia/commons/8/80/India_Emblem.svg';

    const shortBio =
      parsedHero?.short_bio ||
      wikiExtract ||
      `${finalName} was an eminent Indian contributor whose monumental legacy shaped our national history.`;

    const tagline =
      parsedHero?.tagline ||
      (wikiExtract ? wikiExtract.split(/\. |\.\n/)[0] : `${finalName} — Distinguished Indian Contributor`);

    const contribs =
      parsedHero?.contributions && Array.isArray(parsedHero.contributions) && parsedHero.contributions.length > 0
        ? parsedHero.contributions
        : [
            {
              display_order: 1,
              title: 'National Impact',
              description: shortBio,
            },
          ];

    const hero = {
      id: slug,
      slug: slug,
      name: finalName,
      name_local: parsedHero?.name_local || null,
      birth_year: parsedHero?.birth_year || null,
      death_year: parsedHero?.death_year || null,
      state: parsedHero?.state || 'National / India',
      primary_domain: parsedHero?.primary_domain || 'Freedom Struggle & National Heritage',
      tagline: tagline,
      short_bio: shortBio,
      is_unsung_reason:
        parsedHero?.is_unsung_reason ||
        'Synthesized dynamically via Wikimedia Commons & local Qwen AI inference engine.',
      image_url: imageUrl,
      image_license: 'PUBLIC_DOMAIN',
      image_attribution: 'Wikimedia Commons / Public Knowledge Graph',
      image_source_page_url: wikiUrl,
      view_count: 1,
      banner_download_count: 0,
      contributions: contribs,
      timeline_events: [],
      sources: [
        {
          title: `Free Wikipedia Action API & Qwen AI Synthesis: ${finalName}`,
          source_type: 'ACADEMIC_PUBLICATION',
          url: wikiUrl,
          is_primary_reference: true,
        },
      ],
      inference_meta: {
        model: `Qwen (${model}) + Wikimedia Discovery`,
        latency_ms: durationMs,
      },
    };

    return NextResponse.json({ success: true, hero, durationMs });
  } catch (err: any) {
    console.error('Dynamic Search Route Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to synthesize' },
      { status: 500 }
    );
  }
}
