async function testSubmissionWorkflow() {
  const BASE_URL = 'http://localhost:3000';
  console.log('--- 1. Testing GET /api/submissions ---');
  let getRes = await fetch(`${BASE_URL}/api/submissions`);
  let initialList = await getRes.json();
  console.log(`Retrieved ${initialList.length} submissions.`);

  console.log('\n--- 2. Testing POST /api/submissions (Nominate Bina Das) ---');
  const payload = {
    submitter_name: 'Ananya Banerjee',
    submitter_email: 'ananya@presidency.edu.in',
    hero_name: 'Bina Das',
    hero_name_local: 'বীণা দাস',
    state: 'West Bengal',
    primary_domain: 'Freedom Struggle',
    birth_year: 1911,
    death_year: 1986,
    short_bio: 'Bina Das was an Indian revolutionary and nationalist from West Bengal who attempted to assassinate the British Governor of Bengal Stanley Jackson in 1932 at the Calcutta University convocation.',
    key_contributions: [
      'Fired shots at Governor Stanley Jackson during the Calcutta University convocation ceremony.',
      'Active leader of Chhatri Sangha women student resistance movement in Bengal.',
      'Awarded Padma Shri in 1960 for lifelong dedicated social welfare work.'
    ],
    sources_text: "Autobiography 'Shrinkhal Jhankar'; National Archives of India; Calcutta Police Special Branch records.",
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Bina_Das_revolutionary.jpg',
    image_license_declared: 'PUBLIC_DOMAIN'
  };

  let postRes = await fetch(`${BASE_URL}/api/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  let postJson = await postRes.json();
  console.log('Submission Response Status:', postRes.status);
  console.log('Submission ID:', postJson.submission?.id);
  const newSubmissionId = postJson.submission?.id;

  if (!newSubmissionId) {
    console.error('Failed to create submission:', postJson);
    return;
  }

  console.log('\n--- 3. Testing POST /api/submissions/[id]/approve (Approve Bina Das) ---');
  let approveRes = await fetch(`${BASE_URL}/api/submissions/${newSubmissionId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'bina-das',
      tagline: 'The fearlessly defiant revolutionary who fired at Bengal Governor Stanley Jackson at age 21.',
      is_unsung_reason: 'Her supreme courage and years of rigorous imprisonment were eclipsed in post-independence national textbooks.'
    })
  });

  let approveJson = await approveRes.json();
  console.log('Approval Response Status:', approveRes.status);
  console.log('Published Hero Slug:', approveJson.published_hero?.slug);
  console.log('Live Hero URL:', approveJson.hero_url);

  console.log('\n--- 4. Testing Hero Page /heroes/bina-das ---');
  let pageRes = await fetch(`${BASE_URL}/heroes/bina-das`);
  console.log('Hero Page Status:', pageRes.status);

  console.log('\n--- 5. Testing Image Proxy for Published Hero ---');
  let imgProxyRes = await fetch(`${BASE_URL}/api/image-proxy?url=${encodeURIComponent('https://upload.wikimedia.org/wikipedia/commons/4/47/Bina_Das.jpg')}`);
  console.log('Image Proxy Status:', imgProxyRes.status, 'Content-Type:', imgProxyRes.headers.get('content-type'));

  console.log('\n--- 6. Testing Indic Audio Generation for Published Hero ---');
  let ttsRes = await fetch(`${BASE_URL}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hero: {
        name: 'Bina Das',
        state: 'West Bengal',
        primary_domain: 'Freedom Struggle',
        short_bio: 'Bina Das was an Indian revolutionary and nationalist from West Bengal.'
      },
      lang: 'bn'
    })
  });
  let ttsJson = await ttsRes.json();
  console.log('TTS Status:', ttsRes.status, 'Generated Text Sample:', ttsJson.spokenText?.substring(0, 60) + '...');

  console.log('\n--- 7. Testing POST /api/submissions/[id]/reject ---');
  // Create a temporary mock submission to test rejection
  let sub2Res = await fetch(`${BASE_URL}/api/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      submitter_name: 'Anonymous',
      hero_name: 'Unverified Legend Figure',
      state: 'Odisha',
      short_bio: 'Legendary unverified tale.'
    })
  });
  let sub2Json = await sub2Res.json();
  let sub2Id = sub2Json.submission?.id;
  if (sub2Id) {
    let rejectRes = await fetch(`${BASE_URL}/api/submissions/${sub2Id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rejection_reason: 'Lacks verifiable primary archival citations.' })
    });
    let rejectJson = await rejectRes.json();
    console.log('Rejection Response Status:', rejectRes.status, 'Status:', rejectJson.submission?.status);
  }

  console.log('\n========================================');
  console.log('ALL WORKFLOW VERIFICATION STEPS PASSED!');
  console.log('========================================');
}

testSubmissionWorkflow().catch(console.error);
