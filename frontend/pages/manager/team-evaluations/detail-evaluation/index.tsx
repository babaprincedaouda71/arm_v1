import {useAuth, UserRole} from "@/contexts/AuthContext";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import Table from "@/components/Tables/Table/index";
import {handleSort} from "@/utils/sortUtils";
import ProtectedRoute from "@/components/ProtectedRoute";
import React, {useMemo, useRef, useState} from "react";
import useTable from "@/hooks/useTable";
import {TeamEvaluationDetailsForUserProps, TeamEvaluationDetailsProps} from "@/types/dataTypes";
import ProgressBar from "@/components/ProgressBar";
import {TEAM_EVALUATIONS_URLS, USER_RESPONSES_URLS} from "@/config/urls";
import useSWR from "swr";
import {fetcher} from "@/services/api";
import TeamEvaluationDetails from "@/components/TeamEvaluationDetail";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {statusConfig} from "@/config/tableConfig";
import {useRouter} from "next/router";
import {Edit, Eye} from "lucide-react";
import QuestionResponseCard from "@/components/ui/QuestionResponseCard";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";

interface UserResponse {
    id?: string;
    companyId?: number;
    userId: number;
    questionnaireId: string;
    questionId: string;
    responseType: string;
    textResponse?: string | null;
    commentResponse?: string | null;
    scoreResponse?: number | null;
    ratingResponse?: number | null;
    multipleChoiceResponse?: string[] | null;
    singleChoiceResponse?: string | null;
    singleLevelChoiceResponse?: string | null;
    status?: string;
    isSentToManger?: boolean;
    progression?: number;
    startDate?: string;
    lastModifiedDate?: string;
    campaignEvaluationId?: string | null;
}

const TABLE_HEADERS = [
    "Nom",
    "Rôle",
    "État",
    "Progression",
    "Actions",
];
const TABLE_KEYS = [
    "name",
    "position",
    "status",
    "progress",
    "actions",
];

const RECORDS_PER_PAGE = 4;

const DetailEvaluation = () => {
    const router = useRouter()
    const {user} = useAuth()
    const {id} = router.query;
    const {navigateTo} = useRoleBasedNavigation();
    const {
        data: evaluationData,
        mutate: mutateEvaluationDetails
    } = useSWR<TeamEvaluationDetailsProps>(`${TEAM_EVALUATIONS_URLS.getDetails}/${id}/${user?.id}`, fetcher);
    const participants: TeamEvaluationDetailsForUserProps[] | undefined = evaluationData?.participants;
    console.log(evaluationData)
    console.log(evaluationData?.participants)
    const memoizedUserData = useMemo(() =>
        participants || [], [participants]);

    const isSendButtonActive = useMemo(() => {
        if (!memoizedUserData?.length) return false;

        // 1. Vérifie que tous ont 100% de progression
        const allFinished = memoizedUserData.every(p => p.progress === 100);
        // 2. Vérifie que les non-"Employé" ont bien isSentToManager=true
        const allNonEmployeesSent = memoizedUserData.every(p =>
            p.groupe === "Employé" || p.isSentToManager
        );
        // 3. Vérifie que l'évaluation n'a pas déjà été envoyée (isSentToAdmin=false)
        const isEvaluationNotSent = !memoizedUserData.every(p => p.isSentToAdmin);

        return allFinished && allNonEmployeesSent && isEvaluationNotSent;
    }, [memoizedUserData]);

    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalPages,
        totalRecords,
        paginatedData,
        sortableColumns,
    } = useTable(
        memoizedUserData,
        TABLE_HEADERS,
        TABLE_KEYS,
        RECORDS_PER_PAGE,
    );

    /***********************************************/
    const [isSentToAdmin, setIsSentToAdmin] = useState(false); // Supposons que ceci soit initialisé correctement ailleurs ou via fetch

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const openConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };
    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };

    const handleConfirmSendEvaluation = async () => {
        setIsConfirmModalOpen(false);
        const responsesToSend = { // Données pour l'envoi final
            questionnaireId: id,
            userId: user?.id,
            participantIds: evaluationData.participants.map(participant => participant.id),
        }

        try {
            const statusUpdateResponse = await fetch(`${TEAM_EVALUATIONS_URLS.sendEvaluationToAdmin}/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responsesToSend),
            });

            if (!statusUpdateResponse.ok) {
                console.error("Erreur lors de la mise à jour du statut de l'évaluation :", statusUpdateResponse.statusText);
            } else {
                console.log("Statut de l'évaluation mis à jour avec succès.");
                setIsSentToAdmin(true);
                if (evaluationData) {
                    await mutateEvaluationDetails();
                }
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut :", error);
        }
    };
    /***********************************************/

    const renderers = {
        progress: (value: number) => (
            <div>
                <span>{value} %</span>
                <ProgressBar progress={value}/>
            </div>
        ),
        status: (value: string) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
            />
        ),
        actions: (_: string, row: TeamEvaluationDetailsForUserProps) => (
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleOpenModal('view', row)}
                    disabled={!(row.isSentToManager || row.groupe === "Employé")}
                    className={`p-1 rounded ${
                        !(row.isSentToManager || row.groupe === "Employé")
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    title="Voir les réponses"
                >
                    <Eye size={18}/>
                </button>
                {row.groupe === "Employé" && !row.isSentToManager && (
                    <button
                        onClick={() => handleOpenModal('respond', row)}
                        disabled={row.isSentToAdmin}
                        className={`p-1 rounded ${row.isSentToAdmin ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-900 hover:bg-blue-50"}`}
                        title="Répondre/Modifier"
                    >
                        <Edit size={18}/>
                    </button>
                )}
            </div>
        ),
    };

    const handleBackToList = () => {
        navigateTo("/team-evaluations");
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'respond' | null>(null);
    const [currentParticipant, setCurrentParticipant] = useState<TeamEvaluationDetailsForUserProps | null>(null);
    const [participantResponses, setParticipantResponses] = useState<UserResponse[]>([]);
    const [loadingParticipantResponses, setLoadingParticipantResponses] = useState(false);
    const [errorParticipantResponses, setErrorParticipantResponses] = useState<string | null>(null);

    const questionCardRef = useRef<any>(null);

    const fetchParticipantResponses = async (participantUserId: string, questionnaireId: string) => {
        if (!participantUserId || !questionnaireId) {
            console.error("ID du participant ou du questionnaire manquant pour fetchParticipantResponses.");
            setParticipantResponses([]);
            return;
        }
        setLoadingParticipantResponses(true);
        setErrorParticipantResponses(null);
        try {
            const response = await fetch(`${USER_RESPONSES_URLS.fetchUserResponses}/${participantUserId}/${questionnaireId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
            });
            if (!response.ok) {
                if (response.status === 404) {
                    setParticipantResponses([]);
                    console.log("Aucune réponse existante pour ce participant.");
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } else {
                const data: UserResponse[] = await response.json();
                setParticipantResponses(data);
            }
        } catch (error: any) {
            console.error("Erreur lors de la récupération des réponses du participant :", error);
            setErrorParticipantResponses("Erreur lors du chargement des réponses.");
            setParticipantResponses([]);
        } finally {
            setLoadingParticipantResponses(false);
        }
    };

    const handleOpenModal = async (mode: 'view' | 'respond', rowData: TeamEvaluationDetailsForUserProps) => {
        if (!rowData.id || !id) {
            console.error("ID du participant ou de l'évaluation manquant.");
            return;
        }
        setCurrentParticipant(rowData);
        setModalMode(mode);
        setIsModalOpen(true);
        await fetchParticipantResponses(rowData.id, id as string);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalMode(null);
        setCurrentParticipant(null);
        setParticipantResponses([]);
        setErrorParticipantResponses(null);
    };

    const prepareParticipantResponsesToSend = (): Omit<UserResponse, 'id'>[] | null => {
        if (!questionCardRef.current?.getResponses) {
            console.error("QuestionCard ref or getResponses method not available.");
            return null;
        }
        if (!currentParticipant || !id || !user?.id) {
            console.error("Données manquantes pour préparer les réponses (participant, questionnaireId ou userId).");
            return null;
        }

        const responsesFromQuestionCard = questionCardRef.current.getResponses();
        const questionnaireId = id as string;
        const participantUserId = currentParticipant.id;
        const userResponsesToSend: Omit<UserResponse, 'id'>[] = [];
        const responseStartDate = evaluationData?.startDate || new Date().toISOString().split('T')[0];

        evaluationData?.questions?.forEach((question) => {
            const baseResponse: Omit<UserResponse, 'id' | 'textResponse' | 'commentResponse' | 'scoreResponse' | 'ratingResponse' | 'multipleChoiceResponse' | 'singleChoiceResponse' | 'singleLevelChoiceResponse'> = {
                userId: parseInt(participantUserId),
                questionnaireId: questionnaireId,
                questionId: question.id,
                responseType: question.type,
                startDate: responseStartDate,
                lastModifiedDate: new Date().toISOString().split('T')[0],
            };

            switch (question.type) {
                case "Texte":
                    if (responsesFromQuestionCard.textResponses[question.id] !== undefined && responsesFromQuestionCard.textResponses[question.id] !== null) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            textResponse: responsesFromQuestionCard.textResponses[question.id]
                        });
                    }
                    break;
                case "Commentaire":
                    if (responsesFromQuestionCard.commentResponses[question.id] !== undefined && responsesFromQuestionCard.commentResponses[question.id] !== null) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            commentResponse: responsesFromQuestionCard.commentResponses[question.id]
                        });
                    }
                    break;
                case "Score":
                case "MyEvaluationsComponent":
                    if (responsesFromQuestionCard.selectedScores[question.id] !== undefined && responsesFromQuestionCard.selectedScores[question.id] !== null) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            scoreResponse: responsesFromQuestionCard.selectedScores[question.id]
                        });
                    }
                    break;
                case "Notation":
                    if (responsesFromQuestionCard.ratingValues[question.id] !== undefined && responsesFromQuestionCard.ratingValues[question.id] !== null) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            ratingResponse: responsesFromQuestionCard.ratingValues[question.id]
                        });
                    }
                    break;
                case "Réponse multiple":
                    if (responsesFromQuestionCard.multipleChoices[question.id] && responsesFromQuestionCard.multipleChoices[question.id].length > 0) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            multipleChoiceResponse: responsesFromQuestionCard.multipleChoices[question.id]
                        });
                    }
                    break;
                case "Réponse unique":
                    if (responsesFromQuestionCard.singleChoices[question.id]) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            singleChoiceResponse: responsesFromQuestionCard.singleChoices[question.id]
                        });
                    }
                    break;
                default:
                    console.warn(`Type de question non géré pour l'envoi: ${question.type}`);
            }
        });
        return userResponsesToSend;
    };

    const handleSaveParticipantResponses = async () => {
        if (!currentParticipant || !id) return;

        const responsesToSend = prepareParticipantResponsesToSend();
        if (!responsesToSend || responsesToSend.length === 0) {
            console.log("Pas de réponses à enregistrer pour le participant.");
            return;
        }

        console.log("Données à envoyer au backend pour le participant:", responsesToSend);
        try {
            const response = await fetch(`${USER_RESPONSES_URLS.sendUserResponse}/${id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(responsesToSend),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Erreur lors de l'envoi des réponses du participant:", response.status, errorData);
                return;
            }

            console.log("Réponses du participant enregistrées avec succès.");
            await mutateEvaluationDetails();
            handleCloseModal();
        } catch (error) {
            console.error("Erreur lors de l'envoi des réponses du participant :", error);
        }
    };

    return (
        <ProtectedRoute requiredRole={UserRole.Manager}>
            <div className="bg-white rounded-lg pt-6">
                <div
                    className="relative pl-2 flex items-center mb-4"> {/* Conteneur principal pour le positionnement relatif */}
                    {/* Bouton Retour à la liste aligné à gauche */}
                    <button
                        onClick={handleBackToList}
                        className="text-blue-500 border-2 rounded-xl p-2 hover:underline focus:outline-none"
                    >
                        Retour à la liste
                    </button>

                    {/* Conteneur pour centrer le titre */}
                    {/* 'absolute inset-x-0' permet au titre de se centrer par rapport au conteneur parent sans être affecté par le bouton */}
                    {/* 'pointer-events-none' sur le conteneur du titre et 'pointer-events-auto' sur le h1 sont pour s'assurer que le titre ne bloque pas les clics si jamais il se superpose (peu probable ici) */}
                    <div className="absolute inset-x-0 flex justify-center items-center pointer-events-none">
                        <h1 className="text-2xl font-semibold text-gray-800 pointer-events-auto">
                            {evaluationData?.title}
                        </h1>
                    </div>
                </div>

                <TeamEvaluationDetails isSentToAdmin={isSentToAdmin} description={""} training={""}
                                       lastUpdate={""} {...evaluationData}/>

                <h2 className="text-xl font-semibold text-gray-800 mb-4 px-6">Liste des destinataires</h2>

                <div className="flex items-start gap-2 md:gap-8 mt-4">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={true}
                        isRightButtonDisabled={!isSendButtonActive}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Envoyer"
                        isAddPlusSign={false}
                        onRightButtonClick={openConfirmModal}
                        filters={[]}
                        placeholderText={"Recherche d'évaluations"}
                    />
                    <ModalButton
                        headers={TABLE_HEADERS}
                        visibleColumns={visibleColumns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                </div>

                <Table
                    data={paginatedData}
                    keys={TABLE_KEYS}
                    headers={TABLE_HEADERS}
                    sortableCols={sortableColumns}
                    onSort={(column, order) => handleSortData(column, order, handleSort)}
                    isPagination
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage,
                    }}
                    totalRecords={totalRecords}
                    loading={!evaluationData} // Affiche le chargement tant que evaluationData n'est pas chargé
                    onAdd={() => null}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />
            </div>
            {isModalOpen && currentParticipant && evaluationData && (
                <QuestionResponseCard
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={evaluationData.title || "Détail de l'évaluation"}
                    category={evaluationData.type || "Évaluation"}
                    description={evaluationData.description || ""}
                    questions={evaluationData.questions}
                    progress={currentParticipant.progress || 0}
                    initialResponses={participantResponses}
                    mode={modalMode}
                    onSaveDraft={handleSaveParticipantResponses}
                    questionCardRef={questionCardRef}
                    loadingResponses={loadingParticipantResponses}
                    errorLoadingResponses={errorParticipantResponses}
                />
            )}
            {/* Modal de confirmation d'envoi reste ici */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseConfirmModal}
                onConfirm={handleConfirmSendEvaluation}
                title="Confirmation d'envoi"
                message="Êtes-vous sûr de vouloir envoyer cette évaluation ? Une fois envoyée, vous ne pourrez plus la modifier."
            />
        </ProtectedRoute>
    )
}
export default DetailEvaluation;