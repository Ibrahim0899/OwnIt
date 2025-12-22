'use client';

import { Mail, RefreshCw } from 'lucide-react';

interface EmailPreviewProps {
    subject: string;
    body: string;
    prospectName?: string;
    onRegenerate?: () => void;
    isLoading?: boolean;
}

export default function EmailPreview({
    subject,
    body,
    prospectName,
    onRegenerate,
    isLoading
}: EmailPreviewProps) {
    return (
        <div className="card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Mail size={20} className="text-primary" />
                    <h3 className="font-semibold">
                        Aperçu de l&apos;email
                        {prospectName && <span className="text-muted font-normal"> — {prospectName}</span>}
                    </h3>
                </div>
                {onRegenerate && (
                    <button
                        className="btn btn-secondary"
                        onClick={onRegenerate}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner" />
                        ) : (
                            <RefreshCw size={16} />
                        )}
                        Régénérer
                    </button>
                )}
            </div>

            <div className="email-preview">
                <div className="border-b border-gray-200 pb-3 mb-4">
                    <p className="text-gray-500 text-sm">Objet :</p>
                    <h3 className="font-semibold text-gray-900">{subject}</h3>
                </div>

                <div className="whitespace-pre-wrap">
                    {body.split('\n').map((line, i) => (
                        <p key={i} className={line.trim() === '' ? 'h-4' : ''}>
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
