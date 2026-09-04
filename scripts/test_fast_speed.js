async function testSpeed() {
  console.log('Testing speed of fast synthesis fallback & Ollama integration...');
  const t0 = Date.now();
  
  // Test Wikipedia discovery
  const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=Mother_Teresa&redirects=1&prop=extracts|pageimages&exintro=true&explaintext=true&piprop=original&format=json`;
  const res = await fetch(wikiUrl);
  const data = await res.json();
  const pages = data.query.pages;
  const p = Object.values(pages)[0];
  console.log(`Wikipedia discovery in ${Date.now() - t0}ms:`, p.title, p.extract ? p.extract.slice(0, 100) + '...' : '');
}

testSpeed();
