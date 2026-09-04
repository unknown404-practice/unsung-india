export interface Contribution {
  id?: string;
  display_order: number;
  title?: string;
  description: string;
}

export interface TimelineEvent {
  id?: string;
  event_year: number;
  event_date?: string;
  title: string;
  description: string;
  display_order: number;
}

export interface SourceCitation {
  id?: string;
  title: string;
  source_type: 'GOVERNMENT_ARCHIVE' | 'GOVERNMENT_PORTAL' | 'ACADEMIC_PUBLICATION' | 'HISTORICAL_BOOK' | 'COMMONS_MEDIA';
  url?: string;
  archive_ref_no?: string;
  publisher_or_institution?: string;
  is_primary_reference: boolean;
}

export interface Hero {
  id: string;
  slug: string;
  name: string;
  name_local?: string;
  name_local_lang?: string;
  birth_year?: number;
  death_year?: number;
  era?: string;
  state: string;
  district?: string;
  primary_domain: string;
  tagline: string;
  short_bio: string;
  is_unsung_reason: string;
  image_url: string;
  image_license?: string;
  image_attribution?: string;
  image_source_page_url?: string;
  source_attribution?: string;
  unsung_level?: string;
  view_count?: number;
  banner_download_count?: number;
  contributions?: Contribution[];
  timeline_events?: TimelineEvent[];
  sources?: SourceCitation[];
}

export interface BannerTemplate {
  id: string;
  name: string;
  aspect_ratio: string;
  width_px: number;
  height_px: number;
  format_type: string;
  supported_themes: string[];
}

export interface SearchResponse {
  data: Hero[];
  items?: Hero[];
  total: number;
  page?: number;
  limit?: number;
  page_size?: number;
  source?: string;
  durationMs?: number;
  duration_ms?: number;
}
