async function testWikipediaResolution(queries) {
  for (const q of queries) {
    const t0 = Date.now();
    // 1. Search for best matching page title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srlimit=1&format=json`;
    const sRes = await fetch(searchUrl, { headers: { 'User-Agent': 'UnsungIndiaDPI/1.0' } });
    const sData = await sRes.json();
    const hits = sData?.query?.search || [];
    if (hits.length === 0) {
      console.log(`Query: "${q}" -> NO MATCH`);
      continue;
    }
    const topTitle = hits[0].title;
    
    // 2. Fetch details for exact top title
    const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(topTitle)}&redirects=1&prop=extracts|pageimages|info&exintro=true&explaintext=true&piprop=original|thumbnail&pithumbsize=1000&inprop=url&format=json`;
    const dRes = await fetch(detailUrl, { headers: { 'User-Agent': 'UnsungIndiaDPI/1.0' } });
    const dData = await dRes.json();
    const pages = dData?.query?.pages || {};
    const page = Object.values(pages)[0];
    
    const image = page?.original?.source || page?.thumbnail?.source || 'NO_IMAGE';
    const extract = page?.extract ? page.extract.slice(0, 120) + '...' : 'NO_EXTRACT';
    
    console.log(`[${Date.now() - t0}ms] "${q}" -> Title: "${page.title}" | Image: ${image !== 'NO_IMAGE' ? 'FOUND' : 'MISSING'}`);
    console.log(`   Extract: ${extract}\n`);
  }
}

const testQueries = [
  'mother teresa',
  'birsa munda',
  'jagadish chandra bose',
  'satyendra nath bose',
  'sardar vallabhbhai patel',
  'rani chennamma',
  'kanaklata barua',
  'apj abdul kalam',
  'c v raman',
  'srinivasa ramanujan',
  'dr br ambedkar',
  'homi bhabha',
  'vikram sarabhai',
  'sam manekshaw'
];

testWikipediaResolution(testQueries);
