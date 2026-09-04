async function resolveHero(query) {
  const userAgent = 'UnsungIndiaSearch/2.0 (https://unsung-heroes.gov.in; contact@unsung-heroes.gov.in)';
  let wikiTitle = '';
  let wikiExtract = '';
  let wikiImage = '';
  let wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`;

  try {
    // 1. Precise rank-1 Wikipedia Search
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json`;
    const sRes = await fetch(searchUrl, { headers: { 'User-Agent': userAgent } });
    if (sRes.ok) {
      const sData = await sRes.json();
      const hits = sData?.query?.search || [];
      if (hits.length > 0 && hits[0].title) {
        wikiTitle = hits[0].title;
      }
    }

    const targetTitle = wikiTitle || query;

    // 2. Fetch full extract and original lead image
    const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(targetTitle)}&redirects=1&prop=extracts|pageimages|info&exintro=true&explaintext=true&piprop=original|thumbnail&pithumbsize=1000&inprop=url&format=json`;
    const dRes = await fetch(detailUrl, { headers: { 'User-Agent': userAgent } });
    if (dRes.ok) {
      const dData = await dRes.json();
      const pages = dData?.query?.pages || {};
      for (const pid in pages) {
        if (pid !== '-1') {
          const p = pages[pid];
          wikiTitle = p.title || targetTitle;
          wikiExtract = p.extract || '';
          const candidateImg = p.original?.source || p.thumbnail?.source || '';
          if (candidateImg && !candidateImg.toLowerCase().includes('disambig')) {
            wikiImage = candidateImg.split('?')[0];
          }
          wikiUrl = p.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle.replace(/\s+/g, '_'))}`;
        }
      }
    }

    // 3. If image not in lead box, check Commons for this person
    if (!wikiImage) {
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(targetTitle)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json`;
      const cRes = await fetch(commonsUrl, { headers: { 'User-Agent': userAgent } });
      if (cRes.ok) {
        const cData = await cRes.json();
        const cPages = cData?.query?.pages || {};
        for (const cPid in cPages) {
          const title = (cPages[cPid]?.title || '').toLowerCase();
          const imgInfo = cPages[cPid]?.imageinfo;
          if (imgInfo && imgInfo.length > 0 && imgInfo[0].url) {
            const candidateUrl = imgInfo[0].url;
            if (/\.(jpg|jpeg|png|webp)$/i.test(candidateUrl) && !title.includes('grave') && !title.includes('pdf')) {
              wikiImage = candidateUrl.split('?')[0];
              break;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('Resolution error:', err);
  }

  return {
    query,
    resolvedTitle: wikiTitle,
    hasImage: !!wikiImage,
    image: wikiImage || 'NEUTRAL_HERITAGE_FALLBACK',
    extractSample: wikiExtract ? wikiExtract.slice(0, 80) + '...' : ''
  };
}

async function runTests() {
  const people = [
    'Mother Teresa',
    'Birsa Munda',
    'Jagadish Chandra Bose',
    'Satyendra Nath Bose',
    'Sardar Patel',
    'Rani Chennamma',
    'Kanaklata Barua',
    'APJ Abdul Kalam',
    'C.V. Raman',
    'Srinivasa Ramanujan',
    'Dr. B.R. Ambedkar',
    'Homi J. Bhabha',
    'Vikram Sarabhai',
    'Sam Manekshaw'
  ];

  console.log('--- Testing Precision Search Resolution ---');
  for (const p of people) {
    const t0 = Date.now();
    const res = await resolveHero(p);
    console.log(`[${Date.now() - t0}ms] Query: "${p}" => Resolved: "${res.resolvedTitle}"`);
    console.log(`  Image: ${res.image.slice(0, 70)}...`);
    console.log(`  Bio: ${res.extractSample}\n`);
  }
}

runTests();
