-- ONIYAH Prospection Agent - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Offers table
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    problems_solved TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    price_range TEXT DEFAULT '',
    target_sectors TEXT[] DEFAULT '{}',
    target_company_size TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prospects table
CREATE TABLE prospects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT DEFAULT '',
    company TEXT NOT NULL,
    job_title TEXT DEFAULT '',
    sector TEXT DEFAULT '',
    company_size TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    pain_points TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'replied', 'converted', 'unsubscribed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on email to prevent duplicates
CREATE UNIQUE INDEX prospects_email_idx ON prospects(email);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    total_prospects INT DEFAULT 0,
    sent_count INT DEFAULT 0,
    open_rate DECIMAL(5,2) DEFAULT 0,
    reply_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emails table
CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'opened', 'clicked', 'replied', 'bounced')),
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for demo purposes)
-- In production, you would want user-based authentication

CREATE POLICY "Allow all operations on offers" ON offers
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on prospects" ON prospects
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on campaigns" ON campaigns
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on emails" ON emails
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_offers_updated_at
    BEFORE UPDATE ON offers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prospects_updated_at
    BEFORE UPDATE ON prospects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert a sample offer for testing
INSERT INTO offers (name, description, problems_solved, benefits, price_range, target_sectors, target_company_size)
VALUES (
    'Automatisation des Processus Métiers',
    'Solution complète d''automatisation pour les TPE/PME. Nous analysons vos processus répétitifs et mettons en place des automatisations sur mesure.',
    ARRAY['Tâches manuelles répétitives', 'Erreurs de saisie', 'Perte de temps sur l''administratif', 'Manque de visibilité'],
    ARRAY['Gain de 10-20h par semaine', 'Réduction des erreurs de 95%', 'ROI en moins de 3 mois', 'Équipes plus sereines'],
    '1000€ - 10000€',
    ARRAY['Tech', 'Services', 'Industrie', 'Consulting'],
    '10-200'
);

-- Insert sample prospects for testing
INSERT INTO prospects (email, first_name, last_name, company, job_title, sector, company_size)
VALUES 
    ('marie.dupont@techcorp.fr', 'Marie', 'Dupont', 'TechCorp', 'Directrice des Opérations', 'Tech', '50-100'),
    ('jean.martin@industrie-plus.com', 'Jean', 'Martin', 'Industrie Plus', 'DSI', 'Industrie', '100-200'),
    ('sophie.bernard@consulting-rh.fr', 'Sophie', 'Bernard', 'Consulting RH', 'CEO', 'Consulting', '10-20');

-- ============================================
-- VIEWS (Optional - for analytics)
-- ============================================

CREATE OR REPLACE VIEW campaign_stats AS
SELECT 
    c.id,
    c.name,
    c.status,
    o.name as offer_name,
    COUNT(DISTINCT e.id) as total_emails,
    COUNT(DISTINCT CASE WHEN e.status = 'sent' THEN e.id END) as sent,
    COUNT(DISTINCT CASE WHEN e.status = 'opened' THEN e.id END) as opened,
    COUNT(DISTINCT CASE WHEN e.status = 'replied' THEN e.id END) as replied,
    ROUND(
        COUNT(DISTINCT CASE WHEN e.status = 'opened' THEN e.id END)::decimal / 
        NULLIF(COUNT(DISTINCT CASE WHEN e.status = 'sent' THEN e.id END), 0) * 100, 
        2
    ) as open_rate,
    ROUND(
        COUNT(DISTINCT CASE WHEN e.status = 'replied' THEN e.id END)::decimal / 
        NULLIF(COUNT(DISTINCT CASE WHEN e.status = 'sent' THEN e.id END), 0) * 100, 
        2
    ) as reply_rate
FROM campaigns c
LEFT JOIN offers o ON c.offer_id = o.id
LEFT JOIN emails e ON e.campaign_id = c.id
GROUP BY c.id, c.name, c.status, o.name;
