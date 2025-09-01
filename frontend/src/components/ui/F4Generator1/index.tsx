'use client';
import { jsPDF } from 'jspdf';
import Button from "@/components/Buttons/Button";

export default function F4Generator1() {
    const generatePDF = () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
        });

        // ---- HEADER ----
        doc.setFontSize(10);
        doc.text('Ce formulaire est disponible sur le Portail des CSF à l\'adresse: http://csf.ofppt.org.ma.', 40, 40);

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Contrats Spéciaux de Formation', 40, 70);
        doc.text('Formulaire F4', 230, 90);
        doc.text('Fiche d\'évaluation de l\'Action de Formation', 150, 110);

        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text('Cette fiche est remise par le formateur au bénéficiaire au terme de la dernière journée de formation.', 40, 130);
        doc.text('Ce dernier est prié de la remettre, dûment renseignée et signée, au formateur.', 40, 145);
        doc.text('NB: Les informations recueillies à travers cette fiche seront utilisées pour des fins statistiques uniquement et nullement pour porter un jugement quel qu\'il soit sur la performance des parties prenantes.', 40, 160, { maxWidth: 520 });

        // ---- INFOS FORMATION ----
        doc.setFont(undefined, 'bold');
        doc.text('Thème de l\'Action de Formation:', 40, 190);
        doc.text('Dates de la formation:', 340, 190);

        doc.setFont(undefined, 'normal');
        doc.text('Nom du bénéficiaire:', 40, 215);
        doc.text('Prénom du bénéficiaire:', 300, 215);
        doc.text('N° CIN:', 40, 240);
        doc.text('N° CNSS:', 300, 240);

        // ---- TABLES (simplifiées avec des labels) ----
        const sections = [
            {
                title: 'Conditions de réalisation',
                options: [
                    'L\'information concernant la formation a été complète',
                    'La durée et le rythme de la formation étaient conformes à ce qui a été annoncé',
                    'Les documents annoncés ont été remis aux participants.',
                    'Les documents remis constituent une aide à l\'assimilation des contenus',
                    'Les contenus de la formation étaient adaptés à mon niveau initial',
                    'Les conditions matérielles (locaux, restauration, facilité d’accès, etc.) étaient satisfaisantes.',
                ],
                startY: 270,
            },
            {
                title: 'Compétences techniques et pédagogiques',
                options: [
                    'Le formateur dispose des compétences techniques nécessaires',
                    'Le formateur dispose des compétences pédagogiques',
                    'Le formateur a su créer ou entretenir une ambiance agréable dans le groupe en formation',
                    'Les moyens pédagogiques étaient adaptés au contenu de la formation',
                ],
                startY: 420,
            },
            {
                title: 'Atteinte des objectifs',
                options: [
                    'Les objectifs de la formation correspondent à mes besoins professionnels',
                    'Les objectifs recherchés à travers cette formation ont été atteints',
                    'D\'une manière générale, cette formation me permettra d\'améliorer mes compétences professionnelles',
                ],
                startY: 540,
            },
        ];

        let optionY = 0;
        sections.forEach(({ title, options, startY }) => {
            doc.setFont(undefined, 'bold');
            doc.text(title, 40, startY);
            doc.setFont(undefined, 'normal');
            optionY = startY + 20;

            options.forEach(opt => {
                doc.text(opt, 50, optionY);
                doc.text('Pas du tout   Peu   Moyen   Tout à fait', 400, optionY);
                optionY += 20;
            });
        });

        // ---- SIGNATURE ----
        doc.text('Fait à:', 40, optionY + 30);
        doc.text('Le:', 200, optionY + 30);
        doc.text('Signature du bénéficiaire:', 40, optionY + 60);

        doc.save('formulaire_f4.pdf');
    };

    return (
        <Button onClick={generatePDF} className="mt-4">
            Générer PDF F4
        </Button>
    );
}