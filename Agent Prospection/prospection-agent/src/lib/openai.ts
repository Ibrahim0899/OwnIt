import OpenAI from 'openai';
import { Offer, Prospect, GeneratedEmailResponse } from './types';

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiClient;
}

export async function generatePersonalizedEmail(
    offer: Offer,
    prospect: Prospect
): Promise<GeneratedEmailResponse> {
    const prompt = `Tu es un expert en copywriting B2B francophone. Tu dois créer un email de prospection UNIQUE et PERSONNALISÉ.

OFFRE À PROMOUVOIR:
- Nom: ${offer.name}
- Description: ${offer.description}
- Problèmes résolus: ${offer.problems_solved.join(', ')}
- Bénéfices: ${offer.benefits.join(', ')}
- Prix: ${offer.price_range}

PROSPECT CIBLE:
- Prénom: ${prospect.first_name}
- Nom: ${prospect.last_name}
- Entreprise: ${prospect.company}
- Poste: ${prospect.job_title}
- Secteur: ${prospect.sector}
- Taille entreprise: ${prospect.company_size}
${prospect.pain_points ? `- Points de douleur identifiés: ${prospect.pain_points.join(', ')}` : ''}

INSTRUCTIONS:
1. Crée un email court et percutant (150-200 mots maximum)
2. Personnalise l'accroche en fonction du poste et du secteur du prospect
3. Montre que tu comprends ses défis spécifiques
4. Présente l'offre comme une solution à SES problèmes
5. Termine par un call-to-action clair et simple
6. Ton: professionnel mais humain, jamais vendeur ou pushy
7. N'utilise JAMAIS de formules génériques comme "J'espère que vous allez bien"

FORMAT DE RÉPONSE (JSON uniquement):
{
  "subject": "Objet accrocheur et personnalisé (max 60 caractères)",
  "body": "Corps de l'email avec sauts de ligne"
}`;

    const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: 'Tu es un expert en prospection B2B. Tu génères des emails personnalisés de haute qualité en français. Tu réponds UNIQUEMENT en JSON valide.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.8,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
        throw new Error('No content generated from OpenAI');
    }

    const result = JSON.parse(content) as GeneratedEmailResponse;
    return result;
}

export async function enrichProspectPainPoints(
    prospect: Prospect,
    offer: Offer
): Promise<string[]> {
    const prompt = `En analysant ce prospect dans le contexte de l'offre proposée, identifie 3 points de douleur probables:

PROSPECT:
- Poste: ${prospect.job_title}
- Entreprise: ${prospect.company}
- Secteur: ${prospect.sector}
- Taille: ${prospect.company_size}

OFFRE (pour contexte):
- ${offer.name}: ${offer.description}
- Problèmes résolus: ${offer.problems_solved.join(', ')}

Réponds en JSON avec un tableau de 3 pain points courts et précis:
{"pain_points": ["...", "...", "..."]}`;

    const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: 'Tu identifies les pain points business probables. Réponds uniquement en JSON.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 200,
        response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
        return [];
    }

    const result = JSON.parse(content) as { pain_points: string[] };
    return result.pain_points;
}
