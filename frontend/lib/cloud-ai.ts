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

  // 1. OpenRouter (Qwen 2.5 72B / 32B)
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openrouterKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://unsungheroes.in',
          'X-Title': 'Unsung Heroes of India DPI',
        },
        body: JSON.stringify({
          model: 'qwen/qwen-2.5-72b-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 400,
          temperature: 0.3,
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        const parsed = parseJsonResponse(content);
        if (parsed) return { ...parsed, provider: 'OPENROUTER_QWEN_2.5_72B' };
      }
    } catch (e) {
      console.warn('OpenRouter synthesis fallback:', e);
    }
  }

  // 2. NVIDIA NIM API (Qwen 2.5 72B / Llama 3.3 70B)
  const nvidiaKey = process.env.NVIDIA_NIM_API_KEY || process.env.NVIDIA_API_KEY;
  if (nvidiaKey) {
    try {
      const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${nvidiaKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta/llama-3.3-70b-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: 800,
        }),
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        const parsed = parseJsonResponse(content);
        if (parsed) return { ...parsed, provider: 'NVIDIA_NIM_CLOUD_AI' };
      }
    } catch (e) {
      console.warn('NVIDIA NIM synthesis failed:', e);
    }
  }

  // 3. Hugging Face Inference API (Qwen 2.5 72B Instruct)
  const hfKey = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || process.env.HF_TOKEN;
  if (hfKey) {
    try {
      const res = await fetch(
        'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hfKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'Qwen/Qwen2.5-72B-Instruct',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            max_tokens: 800,
            temperature: 0.3,
          }),
          signal: AbortSignal.timeout(4500),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        const parsed = parseJsonResponse(content);
        if (parsed) return { ...parsed, provider: 'HUGGINGFACE_QWEN_2.5_72B' };
      }
    } catch (e) {
      console.warn('HuggingFace inference failed:', e);
    }
  }

  // 4. Groq Fast Cloud Inference (Optional)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        const parsed = parseJsonResponse(content);
        if (parsed) return { ...parsed, provider: 'GROQ_CLOUD_AI' };
      }
    } catch (e) {
      console.warn('Groq synthesis failed:', e);
    }
  }

  // 5. Local Containerized / Host Ollama Qwen (Docker or Localhost)
  const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate';
  const preferredModel = process.env.OLLAMA_MODEL || 'qwen2.5:14b';
  const candidateModels = [preferredModel, 'qwen2.5:7b', 'qwen2.5:3b', 'qwen2.5:1.5b', 'qwen2.5:latest'];
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
        if (parsed) return { ...parsed, provider: `DOCKER_LOCAL_OLLAMA_${model.toUpperCase().replace(/[^A-Z0-9]/g, '_')}` };
      }
    } catch {
      // Continue to next local model or return null
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
