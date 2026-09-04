import { NextRequest, NextResponse } from 'next/server';

// Indic translation / transliteration dictionary for hero narration templates
function generateIndicScriptText(
  name: string,
  nameLocal: string | null | undefined,
  state: string,
  domain: string,
  tagline: string,
  shortBio: string,
  lang: string
): string {
  const displayName = nameLocal || name;

  switch (lang) {
    case 'hi':
    case 'hi-IN':
      return `भारत के महान राष्ट्रीय नायक ${displayName}। राज्य: ${state}। कार्यक्षेत्र: ${domain}। “${tagline}”। जीवनी: ${shortBio}`;

    case 'bn':
    case 'bn-IN':
      return `ভারতের মহান জাতীয় বীর ${displayName}। রাজ্য: ${state}। কর্মক্ষেত্র: ${domain}। “${tagline}”। পরিচিতি: ${shortBio}`;

    case 'ta':
    case 'ta-IN':
      return `இந்தியாவின் மாபெரும் சுதந்திரப் போராட்ட நாயகர் ${displayName}. மாநிலம்: ${state}. துறை: ${domain}. "${tagline}". வரலாறு: ${shortBio}`;

    case 'te':
    case 'te-IN':
      return `భారతదేశపు గొప్ప జాతీయ నాయకుడు ${displayName}. రాష్ట్రం: ${state}. రంగం: ${domain}. "${tagline}". జీవిత చరిత్ర: ${shortBio}`;

    case 'mr':
    case 'mr-IN':
      return `भारताचे थोर राष्ट्रीय महापुरुष ${displayName}. राज्य: ${state}. कार्यक्षेत्र: ${domain}. “${tagline}”. जीवन परिचय: ${shortBio}`;

    case 'gu':
    case 'gu-IN':
      return `ભારતના મહાન રાષ્ટ્રીય નાયક ${displayName}. રાજ્ય: ${state}. ક્ષેત્ર: ${domain}. “${tagline}”. પરિચય: ${shortBio}`;

    case 'kn':
    case 'kn-IN':
      return `ಭಾರತದ ಮಹಾನ್ ರಾಷ್ಟ್ರೀಯ ವೀರ ${displayName}. ರಾಜ್ಯ: ${state}. ಕ್ಷೇತ್ರ: ${domain}. "${tagline}". ಪರಿಚಯ: ${shortBio}`;

    default:
      return `National Hero Narration: ${name}. From ${state}. Domain: ${domain}. Quote: "${tagline}". Biography: ${shortBio}`;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text')?.trim();
  const lang = searchParams.get('lang')?.toLowerCase().slice(0, 2) || 'en';

  if (!text) {
    return new NextResponse('Text is required', { status: 400 });
  }

  try {
    // Truncate text to 200 chars for single TTS sentence chunk if needed
    const cleanText = text.slice(0, 200);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(
      cleanText
    )}`;

    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 UnsungHeroesDPI/1.0',
        Accept: 'audio/mpeg,audio/*;q=0.9',
      },
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (err) {
    console.error('TTS Proxy Error:', err);
  }

  return new NextResponse('TTS generation failed', { status: 500 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hero, lang = 'hi' } = body;

    if (!hero) {
      return NextResponse.json({ error: 'Hero data is required' }, { status: 400 });
    }

    const shortLang = lang.slice(0, 2).toLowerCase();

    // 1. Generate Authentic Indic Script Text
    let spokenText = generateIndicScriptText(
      hero.name,
      hero.name_local,
      hero.state,
      hero.primary_domain,
      hero.tagline,
      hero.short_bio,
      shortLang
    );

    // 2. Optionally use local Qwen to translate full bio into fluent Indic prose
    try {
      if (shortLang !== 'en') {
        const langNames: Record<string, string> = {
          hi: 'Hindi (हिंदी)',
          bn: 'Bengali (বাংলা)',
          ta: 'Tamil (தமிழ்)',
          te: 'Telugu (తెలుగు)',
          mr: 'Marathi (मराठी)',
          gu: 'Gujarati (ગુજરાતી)',
          kn: 'Kannada (ಕನ್ನಡ)',
        };

        const langName = langNames[shortLang] || 'Hindi';

        const qwenPrompt = `Translate the following factual tribute of Indian hero "${hero.name}" into pure, fluent, natural ${langName} script for audio speech narration (keep it to 2-3 inspiring sentences):
"Hero: ${hero.name}. State: ${hero.state}. Domain: ${hero.primary_domain}. Quote: ${hero.tagline}. Bio: ${hero.short_bio}"

Output ${langName} text only, no English, no markdown:`;

        const qRes = await fetch('http://127.0.0.1:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'qwen2.5:7b',
            prompt: qwenPrompt,
            stream: false,
            keep_alive: '24h',
            options: { num_predict: 150, temperature: 0.2 },
          }),
        });

        if (qRes.ok) {
          const qJson = await qRes.json();
          const translated = (qJson.response || '').trim();
          if (translated && translated.length > 20 && !translated.startsWith('```')) {
            spokenText = translated;
          }
        }
      }
    } catch (e) {
      // Use fallback template
    }

    // Split text into speakable chunks (under 180 chars each) for seamless audio playback
    const sentences = spokenText
      .split(/(?<=[।\.!\?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const audioUrls = sentences.map(
      (s) => `/api/tts?text=${encodeURIComponent(s)}&lang=${shortLang}`
    );

    return NextResponse.json({
      success: true,
      lang: shortLang,
      spokenText,
      sentences,
      audioUrls,
    });
  } catch (error: any) {
    console.error('TTS API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
