import { NextRequest, NextResponse } from 'next/server';

// State and region localization dictionary
const STATE_LOCALIZATIONS: Record<string, Record<string, string>> = {
  'West Bengal': {
    bn: 'পশ্চিমবঙ্গ',
    hi: 'पश्चिम बंगाल',
    ta: 'மேற்கு வங்காளம்',
    te: 'పశ్ಚಿమ బెంగాల్',
    mr: 'पश्चिम बंगाल',
    gu: 'પશ્ચિમ બંગાળ',
    kn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ',
  },
  'Andhra Pradesh': {
    bn: 'অন্ধ্রপ্রদেশ',
    hi: 'आंध्र प्रदेश',
    ta: 'ஆந்திரப் பிரதேசம்',
    te: 'ఆంధ్రప్రదేశ్',
    mr: 'आंध्र प्रदेश',
    gu: 'આંધ્ર પ્રદેશ',
    kn: 'ಆಂಧ್ರಪ್ರದೇಶ',
  },
  'Maharashtra': {
    bn: 'মহারাষ্ট্র',
    hi: 'महाराष्ट्र',
    ta: 'மகாராஷ்டிரா',
    te: 'మహారాష్ట్ర',
    mr: 'महाराष्ट्र',
    gu: 'મહારાષ્ટ્ર',
    kn: 'ಮಹಾರಾಷ್ಟ್ರ',
  },
  'Tamil Nadu': {
    bn: 'তামিলনাড়ু',
    hi: 'तमिलनाडु',
    ta: 'தமிழ்நாடு',
    te: 'తమిళనాడు',
    mr: 'तमिळनाडू',
    gu: 'તમિલનાડુ',
    kn: 'ತಮಿಳುನಾಡು',
  },
  'Meghalaya': {
    bn: 'মেঘালয়',
    hi: 'मेघालय',
    ta: 'மேகாலயா',
    te: 'మేఘాలయ',
    mr: 'मेघालय',
    gu: 'મેઘાલય',
    kn: 'ಮೇಘಾಲಯ',
  },
  'Kerala': {
    bn: 'কেরল',
    hi: 'केरल',
    ta: 'கேரளா',
    te: 'కేరళ',
    mr: 'केरळ',
    gu: 'કેરળ',
    kn: 'ಕೇರಳ',
  },
  'Punjab': {
    bn: 'পাঞ্জাব',
    hi: 'पंजाब',
    ta: 'பஞ்சாப்',
    te: 'పంజాబ్',
    mr: 'पंजाब',
    gu: 'પંજાબ',
    kn: 'ಪಂಜಾಬ್',
  },
  'Odisha': {
    bn: 'ওড়িশা',
    hi: 'ओडिशा',
    ta: 'ஒடிசா',
    te: 'ఒడిశా',
    mr: 'ओडिशा',
    gu: 'ઓડિશા',
    kn: 'ಒಡಿಶಾ',
  },
  'Bihar': {
    bn: 'বিহার',
    hi: 'बिहार',
    ta: 'பீகார்',
    te: 'బీహార్',
    mr: 'बिहार',
    gu: 'બિહાર',
    kn: 'ಬಿಹಾರ',
  },
  'Karnataka': {
    bn: 'কর্ণাটক',
    hi: 'कर्नाटक',
    ta: 'கர்நாடகா',
    te: 'కర్ణాటక',
    mr: 'कर्नाटक',
    gu: 'કર્ણાટક',
    kn: 'ಕರ್ನಾಟಕ',
  },
  'Gujarat': {
    bn: 'গুজরাট',
    hi: 'गुजरात',
    ta: 'குஜராத்',
    te: 'గుజరాత్',
    mr: 'गुजरात',
    gu: 'ગુજરાત',
    kn: 'ಗುಜರಾತ್',
  },
};

function getLocalizedState(state: string, lang: string): string {
  for (const [key, mapping] of Object.entries(STATE_LOCALIZATIONS)) {
    if (state.toLowerCase().includes(key.toLowerCase())) {
      return mapping[lang] || state;
    }
  }
  return state;
}

// Humanistic, warm, calm documentary tribute generator
function craftHumanisticStoryTribute(
  name: string,
  nameLocal: string | null | undefined,
  state: string,
  domain: string,
  tagline: string,
  shortBio: string,
  isUnsungReason: string,
  lang: string
): string {
  const localState = getLocalizedState(state, lang);
  const cleanTagline = tagline.replace(/^[“"]|[”"]$/g, '').trim();

  // Pick appropriate script name
  const heroName = (lang === 'bn' && nameLocal) ? nameLocal : (lang === 'hi' && nameLocal && /[\u0900-\u097F]/.test(nameLocal)) ? nameLocal : name;

  switch (lang) {
    case 'bn':
    case 'bn-IN':
      return `আজ আমরা গভীর শ্রদ্ধার সাথে স্মরণ করছি ${heroName}-কে। ${localState}-র পুণ্যভূমিতে জন্ম নেওয়া এই মহান ব্যক্তিত্ব আমাদের শিখিয়ে গেছেন নিঃস্বার্থ ত্যাগ ও অদম্য সাহসের মূল্য। তাঁর সেই অমর বাণী—"${cleanTagline}"। মাতৃভূমির মুক্তি ও অগ্রগতির জন্য তাঁর এই চিরন্তন অবদান আমাদের হৃদয়ে চিরকাল দেশপ্রেমের আলো হয়ে বেঁচে থাকবে।`;

    case 'hi':
    case 'hi-IN':
      return `आइए आज हम श्रद्धापूर्वक नमन करते हैं ${heroName} को। ${localState} की पावन धरा पर जन्मे इस महान व्यक्तित्व ने हमें राष्ट्र सेवा और असीम साहस की प्रेरणा दी। उनका अमर संदेश था—"${cleanTagline}"। मातृभूमि के लिए उनका यह अद्वितीय योगदान और बलिदान हमारी आने वाली पीढ़ियों को सदैव प्रेरित करता रहेगा।`;

    case 'ta':
    case 'ta-IN':
      return `இன்று நாம் ஆழ்ந்த மரியாதையுடன் போற்றும் உன்னத தலைவர், ${heroName}. ${localState} மண்ணில் உதித்த இந்த மாமனிதர், நமக்கு சுயமரியாதையையும் தேச பக்தியையும் கற்றுத் தந்தார். "${cleanTagline}" என்பதே அவரது வாழ்வின் தாரக மந்திரம். இவரது இணையற்ற தியாகமும் அர்ப்பணிப்பும் இந்திய வரலாற்றில் என்றும் நிலைத்து நிற்கும்.`;

    case 'te':
    case 'te-IN':
      return `ఈ రోజు మనం ఎంతో గౌరవంతో స్మరించుకుంటున్న జాతీయ నాయకుడు ${heroName}. ${localState} పుణ్యభూమిలో జన్మించిన ఈ మహనీయుడు, మనందరికీ నిస్వార్థ సేవ మరియు ధైర్యాన్ని అందించారు. "${cleanTagline}" అనే ఆయన సందేశం ప్రతి హృదయాన్ని కదిలిస్తుంది. దేశ ప్రగతి కోసం ఆయన చేసిన త్యాగం చిరకాలం గుర్తుండిపోతుంది.`;

    case 'mr':
    case 'mr-IN':
      return `आज आपण अत्यंत आदराने स्मरण करूया ${heroName} यांचे. ${localState} च्या पवित्र भूमीत जन्मलेल्या या थोर व्यक्तिमत्त्वाने आपल्याला राष्ट्रनिष्ठा आणि अथांग धैर्याचा मार्ग दाखवला. "${cleanTagline}" हा त्यांचा जीवनमंत्र होता. देशासाठी त्यांचे हे अमूल्य योगदान सदैव प्रेरणादायी राहील.`;

    case 'gu':
    case 'gu-IN':
      return `આજે આપણે હૃદયપૂર્વક વંદન કરીએ છીએ ${heroName}ને. ${localState} ની પવિત્ર ભૂમિમાં જન્મેલા આ મહાન સપૂતે આપણને નિઃસ્વાર્થ સેવા અને હિંમતનો સંદેશ આપ્યો. "${cleanTagline}" એ તેમનો જીવન મંત્ર હતો. દેશ માટેનું તેમનું આ બલિદાન સદાય અમર રહેશે.`;

    case 'kn':
    case 'kn-IN':
      return `ಇಂದು ನಾವು ಅತ್ಯಂತ ಗೌರವದಿಂದ ಸ್ಮರಿಸುತ್ತಿರುವ ಧೀಮಂತ ನಾಯಕ ${heroName}. ${localState} ನೆಲದಲ್ಲಿ ಜನಿಸಿದ ಈ ಮಹಾನ್ ಚೇತನ, ನಮಗೆ ತ್ಯಾಗ ಮತ್ತು ಸಾಹಸದ ಹೊಸ ದಾರಿಯನ್ನು ತೋರಿಸಿಕೊಟ್ಟರು. "${cleanTagline}" ಎಂಬುದು ಅವರ ಜೀವನ ಸಂದೇಶವಾಗಿತ್ತು. ದೇಶಕ್ಕಾಗಿ ಇವರ ಮಹಾನ್ ಸೇವೆ ಎಂದಿಗೂ ಅಜರಾಮರ.`;

    default:
      return `Today, we pause to honor the extraordinary journey of ${name}. Rising from ${state}, their life embodies selfless dedication and unwavering courage. Guided by the immortal vision that "${cleanTagline}", their pivotal contributions helped shape the destiny of our nation. Their monumental sacrifice continues to inspire generations of Indians.`;
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
    const cleanText = text.slice(0, 250);
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
    console.error('TTS Stream Error:', err);
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

    // Generate Warm, Poetic Documentary Oral Tribute (< 2ms)
    const spokenText = craftHumanisticStoryTribute(
      hero.name,
      hero.name_local,
      hero.state,
      hero.primary_domain,
      hero.tagline,
      hero.short_bio,
      hero.is_unsung_reason,
      shortLang
    );

    // Split text into natural, calm spoken clauses (under 180 chars each)
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
