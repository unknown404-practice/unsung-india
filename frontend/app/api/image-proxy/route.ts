import { NextRequest, NextResponse } from 'next/server';

// In-memory resolved URL cache to avoid re-querying Wikipedia API for corrected URLs
const RESOLVED_URL_CACHE = new Map<string, string>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return new NextResponse('Missing url parameter', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Check in-memory fast cache
  if (RESOLVED_URL_CACHE.has(rawUrl)) {
    const cachedTarget = RESOLVED_URL_CACHE.get(rawUrl)!;
    if (cachedTarget) rawUrl = cachedTarget;
  }

  // Remove query parameters like ?utm_source=...
  let imageUrl = rawUrl.split('?')[0];

  // Sanitize Wikimedia URLs: Convert invalid /thumb/ URLs to canonical original URLs
  // Example: .../commons/thumb/4/44/File.jpg/600px-File.jpg -> .../commons/4/44/File.jpg
  if (imageUrl.includes('upload.wikimedia.org') && imageUrl.includes('/thumb/')) {
    const match = imageUrl.match(/(https:\/\/upload\.wikimedia\.org\/wikipedia\/[a-z]+)\/thumb\/([a-z0-9]\/[a-z0-9]+)\/([^\/]+)\/.+$/i);
    if (match) {
      imageUrl = `${match[1]}/${match[2]}/${match[3]}`;
    }
  }

  const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 UnsungIndiaDPI/1.0 (contact@unsung-heroes.gov.in)';

  try {
    let response = await fetch(imageUrl, {
      headers: {
        'User-Agent': userAgent,
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    // If direct canonical fetch failed, try original rawUrl
    if (!response.ok && rawUrl !== imageUrl) {
      response = await fetch(rawUrl, {
        headers: {
          'User-Agent': userAgent,
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      });
    }

    // Dynamic Live Fallback: If still 404, query Wikimedia Commons API to find the exact file URL
    if (!response.ok && (imageUrl.includes('wikimedia.org') || imageUrl.includes('wikipedia.org'))) {
      const fileName = imageUrl.split('/').pop()?.replace(/^(File:|Image:)/i, '') || '';
      const cleanSearch = decodeURIComponent(fileName).replace(/_/g, ' ').replace(/\.[a-z0-9]+$/i, '');

      if (cleanSearch) {
        try {
          // Query Commons imageinfo by filename or search
          const apiQueryUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
            cleanSearch
          )}&gsrnamespace=6&gsrlimit=2&prop=imageinfo&iiprop=url&format=json`;

          const apiRes = await fetch(apiQueryUrl, {
            headers: { 'User-Agent': userAgent },
          });

          if (apiRes.ok) {
            const apiJson = await apiRes.json();
            const pages = apiJson?.query?.pages || {};
            for (const pid in pages) {
              const liveUrl = pages[pid]?.imageinfo?.[0]?.url;
              if (liveUrl) {
                const liveFetch = await fetch(liveUrl, {
                  headers: {
                    'User-Agent': userAgent,
                    Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                  },
                });
                if (liveFetch.ok) {
                  RESOLVED_URL_CACHE.set(rawUrl, liveUrl);
                  response = liveFetch;
                  break;
                }
              }
            }
          }
        } catch (apiErr) {
          console.warn('Wikimedia API dynamic resolution error:', apiErr);
        }
      }
    }

    if (response.ok) {
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const buffer = await response.arrayBuffer();

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        },
      });
    }
  } catch (error) {
    console.error('Image proxy fetch error:', error);
  }

  // Resilient Fallback: High-resolution National Emblem & Tiranga Portrait SVG
  const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="#090D16">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="50%" stop-color="#090D16"/>
        <stop offset="100%" stop-color="#030712"/>
      </linearGradient>
      <linearGradient id="saffronGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF9933"/>
        <stop offset="100%" stop-color="#E11D48"/>
      </linearGradient>
      <radialGradient id="aura" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#FF9933" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#FF9933" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="600" height="800" fill="url(#bg)"/>
    <circle cx="300" cy="360" r="220" fill="url(#aura)"/>
    <circle cx="300" cy="360" r="140" fill="none" stroke="url(#saffronGold)" stroke-width="2" stroke-dasharray="8 6" opacity="0.6"/>
    <circle cx="300" cy="360" r="110" fill="#1E293B" stroke="#334155" stroke-width="3"/>
    
    <!-- Stylized Portrait Silhouette -->
    <circle cx="300" cy="320" r="45" fill="#FF9933" opacity="0.85"/>
    <path d="M220 440 C220 380, 260 375, 300 375 C340 375, 380 380, 380 440 Z" fill="#FF9933" opacity="0.85"/>
    
    <!-- Saffron & Green Accent Bars -->
    <rect x="230" y="520" width="140" height="4" rx="2" fill="#FF9933"/>
    <rect x="260" y="530" width="80" height="3" rx="1.5" fill="#138808"/>
    
    <text x="300" y="580" fill="#F8FAFC" font-family="'Cinzel', Georgia, serif" font-size="20" font-weight="bold" text-anchor="middle" letter-spacing="3">UNSUNG HERO</text>
    <text x="300" y="610" fill="#FF9933" font-family="sans-serif" font-size="12" font-weight="600" text-anchor="middle" letter-spacing="2">NATIONAL ARCHIVE OF INDIA</text>
  </svg>`;

  return new NextResponse(fallbackSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
