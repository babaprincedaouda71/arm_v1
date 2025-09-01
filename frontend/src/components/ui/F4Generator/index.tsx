"use client";

import React from 'react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import autoTable from 'jspdf-autotable';

// Interface pour les props du composant, pour le rendre réutilisable
interface F4GeneratorProps {
    trainingTheme: string;
    beneficiaryLastName: string;
    beneficiaryFirstName: string;
    trainingDates: string;
    cin: string;
    cnss: string;
}

const F4Generator: React.FC<F4GeneratorProps> = ({
                                                     trainingTheme,
                                                     beneficiaryLastName,
                                                     beneficiaryFirstName,
                                                     trainingDates,
                                                     cin,
                                                     cnss
                                                 }) => {

    const generateF4Pdf = async () => {
        // ====================================================================
        // 1. INITIALISATION DU DOCUMENT ET DES DONNÉES
        // ====================================================================
        const doc = new jsPDF({orientation: 'portrait', unit: 'mm', format: 'a4'});
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;

        // Définition des données pour les tables pour plus de clarté
        const tableHeaders = [["", "Pas du tout", "Peu", "Moyen", "Tout à fait"]];
        const conditionsBody = [
            ["L'information concernant la formation a été complète"],
            ["La durée et le rythme de la formation étaient conformes à ce qui a été annoncé"],
            ["Les documents annoncés ont été remis aux participants."],
            ["Les documents remis constituent une aide à l'assimilation des contenus"],
            ["Les contenus de la formation étaient adaptés à mon niveau initial"],
            ["Les conditions matérielles (locaux, restauration, facilité d'accès, etc.) étaient satisfaisantes."],
        ];
        const competencesBody = [
            ["Le formateur dispose des compétences techniques nécessaires"],
            ["Le formateur dispose des compétences pédagogiques"],
            ["Le formateur a su créer ou entretenir une ambiance agréable dans le groupe en formation"],
            ["Les moyens pédagogiques étaient adaptés au contenu de la formation"],
        ];
        const objectifsBody = [
            ["Les objectifs de la formation correspondent à mes besoins professionnels"],
            ["Les objectifs recherchés à travers cette formation ont été atteint"],
            ["D'une manière générale, cette formation me permettra d'améliorer mes compétences professionnelles"],
        ];

        // ====================================================================
        // 2. GÉNÉRATION ET AJOUT DU QR CODE
        // ====================================================================
        try {
            // URL ou donnée à encoder. J'utilise celle du formulaire source.
            const qrCodeDataUrl = await QRCode.toDataURL('http://csf.ofppt.org.ma', {
                width: 128, // Taille en pixels
                margin: 1,
            });
            // Ajout en haut à droite. Coordonnées: x, y, largeur, hauteur (en mm)
            doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - margin - 25, 10, 25, 25);
        } catch (err) {
            console.error("Erreur lors de la génération du QR code:", err);
        }

        // ====================================================================
        // 3. EN-TÊTE ET TEXTES INTRODUCTIFS
        // ====================================================================
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text("Fiche d'évaluation de l'Action de Formation", pageWidth / 2, 20, {align: 'center'});

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("Cette fiche est remise par le formateur au bénéficiaire au terme de la dernière journée de formation.", pageWidth / 2, 30, {align: 'center'});
        doc.text("Ce dernier est prié de la remettre, dûment renseignée et signée, au formateur.", pageWidth / 2, 35, {align: 'center'});

        doc.setFont('helvetica', 'bold');
        doc.text("NB:", margin, 45);
        doc.setFont('helvetica', 'normal');
        doc.text("Les informations recueillies à travers cette fiche seront utilisées pour des fins statistiques", margin + 7, 45);
        doc.text("uniquement et nullement pour porter un jugement quel qu'il soit sur la performance des parties prenantes.", margin, 50);

        // ====================================================================
        // 4. SECTION D'INFORMATION (Bénéficiaire, etc.)
        // ====================================================================
        let yPos = 60;
        doc.setLineWidth(0.2);
        doc.line(margin, yPos, pageWidth - margin, yPos); // Ligne de séparation
        yPos += 5;

        doc.setFont('helvetica', 'bold');
        doc.text("Thème de l'Action de Formation:", margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(trainingTheme, margin + 65, yPos);

        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.text("Nom du bénéficiaire:", margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(beneficiaryLastName, margin + 45, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text("Prénom du bénéficiaire:", pageWidth / 2 + 10, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(beneficiaryFirstName, pageWidth / 2 + 55, yPos);

        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.text("Dates de la formation:", margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(trainingDates, margin + 45, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text("N° CIN:", pageWidth / 2 + 10, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(cin, pageWidth / 2 + 55, yPos);

        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.text("N° CNSS:", margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(cnss, margin + 45, yPos);

        yPos += 10; // Espace avant les tableaux

        // ====================================================================
        // 5. CRÉATION DES TABLEAUX AVEC AUTOTABLE (CORRECTED FOR TYPESCRIPT)
        // ====================================================================

        // This helper function draws the circles in the cells.
        const drawCirclesInCells = (data: any) => {
            // We only draw in the body and for columns with AddOCFPage > 0
            if (data.section === 'body' && data.column.index > 0) {
                const x = data.cell.x + data.cell.width / 2;
                const y = data.cell.y + data.cell.height / 2;
                doc.setLineWidth(0.3);
                doc.circle(x, y, 2.5, 'S'); // 'S' for "Stroke" (contour only)
            }
        };

        // Define the common header row for all tables
        const tableHeadersRow = ["", "Pas du tout", "Peu", "Moyen", "Tout à fait"];

        // --- Table 1: Conditions de réalisation ---
        autoTable(doc, {
            // We combine the title and header rows into one head array
            head: [
                [{
                    content: 'Conditions de réalisation',
                    colSpan: 5,
                    styles: {halign: 'left', fontStyle: 'bold', fillColor: [230, 230, 230]}
                }],
                tableHeadersRow
            ],
            body: conditionsBody,
            startY: yPos,
            theme: 'grid',
            styles: {cellPadding: 2, fontSize: 9},
            headStyles: {halign: 'center', fontStyle: 'bold'},
            columnStyles: {
                0: {cellWidth: 'auto', fontStyle: 'normal'},
                1: {cellWidth: 20}, 2: {cellWidth: 20}, 3: {cellWidth: 20}, 4: {cellWidth: 20},
            },
            didDrawCell: drawCirclesInCells,
            margin: {left: margin, right: margin},
        });

        // --- Table 2: Compétences techniques et pédagogiques ---
        autoTable(doc, {
            head: [
                [{
                    content: 'Compétences techniques et pédagogiques',
                    colSpan: 5,
                    styles: {halign: 'left', fontStyle: 'bold', fillColor: [230, 230, 230]}
                }],
                tableHeadersRow
            ],
            body: competencesBody,
            // Use the .finalY property from the previous table to stack them
            startY: (doc as any).lastAutoTable.finalY + 5,
            theme: 'grid',
            styles: {cellPadding: 2, fontSize: 9},
            headStyles: {halign: 'center', fontStyle: 'bold'},
            columnStyles: {
                0: {cellWidth: 'auto', fontStyle: 'normal'},
                1: {cellWidth: 20}, 2: {cellWidth: 20}, 3: {cellWidth: 20}, 4: {cellWidth: 20},
            },
            didDrawCell: drawCirclesInCells,
            margin: {left: margin, right: margin},
        });

        // --- Table 3: Atteinte des objectifs ---
        autoTable(doc, {
            head: [
                [{
                    content: 'Atteinte des objectifs',
                    colSpan: 5,
                    styles: {halign: 'left', fontStyle: 'bold', fillColor: [230, 230, 230]}
                }],
                tableHeadersRow
            ],
            body: objectifsBody,
            startY: (doc as any).lastAutoTable.finalY + 5,
            theme: 'grid',
            styles: {cellPadding: 2, fontSize: 9},
            headStyles: {halign: 'center', fontStyle: 'bold'},
            columnStyles: {
                0: {cellWidth: 'auto', fontStyle: 'normal'},
                1: {cellWidth: 20}, 2: {cellWidth: 20}, 3: {cellWidth: 20}, 4: {cellWidth: 20},
            },
            didDrawCell: drawCirclesInCells,
            margin: {left: margin, right: margin},
        });

        // ====================================================================
        // 6. PIED DE PAGE
        // ====================================================================
        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("Fait à:", margin, finalY + 15);
        doc.text("Le:", pageWidth / 2 - 10, finalY + 15);
        doc.text("Signature du bénéficiaire:", pageWidth / 2 + 40, finalY + 15);

        const footerText = "Ce formulaire est disponible sur le Portail des CSF à l'adresse: http://csf.ofppt.org.ma.";
        doc.setFontSize(8);
        doc.text(footerText, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, {align: 'center'});

        // ====================================================================
        // 7. SAUVEGARDE DU DOCUMENT
        // ====================================================================
        doc.save("Fiche-Evaluation-F4.pdf");
    };

    return (
        <button
            onClick={generateF4Pdf}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
            Générer PDF F4
        </button>
    );
};

export default F4Generator;