// components/QuestionnairePreviewModal/AddOCFPage.tsx
import React, {useEffect, useRef, useState} from 'react';
import {Download, Eye, FileText, X} from 'lucide-react';

interface Question {
    id: string;
    type: string;
    text: string;
    comment?: string;
    options?: string[];
    levels?: string[];
    ratingValue?: number;
    scoreValue?: number;
}

interface QuestionnaireData {
    id: string;
    title: string;
    description?: string;
    type: string;
    questions: Question[];
}

interface QuestionnairePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    questionnaireData: QuestionnaireData | null;
    selectedType: string;
}

const QuestionnairePreviewModal: React.FC<QuestionnairePreviewModalProps> = ({
                                                                                 isOpen,
                                                                                 onClose,
                                                                                 questionnaireData,
                                                                                 selectedType
                                                                             }) => {
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfBlobRef = useRef<Blob | null>(null);

    // Fonction pour générer le PDF du questionnaire
    const generatePDF = async () => {
        if (!questionnaireData) return;

        setIsGenerating(true);

        try {
            // Import dynamique de jsPDF
            const {jsPDF} = await import('jspdf');

            // Créer une nouvelle instance de jsPDF en format A4
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Dimensions A4 en mm
            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 20;
            const usableWidth = pageWidth - (margin * 2);

            // Configuration des polices
            doc.setFont('helvetica');

            // --- En-tête du questionnaire ---
            let currentY = 30;

            // Titre principal
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            const title = "APERÇU DU QUESTIONNAIRE";
            const titleWidth = doc.getTextWidth(title);
            doc.text(title, (pageWidth - titleWidth) / 2, currentY);

            currentY += 15;

            // Type de questionnaire
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Type:', margin, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text(selectedType, margin + 15, currentY);

            currentY += 10;

            // Titre du questionnaire
            doc.setFont('helvetica', 'bold');
            doc.text('Titre:', margin, currentY);
            doc.setFont('helvetica', 'normal');
            const titleLines = doc.splitTextToSize(questionnaireData.title, usableWidth - 20);
            doc.text(titleLines, margin + 15, currentY);
            currentY += titleLines.length * 6;

            // Description (si présente)
            if (questionnaireData.description) {
                currentY += 5;
                doc.setFont('helvetica', 'bold');
                doc.text('Description:', margin, currentY);
                currentY += 6;
                doc.setFont('helvetica', 'normal');
                const descLines = doc.splitTextToSize(questionnaireData.description, usableWidth);
                doc.text(descLines, margin, currentY);
                currentY += descLines.length * 6;
            }

            currentY += 10;

            // --- Questions ---
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text('QUESTIONS:', margin, currentY);
            currentY += 10;

            questionnaireData.questions.forEach((question, index) => {
                // Vérifier si on a besoin d'une nouvelle page
                if (currentY > pageHeight - 80) {
                    doc.addPage();
                    currentY = 30;
                }

                // Numéro et texte de la question
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                const questionNumber = `${index + 1}. `;
                doc.text(questionNumber, margin, currentY);

                const questionTextX = margin + doc.getTextWidth(questionNumber);
                const questionLines = doc.splitTextToSize(question.text, usableWidth - doc.getTextWidth(questionNumber));
                doc.text(questionLines, questionTextX, currentY);
                currentY += questionLines.length * 6 + 3;

                // Commentaire (si présent)
                if (question.comment) {
                    doc.setFont('helvetica', 'italic');
                    doc.setFontSize(9);
                    const commentLines = doc.splitTextToSize(`${question.comment}`, usableWidth - 10);
                    doc.text(commentLines, margin + 5, currentY);
                    currentY += commentLines.length * 4 + 3;
                }

                // Espaces de réponse selon le type de question
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);

                switch (question.type?.toLowerCase()) {
                    case 'texte':
                    case 'commentaire':
                        // Lignes pour réponse écrite
                        doc.text('Réponse:', margin + 5, currentY);
                        currentY += 7;
                        for (let i = 0; i < 4; i++) {
                            doc.setDrawColor(150, 150, 150);
                            doc.setLineWidth(0.3);
                            doc.line(margin + 5, currentY, pageWidth - margin - 5, currentY);
                            currentY += 6;
                        }
                        currentY += 3;
                        break;

                    case 'réponse multiple':
                    case 'choix multiple':
                        // Cases à cocher pour choix multiple
                        if (question.options && question.options.length > 0) {
                            doc.text('Cochez toutes les réponses qui s\'appliquent:', margin + 5, currentY);
                            currentY += 8;

                            question.options.forEach((option) => {
                                // Case à cocher
                                doc.setDrawColor(0, 0, 0);
                                doc.setLineWidth(0.5);
                                doc.rect(margin + 10, currentY - 3, 4, 4);

                                // Texte de l'option
                                const optionLines = doc.splitTextToSize(option, usableWidth - 25);
                                doc.text(optionLines, margin + 18, currentY);
                                currentY += Math.max(optionLines.length * 5, 6);
                            });
                        }
                        break;

                    case 'réponse unique':
                    case 'choix unique':
                        // Boutons radio pour choix unique
                        if (question.options && question.options.length > 0) {
                            doc.text('Sélectionnez une seule réponse:', margin + 5, currentY);
                            currentY += 8;

                            question.options.forEach((option) => {
                                // Cercle pour radio button
                                doc.setDrawColor(0, 0, 0);
                                doc.setLineWidth(0.5);
                                doc.circle(margin + 12, currentY - 1, 2);

                                // Texte de l'option
                                const optionLines = doc.splitTextToSize(option, usableWidth - 25);
                                doc.text(optionLines, margin + 18, currentY);
                                currentY += Math.max(optionLines.length * 5, 6);
                            });
                        }
                        break;

                    case 'notation':
                    case 'évaluation':
                        // Échelle de notation avec étoiles ou niveaux
                        if (question.levels && question.levels.length > 0) {
                            doc.text('Évaluez selon l\'échelle suivante:', margin + 5, currentY);
                            currentY += 8;

                            // Affichage horizontal des niveaux
                            const levelWidth = (usableWidth - 20) / question.levels.length;
                            question.levels.forEach((level, levelIndex) => {
                                const xPos = margin + 10 + (levelIndex * levelWidth);

                                // Case à cocher pour ce niveau
                                doc.rect(xPos, currentY - 3, 4, 4);

                                // Texte du niveau (tronqué si nécessaire)
                                const truncatedLevel = level.length > 15 ? level.substring(0, 15) + '...' : level;
                                const levelTextWidth = doc.getTextWidth(truncatedLevel);
                                doc.text(truncatedLevel, xPos - (levelTextWidth / 2) + 2, currentY + 8);
                            });
                            currentY += 15;
                        } else if (question.ratingValue) {
                            // Échelle numérique
                            doc.text(`Évaluez de 1 à ${question.ratingValue}:`, margin + 5, currentY);
                            currentY += 8;

                            // Affichage des étoiles ou nombres
                            const starSpacing = Math.min(20, (usableWidth - 20) / question.ratingValue);
                            for (let i = 1; i <= question.ratingValue; i++) {
                                const xPos = margin + 10 + ((i - 1) * starSpacing);

                                // Étoile vide
                                doc.setDrawColor(0, 0, 0);
                                doc.setLineWidth(0.5);
                                doc.text('☆', xPos, currentY);

                                // Numéro sous l'étoile
                                doc.setFontSize(8);
                                doc.text(i.toString(), xPos + 1, currentY + 5);
                                doc.setFontSize(10);
                            }
                            currentY += 12;
                        }
                        break;

                    case 'score':
                        // Zone pour saisie de score
                        doc.text(`Score (sur ${question.scoreValue || 100}):`, margin + 5, currentY);
                        currentY += 8;

                        // Rectangle pour la réponse
                        doc.setDrawColor(0, 0, 0);
                        doc.setLineWidth(0.5);
                        doc.rect(margin + 10, currentY - 5, 30, 8);
                        doc.text('/', margin + 45, currentY);
                        doc.text((question.scoreValue || 100).toString(), margin + 50, currentY);
                        currentY += 10;
                        break;

                    default:
                        // Type de question non reconnu - zone de texte par défaut
                        doc.text('Réponse:', margin + 5, currentY);
                        currentY += 7;
                        for (let i = 0; i < 2; i++) {
                            doc.setDrawColor(150, 150, 150);
                            doc.setLineWidth(0.3);
                            doc.line(margin + 5, currentY, pageWidth - margin - 5, currentY);
                            currentY += 6;
                        }
                        currentY += 3;
                        break;
                }

                // Espace entre les questions
                currentY += 10;

                // Ligne de séparation entre les questions
                if (index < questionnaireData.questions.length - 1) {
                    doc.setDrawColor(200, 200, 200);
                    doc.setLineWidth(0.1);
                    doc.line(margin, currentY, pageWidth - margin, currentY);
                    currentY += 8;
                }
            });

            // --- Pied de page ---
            const footerY = pageHeight - 20;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            const footerText = `Questionnaire généré le ${new Date().toLocaleDateString('fr-FR')} - ${questionnaireData.questions.length} question(s)`;
            doc.text(footerText, margin, footerY);

            // Génération du blob PDF
            const pdfBlob = doc.output('blob');
            pdfBlobRef.current = pdfBlob;

            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);

        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Générer le PDF quand le modal s'ouvre
    useEffect(() => {
        if (isOpen && questionnaireData) {
            generatePDF();
        }

        // Cleanup de l'URL quand le modal se ferme
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [isOpen, questionnaireData]);

    // Fonction pour télécharger le PDF
    const handleDownload = () => {
        if (!pdfBlobRef.current || !questionnaireData) return;

        const url = URL.createObjectURL(pdfBlobRef.current);
        const a = document.createElement('a');
        a.href = url;
        const fileName = `questionnaire_${selectedType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="flex items-center gap-2">
                        <Eye className="w-6 h-6 text-blue-600"/>
                        <div>
                            <h2 className="text-xl font-semibold">Aperçu du questionnaire</h2>
                            <p className="text-sm text-gray-600">{selectedType}</p>
                        </div>
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
                    {isGenerating ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Génération de l'aperçu PDF En Cours...</p>
                            </div>
                        </div>
                    ) : pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full border-0 rounded"
                            title="Aperçu du questionnaire"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                                <p className="text-gray-500">
                                    {questionnaireData ? 'Erreur lors de la génération du PDF' : 'Aucun questionnaire sélectionné'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Fermer
                    </button>

                    <button
                        onClick={handleDownload}
                        disabled={!pdfBlobRef.current}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4"/>
                        Télécharger PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionnairePreviewModal;