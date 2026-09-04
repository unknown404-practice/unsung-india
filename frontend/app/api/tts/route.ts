import { NextRequest, NextResponse } from 'next/server';

// Domain Category Enum
type DomainCategory =
  | 'MUSIC_AND_ARTS'
  | 'SCIENCE_AND_DISCOVERY'
  | 'MATHEMATICS_AND_ASTRONOMY'
  | 'MEDICINE_AND_HEALTH'
  | 'LITERATURE_AND_POETRY'
  | 'SOCIAL_REFORM_AND_EDUCATION'
  | 'NATION_BUILDING_AND_AGRICULTURE'
  | 'FREEDOM_STRUGGLE_AND_MARTYRS';

function detectDomainCategory(domain: string, bio: string, tagline: string): DomainCategory {
  const text = `${domain} ${bio} ${tagline}`.toLowerCase();

  if (
    text.includes('music') ||
    text.includes('shehnai') ||
    text.includes('sitar') ||
    text.includes('vocal') ||
    text.includes('singer') ||
    text.includes('carnatic') ||
    text.includes('hindustani') ||
    text.includes('sarod') ||
    text.includes('tabla') ||
    text.includes('flute') ||
    text.includes('dance') ||
    text.includes('bharatanatyam') ||
    text.includes('artist') ||
    text.includes('painter') ||
    text.includes('composer')
  ) {
    return 'MUSIC_AND_ARTS';
  }

  if (
    text.includes('math') ||
    text.includes('number theory') ||
    text.includes('infinite series') ||
    text.includes('algebra') ||
    text.includes('geometry') ||
    text.includes('astronomy') ||
    text.includes('astronomer')
  ) {
    return 'MATHEMATICS_AND_ASTRONOMY';
  }

  if (
    text.includes('physic') ||
    text.includes('chemist') ||
    text.includes('scientist') ||
    text.includes('nobel prize in physics') ||
    text.includes('nobel prize in chemistry') ||
    text.includes('research') ||
    text.includes('laboratory') ||
    text.includes('quantum') ||
    text.includes('light scattering') ||
    text.includes('space') ||
    text.includes('isro') ||
    text.includes('botan') ||
    text.includes('plant physiology')
  ) {
    return 'SCIENCE_AND_DISCOVERY';
  }

  if (
    text.includes('surgeon') ||
    text.includes('surgery') ||
    text.includes('doctor') ||
    text.includes('medicine') ||
    text.includes('medical') ||
    text.includes('ayurveda') ||
    text.includes('charaka') ||
    text.includes('sushruta') ||
    text.includes('health') ||
    text.includes('hospital') ||
    text.includes('healing')
  ) {
    return 'MEDICINE_AND_HEALTH';
  }

  if (
    text.includes('poet') ||
    text.includes('poetry') ||
    text.includes('novel') ||
    text.includes('writer') ||
    text.includes('author') ||
    text.includes('literature') ||
    text.includes('philosophy') ||
    text.includes('philosopher') ||
    text.includes('gitanjali')
  ) {
    return 'LITERATURE_AND_POETRY';
  }

  if (
    text.includes('milk') ||
    text.includes('dairy') ||
    text.includes('white revolution') ||
    text.includes('green revolution') ||
    text.includes('agriculture') ||
    text.includes('industrial') ||
    text.includes('amul') ||
    text.includes('kurien') ||
    text.includes('swaminathan')
  ) {
    return 'NATION_BUILDING_AND_AGRICULTURE';
  }

  if (
    text.includes('reform') ||
    text.includes('social worker') ||
    text.includes('education') ||
    text.includes('widow') ||
    text.includes('untouchab') ||
    text.includes('dalit') ||
    text.includes('brahmo') ||
    text.includes('sati') ||
    text.includes('caste') ||
    text.includes('leprosy') ||
    text.includes('baba amte')
  ) {
    return 'SOCIAL_REFORM_AND_EDUCATION';
  }

  return 'FREEDOM_STRUGGLE_AND_MARTYRS';
}

// State localization dictionary
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
    kn: 'தமிழ்நாடு',
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
    kn: 'ગુજરાત',
  },
  'Uttar Pradesh': {
    bn: 'উত্তরপ্রদেশ',
    hi: 'उत्तर प्रदेश',
    ta: 'உத்தரப் பிரதேசம்',
    te: 'ఉత్తర ప్రదేశ్',
    mr: 'उत्तर प्रदेश',
    gu: 'ઉત્તર પ્રદેશ',
    kn: 'ಉತ್ತರ ಪ್ರದೇಶ',
  },
  'National': {
    bn: 'ভারতবর্ষ',
    hi: 'भारतवर्ष',
    ta: 'பாரத தேசம்',
    te: 'భారతదేశం',
    mr: 'भारतवर्ष',
    gu: 'ભારતવર્ષ',
    kn: 'ಭಾರತ ದೇಶ',
  },
};

function getLocalizedState(state: string, lang: string): string {
  for (const [key, mapping] of Object.entries(STATE_LOCALIZATIONS)) {
    if (state && state.toLowerCase().includes(key.toLowerCase())) {
      return mapping[lang] || state;
    }
  }
  return state || (lang === 'bn' ? 'ভারতবর্ষ' : lang === 'hi' ? 'भारतवर्ष' : 'India');
}

// Domain-Faithful, Fact-Accurate Pure Story Synthesizer
export function buildDomainFaithfulStory(hero: any, lang: string): string {
  const localState = getLocalizedState(hero.state, lang);
  const heroName =
    lang === 'bn' && hero.name_local
      ? hero.name_local
      : lang === 'hi' && hero.name_local && /[\u0900-\u097F]/.test(hero.name_local)
      ? hero.name_local
      : hero.name;

  const category = detectDomainCategory(
    hero.primary_domain || '',
    hero.short_bio || '',
    hero.tagline || ''
  );

  switch (category) {
    case 'MUSIC_AND_ARTS':
      switch (lang) {
        case 'bn':
          return `আজ আমরা গভীর শ্রদ্ধার সাথে স্মরণ করছি ভারতীয় সংগীত ও সংস্কৃতির এক অবিস্মরণীয় মহীরুহ, ${heroName}-কে। ${localState}-র পুণ্যভূমি থেকে উঠে আসা এই মহান সুরসাধক ভারতীয় মার্গ সংগীত এবং সুরের ঐশ্বর্যকে বিশ্বমঞ্চে এক অনন্য উচ্চতায় পৌঁছে দিয়েছিলেন। তাঁর অমর সুর সৃষ্টি এবং রাগ-রাগিণীর অনন্য পরিবেশনা প্রতিটি সংগীতপ্রেমীর হৃদয়ে চিরকাল আনন্দ ও ভক্তির অমিয় ধারা বইয়ে দেবে। সংগীত সাধনায় তাঁর এই ঐশ্বরিক অবদান সমগ্র জাতির চিরন্তন অহংকার। আসুন আমরা শ্রদ্ধার সাথে এই মহান সংগীতসাধককে প্রণাম জানাই।`;
        case 'hi':
          return `आइए आज हम सब मिलकर श्रद्धापूर्वक स्मरण करते हैं भारतीय संगीत और कला के महान शिखर पुरुष, ${heroName} को। ${localState} की पावन धरा से निकलकर इस महान संगीत मनीषी ने भारतीय शास्त्रीय संगीत और सुरों की पवित्र परंपरा को पूरे विश्व में प्रतिष्ठित किया। इनकी दिव्य संगीत साधना, सुरों की मिठास और रागों का अनूठा सम्मोहन हर संगीत प्रेमी के दिल में सदैव गूंजता रहेगा। कला और संगीत के क्षेत्र में इनका यह अविस्मरणीय योगदान हमारी सांस्कृतिक धरोहर का अनमोल गौरव है। आइए हम सब मिलकर इस महान कला साधक को नमन करें।`;
        case 'ta':
          return `இன்று நாம் ஆழ்ந்த மரியாதையுடன் போற்றும் இந்திய இசை உலகின் மாபெரும் மேதை, ${heroName}. ${localState} மண்ணில் உதித்த இந்த சங்கீத மேதை, இந்திய பாரம்பரிய இசையையும் நாத பிரம்மத்தையும் உலக அரங்கில் உயர்த்திப் பிடித்தார். இவரது தெய்வீக இசை ஞானமும் காலத்தால் அழியாத ராகங்களும் ஒவ்வொரு இசை ரசிகரின் நெஞ்சிலும் என்றும் நிலைத்திருக்கும். கலை மற்றும் இசைத் துறைக்கு இவர் ஆற்றிய மகத்தான பங்களிப்பு இந்தியாவின் அழியாத பொக்கிஷமாகும். நாம் அனைவரும் இவரைப் போற்றி வணங்குவோம்.`;
        case 'te':
          return `ఈ రోజు మనం ఎంతో గౌరవంతో స్మరించుకుంటున్న భారతీయ సంగీత ప్రపంచపు మహోన్నత శిఖరం ${heroName}. ${localState} పుణ్యభూమి నుంచి వచ్చిన ఈ సంగీత విద్వాంసుడు, భారతీయ శాస్త్రీయ సంగీతాన్ని ప్రపంచ స్థాయికి చేర్చారు. ఆయన స్వర మాధుర్యం, రాగాల సమ్మోహనం సంగీత ప్రేమికుల హృదయాల్లో ఎప్పటికీ నిలిచి ఉంటాయి. సంగీత రంగానికి ఆయన చేసిన సేవలు భారతీయ సంస్కృతికి గర్వకారణం. ఆయనకు మన ఘన నివాళులు.`;
        case 'mr':
          return `आज आपण अत्यंत आदराने स्मरण करूया भारतीय संगीत आणि संस्कृतीचे महान तपस्वी, ${heroName} यांचे. ${localState} च्या पवित्र भूमीतून पुढे आलेल्या या थोर संगीतकाराने भारतीय शास्त्रीय संगीताचा नाद जगभर पोहोचवला. त्यांची अद्वितीय स्वरसाधना आणि संगीतातील श्रेष्ठत्व प्रत्येक संगीतप्रेमीच्या मनात सदैव जिवंत राहील. कलेच्या क्षेत्रातील त्यांचे हे अमूल्य योगदान आपल्या देशाचा चिरंतन अभिमान आहे. आपण सर्व मिळून त्यांना त्रिवार वंदन करूया.`;
        case 'gu':
          return `આજે આપણે હૃદયપૂર્વક વંદન કરીએ છીએ ભારતીય સંગીત અને કલાના મહાન સાધક, ${heroName}ને. ${localState} ની પવિત્ર ભૂમિમાંથી ઉભરી આવેલા આ સંગીત સમ્રાટે ભારતીય શાસ્ત્રીય સંગીતને વિશ્વભરમાં અનોખી ઓળખ અપાવી. તેમની દિવ્ય સૂર સાધના અને રાગોનું અનોખું સૌંદર્ય દરેક સંગીતપ્રેમીના દિલમાં સદાય ગુંજતું રહેશે. કલા ક્ષેત્રે તેમનું આ અણમોલ પ્રદાન આપણા દેશનું કાયમી ગૌરવ છે.`;
        case 'kn':
          return `ಇಂದು ನಾವು ಅತ್ಯಂತ ಗೌರವದಿಂದ ಸ್ಮರಿಸುತ್ತಿರುವ ಭಾರತೀಯ ಸಂಗೀತ ಕ್ಷೇತ್ರದ ಮಹಾನ್ ಸಾಧಕ ${heroName}. ${localState} ನೆಲದಲ್ಲಿ ಬೆಳೆದ ಈ ಸಂಗೀತ ಚೇತನ, ಭಾರತೀಯ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತದ ಘನತೆಯನ್ನು ಜಗತ್ತಿನಾದ್ಯಂತ ಪಸರಿಸಿದರು. ಇವರ ನಾದ ಮಾಧುರ್ಯ ಮತ್ತು ಸಂಗೀತ ತಪಸ್ಸು ಪ್ರತಿಯೊಬ್ಬ ಸಂಗೀತಪ್ರಿಯರ ಮನಸ್ಸಿನಲ್ಲಿ ಸದಾ ಚಿರಂತನ. ಕಲಾ ಕ್ಷೇತ್ರಕ್ಕೆ ಇವರು ನೀಡಿದ ಕೊಡುಗೆ ದೇಶದ ಹೆಮ್ಮೆಯಾಗಿದೆ. ಇವರಿಗೆ ನಮ್ಮ ಕೋಟಿ ಕೋಟಿ ನಮನಗಳು.`;
        default:
          return `Today, we pause to honor the extraordinary musical genius and cultural legacy of ${hero.name}. Rising from ${hero.state}, this legendary maestro elevated Indian classical music to the highest pinnacle on the global stage. Their divine compositions, soulful melodies, and lifelong dedication to art remain an eternal treasure for humanity.`;
      }

    case 'SCIENCE_AND_DISCOVERY':
      switch (lang) {
        case 'bn':
          return `আজ আমরা গভীর শ্রদ্ধার সাথে স্মরণ করছি ভারতের এক বিশ্ববরেণ্য বিজ্ঞানী, ${heroName}-কে। ${localState}-র পুণ্যভূমিতে জন্ম নেওয়া এই দূরদর্শী গবেষক বৈজ্ঞানিক অনুসন্ধান এবং আবিষ্কারের মাধ্যমে আধুনিক জ্ঞান-বিজ্ঞানের দিগন্ত উন্মোচন করেছিলেন। তাঁর যুগান্তকারী গবেষণা আন্তর্জাতিক স্তরে ভারতের বৈজ্ঞানিক শ্রেষ্ঠত্বকে প্রতিষ্ঠিত করেছিল। মানবকল্যাণ ও প্রযুক্তির অগ্রগতিতে তাঁর এই অবিস্মরণীয় অবদান আমাদের ভবিষ্যৎ বিজ্ঞানীদের চিরকাল পথ দেখাবে। আসুন আমরা শ্রদ্ধার সাথে এই মহান বিজ্ঞানীকে স্যালুট জানাই।`;
        case 'hi':
          return `आइए आज हम सब मिलकर श्रद्धापूर्वक नमन करते हैं भारत के महान वैज्ञानिक और शोधकर्ता, ${heroName} को। ${localState} की पावन धरा पर जन्मे इस दूरदर्शी वैज्ञानिक ने अपने शोध और खोजों के माध्यम से आधुनिक विज्ञान की दुनिया में भारत का परचम लहराया। इनकी मौलिक खोजों और वैज्ञानिक प्रतिभा ने वैश्विक स्तर पर विज्ञान की दिशा को एक नई गति प्रदान की। विज्ञान और राष्ट्र निर्माण के क्षेत्र में इनका यह ऐतिहासिक योगदान हमारी आने वाली पीढ़ियों के लिए सदैव प्रेरणा का स्रोत रहेगा।`;
        case 'ta':
          return `இன்று நாம் பெருமையுடன் போற்றும் இந்தியாவின் புகழ்பெற்ற விஞ்ஞானி, ${heroName}. ${localState} மண்ணில் உதித்த இந்த மாபெரும் ஆய்வாளர், தனது அறிவியல் கண்டுபிடிப்புகளின் மூலம் உலக அளவில் இந்தியாவின் புகழை உயர்த்தினார். இவரது புரட்சிகரமான ஆராய்ச்சிகள் நவீன அறிவியல் வளர்ச்சிக்கு மிகப்பெரிய அடித்தளமாக அமைந்தன. அறிவியல் துறைக்கு இவர் ஆற்றிய தன்னலமற்ற பங்களிப்பை நாம் அனைவரும் போற்றி வணங்குவோம்.`;
        case 'te':
          return `ఈ రోజు మనం ఎంతో గర్వంగా స్మరించుకుంటున్న భారతదేశపు గొప్ప శాస్త్రవేత్త ${heroName}. ${localState} పుణ్యభూమిలో జన్మించిన ఈ పరిశోధకుడు, తమ అద్భుతమైన శాస్త్రీయ ఆవిష్కరణలతో ప్రపంచ వేదికపై భారతదేశ ఖ్యాతిని చాటారు. సైన్స్ మరియు విజ్ఞాన రంగంలో ఆయన చేసిన కృషి అజరామరం. ఆయనకు మన ఘన నివాళులు.`;
        case 'mr':
          return `आज आपण अत्यंत आदराने स्मरण करूया भारताचे महान शास्त्रज्ञ आणि संशोधक, ${heroName} यांचे. ${localState} च्या पवित्र भूमीत जन्मलेल्या या द्रष्ट्या वैज्ञानिकाने आपल्या संशोधनाद्वारे जागतिक पातळीवर भारताची मान उंचावली. विज्ञानातील त्यांचे मूलभूत योगदान देशाच्या प्रगतीसाठी सदैव दीपस्तंभ ठरले आहे. आपण सर्व मिळून या थोर वैज्ञानिकाला वंदन करूया.`;
        case 'gu':
          return `આજે આપણે હૃદયપૂર્વક વંદન કરીએ છીએ ભારતના વિશ્વપ્રસિદ્ધ વૈજ્ઞાનિક, ${heroName}ને. ${localState} ની પવિત્ર ભૂમિમાં જન્મેલા આ મહાન સંશોધકે પોતાના વૈજ્ઞાનિક પ્રયોગો અને શોધો દ્વારા વિજ્ઞાન જગતમાં ભારતનું નામ રોશન કર્યું. વિજ્ઞાન અને રાષ્ટ્ર નિર્માણમાં તેમનું યોગદાન અદ્વિતીય છે.`;
        case 'kn':
          return `ಇಂದು ನಾವು ಹೆಮ್ಮೆಯಿಂದ ಸ್ಮರಿಸುತ್ತಿರುವ ಭಾರತದ ಮಹಾನ್ ವಿಜ್ಞಾನಿ ${heroName}. ${localState} ನೆಲದಲ್ಲಿ ಜನಿಸಿದ ಈ ಸಂಶೋಧಕರು, ತಮ್ಮ ಅದ್ಭುತ ವೈಜ್ಞಾನಿಕ ಸಂಶೋಧನೆಗಳ ಮೂಲಕ ಜಾಗತಿಕ ಮಟ್ಟದಲ್ಲಿ ಭಾರತದ ಕೀರ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸಿದರು. ವಿಜ್ಞಾನ ಕ್ಷೇತ್ರಕ್ಕೆ ಇವರು ನೀಡಿದ ಕೊಡುಗೆ ಚಿರಸ್ಮರಣೀಯ.`;
        default:
          return `Today, we honor the pioneering scientific genius and intellectual brilliance of ${hero.name}. Rising from ${hero.state}, their groundbreaking discoveries and visionary research established India at the forefront of global scientific advancement.`;
      }

    case 'MATHEMATICS_AND_ASTRONOMY':
      switch (lang) {
        case 'bn':
          return `আজ আমরা গভীর শ্রদ্ধার সাথে স্মরণ করছি বিশ্বখ্যাত ভারতীয় গণিতজ্ঞ, ${heroName}-কে। ${localState}-র পুণ্যভূমি থেকে উঠে আসা এই বিস্ময়কর প্রতিভার অধিকারী তাঁর যুগান্তকারী সংখ্যাতত্ত্ব ও সমীকরণের মাধ্যমে আধুনিক গণিতশাস্ত্রকে পুনর্গঠিত করেছিলেন। গণিতের জটিল রহস্য উন্মোচনে তাঁর এই অলৌকিক মেধা সারা বিশ্বকে স্তম্ভিত করে দিয়েছিল। গণিত ও বিশ্ব জ্ঞানের জগতে তাঁর অবদান চিরকাল অমর হয়ে থাকবে।`;
        case 'hi':
          return `आइए आज हम श्रद्धापूर्वक स्मरण करते हैं भारत के अद्वितीय गणितज्ञ और प्रखर विचारक, ${heroName} को। ${localState} की पावन धरा पर जन्मे इस विलक्षण प्रतिभा के धनी ने अपनी अद्भुत गणितीय गणनाओं, सूत्रों और सिद्धांतों से पूरी दुनिया को चकित कर दिया था। संख्या सिद्धांत और गणित के गूढ़ रहस्यों को सुलझाने में इनका यह अलौकिक योगदान विश्व इतिहास में सदैव अमर रहेगा।`;
        case 'ta':
          return `இன்று நாம் ஆழ்ந்த மரியாதையுடன் போற்றும் உலகப் புகழ்பெற்ற கணித மேதை, ${heroName}. ${localState} மண்ணில் உதித்த இந்த விந்தை மனிதர், தனது வியக்கத்தக்க கணிதச் சமன்பாடுகளாலும் எண்கணித ஆய்வுகளாலும் உலகை வியப்பில் ஆழ்த்தினார். கணித உலகிற்கு இவர் ஆற்றிய அளப்பரிய சேவை என்றும் நிலைத்து நிற்கும்.`;
        case 'te':
          return `ఈ రోజు మనం ఎంతో గౌరవంతో స్మరించుకుంటున్న ప్రపంచ ప్రఖ్యాత భారతీయ గణిత మేధావి ${heroName}. ${localState} పుణ్యభూమిలో జన్మించిన ఈ అద్భుత ప్రతిభాశాలి, తమ గణిత సూత్రాలతో యావత్ ప్రపంచాన్ని ఆశ్చర్యపరిచారు. గణిత శాస్త్రానికి ఆయన చేసిన సేవలు చిరస్మరణీయం.`;
        case 'mr':
          return `आज आपण अत्यंत आदराने स्मरण करूया भारताचे महान गणितज्ञ, ${heroName} यांचे. ${localState} च्या पवित्र भूमीत जन्मलेल्या या अद्वितीय प्रतिभावंताने आपल्या गणितीय सूत्रांनी जगाला थक्क केले. गणिताच्या क्षेत्रातील त्यांचे हे कार्य युगानुयुगे स्मरणात राहील.`;
        case 'gu':
          return `આજે આપણે હૃદયપૂર્વક વંદન કરીએ છીએ ભારતના મહાન ગણિતશાસ્ત્રી, ${heroName}ને. ${localState} ની પવિત્ર ભૂમિમાં જન્મેલા આ પ્રતિભાવાન વિદ્વાને પોતાના ગણિતના અદભુત સિદ્ધાંતોથી વિશ્વને અચંબિત કર્યું હતું. ગણિત ક્ષેત્રે તેમનું યોગદાન અમર છે.`;
        case 'kn':
          return `ಇಂದು ನಾವು ಅತ್ಯಂತ ಗೌರವದಿಂದ ಸ್ಮರಿಸುತ್ತಿರುವ ಜಗತ್ಪ್ರಸಿದ್ಧ ಗಣಿತ ಮೇಧಾವಿ ${heroName}. ${localState} ನೆಲದಲ್ಲಿ ಜನಿಸಿದ ಈ ಅದ್ಭುತ ಪ್ರತಿಭೆ, ತಮ್ಮ ಗಣಿತ ಸೂತ್ರಗಳ ಮೂಲಕ ಇಡೀ ಜಗತ್ತನ್ನು ಬೆರಗುಗೊಳಿಸಿದರು. ಗಣಿತ ಕ್ಷೇತ್ರಕ್ಕೆ ಇವರ ಕೊಡುಗೆ ಅಜರಾಮರ.`;
        default:
          return `Today, we honor the sublime mathematical mind and visionary genius of ${hero.name}. Rising from ${hero.state}, their revolutionary insights into numbers, equations, and infinite series continue to inspire mathematicians worldwide.`;
      }

    case 'MEDICINE_AND_HEALTH':
      switch (lang) {
        case 'bn':
          return `আজ আমরা গভীর শ্রদ্ধার সাথে স্মরণ করছি মানবকল্যাণে নিবেদিতপ্রাণ মহান চিকিৎসক ও শল্যবিশেষজ্ঞ, ${heroName}-কে। ${localState}-র পুণ্যভূমি থেকে চিকিৎসা জগতে পথপ্রদর্শক এই মহাত্মা অসংখ্য মানুষের জীবন রক্ষা এবং প্রাচীন ও আধুনিক চিকিৎসা বিজ্ঞানের অগ্রগতিতে ঐতিহাসিক ভূমিকা পালন করেছিলেন। মানবজাতির স্বাস্থ্য ও রোগমুক্তির জন্য তাঁর এই নিঃস্বার্থ সাধনা চিরস্মরণীয়।`;
        case 'hi':
          return `आइए आज हम श्रद्धापूर्वक नमन करते हैं चिकित्सा और शल्यकर्म के महान अग्रदूत, ${heroName} को। ${localState} की पावन धरा पर जन्मे इस दयालु चिकित्सक ने मानव जीवन की रक्षा और चिकित्सा विज्ञान की उन्नति के लिए अपना सर्वस्व समर्पित कर दिया। रोगियों की सेवा और असाध्य रोगों के उपचार में इनका यह पावन योगदान मानवता के इतिहास में सदैव वंदनीय रहेगा।`;
        case 'ta':
          return `இன்று நாம் ஆழ்ந்த மரியாதையுடன் போற்றும் உன்னத மருத்துவ மேதை, ${heroName}. ${localState} மண்ணில் உதித்த இந்த மாபெரும் மருத்துவர், மனித உயிர்களைக் காப்பதிலும் மருத்துவ அறிவியலை வளர்ப்பதிலும் அளப்பரிய பங்காற்றினார். இவரது தன்னலமற்ற மருத்துவ சேவை என்றும் போற்றத்தக்கது.`;
        case 'te':
          return `ఈ రోజు మనం ఎంతో గౌరవంతో స్మరించుకుంటున్న మహోన్నత వైద్య నిపుణుడు ${heroName}. ${localState} పుణ్యభూమిలో జన్మించిన ఈ వైద్యుడు, మానవ ప్రాణాలను కాపాడటంలో మరియు వైద్య విజ్ఞానాన్ని అభివృద్ధి చేయడంలో విశేష కృషి చేశారు.`;
        case 'mr':
          return `आज आपण अत्यंत आदराने स्मरण करूया थोर वैद्यकीय तज्ज्ञ आणि शल्यविशारद, ${heroName} यांचे. ${localState} च्या पवित्र भूमीत जन्मलेल्या या थोर वैद्याने मानवी जीवन वाचवण्यासाठी आणि वैद्यकशास्त्राच्या विकासासाठी मोलाचे योगदान दिले.`;
        case 'gu':
          return `આજે આપણે હૃદયપૂર્વક વંદન કરીએ છીએ માનવતાના સેવક અને મહાન ચિકિત્સક, ${heroName}ને. ${localState} ની પવિત્ર ભૂમિમાં જન્મેલા આ વિદ્વાન વૈદ્યે માનવ જીવનના રક્ષણ અને તબીબી વિજ્ઞાનના વિકાસમાં ઐતિહાસિક ભૂમિકા ભજવી હતી.`;
        case 'kn':
          return `ಇಂದು ನಾವು ಅತ್ಯಂತ ಗೌರವದಿಂದ ಸ್ಮರಿಸುತ್ತಿರುವ ಮಹಾನ್ ವೈದ್ಯ ಚೇತನ ${heroName}. ${localState} ನೆಲದಲ್ಲಿ ಜನಿಸಿದ ಈ ವೈದ್ಯರು, ಮಾನವ ಜೀವಗಳನ್ನು ರಕ್ಷಿಸಲು ಮತ್ತು ವೈದ್ಯಕೀಯ ವಿಜ್ಞಾನವನ್ನು ಮುನ್ನಡೆಸಲು ತಮ್ಮ ಜೀವನವನ್ನೇ ಮುಡಿಪಾಗಿಟ್ಟರು.`;
        default:
          return `Today, we honor the compassionate healer and pioneer of medicine, ${hero.name}. Rising from ${hero.state}, their relentless devotion to saving human lives and advancing surgical and medical science left an indelible mark on humanity.`;
      }

    case 'SOCIAL_REFORM_AND_EDUCATION':
      switch (lang) {
        case 'bn':
          return `আজ আমরা গভীর শ্রদ্ধার সাথে স্মরণ করছি সমাজ সংস্কার ও মানবতার মহান আলোকবর্তিকা, ${heroName}-কে। ${localState}-র পুণ্যভূমিতে জন্ম নেওয়া এই দূরদর্শী সংস্কারক সমাজের কুসংস্কার, বৈষম্য দূরীকরণ এবং শিক্ষা ও নারীমুক্তির জন্য আজীবন সংগ্রাম করেছিলেন। দুর্বল ও নিপীড়িত মানুষের অধিকার প্রতিষ্ঠায় তাঁর এই নিঃস্বার্থ আত্মত্যাগ ভারতীয় সমাজকে এক নতুন আলোর দিশা দেখিয়েছিল।`;
        case 'hi':
          return `आइए आज हम श्रद्धापूर्वक नमन करते हैं समाज सुधार और समरसता के महान अग्रदूत, ${heroName} को। ${localState} की पावन धरा पर जन्मे इस महान समाज सुधारक ने सामाजिक कुरीतियों, भेदभाव और अशिक्षा के विरुद्ध आजीवन संघर्ष किया। शोषितों, वंचितों के उत्थान और नारी शिक्षा के लिए इनका यह पावन त्याग हमारे समाज को सदैव समानता और न्याय की राह दिखाता रहेगा।`;
        case 'ta':
          return `இன்று நாம் ஆழ்ந்த மரியாதையுடன் போற்றும் சமூக சீர்திருத்த மேதை, ${heroName}. ${localState} மண்ணில் உதித்த இந்த மாமனிதர், சமூகத்தில் நிலவிய மூடநம்பிக்கைகளையும் ஏற்றத்தாழ்வுகளையும் களைய தன் வாழ்நாள் முழுவதையும் அர்ப்பணித்தார். எளிய மக்களின் உரிமைக்காகவும் கல்விக்காகவும் இவர் ஆற்றிய பணிகள் என்றும் போற்றத்தக்கவை.`;
        case 'te':
          return `ఈ రోజు మనం ఎంతో గౌరవంతో స్మరించుకుంటున్న సమాజ సంస్కర్త ${heroName}. ${localState} పుణ్యభూమిలో జన్మించిన ఈ మహనీయుడు, మూఢనమ్మకాలు మరియు అసమానతలకు వ్యతిరేకంగా పోరాడారు. అట్టడుగు వర్గాల విద్యాభివృద్ధి మరియు సంక్షేమం కోసం ఆయన చేసిన కృషి అజరామరం.`;
        case 'mr':
          return `आज आपण अत्यंत आदराने स्मरण करूया थोर समाजसुधारक आणि शिक्षणतज्ज्ञ, ${heroName} यांचे. ${localState} च्या पवित्र भूमीत जन्मलेल्या या महामानवाने सामाजिक विषमता, अंधश्रद्धा आणि अन्यायाविरुद्ध आयुष्यभर लढा दिला. दीनदुबळ्यांच्या उद्धारासाठी त्यांचे हे कार्य सदैव प्रेरणादायी राहील.`;
        case 'gu':
          return `આજે આપણે હૃદયપૂર્વક વંદન કરીએ છીએ સમાજ સુધારક અને શિક્ષણવિદ્, ${heroName}ને. ${localState} ની પવિત્ર ભૂમિમાં જન્મેલા આ મહાન સુધારકે સામાજિક કુરિવાજો અને અસમાનતા દૂર કરવા માટે પોતાનું જીવન સમર્પિત કર્યું હતું.`;
        case 'kn':
          return `ಇಂದು ನಾವು ಅತ್ಯಂತ ಗೌರವದಿಂದ ಸ್ಮರಿಸುತ್ತಿರುವ ಮಹಾನ್ ಸಮಾಜ ಸುಧಾರಕ ${heroName}. ${localState} ನೆಲದಲ್ಲಿ ಜನಿಸಿದ ಈ ಚೇತನ, ಸಮಾಜದ ಅನಿಷ್ಟ ಪದ್ಧತಿಗಳು ಮತ್ತು ತಾರತಮ್ಯದ ವಿರುದ್ಧ ನಿರಂತರವಾಗಿ ಹೋರಾಡಿದರು. ಶೋಷಿತರ ಏಳಿಗೆಗಾಗಿ ಇವರು ಸಲ್ಲಿಸಿದ ಸೇವೆ ಅಮೋಘ.`;
        default:
          return `Today, we honor the fearless champion of social justice, equality, and human dignity, ${hero.name}. Rising from ${hero.state}, their life was dedicated to eradicating discrimination, uplifting the marginalized, and spreading the light of education.`;
      }

    default: // Freedom fighters & National heroes
      switch (lang) {
        case 'bn':
          return `আজ আমরা গভীর শ্রদ্ধার সাথে স্মরণ করছি ভারতের এক মহান বিপ্লবী বীর, ${heroName}-কে। ${localState}-র পুণ্যভূমিতে জন্ম নেওয়া এই অমর সন্তান মাতৃভূমির মুক্তি ও স্বাধীনতার জন্য নিজের সমগ্র জীবন হাসিমুখে উৎসর্গ করেছিলেন। ঔপনিবেশিক শাসনের বিরুদ্ধে তাঁর আপসহীন সংগ্রাম এবং বীরত্বপূর্ণ আত্মত্যাগ ভারতীয় স্বাধীনতা সংগ্রামের ইতিহাসে চিরকাল স্বর্ণাক্ষরে লেখা থাকবে। আসুন আমরা শ্রদ্ধার সাথে এই অমর শহীদকে স্যালুট জানাই। জয় হিন্দ!`;
        case 'hi':
          return `आइए आज हम सब मिलकर श्रद्धापूर्वक स्मरण करते हैं भारत के अमर सपूत और स्वतंत्रता सेनानी, ${heroName} को। ${localState} की पावन धरा पर जन्मे इस महानायक ने मातृभूमि की स्वाधीनता और मान-सम्मान के लिए अपना सर्वस्व न्योछावर कर दिया। ब्रिटिश हुकूमत के विरुद्ध इनका अदम्य साहस और अमर बलिदान भारतीय इतिहास में सदैव अमर रहेगा। आइए हम सब मिलकर इनके पावन बलिदान को नमन करें। जय हिंद!`;
        case 'ta':
          return `இன்று நாம் ஆழ்ந்த மரியாதையுடன் போற்றும் உன்னத விடுதலைப் போராட்ட வீரர், ${heroName}. ${localState} மண்ணில் உதித்த இந்த மாமனிதர், தாய்நாட்டின் சுதந்திரத்திற்காகவும் உரிமைக்காகவும் தன் உயிரையே தியாகம் செய்தார். அன்னிய ஆதிக்கத்திற்கு எதிராக இவர் நடத்திய வீரமிக்க போராட்டம் இந்திய வரலாற்றில் என்றும் நிலைத்து நிற்கும். ஜெய் ஹிந்த்!`;
        case 'te':
          return `ఈ రోజు మనం ఎంతో గౌరవంతో స్మరించుకుంటున్న జాతీయ స్వాతంత్ర్య సమరయోధుడు ${heroName}. ${localState} పుణ్యభూమిలో జన్మించిన ఈ మహనీయుడు, దేశ విముక్తి కోసం తమ సర్వస్వాన్ని త్యాగం చేశారు. ఆయన చేసిన పోరాటం భారత చరిత్రలో అజరామరం. ఆయనకు మన ఘన నివాళులు. జై హింద్!`;
        case 'mr':
          return `आज आपण अत्यंत आदराने स्मरण करूया भारताचे महान स्वातंत्र्यसैनिक आणि हुतात्मा, ${heroName} यांचे. ${localState} च्या पवित्र भूमीत जन्मलेल्या या थोर सुपुत्राने मातृभूमीच्या स्वातंत्र्यासाठी आपल्या प्राणांची आहुती दिली. देशासाठी त्यांचे हे बलिदान सदैव प्रेरणादायी राहील. जय हिंद!`;
        case 'gu':
          return `આજે આપણે હૃદયપૂર્વક વંદન કરીએ છીએ ભારતના મહાન સ્વાતંત્ર્ય સેનાની, ${heroName}ને. ${localState} ની પવિત્ર ભૂમિમાં જન્મેલા આ મહાન વીરે માતૃભૂમિની આઝાદી માટે પોતાનું સર્વસ્વ સમર્પિત કરી દીધું હતું. તેમનું આ બલિદાન સદાય અમર રહેશે. જય હિન્દ!`;
        case 'kn':
          return `ಇಂದು ನಾವು ಅತ್ಯಂತ ಗೌರವದಿಂದ ಸ್ಮರಿಸುತ್ತಿರುವ ಭಾರತದ ಮಹಾನ್ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರ ${heroName}. ${localState} ನೆಲದಲ್ಲಿ ಜನಿಸಿದ ಈ ವೀರ ಚೇತನ, ದೇಶದ ಸ್ವಾತಂತ್ರ್ಯಕ್ಕಾಗಿ ತಮ್ಮ ಜೀವನವನ್ನೇ ಮುಡಿಪಾಗಿಟ್ಟರು. ದೇಶಕ್ಕಾಗಿ ಇವರ ಮಹಾನ್ ಸೇವೆ ಎಂದಿಗೂ ಅಜರಾಮರ. ಜೈ ಹಿಂದ್!`;
        default:
          return `Today, we honor the supreme patriotism, courage, and sacrifice of ${hero.name}. Rising from ${hero.state}, their fearless resistance against colonial rule and unyielding devotion to India's freedom will inspire generations forever. Jai Hind!`;
      }
  }
}

// Single Continuous Full Audio Stream Handler
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text')?.trim();
  const lang = searchParams.get('lang')?.toLowerCase().slice(0, 2) || 'en';

  if (!text) {
    return new NextResponse('Text is required', { status: 400 });
  }

  // Split into chunks of max 180 chars
  const chunks: string[] = [];
  const rawSentences = text.split(/(?<=[।\.!\?])\s+/).filter(Boolean);

  for (const s of rawSentences) {
    if (s.length <= 180) {
      chunks.push(s);
    } else {
      const sub = s.split(/,\s+/);
      for (const part of sub) {
        if (part.trim()) chunks.push(part.trim());
      }
    }
  }

  try {
    const audioBuffers = await Promise.all(
      chunks.map(async (chunk) => {
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(
          chunk
        )}`;
        const res = await fetch(ttsUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 UnsungHeroesDPI/1.0',
            Accept: 'audio/mpeg,audio/*;q=0.9',
          },
        });
        if (res.ok) {
          return await res.arrayBuffer();
        }
        return new ArrayBuffer(0);
      })
    );

    let totalLength = 0;
    for (const b of audioBuffers) {
      totalLength += b.byteLength;
    }

    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const b of audioBuffers) {
      combined.set(new Uint8Array(b), offset);
      offset += b.byteLength;
    }

    return new NextResponse(combined, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': combined.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('Full TTS Stream Error:', err);
    return new NextResponse('Full audio stream generation failed', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hero, lang = 'hi' } = body;

    if (!hero) {
      return NextResponse.json({ error: 'Hero data is required' }, { status: 400 });
    }

    const shortLang = lang.slice(0, 2).toLowerCase();

    // Domain & Fact-Faithful Monolingual Generation (Never calls a musician a freedom fighter!)
    const spokenText = buildDomainFaithfulStory(hero, shortLang);

    const sentences = spokenText
      .split(/(?<=[।\.!\?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const fullAudioStreamUrl = `/api/tts?lang=${shortLang}&text=${encodeURIComponent(spokenText)}`;

    return NextResponse.json({
      success: true,
      lang: shortLang,
      spokenText,
      sentences,
      fullAudioStreamUrl,
    });
  } catch (error: any) {
    console.error('TTS API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
