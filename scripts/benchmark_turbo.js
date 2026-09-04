async function benchmarkTurbo() {
  console.log('Testing Turbo Qwen (num_ctx: 384, num_predict: 80, temp: 0.0)...');
  const t0 = Date.now();
  try {
    const res = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:1.5b',
        prompt: 'Return JSON with {"tagline": "...", "unsung_reason": "..."} for Subhas Chandra Bose.',
        stream: false,
        format: 'json',
        keep_alive: -1,
        options: {
          temperature: 0.0,
          num_ctx: 384,
          num_predict: 80,
          num_thread: 8
        }
      }),
      signal: AbortSignal.timeout(15000)
    });
    const d = await res.json();
    console.log(`Turbo SUCCESS in ${Date.now() - t0}ms:`, d.response);
  } catch (err) {
    console.log(`Turbo FAILED in ${Date.now() - t0}ms:`, err.message);
  }
}

benchmarkTurbo();
