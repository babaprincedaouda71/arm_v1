import {useCallback, useState} from 'react';
import {BatchProgress, QuestionnaireGenerator} from "@/utils/plan/QuestionnaireGenerator";
import {GROUPE_EVALUATION_URLS, QUESTIONNAIRE_URLS} from "@/config/urls";

interface EvaluationData {
    id: string;
    label: string;
    status: string;
    theme: string;
    dates: string[];
    questionnaire: any;
    qrTokens: Array<{
        id: string;
        token: string;
        participantId: number;
        evaluationId: string;
        isUsed: boolean;
        createdAt: string;
    }>;
}

export const useQuestionnaireGenerator = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState<BatchProgress | null>(null);
    const [error, setError] = useState<string>('');

    const generateQuestionnaires = useCallback(async (
        selectedParticipants: any[],
        groupeEvaluationId: string,
        options: {
            trainingTheme: string;
            groupName: string;
            getBaseUrl: () => string;
        }
    ): Promise<Blob> => {
        setIsGenerating(true);
        setError('');
        setProgress(null);

        try {
            // Validation initiale optimisée
            if (!selectedParticipants.length) {
                throw new Error('Aucun participant sélectionné');
            }

            // Gestion intelligente des gros volumes
            if (selectedParticipants.length > 100) {
                const confirm = window.confirm(
                    `⚠️ Génération de ${selectedParticipants.length} questionnaires.\n` +
                    `Cela peut prendre plusieurs minutes et consommer de la mémoire.\n` +
                    `Recommandation: Générer par batch de 50 participants maximum.\n\n` +
                    `Voulez-vous continuer ?`
                );
                if (!confirm) {
                    throw new Error('Génération annulée par l\'utilisateur');
                }
            }

            // Progress initial
            setProgress({
                current: 0,
                total: selectedParticipants.length,
                percentage: 0,
                currentParticipant: 'Préparation...'
            });

            // Fetch optimisé des données d'évaluation avec cache
            const evaluationData = await fetchEvaluationDataOptimized(groupeEvaluationId);

            // Validation des tokens QR
            const participantsWithTokens = selectedParticipants.filter(participant => {
                const hasToken = evaluationData.qrTokens.some(token =>
                    token.participantId === participant.id
                );
                if (!hasToken) {
                    console.warn(`Aucun token QR trouvé pour le participant ${participant.name} (ID: ${participant.id})`);
                }
                return hasToken;
            });

            if (participantsWithTokens.length === 0) {
                throw new Error('Aucun token QR valide trouvé pour les participants sélectionnés');
            }

            if (participantsWithTokens.length < selectedParticipants.length) {
                const missingCount = selectedParticipants.length - participantsWithTokens.length;
                console.warn(`${missingCount} participant(s) ignoré(s) car aucun token QR n'a été trouvé`);
            }

            setProgress({
                current: 0,
                total: participantsWithTokens.length,
                percentage: 0,
                currentParticipant: 'Initialisation PDF...'
            });

            // Import dynamique de jsPDF avec gestion d'erreur
            let jsPDF;
            try {
                const jsPDFModule = await import('jspdf');
                jsPDF = jsPDFModule.jsPDF;
            } catch (importError) {
                throw new Error('Erreur lors du chargement de la bibliothèque PDF');
            }

            // Créer le générateur optimisé
            const generator = new QuestionnaireGenerator(jsPDF);

            setProgress({
                current: 0,
                total: participantsWithTokens.length,
                percentage: 0,
                currentParticipant: 'Génération En Cours...'
            });

            // Générer le PDF avec suivi de progression optimisé
            const pdfBlob = await generator.generateBatch(
                participantsWithTokens,
                evaluationData,
                {
                    ...options,
                    getBaseUrl, // Utiliser la fonction du hook
                    onProgress: (progressData) => {
                        setProgress(progressData);

                        // Log pour le debug en cas de gros volumes
                        if (progressData.current % 10 === 0 || progressData.current === progressData.total) {
                            console.log(`Génération PDF: ${progressData.current}/${progressData.total} (${Math.round(progressData.percentage)}%)`);
                        }
                    }
                }
            );

            // Progress final
            setProgress({
                current: participantsWithTokens.length,
                total: participantsWithTokens.length,
                percentage: 100,
                currentParticipant: 'Finalisation...'
            });

            // Vérification de la taille du blob pour gros volumes
            const sizeInMB = pdfBlob.size / (1024 * 1024);
            if (sizeInMB > 50) {
                console.warn(`PDF généré de taille importante: ${sizeInMB.toFixed(1)} MB`);
            }

            return pdfBlob;

        } catch (error: any) {
            console.error('Erreur lors de la génération des questionnaires:', error);
            setError(error.message || 'Erreur lors de la génération');
            throw error;
        } finally {
            setIsGenerating(false);
        }
    }, []);

    // Fonction optimisée pour récupérer les données d'évaluation
    const fetchEvaluationDataOptimized = async (groupeEvaluationId: string): Promise<EvaluationData> => {
        try {
            // Utiliser Promise.allSettled pour une meilleure gestion d'erreur
            const responses = await Promise.allSettled([
                fetch(`${GROUPE_EVALUATION_URLS.getEvaluationForF4}/${groupeEvaluationId}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache' // Force refresh pour les données critiques
                    }
                }),
                fetch(`${GROUPE_EVALUATION_URLS.getTokensForF4}/${groupeEvaluationId}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                })
            ]);

            // Vérifier les erreurs de réseau
            const rejectedPromises = responses.filter(result => result.status === 'rejected');
            if (rejectedPromises.length > 0) {
                throw new Error('Erreur de réseau lors de la récupération des données d\'évaluation');
            }

            const [evaluationResponse, tokensResponse] = responses.map(result =>
                result.status === 'fulfilled' ? result.value : null
            );

            // Vérifier les réponses HTTP
            if (!evaluationResponse?.ok) {
                const errorData = await evaluationResponse?.json().catch(() => ({}));
                throw new Error(errorData.error || `Erreur HTTP ${evaluationResponse?.status} lors de la récupération de l'évaluation`);
            }

            if (!tokensResponse?.ok) {
                const errorData = await tokensResponse?.json().catch(() => ({}));
                throw new Error(errorData.error || `Erreur HTTP ${tokensResponse?.status} lors de la récupération des tokens QR`);
            }

            // Parser les données
            const [evaluation, tokens] = await Promise.all([
                evaluationResponse.json(),
                tokensResponse.json()
            ]);

            // Validation métier
            if (!evaluation) {
                throw new Error('Données d\'évaluation non trouvées');
            }

            if (evaluation.status !== 'Publiée') {
                throw new Error(`L'évaluation doit être publiée pour générer les questionnaires. Statut actuel: ${evaluation.status}`);
            }

            if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
                throw new Error('Aucun token QR trouvé pour cette évaluation');
            }

            // Récupérer le questionnaire
            const questionnaireResponse = await fetch(`${QUESTIONNAIRE_URLS.getF4Questionnaire}/${evaluation.questionnaireId}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });

            if (!questionnaireResponse.ok) {
                const errorData = await questionnaireResponse.json().catch(() => ({}));
                throw new Error(errorData.error || 'Erreur lors de la récupération du questionnaire');
            }

            const questionnaire = await questionnaireResponse.json();
            console.log(questionnaire);

            if (!questionnaire || !questionnaire.questions || questionnaire.questions.length === 0) {
                throw new Error('Questionnaire vide ou invalide');
            }

            // Validation des tokens
            const validTokens = tokens.filter(token =>
                token && token.token && token.participantId && !token.isUsed
            );

            if (validTokens.length === 0) {
                throw new Error('Aucun token QR valide disponible');
            }

            console.log(`Données récupérées: évaluation ${evaluation.id}, ${validTokens.length} tokens QR, ${questionnaire.questions.length} questions`);

            return {
                id: evaluation.id,
                label: evaluation.label,
                status: evaluation.status,
                theme: evaluation.theme,
                dates: evaluation.dates,
                questionnaire,
                qrTokens: validTokens
            };

        } catch (error: any) {
            console.error('Erreur lors de la récupération des données d\'évaluation:', error);
            throw new Error(`Impossible de récupérer les données d'évaluation: ${error.message}`);
        }
    };

    const resetError = useCallback(() => {
        setError('');
        setProgress(null);
    }, []);

    // Fonction pour obtenir l'URL de base correcte
    const getBaseUrl = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            return 'http://192.168.1.12:3000';
        }
        return window.location.origin;
    }, []);

    return {
        generateQuestionnaires,
        isGenerating,
        progress,
        error,
        resetError,
        getBaseUrl
    };
};