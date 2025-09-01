import React, { useState, useRef } from 'react';
import { X, Download, Save, FileText } from 'lucide-react';

// Interface pour les données de la formation
interface TrainingData {
    theme: string;
    location: string;
    startDate: string;
    endDate?: string;
    participantCount?: number;
    // Ajoutez d'autres champs selon vos besoins
}

interface PDFGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    trainingData: TrainingData | null;
    groupData: any;
    onSave?: (pdfBlob: Blob) => Promise<void>;
    onSaveAndDownload?: (pdfBlob: Blob) => Promise<void>;
}

const PDFGenerationModal: React.FC<PDFGenerationModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   trainingData,
                                                                   groupData,
                                                                   onSave,
                                                                   onSaveAndDownload
                                                               }) => {
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const pdfBlobRef = useRef<Blob | null>(null);

    // Fonction pour générer le PDF avec jsPDF
    const generatePDF = async () => {
        setIsGenerating(true);

        try {
            // Import dynamique de jsPDF
            const { jsPDF } = await import('jspdf');

            // Créer une nouvelle instance de jsPDF en format A4
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Dimensions A4 en mm
            const pageWidth = 210;
            const pageHeight = 297;

            // Marges
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);

            // Configuration des polices
            doc.setFont('helvetica');

            // Titre principal
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            const title = "AVIS D'ANNULATION OU DE MODIFICATION";
            const titleWidth = doc.getTextWidth(title);
            doc.text(title, (pageWidth - titleWidth) / 2, 40);

            // Dessiner le tableau principal
            const tableStartY = 60;
            const tableHeight = 60;
            const col1Width = 40;
            const col2Width = 60;
            const col3Width = contentWidth - col1Width - col2Width;

            // Background gris pour le tableau principal
            doc.setFillColor(220, 220, 220); // Gris clair
            doc.rect(margin, tableStartY, contentWidth, tableHeight, 'F'); // 'F' pour remplir

            // Bordures du tableau principal
            doc.setLineWidth(0.5);
            doc.setDrawColor(0, 0, 0); // Noir pour les bordures
            doc.rect(margin, tableStartY, contentWidth, tableHeight);

            // Colonnes verticales
            doc.line(margin + col1Width, tableStartY, margin + col1Width, tableStartY + tableHeight);
            doc.line(margin + col1Width + col2Width, tableStartY, margin + col1Width + col2Width, tableStartY + tableHeight);

            // Définir la position de la colonne de droite
            const rightColStartX = margin + col1Width + col2Width;

            // Ligne horizontale pour séparer Annulation (petite partie) et Modification (grande partie)
            // Annulation prend environ 1/5 de la hauteur, Modification prend 4/5
            const annulationHeight = tableHeight / 5; // Petite cellule pour Annulation
            const separationY = tableStartY + annulationHeight;
            doc.line(margin + col1Width, separationY, margin + col1Width + col2Width, separationY);

            // Ligne horizontale pour séparer la cellule vide (en face d'Annulation) de la première cellule de Modification
            doc.line(rightColStartX, separationY, margin + contentWidth, separationY);

            // Lignes horizontales pour diviser la partie Modification de la colonne 3 en 4 cellules
            const modificationSectionHeight = tableHeight - annulationHeight; // 4/5 de la hauteur
            const modificationCellHeight = modificationSectionHeight / 4; // 4 cellules égales

            // Diviser seulement la partie Modification (4/5 inférieurs) en 4 cellules
            for (let i = 1; i < 4; i++) {
                const yPos = separationY + (modificationCellHeight * i);
                doc.line(rightColStartX, yPos, margin + contentWidth, yPos);
            }

            // Lignes verticales pour diviser chaque cellule de Modification en deux parties (texte à gauche, vide à droite)
            const col3MiddleX = rightColStartX + (col3Width / 2);

            // Ligne verticale seulement dans la section Modification (pas dans la cellule en face d'Annulation)
            for (let i = 0; i < 4; i++) {
                const cellStartY = separationY + (modificationCellHeight * i);
                const cellEndY = separationY + (modificationCellHeight * (i + 1));
                doc.line(col3MiddleX, cellStartY, col3MiddleX, cellEndY);
            }

            // Textes dans le tableau
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0); // Texte noir

            // Colonne 1 - AVIS (centré verticalement sur toute la hauteur)
            const avisText = 'AVIS';
            const avisWidth = doc.getTextWidth(avisText);
            doc.text(avisText, margin + (col1Width - avisWidth) / 2, tableStartY + (tableHeight / 2) + 2);

            // Colonne 2 - Headers
            // Annulation (centré dans la petite cellule du haut)
            const annulationText = 'Annulation';
            const annulationWidth = doc.getTextWidth(annulationText);
            doc.text(annulationText, margin + col1Width + (col2Width - annulationWidth) / 2, tableStartY + (annulationHeight / 2) + 2);

            // Modification (centré dans la grande partie du bas)
            const modificationText = 'Modification';
            const modificationWidth = doc.getTextWidth(modificationText);
            const modificationCenterY = separationY + (modificationSectionHeight / 2);
            doc.text(modificationText, margin + col1Width + (col2Width - modificationWidth) / 2, modificationCenterY + 2);

            // Colonne 3 - Labels pour les 4 cellules de Modification
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);

            const modificationLabels = [
                'de la date de\nRéalisation',
                'de l\'organisme\nde formation',
                'du lieu de\nformation',
                'Organisation\nhoraire'
            ];

            modificationLabels.forEach((label, index) => {
                const cellY = separationY + (modificationCellHeight * index);
                const cellCenterY = cellY + (modificationCellHeight / 2);

                // Diviser le texte en lignes pour les labels multi-lignes
                const lines = label.split('\n');
                const lineHeight = 3;
                const totalTextHeight = lines.length * lineHeight;
                const startY = cellCenterY - (totalTextHeight / 2) + 2;

                lines.forEach((line, lineIndex) => {
                    doc.text(line, rightColStartX + 2, startY + (lineIndex * lineHeight));
                });
            });

            // Section des détails
            let currentY = tableStartY + tableHeight + 20;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            // Thème de l'action
            doc.setFont('helvetica', 'bold');
            doc.text(`Thème de l'action: ${trainingData?.theme}`, margin, currentY);
            doc.setFont('helvetica', 'normal');
            currentY += 8;

            // Nature de l'action
            doc.setFont('helvetica', 'bold');
            doc.text('Nature de l\'action :', margin, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text('planifiée', margin + 50, currentY);
            doc.text('non planifiée', margin + 90, currentY);
            doc.text('Alpha', margin + 140, currentY);
            currentY += 10;

            // Effectif des participants
            doc.setFont('helvetica', 'bold');
            doc.text('Effectif des participants :', margin, currentY);
            doc.setFont('helvetica', 'normal');
            if (groupData?.managerCount || groupData?.employeeCount || groupData?.workerCount) {
                const totalParticipants = (groupData.managerCount || 0) +
                    (groupData.employeeCount || 0) +
                    (groupData.workerCount || 0) +
                    (groupData.temporaryWorkerCount || 0);
                doc.text(totalParticipants.toString(), margin + 60, currentY);
            }
            currentY += 10;

            // Organisme de formation initial
            doc.setFont('helvetica', 'bold');
            doc.text('Organisme de formation initial', margin, currentY);
            doc.text('Nouvel Organisme de formation', margin + 100, currentY);
            doc.setFont('helvetica', 'normal');
            // Ligne pointillée
            for (let i = 0; i < 50; i++) {
                doc.text('.', margin + 5 + (i * 2), currentY + 5);
                doc.text('.', margin + 105 + (i * 2), currentY + 5);
            }
            currentY += 15;

            // Lieu de formation initial
            doc.setFont('helvetica', 'bold');
            doc.text('Lieu de formation initial', margin, currentY);
            doc.text('Nouveau lieu', margin + 100, currentY);
            doc.setFont('helvetica', 'normal');
            if (trainingData?.location) {
                doc.text(trainingData.location, margin + 5, currentY + 5);
            }
            // Ligne pointillée
            for (let i = 0; i < 50; i++) {
                doc.text('.', margin + 5 + (i * 2), currentY + 5);
                doc.text('.', margin + 105 + (i * 2), currentY + 5);
            }
            currentY += 15;

            // Dates initiales de réalisation
            doc.setFont('helvetica', 'bold');
            doc.text('Dates initiales de réalisation', margin, currentY);
            doc.text('Nouvelles Dates exactes de réalisation', margin + 100, currentY);
            doc.setFont('helvetica', 'normal');
            if (trainingData?.startDate) {
                const formattedDate = new Date(trainingData.startDate).toLocaleDateString('fr-FR');
                doc.text(formattedDate, margin + 5, currentY + 5);
            }
            // Ligne pointillée
            for (let i = 0; i < 50; i++) {
                doc.text('.', margin + 5 + (i * 2), currentY + 5);
                doc.text('.', margin + 105 + (i * 2), currentY + 5);
            }
            currentY += 15;

            // Organisation horaire initiale
            doc.setFont('helvetica', 'bold');
            doc.text('Organisation horaire initiale :', margin, currentY);
            currentY += 5;
            doc.text('- heure début', margin + 5, currentY);
            doc.text('heure fin', margin + 100, currentY);
            doc.setFont('helvetica', 'normal');
            if (groupData?.morningStartTime) {
                doc.text(groupData.morningStartTime, margin + 30, currentY);
            }
            if (groupData?.morningEndTime) {
                doc.text(groupData.morningEndTime, margin + 120, currentY);
            }
            // Ligne pointillée
            for (let i = 0; i < 20; i++) {
                doc.text('.', margin + 35 + (i * 2), currentY);
                doc.text('.', margin + 125 + (i * 2), currentY);
            }
            currentY += 10;

            // Nouvelle organisation horaire
            doc.setFont('helvetica', 'bold');
            doc.text('Nouvelle organisation horaire :', margin, currentY);
            currentY += 5;
            doc.text('- heure début', margin + 5, currentY);
            doc.text('heure fin', margin + 100, currentY);
            doc.setFont('helvetica', 'normal');
            // Ligne pointillée
            for (let i = 0; i < 20; i++) {
                doc.text('.', margin + 35 + (i * 2), currentY);
                doc.text('.', margin + 125 + (i * 2), currentY);
            }
            currentY += 15;

            // Responsable à contacter
            doc.setFont('helvetica', 'bold');
            doc.text('Responsable à contacter :', margin, currentY);
            currentY += 20;

            // Pied de page - aligné à droite
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            const footerY = pageHeight - 30;
            const footerText = "Cachet de l'entreprise, Signature et qualité du responsable";
            const footerWidth = doc.getTextWidth(footerText);

            // Positionner le texte à droite de la page
            const footerX = pageWidth - margin - footerWidth;
            doc.text(footerText, footerX, footerY);

            // Générer le blob PDF
            const pdfBlob = doc.output('blob');
            pdfBlobRef.current = pdfBlob;

            // Créer l'URL pour l'aperçu
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);

        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Effet pour générer le PDF quand le modal s'ouvre
    React.useEffect(() => {
        if (isOpen && trainingData) {
            generatePDF();
        }

        // Cleanup de l'URL quand le modal se ferme
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [isOpen, trainingData]);

    // Fonction pour enregistrer le PDF
    const handleSave = async () => {
        if (!pdfBlobRef.current || !onSave) return;

        setIsLoading(true);
        try {
            await onSave(pdfBlobRef.current);
            onClose();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour enregistrer et télécharger
    const handleSaveAndDownload = async () => {
        if (!pdfBlobRef.current || !onSaveAndDownload) return;

        setIsLoading(true);
        try {
            await onSaveAndDownload(pdfBlobRef.current);

            // Télécharger le fichier
            const url = URL.createObjectURL(pdfBlobRef.current);
            const a = document.createElement('a');
            a.href = url;
            a.download = `avis_annulation_${trainingData?.theme || 'formation'}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            onClose();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde et téléchargement:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold">Avis d'annulation OFPPT</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-hidden">
                    {isGenerating ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Génération du PDF En Cours...</p>
                            </div>
                        </div>
                    ) : pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full border-0 rounded"
                            title="Aperçu du PDF"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Erreur lors de la génération du PDF</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Annuler
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isLoading || !pdfBlobRef.current}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>

                    <button
                        onClick={handleSaveAndDownload}
                        disabled={isLoading || !pdfBlobRef.current}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        {isLoading ? 'Traitement...' : 'Enregistrer et Télécharger'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PDFGenerationModal;