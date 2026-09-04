// Global In-Memory Synthesis Cache (< 1ms instant retrieval for repeated queries)
const SYNTHESIS_CACHE = new Map<string, HistoricalSynthesisResult>();

export interface HistoricalSynthesisResult {
  tagline: string;
  unsung_reason: string;
  contributions: Array<{ id: string; display_order: number; title: string; description: string }>;
  provider: string;
}

export async function generateHistoricalSynthesis(params: {
  name: string;
  state: string;
  domain: string;
  bio: string;
}): Promise<HistoricalSynthesisResult | null> {
  const { name, state, domain, bio } = params;

  // 1. Instant Cache Return (< 1ms)
  const cacheKey = `${name.toLowerCase().trim()}|${state.toLowerCase().trim()}|${domain.toLowerCase().trim()}`;
  if (SYNTHESIS_CACHE.has(cacheKey)) {
    return SYNTHESIS_CACHE.get(cacheKey)!;
  }

  const systemPrompt =
    'You are a premier Indic historian and cultural scholar for the Digital Public Infrastructure of India. Return VALID JSON ONLY with exact keys: "tagline" (string: 1-line inspiring impact statement), "unsung_reason" (string: 1-2 sentence why their monumental legacy was overlooked or historical significance), and "contributions" (array of 2-3 objects with "title" and "description").';

  const userPrompt = `Hero/Contributor: ${name}\nState/Region: ${state}\nPrimary Domain: ${domain}\nBiographical Narrative: ${bio}\n\nSynthesize authentic domain-specific historical profile in JSON.`;

  // 2. Containerized or Host Local Ollama Model (Docker or Host Windows Ollama)
  const configuredUrl = process.env.OLLAMA_URL;
  const endpointCandidates = Array.from(
    new Set(
      [
        configuredUrl,
        'http://127.0.0.1:11434/api/generate',
        'http://localhost:11434/api/generate',
        'http://127.0.0.1:11435/api/generate',
        'http://localhost:11435/api/generate',
        'http://ollama:11434/api/generate',
      ].filter(Boolean) as string[]
    )
  );

  // Prioritize ultra-fast 1.5b and 3b turbo models for sub-second CPU inference
  const preferredModel = process.env.OLLAMA_MODEL;
  const candidateModels = [
    ...(preferredModel ? [preferredModel] : []),
    'qwen2.5:1.5b',
    'qwen2.5:3b',
    'qwen2.5:7b',
    'qwen2.5:14b',
    'qwen2.5:latest',
    'llama3.1:8b',
    'gemma:2b',
  ];
  const uniqueModels = Array.from(new Set(candidateModels));

  for (const ollamaUrl of endpointCandidates) {
    for (const model of uniqueModels) {
      try {
        const res = await fetch(ollamaUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            prompt: `${systemPrompt}\n\n${userPrompt}`,
            stream: false,
            format: 'json',
            keep_alive: '24h',
            options: {
              temperature: 0.1,
              top_k: 20,
              top_p: 0.8,
              num_ctx: 1024,
              num_predict: 220,
              num_thread: 8,
            },
          }),
          signal: AbortSignal.timeout(3500),
        });

        if (res.ok) {
          const json = await res.json();
          const parsed = parseJsonResponse(json.response);
          if (parsed) {
            const result: HistoricalSynthesisResult = {
              ...parsed,
              provider: `LOCAL_OLLAMA_${model.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
            };
            SYNTHESIS_CACHE.set(cacheKey, result);
            return result;
          }
        }
      } catch {
        // Try next model or endpoint within fast timeout window
      }
    }
  }

  return null;
}

function parseJsonResponse(raw: string | undefined): {
  tagline: string;
  unsung_reason: string;
  contributions: Array<{ id: string; display_order: number; title: string; description: string }>;
} | null {
  if (!raw) return null;
  try {
    let text = raw.trim();
    if (text.includes('```')) {
      text = text.replace(/```(?:json)?([\s\S]*?)```/gi, '$1').trim();
    }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.slice(firstBrace, lastBrace + 1);
    }
    const json = JSON.parse(text);

    const tagline = json.tagline || '';
    const unsung_reason = json.unsung_reason || '';
    const contributions = Array.isArray(json.contributions)
      ? json.contributions.map((c: any, i: number) => ({
          id: String(i + 1),
          display_order: i + 1,
          title: typeof c === 'string' ? `Milestone ${i + 1}` : c.title || `Milestone ${i + 1}`,
          description: typeof c === 'string' ? c : c.description || String(c),
        }))
      : [];

    if (tagline || contributions.length > 0) {
      return { tagline, unsung_reason, contributions };
    }
  } catch (e) {
    console.warn('Failed to parse AI JSON response:', e);
  }
  return null;
}

