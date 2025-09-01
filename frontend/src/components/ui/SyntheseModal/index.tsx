import React, {useEffect, useRef, useState} from 'react';
import {AlertTriangle, BarChart3, CheckCircle, Download, X} from 'lucide-react';
import {useEvaluationSynthese} from '@/hooks/plans/useEvaluationSynthese';

interface SyntheseModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupeEvaluationId: string;
    evaluationLabel?: string;
}

const SyntheseModal: React.FC<SyntheseModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         groupeEvaluationId,
                                                         evaluationLabel = "Évaluation"
                                                     }) => {
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [progress, setProgress] = useState<{ current: number; total: number; percentage: number } | null>(null);
    const pdfBlobRef = useRef<Blob | null>(null);

    const {
        fetchSyntheseData,
        generateSynthesePDF,
        isLoading,
        error,
        syntheseData,
        resetError
    } = useEvaluationSynthese();

    // Fonction pour générer le PDF
    const handleGenerate = async () => {
        try {
            resetError();
            setIsSuccess(false);
            setProgress(null);

            const pdfBlob = await generateSynthesePDF(groupeEvaluationId, {
                onProgress: (progressData) => {
                    setProgress(progressData);
                }
            });

            pdfBlobRef.current = pdfBlob;
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
            setIsSuccess(true);
            setProgress(null);

        } catch (error: any) {
            console.error('Erreur génération PDF synthèse:', error);
        }
    };

    // Fonction pour télécharger le PDF
    const handleDownload = () => {
        if (!pdfBlobRef.current) return;

        const url = URL.createObjectURL(pdfBlobRef.current);
        const a = document.createElement('a');
        a.href = url;
        const fileName = `synthese_evaluation_${groupeEvaluationId}_${new Date().toISOString().split('T')[0]}.pdf`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Effet de génération et nettoyage
    useEffect(() => {
        if (isOpen && !pdfUrl) {
            handleGenerate();
        }

        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-green-600"/>
                        <h2 className="text-xl font-semibold">
                            Fiche d'Évaluation Synthétique
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-6 h-6"/>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-hidden">
                    {error ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center max-w-md">
                                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4"/>
                                <p className="text-red-600 font-medium mb-2">Erreur</p>
                                <p className="text-gray-600 mb-4">{error}</p>
                                <button
                                    onClick={handleGenerate}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Réessayer
                                </button>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>

                                {progress ? (
                                    <div className="space-y-2">
                                        <p className="text-gray-600">
                                            Génération En Cours... {progress.current}/{progress.total}
                                        </p>
                                        <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                                            <div
                                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                style={{width: `${progress.percentage}%`}}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {Math.round(progress.percentage)}% terminé
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-gray-600">Récupération des statistiques...</p>
                                )}
                            </div>
                        </div>
                    ) : pdfUrl ? (
                        <div className="h-full flex flex-col">
                            {isSuccess && (
                                <div
                                    className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600"/>
                                    <span className="text-green-700 text-sm">
                                        Fiche de synthèse générée avec succès
                                    </span>
                                </div>
                            )}

                            {/* Aperçu des statistiques */}
                            {syntheseData && (
                                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-semibold text-blue-900 mb-2">Aperçu des statistiques</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-blue-700 font-medium">Participants:</span>
                                            <span
                                                className="ml-2">{syntheseData.totalResponses}/{syntheseData.totalParticipants}</span>
                                        </div>
                                        <div>
                                            <span className="text-blue-700 font-medium">Completion:</span>
                                            <span
                                                className="ml-2">{syntheseData.completionPercentage.toFixed(1)}%</span>
                                        </div>
                                        <div>
                                            <span className="text-blue-700 font-medium">Questions:</span>
                                            <span className="ml-2">{syntheseData.questionStats.length}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <iframe
                                src={pdfUrl}
                                className="flex-1 border-0 rounded"
                                title="Aperçu de la fiche de synthèse"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Initialisation...</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-6 border-t bg-gray-50">
                    <div className="text-sm text-gray-600">
                        {syntheseData ? (
                            `Synthèse pour "${syntheseData.evaluationLabel}"`
                        ) : (
                            `Synthèse d'évaluation`
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Fermer
                        </button>

                        <button
                            onClick={handleDownload}
                            disabled={!pdfBlobRef.current || isLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Download className="w-4 h-4"/>
                            Télécharger PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SyntheseModal;