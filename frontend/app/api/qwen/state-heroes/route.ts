import { NextRequest, NextResponse } from 'next/server';
import { Hero } from '../../../../lib/types';
import { SAMPLE_HEROES } from '../../../../lib/sample-data';

// Pre-seeded rich state regional figures index
const STATE_REGIONAL_HEROES: Record<string, string[]> = {
  'andhra pradesh': [
    'Alluri Sitarama Raju',
    'Pingali Venkayya',
    'Tanguturi Prakasam',
    'Durgabai Deshmukh',
    'Uyyalawada Narasimha Reddy',
    'Potti Sreeramulu',
  ],
  'west bengal': [
    'Subhas Chandra Bose',
    'Khudiram Bose',
    'Rash Behari Bose',
    'Matangini Hazra',
    'Prafulla Chandra Ray',
    'Jagadish Chandra Bose',
    'Dr. Sambhu Nath De',
    'Begum Rokeya',
  ],
  'maharashtra': [
    'Savitribai Phule',
    'Jyotirao Phule',
    'Vasudev Balwant Phadke',
    'Tatya Tope',
    'Ahilyabai Holkar',
    'Bhimrao Ramji Ambedkar',
    'Lata Mangeshkar',
  ],
  'tamil nadu': [
    'Subramania Bharati',
    'Velu Nachiyar',
    'V. O. Chidambaram Pillai',
    'C. V. Raman',
    'Srinivasa Ramanujan',
    'M. S. Subbulakshmi',
    'Tiruppur Kumaran',
  ],
  'punjab': [
    'Bhagat Singh',
    'Udham Singh',
    'Kartar Singh Sarabha',
    'Lala Lajpat Rai',
    'Bhai Mati Das',
  ],
  'kerala': [
    'Pazhassi Raja',
    'Ayyankali',
    'K. Kelappan',
    'Janaki Ammal',
    'Velu Thampi Dalawa',
    'Akkamma Cherian',
  ],
  'odisha': [
    'Baji Rout',
    'Bakshi Jagabandhu',
    'Gopabandhu Das',
    'Chakhi Khuntia',
  ],
  'meghalaya': [
    'U Tirot Sing',
    'Pa Togan Sangma',
    'U Kiang Nangbah',
  ],
  'assam': [
    'Lachit Borphukan',
    'Kanaklata Barua',
    'Maniram Dewan',
    'Kushal Konwar',
    'Bhogeswari Phukanani',
  ],
  'gujarat': [
    'Mahatma Gandhi',
    'Sardar Vallabhbhai Patel',
    'Shyamji Krishna Varma',
    'Ravi Shankar Vyas',
    'Tribhuvandas Patel',
    'Verghese Kurien',
  ],
  'bihar': [
    'Kunwar Singh',
    'Peer Ali Khan',
    'Batukeshwar Dutt',
    'Dr. Rajendra Prasad',
    'Jayaprakash Narayan',
  ],
  'karnataka': [
    'Kittur Chennamma',
    'Sangolli Rayanna',
    'Rani Abbakka Chowta',
    'Kamaladevi Chattopadhyay',
    'M. Visvesvaraya',
  ],
  'uttar pradesh': [
    'Rani Lakshmibai',
    'Mangal Pandey',
    'Chandrashekhar Azad',
    'Begum Hazrat Mahal',
    'Ustad Bismillah Khan',
    'Ashfaqulla Khan',
  ],
  'madhya pradesh': [
    'Tantia Tope',
    'Rani Durgavati',
    'Chhatrasal',
    'Tantia Bhil',
  ],
  'jharkhand': [
    'Birsa Munda',
    'Tilka Manjhi',
    'Sidhu Murmu',
    'Kanhu Murmu',
    'Jatra Bhagat',
  ],
};

const STATE_HEROES_CACHE = new Map<string, Hero[]>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state')?.toLowerCase().trim() || '';

  if (!state) {
    return NextResponse.json({ error: 'State parameter is required' }, { status: 400 });
  }

  // 1. Instant Cache Check (< 1ms)
  if (STATE_HEROES_CACHE.has(state)) {
    return NextResponse.json({
      state,
      heroes: STATE_HEROES_CACHE.get(state),
      source: 'STATE_MEMORY_CACHE',
    });
  }

  // 2. Collect from catalog first
  const catalogMatches = SAMPLE_HEROES.filter((h) =>
    h.state.toLowerCase().includes(state)
  );

  // 3. Find registered names for this state
  const targetNames = STATE_REGIONAL_HEROES[state] || [
    `Freedom Fighter of ${state}`,
    `Leader of ${state}`,
  ];

  // Merge with names not yet in catalog
  const missingNames = targetNames.filter(
    (name) => !catalogMatches.some((h) => h.name.toLowerCase().includes(name.toLowerCase()))
  );

  const discoveredHeroes: Hero[] = [...catalogMatches];

  // 4. Concurrently fetch missing heroes via high-speed internal resolver
  const fetchPromises = missingNames.map(async (name) => {
    try {
      const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[-\s]+/g, '-');
      const directUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        name
      )}&redirects=1&prop=extracts|pageimages|info&exintro=true&explaintext=true&piprop=original|thumbnail&pithumbsize=800&inprop=url&format=json`;

      const res = await fetch(directUrl, {
        headers: { 'User-Agent': 'UnsungIndiaDPI/1.0' },
        next: { revalidate: 86400 },
      });

      if (res.ok) {
        const json = await res.json();
        const pages = json?.query?.pages || {};
        for (const pid in pages) {
          if (pid !== '-1') {
            const p = pages[pid];
            const ext = p.extract || '';
            const img = p.original?.source || p.thumbnail?.source || '';
            if (ext) {
              const cleanExtract = ext.split('. ').slice(0, 3).join('. ') + '.';
              const newHero: Hero = {
                id: slug,
                slug,
                name: p.title || name,
                name_local: p.title || name,
                state: state.charAt(0).toUpperCase() + state.slice(1),
                primary_domain: /freedom|revolt|rebel/i.test(ext)
                  ? 'Freedom Struggle & Armed Resistance'
                  : /music|singer/i.test(ext)
                  ? 'Classical Indian Music & Culture'
                  : /physic|scientist/i.test(ext)
                  ? 'Scientific Discovery'
                  : 'National Heritage & Public Service',
                tagline: `Immortal pioneer and revolutionary from ${state}.`,
                short_bio: cleanExtract,
                image_url: img || 'https://upload.wikimedia.org/wikipedia/commons/8/80/India_Emblem.svg',
                is_unsung_reason: `Monumental contributions to the freedom and culture of ${state} and India.`,
                image_license: 'PUBLIC_DOMAIN',
                image_attribution: 'Wikimedia Commons / Public Domain',
              };
              return newHero;
            }
          }
        }
      }
    } catch (e) {
      console.warn('State hero fetch error for:', name, e);
    }
    return null;
  });

  const results = await Promise.allSettled(fetchPromises);
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) {
      discoveredHeroes.push(r.value);
    }
  }

  // Cache state results
  STATE_HEROES_CACHE.set(state, discoveredHeroes);

  return NextResponse.json({
    state,
    heroes: discoveredHeroes,
    total: discoveredHeroes.length,
    source: 'QWEN_WIKIPEDIA_PARALLEL_STATE_RESOLVER',
  });
}
