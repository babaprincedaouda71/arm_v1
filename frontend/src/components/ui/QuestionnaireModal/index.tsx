import React, {useRef, useState, useEffect} from 'react';
import {AlertTriangle, CheckCircle, Download, FileText, X} from 'lucide-react';
import {useQuestionnaireGenerator} from "@/hooks/plans/useQuestionnaireGenerator";

interface QuestionnaireModalOptimizedProps {
    isOpen: boolean;
    onClose: () => void;
    groupeEvaluationId: string;
    selectedParticipants: Array<{ id: number, name: string }>;
    trainingTheme?: string;
    groupName?: string;
}

const QuestionnaireModal: React.FC<QuestionnaireModalOptimizedProps> = ({
                                                                            isOpen,
                                                                            onClose,
                                                                            groupeEvaluationId,
                                                                            selectedParticipants,
                                                                            trainingTheme = "Formation",
                                                                            groupName = "Groupe"
                                                                        }) => {
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState(false);
    const pdfBlobRef = useRef<Blob | null>(null);

    const {
        generateQuestionnaires,
        isGenerating,
        progress,
        error,
        resetError,
        getBaseUrl
    } = useQuestionnaireGenerator();

    // Fonction pour générer le PDF
    const handleGenerate = async () => {
        try {
            resetError();
            setIsSuccess(false);

            const pdfBlob = await generateQuestionnaires(
                selectedParticipants,
                groupeEvaluationId,
                {
                    trainingTheme,
                    groupName,
                    getBaseUrl
                }
            );

            pdfBlobRef.current = pdfBlob;
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
            setIsSuccess(true);

        } catch (error: any) {
            console.error('Erreur génération PDF:', error);
        }
    };

    // Fonction pour télécharger le PDF
    const handleDownload = () => {
        if (!pdfBlobRef.current) return;

        const url = URL.createObjectURL(pdfBlobRef.current);
        const a = document.createElement('a');
        a.href = url;
        const fileName = `Formulaire F4 ${new Date().toISOString().split('T')[0]}.pdf`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Effet de génération et nettoyage
    useEffect(() => {
        if (isOpen && selectedParticipants.length > 0 && !pdfUrl) {
            handleGenerate();
        }

        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [isOpen, selectedParticipants]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-600"/>
                        <h2 className="text-xl font-semibold">
                            Questionnaires d'évaluation
                            ({selectedParticipants.length} participant{selectedParticipants.length > 1 ? 's' : ''})
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
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Réessayer
                                </button>
                            </div>
                        </div>
                    ) : isGenerating ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>

                                {progress ? (
                                    <div className="space-y-2">
                                        <p className="text-gray-600">
                                            Génération En Cours... {progress.current}/{progress.total}
                                        </p>
                                        {progress.currentParticipant && (
                                            <p className="text-sm text-gray-500">
                                                Traitement de: {progress.currentParticipant}
                                            </p>
                                        )}
                                        <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{width: `${progress.percentage}%`}}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {Math.round(progress.percentage)}% terminé
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-gray-600">Préparation...</p>
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
                                        PDF généré avec succès pour {selectedParticipants.length} participant{selectedParticipants.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                            <iframe
                                src={pdfUrl}
                                className="flex-1 border-0 rounded"
                                title="Aperçu des questionnaires"
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
                        {selectedParticipants.length} questionnaire{selectedParticipants.length > 1 ? 's' : ''} à
                        générer
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
                            disabled={!pdfBlobRef.current || isGenerating}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

export default QuestionnaireModal;