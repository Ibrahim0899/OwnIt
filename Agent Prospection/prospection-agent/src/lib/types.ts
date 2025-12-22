// Types for the Prospection Agent application

export interface Offer {
  id: string;
  name: string;
  description: string;
  problems_solved: string[];
  benefits: string[];
  price_range: string;
  target_sectors: string[];
  target_company_size: string;
  created_at: string;
}

export interface Prospect {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  job_title: string;
  sector: string;
  company_size: string;
  linkedin_url?: string;
  status: 'new' | 'contacted' | 'replied' | 'converted' | 'unsubscribed';
  pain_points?: string[];
  created_at: string;
}

export interface Email {
  id: string;
  prospect_id: string;
  offer_id: string;
  subject: string;
  body: string;
  status: 'draft' | 'scheduled' | 'sent' | 'opened' | 'clicked' | 'replied';
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  offer_id: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  total_prospects: number;
  sent_count: number;
  open_rate?: number;
  reply_rate?: number;
  created_at: string;
}

export interface GeneratedEmailRequest {
  offer: Offer;
  prospect: Prospect;
}

export interface GeneratedEmailResponse {
  subject: string;
  body: string;
}
