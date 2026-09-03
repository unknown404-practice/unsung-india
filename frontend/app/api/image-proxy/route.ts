import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return new NextResponse('Missing url parameter', {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
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

    // If original returned 404/400 (e.g. SVG render or TIFF), fallback to rawUrl
    if (!response.ok && rawUrl !== imageUrl) {
      response = await fetch(rawUrl, {
        headers: {
          'User-Agent': userAgent,
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      });
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

  // Fallback: If direct fetch fails, return clean sovereign SVG emblem
  return new NextResponse(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="#090D16">
      <rect width="600" height="800" fill="#090D16"/>
      <circle cx="300" cy="350" r="140" fill="#ff9933" opacity="0.12"/>
      <circle cx="300" cy="350" r="90" fill="#ffffff" opacity="0.08"/>
      <path d="M300 280 L300 420 M230 350 L370 350" stroke="#ff9933" stroke-width="4" stroke-linecap="round"/>
      <text x="300" y="550" fill="#ff9933" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle" letter-spacing="2">UNSUNG HERO OF INDIA</text>
    </svg>`,
    {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
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
