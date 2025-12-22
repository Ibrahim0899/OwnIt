'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Offer {
    name: string;
    description: string;
    problems_solved: string[];
    benefits: string[];
    price_range: string;
    target_sectors: string[];
    target_company_size: string;
}

interface OfferFormProps {
    onSubmit: (offer: Offer) => void;
    isLoading?: boolean;
}

export default function OfferForm({ onSubmit, isLoading }: OfferFormProps) {
    const [offer, setOffer] = useState<Offer>({
        name: '',
        description: '',
        problems_solved: [],
        benefits: [],
        price_range: '',
        target_sectors: [],
        target_company_size: '',
    });

    const [newProblem, setNewProblem] = useState('');
    const [newBenefit, setNewBenefit] = useState('');
    const [newSector, setNewSector] = useState('');

    const handleAddTag = (field: 'problems_solved' | 'benefits' | 'target_sectors', value: string, setter: (v: string) => void) => {
        if (value.trim()) {
            setOffer(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
            setter('');
        }
    };

    const handleRemoveTag = (field: 'problems_solved' | 'benefits' | 'target_sectors', index: number) => {
        setOffer(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(offer);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="label">Nom de l&apos;offre *</label>
                <input
                    type="text"
                    className="input"
                    placeholder="Ex: Automatisation des processus métiers"
                    value={offer.name}
                    onChange={(e) => setOffer(prev => ({ ...prev, name: e.target.value }))}
                    required
                />
            </div>

            <div>
                <label className="label">Description détaillée *</label>
                <textarea
                    className="input textarea"
                    placeholder="Décrivez votre offre en détail : ce que vous proposez, comment ça fonctionne, pourquoi c'est différent..."
                    value={offer.description}
                    onChange={(e) => setOffer(prev => ({ ...prev, description: e.target.value }))}
                    required
                />
            </div>

            <div>
                <label className="label">Problèmes résolus</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        className="input"
                        placeholder="Ex: Tâches manuelles répétitives"
                        value={newProblem}
                        onChange={(e) => setNewProblem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag('problems_solved', newProblem, setNewProblem))}
                    />
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleAddTag('problems_solved', newProblem, setNewProblem)}
                    >
                        <Plus size={18} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {offer.problems_solved.map((problem, i) => (
                        <span key={i} className="tag">
                            {problem}
                            <X size={14} className="tag-remove" onClick={() => handleRemoveTag('problems_solved', i)} />
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <label className="label">Bénéfices clients</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        className="input"
                        placeholder="Ex: Gain de 10h par semaine"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag('benefits', newBenefit, setNewBenefit))}
                    />
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleAddTag('benefits', newBenefit, setNewBenefit)}
                    >
                        <Plus size={18} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {offer.benefits.map((benefit, i) => (
                        <span key={i} className="tag">
                            {benefit}
                            <X size={14} className="tag-remove" onClick={() => handleRemoveTag('benefits', i)} />
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label">Fourchette de prix</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Ex: 500€ - 5000€"
                        value={offer.price_range}
                        onChange={(e) => setOffer(prev => ({ ...prev, price_range: e.target.value }))}
                    />
                </div>
                <div>
                    <label className="label">Taille d&apos;entreprise cible</label>
                    <select
                        className="input"
                        value={offer.target_company_size}
                        onChange={(e) => setOffer(prev => ({ ...prev, target_company_size: e.target.value }))}
                    >
                        <option value="">Sélectionner...</option>
                        <option value="1-10">1-10 employés</option>
                        <option value="11-50">11-50 employés</option>
                        <option value="51-200">51-200 employés</option>
                        <option value="201-500">201-500 employés</option>
                        <option value="500+">500+ employés</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="label">Secteurs cibles</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        className="input"
                        placeholder="Ex: Tech, Industrie, Services"
                        value={newSector}
                        onChange={(e) => setNewSector(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag('target_sectors', newSector, setNewSector))}
                    />
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleAddTag('target_sectors', newSector, setNewSector)}
                    >
                        <Plus size={18} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {offer.target_sectors.map((sector, i) => (
                        <span key={i} className="tag">
                            {sector}
                            <X size={14} className="tag-remove" onClick={() => handleRemoveTag('target_sectors', i)} />
                        </span>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <span className="spinner" />
                        Enregistrement...
                    </>
                ) : (
                    'Enregistrer l\'offre'
                )}
            </button>
        </form>
    );
}
