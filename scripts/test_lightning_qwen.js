async function testLightningQwen() {
  console.log('Testing Ultra-Concise Lightning Qwen...');
  const t0 = Date.now();
  try {
    const prompt = 'Hero: Subhas Chandra Bose (Freedom Fighter, West Bengal). Return JSON: {"tagline": "...", "unsung_reason": "..."}';
    const res = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:1.5b',
        prompt: prompt,
        stream: false,
        format: 'json',
        keep_alive: -1,
        options: {
          temperature: 0.0,
          num_ctx: 128,
          num_predict: 45,
          num_thread: 8
        }
      }),
      signal: AbortSignal.timeout(10000)
    });

    const d = await res.json();
    console.log(`⚡ Lightning Qwen SUCCESS in ${Date.now() - t0}ms!`);
    console.log('Response:', d.response);
  } catch (err) {
    console.log(`Failed in ${Date.now() - t0}ms:`, err.message);
  }
}

testLightningQwen();
