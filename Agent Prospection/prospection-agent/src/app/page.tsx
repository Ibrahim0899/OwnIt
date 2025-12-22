'use client';

import { useState } from 'react';
import {
  Zap,
  Users,
  Mail,
  Send,
  BarChart3,
  Package,
  ChevronRight,
  Sparkles,
  Check
} from 'lucide-react';
import OfferForm from '@/components/OfferForm';
import ProspectImport from '@/components/ProspectImport';
import EmailPreview from '@/components/EmailPreview';

type Tab = 'offer' | 'prospects' | 'campaign' | 'analytics';

interface Offer {
  id?: string;
  name: string;
  description: string;
  problems_solved: string[];
  benefits: string[];
  price_range: string;
  target_sectors: string[];
  target_company_size: string;
}

interface Prospect {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  job_title: string;
  sector: string;
  company_size: string;
  status?: string;
}

interface GeneratedEmail {
  prospect: Prospect;
  subject: string;
  body: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('offer');
  const [offer, setOffer] = useState<Offer | null>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState<'idle' | 'generating' | 'sending' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  const handleOfferSubmit = async (offerData: Offer) => {
    setIsLoading(true);
    try {
      // In a real app, save to Supabase
      // const response = await fetch('/api/offers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(offerData),
      // });
      // const data = await response.json();

      // For demo, just store locally
      setOffer({ ...offerData, id: 'demo-' + Date.now() });
      setActiveTab('prospects');
    } catch (error) {
      console.error('Error saving offer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProspectsImport = async (importedProspects: Prospect[]) => {
    setIsLoading(true);
    try {
      // Add IDs for demo
      const prospectsWithIds = importedProspects.map((p, i) => ({
        ...p,
        id: 'prospect-' + i,
        status: 'new'
      }));
      setProspects(prospectsWithIds);
      setActiveTab('campaign');
    } catch (error) {
      console.error('Error importing prospects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEmails = async () => {
    if (!offer || prospects.length === 0) return;

    setCampaignStatus('generating');
    setGeneratedEmails([]);
    setProgress(0);

    const emails: GeneratedEmail[] = [];

    for (let i = 0; i < prospects.length; i++) {
      const prospect = prospects[i];

      try {
        const response = await fetch('/api/generate-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offer, prospect }),
        });

        const data = await response.json();

        if (data.success) {
          emails.push({
            prospect,
            subject: data.email.subject,
            body: data.email.body,
          });
        }
      } catch (error) {
        console.error('Error generating email for', prospect.email, error);
      }

      setProgress(Math.round(((i + 1) / prospects.length) * 100));
      setGeneratedEmails([...emails]);
    }

    setCampaignStatus('idle');
  };

  const sendAllEmails = async () => {
    setCampaignStatus('sending');
    setProgress(0);

    for (let i = 0; i < generatedEmails.length; i++) {
      const email = generatedEmails[i];

      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email.prospect.email,
            subject: email.subject,
            body: email.body,
          }),
        });
      } catch (error) {
        console.error('Error sending email to', email.prospect.email, error);
      }

      setProgress(Math.round(((i + 1) / generatedEmails.length) * 100));
    }

    setCampaignStatus('done');
  };

  const tabs = [
    { id: 'offer' as Tab, label: 'Offre', icon: Package, done: !!offer },
    { id: 'prospects' as Tab, label: 'Prospects', icon: Users, done: prospects.length > 0 },
    { id: 'campaign' as Tab, label: 'Campagne', icon: Send, done: generatedEmails.length > 0 },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3, done: false },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ONIYAH Prospector</h1>
                <p className="text-muted text-sm">Agent de prospection IA</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {offer && (
                <div className="stat-card px-4 py-2">
                  <span className="text-muted text-sm">Offre active :</span>
                  <span className="ml-2 font-semibold text-primary">{offer.name}</span>
                </div>
              )}
              {prospects.length > 0 && (
                <div className="stat-card px-4 py-2">
                  <Users size={16} className="inline mr-2 text-accent" />
                  <span className="font-semibold">{prospects.length}</span>
                  <span className="text-muted text-sm ml-1">prospects</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <nav className="border-b border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 transition-all border-b-2 ${activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted hover:text-foreground'
                  }`}
              >
                {tab.done ? (
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <Check size={12} className="text-success" />
                  </div>
                ) : (
                  <tab.icon size={18} />
                )}
                <span className="font-medium">{tab.label}</span>
                {index < tabs.length - 1 && (
                  <ChevronRight size={16} className="text-border ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab: Offer */}
        {activeTab === 'offer' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Définissez votre offre</h2>
              <p className="text-muted">
                L&apos;IA utilisera ces informations pour personnaliser chaque email
              </p>
            </div>
            <div className="card">
              <OfferForm onSubmit={handleOfferSubmit} isLoading={isLoading} />
            </div>
          </div>
        )}

        {/* Tab: Prospects */}
        {activeTab === 'prospects' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Importez vos prospects</h2>
              <p className="text-muted">
                Glissez-déposez un fichier CSV avec vos contacts
              </p>
            </div>
            <ProspectImport onImport={handleProspectsImport} isLoading={isLoading} />
          </div>
        )}

        {/* Tab: Campaign */}
        {activeTab === 'campaign' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Lancez votre campagne</h2>
              <p className="text-muted">
                L&apos;IA génère un email unique et personnalisé pour chaque prospect
              </p>
            </div>

            {/* Campaign controls */}
            <div className="flex justify-center gap-4">
              <button
                className="btn btn-primary"
                onClick={generateEmails}
                disabled={!offer || prospects.length === 0 || campaignStatus !== 'idle'}
              >
                <Sparkles size={18} />
                Générer {prospects.length} emails avec l&apos;IA
              </button>

              {generatedEmails.length > 0 && campaignStatus === 'idle' && (
                <button
                  className="btn btn-success"
                  onClick={sendAllEmails}
                >
                  <Mail size={18} />
                  Envoyer tous les emails
                </button>
              )}
            </div>

            {/* Progress bar */}
            {(campaignStatus === 'generating' || campaignStatus === 'sending') && (
              <div className="max-w-xl mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted">
                    {campaignStatus === 'generating' ? 'Génération IA en cours...' : 'Envoi en cours...'}
                  </span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Success message */}
            {campaignStatus === 'done' && (
              <div className="max-w-xl mx-auto text-center p-6 bg-success/10 border border-success/30 rounded-xl">
                <Check size={48} className="mx-auto mb-4 text-success" />
                <h3 className="text-xl font-semibold text-success mb-2">
                  Campagne envoyée avec succès !
                </h3>
                <p className="text-muted">
                  {generatedEmails.length} emails personnalisés ont été envoyés
                </p>
              </div>
            )}

            {/* Generated emails preview */}
            {generatedEmails.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Emails générés ({generatedEmails.length})
                </h3>
                <div className="grid gap-4">
                  {generatedEmails.slice(0, 5).map((email, i) => (
                    <EmailPreview
                      key={i}
                      subject={email.subject}
                      body={email.body}
                      prospectName={`${email.prospect.first_name} ${email.prospect.last_name}`}
                    />
                  ))}
                </div>

                {generatedEmails.length > 5 && (
                  <p className="text-center text-muted">
                    ... et {generatedEmails.length - 5} autres emails
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: Analytics */}
        {activeTab === 'analytics' && (
          <div className="text-center py-16">
            <BarChart3 size={64} className="mx-auto mb-6 text-muted" />
            <h2 className="text-2xl font-bold mb-2">Analytics</h2>
            <p className="text-muted max-w-md mx-auto">
              Les statistiques de votre campagne apparaîtront ici une fois les emails envoyés.
              Taux d&apos;ouverture, clics, réponses...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
