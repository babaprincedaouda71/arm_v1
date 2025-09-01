import {useCallback, useState} from 'react';
import {GROUPE_EVALUATION_URLS} from '@/config/urls';

export interface QuestionStats {
    questionId: string;
    questionText: string;
    questionType: string;
    totalResponses: number;
    optionPercentages: Record<string, number>;
}

export interface EvaluationSynthese {
    evaluationId: string;
    evaluationLabel: string;
    questionnaireTitle: string;
    questionnaireDescription: string;
    totalParticipants: number;
    totalResponses: number;
    completionPercentage: number;
    questionStats: QuestionStats[];
    generationDate: string;
    location: string;
    city: string;
    trainerName: string;
    date: string;
    trainingTheme: string;
    groupeNumber: number;
    companyName: string;
    ocf: string;
}

export const useEvaluationSynthese = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [syntheseData, setSyntheseData] = useState<EvaluationSynthese | null>(null);

    const fetchSyntheseData = useCallback(async (groupeEvaluationId: string): Promise<EvaluationSynthese> => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${GROUPE_EVALUATION_URLS.synthese}/${groupeEvaluationId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            setSyntheseData(data);
            return data;

        } catch (error: any) {
            const errorMessage = error.message || 'Erreur lors de la récupération des statistiques';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const generateSynthesePDF = useCallback(async (
        groupeEvaluationId: string,
        options: {
            onProgress?: (progress: { current: number; total: number; percentage: number }) => void;
        } = {}
    ): Promise<Blob> => {
        try {
            // 1. Récupérer les données de synthèse
            const syntheseData = await fetchSyntheseData(groupeEvaluationId);

            // 2. Import dynamique de jsPDF
            const jsPDFModule = await import('jspdf');
            const jsPDF = jsPDFModule.jsPDF;

            // 3. Créer le PDF
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // 4. Générer le contenu du PDF
            await generateSynthesePDFContent(doc, syntheseData, options.onProgress);

            // 5. Retourner le blob
            return doc.output('blob');

        } catch (error: any) {
            console.error('Erreur lors de la génération du PDF de synthèse:', error);
            throw error;
        }
    }, [fetchSyntheseData]);

    const resetError = useCallback(() => {
        setError('');
    }, []);

    return {
        fetchSyntheseData,
        generateSynthesePDF,
        isLoading,
        error,
        syntheseData,
        resetError
    };
};

async function generateSynthesePDFContent(
    doc: any,
    syntheseData: EvaluationSynthese,
    onProgress?: (progress: { current: number; total: number; percentage: number }) => void
): Promise<void> {
    // Configuration générale
    const pageWidth = 210;
    const pageHeight = 297;
    const topMargin = 15;
    const leftMargin = 15;
    const rightMargin = 15;
    const contentWidth = pageWidth - leftMargin - rightMargin;
    let currentY = topMargin;

    // ==========================================
    // BLOC 1 : TITRE PRINCIPAL AVEC ENCADREMENT
    // ==========================================

    const titleText = "Fiche d'évaluation synthétique par groupe";

    // Calculer la largeur du texte pour dimensionner les cadres
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    const textWidth = doc.getTextWidth(titleText);
    const frameWidth = textWidth + 12;
    const frameHeight = 12;
    const frameX = (pageWidth - frameWidth) / 2;

    // Ombre du cadre (gris, décalée de 1mm)
    doc.setFillColor(200, 200, 200);
    doc.rect(frameX + 1, currentY + 1, frameWidth, frameHeight, 'F');

    // Cadre extérieur (fond blanc, bordure noire)
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(frameX, currentY, frameWidth, frameHeight, 'FD');

    // Cadre intérieur (décalé de 1.5mm à l'intérieur)
    doc.rect(frameX + 1.5, currentY + 1.5, frameWidth - 3, frameHeight - 3, 'D');

    // Texte centré dans les cadres
    doc.setTextColor(0, 0, 0);
    doc.text(titleText, pageWidth / 2, currentY + frameHeight / 2 + 1.5, {align: 'center'});

    currentY += frameHeight + 10;

    // ==========================================
    // BLOC 2 : INFORMATIONS GÉNÉRALES
    // ==========================================

    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    // Utiliser les données de syntheseData si disponibles
    doc.text(`Nom de l'entreprise : ${syntheseData.companyName || ''}`, leftMargin, currentY);
    currentY += 6;
    doc.text(`Nom de l'organisme de formation : ${syntheseData.ocf}`, leftMargin, currentY);
    currentY += 8;

    // ==========================================
    // BLOC 3 : TABLEAU DES DÉTAILS
    // ==========================================

    const tableHeight = 30;
    const col1Width = contentWidth * 0.45;
    const col2Width = contentWidth * 0.35;
    const col3Width = contentWidth * 0.20;

    // Dessiner le cadre extérieur du tableau
    doc.setLineWidth(0.2);
    doc.rect(leftMargin, currentY, contentWidth, tableHeight, 'D');

    // Lignes verticales séparant les colonnes
    doc.line(leftMargin + col1Width, currentY, leftMargin + col1Width, currentY + tableHeight);
    doc.line(leftMargin + col1Width + col2Width, currentY, leftMargin + col1Width + col2Width, currentY + tableHeight);

    // Contenu du tableau avec données réelles
    doc.setFont('times', 'normal');
    doc.setFontSize(11);

    // Colonne 1
    doc.text(`Thème : ${syntheseData.trainingTheme || ''}`, leftMargin + 1, currentY + 8);
    doc.text(`Date : ${syntheseData.date || ''}`, leftMargin + 1, currentY + 15);
    doc.text(`Animateur : ${syntheseData.trainerName || ''}`, leftMargin + 1, currentY + 22);

    // Colonne 2
    doc.text(`Nombre de participants : ${syntheseData.totalParticipants || ''}`, leftMargin + col1Width + 1, currentY + 8);
    doc.text(`Lieu : ${syntheseData.location || ''}`, leftMargin + col1Width + 1, currentY + 15);

    // Colonne 3
    doc.text(`N° du Groupe : ${syntheseData.groupeNumber || ''}`, leftMargin + col1Width + col2Width + 1, currentY + 8);
    doc.text(`Ville : ${syntheseData.city || ''}`, leftMargin + col1Width + col2Width + 1, currentY + 15);

    currentY += tableHeight + 8;

    // ==========================================
    // BLOC 4 : SECTION D'ÉVALUATION
    // ==========================================

    // Sous-titre de la section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text("EVALUATION CRITERE", leftMargin, currentY);

    // Mesurer la largeur exacte du texte précédent
    const evaluationTextWidth = doc.getTextWidth("EVALUATION CRITERE");

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(" (Synthèse)", leftMargin + evaluationTextWidth + 2, currentY);

    currentY += 6;

    // Fonction pour créer un tableau d'évaluation avec les pourcentages
    function createEvaluationTable(title: string, criteria: string[], questionStats: QuestionStats[], startY: number): number {
        let tableY = startY;

        // Dimensions des colonnes
        const criteriaColWidth = contentWidth * 0.55;
        const ratingColWidth = contentWidth * 0.1125;

        // LIGNE 1 : Titre du tableau + En-têtes des notations sur la même ligne
        const rowHeight = 7;
        doc.setLineWidth(0.2);
        doc.rect(leftMargin, tableY, contentWidth, rowHeight, 'D');

        // Lignes verticales pour séparer les colonnes
        doc.line(leftMargin + criteriaColWidth, tableY, leftMargin + criteriaColWidth, tableY + rowHeight);
        for (let i = 1; i <= 3; i++) {
            const x = leftMargin + criteriaColWidth + (i * ratingColWidth);
            doc.line(x, tableY, x, tableY + rowHeight);
        }

        // Titre dans la première colonne
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.text(title, leftMargin + 1, tableY + 4);

        // En-têtes des colonnes de notation dans les autres colonnes
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        const headers = ["Pas du tout", "Peu", "Moyen", "Tout à fait"];

        for (let i = 0; i < headers.length; i++) {
            const colX = leftMargin + criteriaColWidth + (i * ratingColWidth);
            const colCenterX = colX + ratingColWidth / 2;
            doc.text(headers[i], colCenterX, tableY + 4, {align: 'center'});
        }
        tableY += rowHeight;

        // Lignes de critères avec pourcentages
        doc.setFont('times', 'normal');
        doc.setFontSize(9);

        for (let j = 0; j < criteria.length; j++) {
            const criterion = criteria[j];

            // Trouver la question correspondante dans questionStats (logique améliorée)
            let questionStat = questionStats.find(stat => {
                const criterionLower = criterion.toLowerCase().trim();
                const questionLower = stat.questionText.toLowerCase().trim();

                // Essayer différentes méthodes de correspondance
                const exactMatch = criterionLower === questionLower;
                const includesMatch = criterionLower.includes(questionLower) || questionLower.includes(criterionLower);

                // Correspondance par mots-clés principaux
                const criterionWords = criterionLower.split(' ').filter(word => word.length > 3);
                const questionWords = questionLower.split(' ').filter(word => word.length > 3);
                const commonWords = criterionWords.filter(word => questionWords.includes(word));
                const keywordMatch = commonWords.length >= 2;

                return exactMatch || includesMatch || keywordMatch;
            });

            // Si pas de correspondance trouvée, essayer par AddOCFPage
            if (!questionStat && questionStats[j]) {
                questionStat = questionStats[j];
            }

            // Gérer le retour à la ligne automatique
            const textLines = doc.splitTextToSize(criterion, criteriaColWidth - 2);
            const lineHeight = textLines.length * 3.2 + 4;
            const criteriaRowHeight = Math.max(5.5, lineHeight);

            // Dessiner la ligne du tableau
            doc.rect(leftMargin, tableY, contentWidth, criteriaRowHeight, 'D');

            // Lignes verticales
            doc.line(leftMargin + criteriaColWidth, tableY, leftMargin + criteriaColWidth, tableY + criteriaRowHeight);
            for (let i = 1; i <= 3; i++) {
                const x = leftMargin + criteriaColWidth + (i * ratingColWidth);
                doc.line(x, tableY, x, tableY + criteriaRowHeight);
            }

            // Texte du critère
            doc.text(textLines, leftMargin + 1, tableY + 3.5);

            // Ajouter les pourcentages dans les colonnes correspondantes
            if (questionStat && questionStat.optionPercentages) {
                doc.setFont('times', 'normal');
                doc.setFontSize(8);

                // Essayer différents formats de clés
                const possibleKeys = [
                    ["Pas du tout", "Peu", "Moyen", "Tout à fait"],
                    ["pas du tout", "peu", "moyen", "tout à fait"],
                    ["PAS DU TOUT", "PEU", "MOYEN", "TOUT À FAIT"],
                    ["1", "2", "3", "4"],
                    ["option1", "option2", "option3", "option4"]
                ];

                for (const keySet of possibleKeys) {
                    if (keySet.some(key => questionStat.optionPercentages.hasOwnProperty(key))) {
                        for (let k = 0; k < keySet.length; k++) {
                            const optionKey = keySet[k];
                            const percentage = questionStat.optionPercentages[optionKey];

                            if (percentage !== undefined && percentage !== null) {
                                const colX = leftMargin + criteriaColWidth + (k * ratingColWidth);
                                const colCenterX = colX + ratingColWidth / 2;
                                const percentageText = `${percentage.toFixed(1)}%`;

                                doc.text(percentageText, colCenterX, tableY + criteriaRowHeight / 2 + 1, {align: 'center'});
                            }
                        }
                        break;
                    }
                }

                doc.setFont('times', 'normal');
                doc.setFontSize(9);
            }

            tableY += criteriaRowHeight;
        }

        return tableY;
    }

    // Générer les trois tableaux d'évaluation avec les questions ORIGINALES
    const tableConfigs = [
        {
            title: "Conditions de réalisation",
            criteria: [
                "L'information concernant la formation a été complète",
                "La durée et le rythme de la formation étaient conformes",
                "Les documents annoncés ont remis aux participants",
                "Les documents remis constituent une aide à l'assimilation des contenus",
                "Les contenus de la formation étaient adaptés à mon niveau initial",
                "Les conditions matérielles étaient satisfaisantes"
            ]
        },
        {
            title: "Compétences techniques et pédagogiques",
            criteria: [
                "Le formateur dispose des compétences techniques nécessaires",
                "Le formateur dispose des compétences pédagogiques",
                "Le formateur a su créer ou entretenir une ambiance dans le groupe en formation",
                "Les moyens pédagogiques étaient adaptés au contenu de la formation"
            ]
        },
        {
            title: "Atteinte des objectifs",
            criteria: [
                "Les objectifs de la formation correspondent aux objectifs professionnels",
                "Les objectifs recherchés ont été atteints",
                "La formation permet d'améliorer les compétences professionnelles"
            ]
        }
    ];

    for (let i = 0; i < tableConfigs.length; i++) {
        const config = tableConfigs[i];

        // Progress callback
        if (onProgress) {
            onProgress({
                current: i + 1,
                total: tableConfigs.length + 2,
                percentage: ((i + 1) / (tableConfigs.length + 2)) * 100
            });
        }

        currentY = createEvaluationTable(config.title, config.criteria, syntheseData.questionStats, currentY);
        currentY += 4;
    }

    // ==========================================
    // BLOC 5 : SECTION DES COMMENTAIRES LIBRES
    // ==========================================

    const commentColWidth = contentWidth / 3;
    const commentTableHeight = 50;

    // Dessiner le cadre du tableau de commentaires
    doc.rect(leftMargin, currentY, contentWidth, commentTableHeight, 'D');

    // Lignes verticales
    doc.line(leftMargin + commentColWidth, currentY, leftMargin + commentColWidth, currentY + commentTableHeight);
    doc.line(leftMargin + 2 * commentColWidth, currentY, leftMargin + 2 * commentColWidth, currentY + commentTableHeight);

    // Ligne horizontale séparant en-tête et zone de saisie
    doc.line(leftMargin, currentY + 6, leftMargin + contentWidth, currentY + 6);

    // En-têtes des colonnes
    doc.setFont('times', 'bold');
    doc.setFontSize(10);

    const commentHeaders = ["Aspects à développer", "Aspects à clarifier", "Aspects à supprimer"];
    for (let i = 0; i < commentHeaders.length; i++) {
        const colCenterX = leftMargin + (i * commentColWidth) + (commentColWidth / 2);
        doc.text(commentHeaders[i], colCenterX, currentY + 4, {align: 'center'});
    }

    currentY += commentTableHeight + 5;

    // ==========================================
    // BLOC 6 : PIED DE PAGE (SIGNATURES)
    // ==========================================

    // Signatures directement après le tableau de commentaires
    doc.setFont('times', 'bold');
    doc.setFontSize(11);

    // Signature à gauche
    doc.text("Emargement de l'animateur", leftMargin, currentY);

    // Cachet à droite
    doc.text("Cachet de l'organisme de formation", leftMargin + contentWidth, currentY, {align: 'right'});

    // Progress final
    if (onProgress) {
        onProgress({
            current: tableConfigs.length + 2,
            total: tableConfigs.length + 2,
            percentage: 100
        });
    }
}