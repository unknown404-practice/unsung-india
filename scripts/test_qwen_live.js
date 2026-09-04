async function testQwen15b() {
  console.log('Testing qwen2.5:1.5b with 30s timeout on 127.0.0.1:11434...');
  const t0 = Date.now();
  try {
    const res = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:1.5b',
        prompt: 'You are an Indic historian. Output VALID JSON ONLY: {"tagline": "...", "unsung_reason": "...", "contributions": [{"title": "...", "description": "..."}] } for hero Birsa Munda.',
        stream: false,
        format: 'json',
        keep_alive: '24h',
        options: {
          temperature: 0.1,
          num_ctx: 1024,
          num_predict: 180,
          num_thread: 8
        }
      }),
      signal: AbortSignal.timeout(30000)
    });
    const d = await res.json();
    console.log(`SUCCESS in ${Date.now() - t0}ms:`);
    console.log(d.response);
  } catch (err) {
    console.log(`FAILED in ${Date.now() - t0}ms:`, err.message);
  }
}

testQwen15b();
