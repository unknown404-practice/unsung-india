import { NextRequest, NextResponse } from 'next/server';
import { getAllSubmissions, createSubmission } from '@/lib/submissions-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const all = getAllSubmissions();
    if (!statusFilter || statusFilter === 'ALL') {
      return NextResponse.json(all);
    }

    const filtered = all.filter((s) => s.status === statusFilter);
    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.hero_name || !body.state || !body.short_bio) {
      return NextResponse.json(
        { error: 'Hero name, state, and short biography are required fields.' },
        { status: 400 }
      );
    }

    const newSub = createSubmission({
      submitter_name: body.submitter_name || 'Anonymous Contributor',
      submitter_email: body.submitter_email || 'contributor@unsungheroes.in',
      hero_name: body.hero_name.trim(),
      hero_name_local: body.hero_name_local ? body.hero_name_local.trim() : undefined,
      state: body.state.trim(),
      primary_domain: body.primary_domain || 'Freedom Struggle',
      birth_year: body.birth_year ? parseInt(body.birth_year) : null,
      death_year: body.death_year ? parseInt(body.death_year) : null,
      short_bio: body.short_bio.trim(),
      key_contributions: Array.isArray(body.key_contributions) ? body.key_contributions : [],
      sources_text: body.sources_text || '',
      image_url: body.image_url || null,
      image_license_declared: body.image_license_declared || 'PUBLIC_DOMAIN',
    });

    return NextResponse.json(
      {
        message: 'Submission successfully recorded in moderation queue.',
        submission: newSub,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: error?.message || 'Failed to record submission' }, { status: 500 });
  }
}
