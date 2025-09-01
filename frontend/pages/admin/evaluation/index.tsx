import React, {useMemo, useState} from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";
import EvaluationSection from "@/components/Evaluation/EvaluationSection";
import {fetcher} from "@/services/api";
import useSWR, {mutate} from "swr";
import {EvaluationsByTypeProps, EvaluationsProps} from "@/types/dataTypes";
import {QUESTIONNAIRE_URLS} from "@/config/urls";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";

interface FixedSectionStructureItem {
    id: string;
    type: string;
    questionnaires: EvaluationsProps[]; // <-- Remplace 'any[]' par le type correct, ex: EvaluationsProps[]
}

const fixedEvaluationSectionsStructure: FixedSectionStructureItem[] = [
    {
        id: "1",
        type: "Récensement des besoins de formation",
        questionnaires: []
    },
    {
        id: "2",
        type: "Évaluation des participants avant la formation",
        questionnaires: []
    },
    {
        id: "3",
        type: "Évaluation immédiate pour les apprenants",
        questionnaires: []
    },
    {
        id: "4",
        type: "Évaluation retardée pour les apprenants",
        questionnaires: []
    },
    {
        id: "5",
        type: "Questionnaire pour les responsables des apprenants",
        questionnaires: []
    },
    {
        id: "6",
        type: "Questionnaire pour les formateurs",
        questionnaires: []
    },
    {
        id: "7",
        type: "Formulaire F4",
        questionnaires: []
    }
]

const EvaluationListPage = () => {
    // États pour le modal de suppression
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [questionnaireToDeleteId, setQuestionnaireToDeleteId] = useState<string | null>(null);
    const [questionnaireToDeleteTitle, setQuestionnaireToDeleteTitle] = useState<string | null>(null);
    const {
        data: evaluationsData,
        error,
        isLoading,
    } = useSWR<EvaluationsByTypeProps[]>(QUESTIONNAIRE_URLS.fetchAllByType, fetcher)
    const [openSectionIndex, setOpenSectionIndex] = useState(null);

    console.log(evaluationsData);

    const handleSectionToggle = (index) => {
        setOpenSectionIndex(openSectionIndex === index ? null : index);
    };

    const handleUpdateEvaluation = async (updatedEvaluation: EvaluationsProps) => {
        console.log(updatedEvaluation)
        try {
            // Supposons que tu as une API pour mettre à jour une évaluation
            await fetch(`${QUESTIONNAIRE_URLS.updateStatus}/${updatedEvaluation.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionnaireType: updatedEvaluation.type,
                    isDefault: updatedEvaluation.isDefault,
                }),
            });
            // Revalider les données SWR pour refléter la mise à jour
            mutate(QUESTIONNAIRE_URLS.fetchAllByType);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'évaluation :", error);
            // Gérer l'erreur ici (afficher un message à l'utilisateur, etc.)
        }
    };

    // Modifié pour ouvrir le modal au lieu de supprimer directement
    const handleDeleteEvaluationRequest = (questionnaireId: string, questionnaireTitle: string) => {
        setQuestionnaireToDeleteId(questionnaireId);
        setQuestionnaireToDeleteTitle(questionnaireTitle); // Stocker le titre pour l'afficher dans le modal
        setIsDeleteModalOpen(true);
    };

    // Fonction appelée lors de la confirmation dans le modal
    const confirmActualDelete = async () => {
        if (!questionnaireToDeleteId) return;

        try {
            // IMPORTANT: Vérifiez et ajustez cette URL
            const deleteUrl = `${QUESTIONNAIRE_URLS.delete}/${questionnaireToDeleteId}`;

            await fetch(deleteUrl, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            mutate(QUESTIONNAIRE_URLS.fetchAllByType);
            console.log(`Questionnaire ${questionnaireToDeleteId} supprimé avec succès.`);
            // Optionnel : Afficher une notification de succès (toast, etc.)
        } catch (err) { // Renommé error en err pour éviter conflit de portée si error est déjà défini plus haut
            console.error("Erreur lors de la suppression du questionnaire :", err);
            alert("Une erreur est survenue lors de la suppression du questionnaire."); // Ou une notification d'erreur
        } finally {
            setIsDeleteModalOpen(false);
            setQuestionnaireToDeleteId(null);
            setQuestionnaireToDeleteTitle(null);
        }
    };

    // Fonction pour fermer le modal
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setQuestionnaireToDeleteId(null);
        setQuestionnaireToDeleteTitle(null);
    };

    // Utilise useMemo pour fusionner les données du backend avec la structure fixe
    const sectionsToDisplay = useMemo(() => {
        // Commence avec la structure fixe
        const sections = JSON.parse(JSON.stringify(fixedEvaluationSectionsStructure)); // Clone pour ne pas modifier l'original

        if (evaluationsData) {
            // Crée une carte des questionnaires par type à partir des données du backend
            const backendEvaluationsMap = new Map<string, EvaluationsProps[]>();
            evaluationsData.forEach(typeData => {
                if (typeData.type) {
                    backendEvaluationsMap.set(typeData.type, typeData.questionnaires || []);
                }
            });

            // Parcours la structure fixe et ajoute les questionnaires du backend correspondants
            sections.forEach(section => {
                const questionnairesForType = backendEvaluationsMap.get(section.type);
                if (questionnairesForType) {
                    section.questionnaires = questionnairesForType;
                }
                // Si aucun questionnaire trouvé pour ce type, section.evaluations reste [] (grâce au clone initial)
            });
        }

        return sections;

    }, [evaluationsData]); // Recalcule uniquement si evaluationsData change


    // Gestion des états de chargement et d'erreur
    if (isLoading) {
        return <div className="p-6 text-center">Chargement des questionnaires...</div>;
    }

    if (error) {
        console.error("Erreur lors du chargement des questionnaires :", error);
        // Tu pourrais afficher un message d'erreur plus détaillé si 'error' contient des infos utiles
        return <div className="p-6 text-center text-red-500">Erreur lors du chargement des questionnaires.</div>;
    }

    // Afficher un message si aucune donnée n'est disponible après chargement
    if (!sectionsToDisplay || sectionsToDisplay.length === 0) {
        return <div className="p-6 text-center">Aucun type de questionnaire défini ou chargé.</div>;
    }


    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="p-6 mx-auto bg-white rounded-lg flex flex-col">
                {sectionsToDisplay.map((section, index) => (
                    <EvaluationSection
                        key={section.id}
                        type={section.type}
                        evaluations={section.questionnaires}
                        isOpen={openSectionIndex === index}
                        onToggle={() => handleSectionToggle(index)}
                        questionnaireTypeForNewModel={section.type}
                        onUpdateEvaluation={handleUpdateEvaluation}
                        onDeleteEvaluation={(id, title) => handleDeleteEvaluationRequest(id, title)}
                    />
                ))}
            </div>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={cancelDelete}
                onConfirm={confirmActualDelete}
                title="Confirmation de suppression"
                message={`Êtes-vous sûr de vouloir supprimer le questionnaire :\n"${questionnaireToDeleteTitle || ''}" ?\n\nCette action est irréversible.`}
            />
        </ProtectedRoute>
    );
};

export default EvaluationListPage;