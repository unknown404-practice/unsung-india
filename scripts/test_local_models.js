async function test() {
  console.log('--- 1. Testing Ollama tags ---');
  let availableModels = [];
  try {
    const r = await fetch('http://127.0.0.1:11434/api/tags');
    const d = await r.json();
    availableModels = (d.models || []).map(m => m.name);
    console.log('Host Ollama models (127.0.0.1:11434):', availableModels);
  } catch(e) {
    console.log('Host Ollama error (127.0.0.1:11434):', e.message);
  }

  console.log('--- 2. Testing generateHistoricalSynthesis from frontend/lib/cloud-ai ---');
  try {
    const { generateHistoricalSynthesis } = require('./frontend/lib/cloud-ai.ts');
    // We can import or test with ts-node or run directly
  } catch(e) {
    //
  }

  for (const m of availableModels) {
    if (m.includes('qwen') || m.includes('llama') || m.includes('gemma')) {
      console.log(`Testing model: ${m}...`);
      const t0 = Date.now();
      try {
        const res = await fetch('http://127.0.0.1:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: m,
            prompt: 'You are a historian. Output JSON with tagline and unsung_reason for Rani Abbakka Chowta.',
            stream: false,
            format: 'json',
            options: { num_predict: 100, num_ctx: 1024 }
          }),
          signal: AbortSignal.timeout(15000)
        });
        const data = await res.json();
        console.log(`Model ${m} SUCCESS in ${Date.now() - t0}ms:`, data.response);
      } catch (err) {
        console.log(`Model ${m} FAILED in ${Date.now() - t0}ms:`, err.message);
      }
    }
  }
}

test();
