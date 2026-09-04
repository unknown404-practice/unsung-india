import { NextRequest, NextResponse } from 'next/server';

// State and region localization dictionary
const STATE_LOCALIZATIONS: Record<string, Record<string, string>> = {
  'West Bengal': {
    bn: 'পশ্চিমবঙ্গ',
    hi: 'पश्चिम बंगाल',
    ta: 'மேற்கு வங்காளம்',
    te: 'పశ్చిమ బెంగాల్',
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
    kn: 'મહારાષ્ટ્ર',
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
    te: 'కర్ణాಟಕ',
    mr: 'कर्नाटक',
    gu: 'કર્ણાટક',
    kn: 'ಕರ್ನಾಟಕ',
  },
  'Gujarat': {
    bn: 'গুজরাট',
    hi: 'गुजरात',
    ta: 'குஜராத்',
    te: 'ગુજરાત',
    mr: 'ગુજરાત',
    gu: 'ગુજરાત',
    kn: 'ಗುಜರಾತ್',
  },
};

function getLocalizedState(state: string, lang: string): string {
  for (const [key, mapping] of Object.entries(STATE_LOCALIZATIONS)) {
    if (state && state.toLowerCase().includes(key.toLowerCase())) {
      return mapping[lang] || state;
    }
  }
  return state || 'ভারত';
}

// Complete 5-Act Documentary Storytelling Builder across all 8 languages
function buildCompleteOralStory(hero: any, lang: string): string {
  const localState = getLocalizedState(hero.state, lang);
  const cleanTagline = (hero.tagline || '').replace(/^[“"]|[”"]$/g, '').trim();
  const shortBio = (hero.short_bio || '').trim();
  const unsungReason = (hero.is_unsung_reason || '').trim();

  // Pick best matched localized name
  let heroName = hero.name;
  if (lang === 'bn' && hero.name_local) heroName = hero.name_local;
  else if (lang === 'hi' && hero.name_local && /[\u0900-\u097F]/.test(hero.name_local)) heroName = hero.name_local;

  const contribsList = Array.isArray(hero.contributions) ? hero.contributions : [];
  const contribsDesc = contribsList
    .slice(0, 3)
    .map((c: any) => `${c.title}: ${c.description}`)
    .join('। ');

  switch (lang) {
    case 'bn':
    case 'bn-IN': {
      const cPart = contribsDesc ? `তাঁদের জীবনের প্রধান ঐতিহাসিক কীর্তিগুলি ছিল—${contribsDesc}।` : '';
      return `আজ আমরা গভীর শ্রদ্ধার সাথে স্মরণ করছি ভারতের এক মহান ব্যক্তিত্ব, ${heroName}-কে। ${localState}-র পুণ্যভূমিতে জন্ম নেওয়া এই অমর সন্তান আমাদের শিখিয়ে গেছেন নিঃস্বার্থ ত্যাগ ও অদম্য সাহসের মূল্য। তাঁর সেই কালজয়ী অমর আহ্বান ছিল—"${cleanTagline}"। জীবনের ঐতিহাসিক পটভূমি: ${shortBio} ${cPart} ঐতিহাসিক গুরুত্ব ও আত্মত্যাগ: ${unsungReason} মাতৃভূমির মুক্তি ও অগ্রগতির জন্য তাঁর এই চিরন্তন অবদান আমাদের হৃদয়ে চিরকাল দেশপ্রেমের আলো হয়ে বেঁচে থাকবে। আসুন আমরা শ্রদ্ধার সাথে তাঁর স্মৃতিকে স্যালুট জানাই। জয় হিন্দ!`;
    }

    case 'hi':
    case 'hi-IN': {
      const cPart = contribsDesc ? `इनके प्रमुख ऐतिहासिक कार्य और उपलब्धियां थीं—${contribsDesc}।` : '';
      return `आइए आज हम सब मिलकर श्रद्धापूर्वक स्मरण करते हैं भारत के महान गौरव, ${heroName} को। ${localState} की पावन धरा पर जन्मे इस महानायक ने हमें राष्ट्र सेवा और असीम साहस की प्रेरणा दी। इनका अमर जीवन संदेश था—"${cleanTagline}"। इनका जीवन परिचय और ऐतिहासिक यात्रा: ${shortBio} ${cPart} ऐतिहासिक महत्व और बलिदान: ${unsungReason} मातृभूमि के लिए इनका यह अद्वितीय योगदान हमारी आने वाली पीढ़ियों को सदैव प्रेरित करता रहेगा। आइए हम सब मिलकर इनके पावन योगदान को नमन करें। जय हिंद!`;
    }

    case 'ta':
    case 'ta-IN': {
      const cPart = contribsDesc ? `இவரது முக்கிய வரலாற்று சாதனைகள்: ${contribsDesc}.` : '';
      return `இன்று நாம் ஆழ்ந்த மரியாதையுடன் போற்றும் உன்னத தேசியத் தலைவர், ${heroName}. ${localState} மண்ணில் உதித்த இந்த மாமனிதர், நமக்கு சுயமரியாதையையும் தேச பக்தியையும் கற்றுத் தந்தார். "${cleanTagline}" என்பதே இவரது வாழ்வின் தாரக மந்திரமாகும். வரலாற்றுப் பின்னணி மற்றும் வாழ்க்கை நிகழ்வுகள்: ${shortBio} ${cPart} வரலாற்று முக்கியத்துவம் மற்றும் தியாகம்: ${unsungReason} தாய்நாட்டிற்காக இவர் ஆற்றிய இந்த ஒப்பற்ற சேவை இந்திய வரலாற்றில் என்றும் நிலைத்து நிற்கும். நாம் அனைவரும் இவரை வணங்கி போற்றுவோம். ஜெய் ஹிந்த்!`;
    }

    case 'te':
    case 'te-IN': {
      const cPart = contribsDesc ? `ఆయన సాధించిన ప్రధాన చారిత్రక విజయాలు: ${contribsDesc}.` : '';
      return `ఈ రోజు మనం ఎంతో గౌరవంతో స్మరించుకుంటున్న జాతీయ నాయకుడు ${heroName}. ${localState} పుణ్యభూమిలో జన్మించిన ఈ మహనీయుడు, మనందరికీ నిస్వార్థ సేవ మరియు ధైర్యాన్ని అందించారు. "${cleanTagline}" అనే ఆయన సందేశం ప్రతి హృదయాన్ని కదిలిస్తుంది. జీవిత చరిత్ర మరియు పోరాట గాథ: ${shortBio} ${cPart} చారిత్రక ప్రాముఖ్యత మరియు త్యాగం: ${unsungReason} దేశ ప్రగతి కోసం ఆయన చేసిన త్యాగం చిరకాలం గుర్తుండిపోతుంది. ఆయనకు మన ఘన నివాళులు. జై హింద్!`;
    }

    case 'mr':
    case 'mr-IN': {
      const cPart = contribsDesc ? `त्यांचे प्रमुख ऐतिहासिक कार्य: ${contribsDesc}।` : '';
      return `आज आपण अत्यंत आदराने स्मरण करूया भारताचे महान सुपुत्र, ${heroName} यांचे. ${localState} च्या पवित्र भूमीत जन्मलेल्या या थोर व्यक्तिमत्त्वाने आपल्याला राष्ट्रनिष्ठा आणि अथांग धैर्याचा मार्ग दाखवला. "${cleanTagline}" हा त्यांचा जीवनमंत्र होता. जीवनपट आणि ऐतिहासिक प्रवास: ${shortBio} ${cPart} ऐतिहासिक महत्त्व आणि बलिदान: ${unsungReason} देशासाठी त्यांचे हे अमूल्य योगदान सदैव प्रेरणादायी राहील. आपण सर्व मिळून त्यांना त्रिवार वंदन करूया. जय हिंद!`;
    }

    case 'gu':
    case 'gu-IN': {
      const cPart = contribsDesc ? `તેમના મુખ્ય ઐતિહાસિક યોગદાન: ${contribsDesc}.` : '';
      return `આજે આપણે હૃદયપૂર્વક વંદન કરીએ છીએ ભારતના મહાન સપૂત, ${heroName}ને. ${localState} ની પવિત્ર ભૂમિમાં જન્મેલા આ મહાન વ્યક્તિએ આપણને નિઃસ્વાર્થ સેવા અને હિંમતનો સંદેશ આપ્યો. "${cleanTagline}" એ તેમનો જીવન મંત્ર હતો. જીવન પરિચય અને ઐતિહાસિક સફર: ${shortBio} ${cPart} ઐતિહાસિક મહત્વ અને બલિદાન: ${unsungReason} દેશ માટેનું તેમનું આ બલિદાન સદાય અમર રહેશે. ચાલો આપણે સૌ તેમને શ્રદ્ધાંજલિ અર્પીએ. જય હિન્દ!`;
    }

    case 'kn':
    case 'kn-IN': {
      const cPart = contribsDesc ? `ಇವರ ಪ್ರಮುಖ ಐತಿಹಾಸಿಕ ಸಾಧನೆಗಳು: ${contribsDesc}.` : '';
      return `ಇಂದು ನಾವು ಅತ್ಯಂತ ಗೌರವದಿಂದ ಸ್ಮರಿಸುತ್ತಿರುವ ಧೀಮಂತ ನಾಯಕ ${heroName}. ${localState} ನೆಲದಲ್ಲಿ ಜನಿಸಿದ ಈ ಮಹಾನ್ ಚೇತನ, ನಮಗೆ ತ್ಯಾಗ ಮತ್ತು ಸಾಹಸದ ಹೊಸ ದಾರಿಯನ್ನು ತೋರಿಸಿಕೊಟ್ಟರು. "${cleanTagline}" ಎಂಬುದು ಅವರ ಜೀವನ ಸಂದೇಶವಾಗಿತ್ತು. ಜೀವನ ಇತಿಹಾಸ ಮತ್ತು ಮಹಾ ಪಯಣ: ${shortBio} ${cPart} ಐತಿಹಾಸಿಕ ಮಹತ್ವ ಮತ್ತು ತ್ಯಾಗ: ${unsungReason} ದೇಶಕ್ಕಾಗಿ ಇವರ ಮಹಾನ್ ಸೇವೆ ಎಂದಿಗೂ ಅಜರಾಮರ. ಇವರಿಗೆ ನಮ್ಮ ಕೋಟಿ ಕೋಟಿ ನಮನಗಳು. ಜೈ ಹಿಂದ್!`;
    }

    default: {
      const cPart = contribsDesc ? `Their pivotal milestones include: ${contribsDesc}.` : '';
      return `Today, we pause to honor the extraordinary journey of ${hero.name}. Rising from ${hero.state}, their life embodies selfless dedication and unwavering courage. Guided by the vision that "${cleanTagline}", their pivotal contributions helped shape the destiny of our nation. Historical Narrative: ${shortBio} ${cPart} Significance and Enduring Legacy: ${unsungReason} Their monumental sacrifice continues to inspire millions across India. Jai Hind!`;
    }
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

    // Generate Full Complete 5-Act Documentary Story
    const spokenText = buildCompleteOralStory(hero, shortLang);

    // Split text into natural spoken sentences (respecting Indic punctuation । and . ? !)
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
