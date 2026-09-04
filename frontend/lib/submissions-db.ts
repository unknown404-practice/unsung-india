import fs from 'fs';
import path from 'path';

export interface SubmissionRecord {
  id: string;
  submitter_name: string;
  submitter_email: string;
  hero_name: string;
  hero_name_local?: string;
  state: string;
  primary_domain: string;
  birth_year?: number | null;
  death_year?: number | null;
  short_bio: string;
  key_contributions: string[];
  sources_text: string;
  image_url?: string | null;
  image_license_declared?: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
  approved_hero_slug?: string;
  created_at: string;
  updated_at: string;
}

export interface PublishedHeroRecord {
  id: string;
  slug: string;
  name: string;
  name_local?: string;
  birth_year?: number | null;
  death_year?: number | null;
  era: string;
  state: string;
  district?: string;
  primary_domain: string;
  tagline: string;
  short_bio: string;
  is_unsung_reason: string;
  image_url: string;
  image_license: string;
  image_attribution: string;
  image_source_page_url: string;
  view_count: number;
  banner_download_count: number;
  contributions: Array<{ display_order: number; title: string; description: string }>;
  timeline_events: Array<{ event_year: number; event_date?: string; title: string; description: string; display_order: number }>;
  sources: Array<{ title: string; source_type: string; url?: string; is_primary_reference: boolean }>;
  published_at: string;
  submission_id?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions_store.json');
const PUBLISHED_HEROES_FILE = path.join(DATA_DIR, 'published_heroes.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

const INITIAL_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: 'sub-001',
    submitter_name: 'Prof. Debabrata Roy',
    submitter_email: 'debabrata@jadavpur.edu',
    hero_name: 'Khudiram Bose',
    hero_name_local: 'ক্ষুদিরাম বসু',
    state: 'West Bengal',
    primary_domain: 'Freedom Struggle',
    birth_year: 1889,
    death_year: 1908,
    short_bio: 'One of the youngest revolutionaries of the Indian independence movement, martyred at age 18 in Muzaffarpur.',
    key_contributions: [
      'Active leader in the Anushilan Samiti revolutionary organisation.',
      'Muzaffarpur action against oppressive colonial magistrate Douglas Kingsford.',
      'Embraced the gallows smiling at just 18 years old, igniting Bengali revolutionary songs.'
    ],
    sources_text: 'National Archives of India (Muzaffarpur Conspiracy Case File); PIB Bengal Martyrs Series.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Khudiram_Bose_1905.jpg',
    image_license_declared: 'PUBLIC_DOMAIN',
    status: 'SUBMITTED',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'sub-002',
    submitter_name: 'Dr. Kavitha Nair',
    submitter_email: 'kavitha.nair@kerala.ac.in',
    hero_name: 'Akkamma Cherian',
    hero_name_local: 'അക്കമ്മ ചെറിയാൻ',
    state: 'Kerala',
    primary_domain: 'Freedom Struggle',
    birth_year: 1909,
    death_year: 1982,
    short_bio: 'Indian independence activist and feminist leader from Travancore affectionately hailed as the "Jhansi Rani of Travancore" by Mahatma Gandhi.',
    key_contributions: [
      'Led 20,000 peaceful demonstrators against the autocratic Diwan CP Ramaswamy Iyer.',
      'Famously dared the police inspector to shoot her first when military troops opened fire.',
      'Formed the Desasevini Sangh volunteer brigade for women independence workers.'
    ],
    sources_text: 'Kerala State Archives gazetteer; PIB Women Freedom Fighters of India.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Akkamma_Cherian.jpg',
    image_license_declared: 'PUBLIC_DOMAIN',
    status: 'SUBMITTED',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'sub-003',
    submitter_name: 'Siddharth Deshmukh',
    submitter_email: 'siddharth@pune.org',
    hero_name: 'Krishnaji Gopal Karve',
    hero_name_local: 'कृष्णाजी गोपाळ कर्वे',
    state: 'Maharashtra',
    primary_domain: 'Freedom Struggle',
    birth_year: 1887,
    death_year: 1910,
    short_bio: 'Revolutionary freedom fighter from Nashik associated with the Abhinav Bharat Society founded by Veer Savarkar.',
    key_contributions: [
      'Key member of the Abhinav Bharat revolutionary society in Maharashtra.',
      'Assassinated the oppressive British Collector A.M.T. Jackson in Nashik in December 1909.',
      'Executed by the British regime at Thane Jail in 1910.'
    ],
    sources_text: 'Maharashtra State Archives; Abhinav Bharat Historical Society records.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Revolutionary_Krishna_Karve.jpg',
    image_license_declared: 'PUBLIC_DOMAIN',
    status: 'SUBMITTED',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'sub-004',
    submitter_name: 'Ananya Banerjee',
    submitter_email: 'ananya@presidency.edu.in',
    hero_name: 'Bina Das',
    hero_name_local: 'বীণা দাস',
    state: 'West Bengal',
    primary_domain: 'Freedom Struggle',
    birth_year: 1911,
    death_year: 1986,
    short_bio: 'Bina Das was an Indian revolutionary and nationalist from West Bengal who attempted to assassinate Bengal Governor Stanley Jackson in 1932.',
    key_contributions: [
      'Fired shots at Governor Stanley Jackson during the Calcutta University convocation ceremony.',
      'Active leader of the Chhatri Sangha women student resistance in Bengal.',
      'Awarded Padma Shri in 1960 for dedicated social work.'
    ],
    sources_text: 'Autobiography Shrinkhal Jhankar; Calcutta Police Special Branch records.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Bina_Das_revolutionary.jpg',
    image_license_declared: 'PUBLIC_DOMAIN',
    status: 'APPROVED',
    approved_hero_slug: 'bina-das',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export function getAllSubmissions(): SubmissionRecord[] {
  ensureDataDir();
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(INITIAL_SUBMISSIONS, null, 2), 'utf-8');
    return INITIAL_SUBMISSIONS;
  }
  try {
    const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading submissions file:', e);
    return INITIAL_SUBMISSIONS;
  }
}

export function saveSubmissions(submissions: SubmissionRecord[]) {
  ensureDataDir();
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf-8');
}

export function getSubmissionById(id: string): SubmissionRecord | undefined {
  const list = getAllSubmissions();
  return list.find((s) => s.id === id);
}

export function createSubmission(data: Omit<SubmissionRecord, 'id' | 'status' | 'created_at' | 'updated_at'>): SubmissionRecord {
  const submissions = getAllSubmissions();
  const id = `sub-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const newSubmission: SubmissionRecord = {
    ...data,
    id,
    status: 'SUBMITTED',
    created_at: now,
    updated_at: now
  };
  submissions.unshift(newSubmission);
  saveSubmissions(submissions);
  return newSubmission;
}

export function updateSubmissionStatus(
  id: string,
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED',
  opts?: { rejection_reason?: string; approved_hero_slug?: string }
): SubmissionRecord | null {
  const submissions = getAllSubmissions();
  const index = submissions.findIndex((s) => s.id === id);
  if (index === -1) return null;

  submissions[index] = {
    ...submissions[index],
    status,
    updated_at: new Date().toISOString(),
    ...(opts?.rejection_reason !== undefined && { rejection_reason: opts.rejection_reason }),
    ...(opts?.approved_hero_slug !== undefined && { approved_hero_slug: opts.approved_hero_slug }),
  };

  saveSubmissions(submissions);
  return submissions[index];
}

// Published Heroes DB
export function getPublishedCommunityHeroes(): PublishedHeroRecord[] {
  ensureDataDir();
  if (!fs.existsSync(PUBLISHED_HEROES_FILE)) {
    fs.writeFileSync(PUBLISHED_HEROES_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const data = fs.readFileSync(PUBLISHED_HEROES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading published heroes file:', e);
    return [];
  }
}

export function savePublishedCommunityHeroes(heroes: PublishedHeroRecord[]) {
  ensureDataDir();
  fs.writeFileSync(PUBLISHED_HEROES_FILE, JSON.stringify(heroes, null, 2), 'utf-8');
}

export function publishHeroRecord(hero: PublishedHeroRecord) {
  const list = getPublishedCommunityHeroes();
  const existingIdx = list.findIndex((h) => h.slug === hero.slug || h.id === hero.id);
  if (existingIdx >= 0) {
    list[existingIdx] = hero;
  } else {
    list.unshift(hero);
  }
  savePublishedCommunityHeroes(list);
}
