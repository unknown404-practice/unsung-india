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

  const systemPrompt =
    'You are a premier Indic historian and cultural scholar for the Digital Public Infrastructure of India. Return VALID JSON ONLY with exact keys: "tagline" (string: 1-line inspiring impact statement), "unsung_reason" (string: 1-2 sentence why their monumental legacy was overlooked or historical significance), and "contributions" (array of 2-3 objects with "title" and "description").';

  const userPrompt = `Hero/Contributor: ${name}\nState/Region: ${state}\nPrimary Domain: ${domain}\nBiographical Narrative: ${bio}\n\nSynthesize authentic domain-specific historical profile in JSON.`;

  // 1. Containerized Local Ollama Qwen Model (Docker or Host)
  const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate';
  const preferredModel = process.env.OLLAMA_MODEL || 'qwen2.5:7b';
  const candidateModels = [preferredModel, 'qwen2.5:14b', 'qwen2.5:3b', 'qwen2.5:1.5b', 'qwen2.5:latest'];
  const uniqueModels = Array.from(new Set(candidateModels));

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
          options: {
            temperature: 0.2,
            top_p: 0.85,
            num_ctx: 4096,
          },
        }),
        signal: AbortSignal.timeout(25000),
      });

      if (res.ok) {
        const json = await res.json();
        const parsed = parseJsonResponse(json.response);
        if (parsed) return { ...parsed, provider: `LOCAL_OLLAMA_${model.toUpperCase().replace(/[^A-Z0-9]/g, '_')}` };
      }
    } catch {
      // Continue to next local model or fallback
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
