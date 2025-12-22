'use client';

import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface Prospect {
    email: string;
    first_name: string;
    last_name: string;
    company: string;
    job_title: string;
    sector: string;
    company_size: string;
    linkedin_url?: string;
}

interface ProspectImportProps {
    onImport: (prospects: Prospect[]) => void;
    isLoading?: boolean;
}

export default function ProspectImport({ onImport, isLoading }: ProspectImportProps) {
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const parseCSV = (text: string): Prospect[] => {
        const lines = text.trim().split('\n');
        if (lines.length < 2) {
            throw new Error('Le fichier CSV doit contenir au moins un en-tête et une ligne de données');
        }

        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());

        // Map common header names to our fields
        const headerMap: Record<string, keyof Prospect> = {
            'email': 'email',
            'mail': 'email',
            'e-mail': 'email',
            'first_name': 'first_name',
            'firstname': 'first_name',
            'prénom': 'first_name',
            'prenom': 'first_name',
            'last_name': 'last_name',
            'lastname': 'last_name',
            'nom': 'last_name',
            'company': 'company',
            'entreprise': 'company',
            'société': 'company',
            'societe': 'company',
            'job_title': 'job_title',
            'title': 'job_title',
            'poste': 'job_title',
            'fonction': 'job_title',
            'sector': 'sector',
            'secteur': 'sector',
            'industry': 'sector',
            'company_size': 'company_size',
            'size': 'company_size',
            'taille': 'company_size',
            'linkedin': 'linkedin_url',
            'linkedin_url': 'linkedin_url',
        };

        const columnMapping: Record<number, keyof Prospect> = {};
        headers.forEach((header, index) => {
            const field = headerMap[header];
            if (field) {
                columnMapping[index] = field;
            }
        });

        if (!Object.values(columnMapping).includes('email')) {
            throw new Error('Colonne "email" non trouvée dans le fichier CSV');
        }

        const parsedProspects: Prospect[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));

            const prospect: Partial<Prospect> = {
                email: '',
                first_name: '',
                last_name: '',
                company: '',
                job_title: '',
                sector: '',
                company_size: '',
            };

            Object.entries(columnMapping).forEach(([index, field]) => {
                prospect[field] = values[parseInt(index)] || '';
            });

            if (prospect.email && prospect.email.includes('@')) {
                parsedProspects.push(prospect as Prospect);
            }
        }

        return parsedProspects;
    };

    const handleFile = useCallback((file: File) => {
        setError(null);

        if (!file.name.endsWith('.csv')) {
            setError('Veuillez importer un fichier CSV');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const parsed = parseCSV(text);
                setProspects(parsed);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur lors du parsing du fichier');
            }
        };
        reader.readAsText(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    }, [handleFile]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleImport = () => {
        if (prospects.length > 0) {
            onImport(prospects);
        }
    };

    return (
        <div className="space-y-6">
            {/* Drop zone */}
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragOver
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
            >
                <Upload size={48} className="mx-auto mb-4 text-muted" />
                <p className="text-lg mb-2">Glissez-déposez votre fichier CSV ici</p>
                <p className="text-muted text-sm mb-4">ou</p>
                <label className="btn btn-secondary cursor-pointer">
                    <FileSpreadsheet size={18} />
                    Parcourir les fichiers
                    <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileInput}
                    />
                </label>
            </div>

            {/* Error message */}
            {error && (
                <div className="flex items-center gap-2 p-4 bg-error/10 border border-error/30 rounded-lg text-error">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Preview */}
            {prospects.length > 0 && (
                <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                            {prospects.length} prospect{prospects.length > 1 ? 's' : ''} détecté{prospects.length > 1 ? 's' : ''}
                        </h3>
                        <button
                            className="btn btn-success"
                            onClick={handleImport}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner" />
                                    Import...
                                </>
                            ) : (
                                `Importer ${prospects.length} prospects`
                            )}
                        </button>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Prénom</th>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Entreprise</th>
                                    <th>Poste</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prospects.slice(0, 10).map((prospect, i) => (
                                    <tr key={i}>
                                        <td>{prospect.first_name}</td>
                                        <td>{prospect.last_name}</td>
                                        <td className="text-accent">{prospect.email}</td>
                                        <td>{prospect.company}</td>
                                        <td className="text-muted">{prospect.job_title}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {prospects.length > 10 && (
                        <p className="text-muted text-sm mt-2 text-center">
                            ... et {prospects.length - 10} autres prospects
                        </p>
                    )}
                </div>
            )}

            {/* CSV format helper */}
            <div className="card">
                <h4 className="font-semibold mb-2">Format CSV attendu</h4>
                <p className="text-muted text-sm mb-3">
                    Les colonnes suivantes sont reconnues automatiquement :
                </p>
                <code className="block bg-background p-3 rounded-lg text-sm overflow-x-auto">
                    email, first_name, last_name, company, job_title, sector, company_size, linkedin_url
                </code>
            </div>
        </div>
    );
}
