import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import Table from "@/components/Tables/Table/index";
import {handleSort} from "@/utils/sortUtils";
import React, {useMemo, useRef, useState} from "react";
import useSWR, {mutate} from "swr";
import {NeedsEvaluationCampaignDetailsProps, UserEvaluationProps} from "@/types/dataTypes";
import {CAMPAIGN_URLS, USER_RESPONSES_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import useTable from "@/hooks/useTable";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {statusConfig} from "@/config/tableConfig";
import router from "next/router";
import QuestionResponseCard from "@/components/ui/QuestionResponseCard";
import EyeFileIcon from "@/components/Svgs/EyeFileIcon";
import DeleteIcon from "@/components/Svgs/DeleteIcon";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";

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

// Table Headers and Keys
const TABLE_HEADERS = [
    "Site",
    "Département",
    "Nom",
    "Prénoms",
    "Groupe",
    "État",
    "Validé par",
    "Date de réponse",
    "Actions",
];
const TABLE_KEYS = [
    "site",
    "department",
    "lastName",
    "firstName",
    "role",
    "status",
    "manager",
    "responseDate",
    "actions",
];

const ACTIONS_TO_SHOW = ["view", "delete"];
const RECORDS_PER_PAGE = 4;

const CampaignEvaluationDetails = () => {
    const {navigateTo} = useRoleBasedNavigation()
    const {id} = router.query;
    const {data: campaignEvaluationData} = useSWR<NeedsEvaluationCampaignDetailsProps[]>(`${CAMPAIGN_URLS.campaignEvaluationDetail}/${id}`, fetcher);
    const memoizedUserData = useMemo(() =>
        campaignEvaluationData || [], [campaignEvaluationData]);

    console.log(memoizedUserData)

    /****************************/
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'respond' | null>(null);
    const [loadingResponses, setLoadingResponses] = useState(false);
    const [errorLoadingResponses, setErrorLoadingResponses] = useState<string | null>(null);
    const [modalResponses, setModalResponses] = useState<UserResponse[]>([]);
    const questionCardRef = useRef<any>(null); // Cette ref sera passée à QuestionResponseCard
    const [evaluationData, setEvaluationData] = useState<UserEvaluationProps>();

    const handleOpenModal = (mode: 'view' | 'respond', questionnaireId: string, participantId: number) => {
        setIsModalOpen(true);
        setModalMode(mode);
        if (mode === 'view') {
            fetchResponses(questionnaireId, participantId);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalMode(null);
        setModalResponses([]); // Réinitialiser les réponses lors de la fermeture
        setErrorLoadingResponses(null); // Réinitialiser les erreurs
    };

    const fetchResponses = async (questionnaireId: string, participantId: number) => {
        console.log("Fetching responses...");
        setLoadingResponses(true);
        setErrorLoadingResponses(null);
        try {
            const response = await fetch(`${USER_RESPONSES_URLS.fetchUserQuestionsResponses}/${participantId}/${questionnaireId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: UserEvaluationProps = await response.json();
            setEvaluationData(data);
        } catch (error: any) {
            console.error("Erreur lors de la récupération des réponses :", error);
            setErrorLoadingResponses("Erreur lors du chargement des réponses.");
        } finally {
            setLoadingResponses(false);
        }
    };
    /**********************************/
    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalRecords,
        totalPages,
        sortableColumns,
        paginatedData,
    } = useTable(memoizedUserData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ participantId: number; questionnaireId: string } | null>(null);

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };
    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            await handelDeleteUserResponses(itemToDelete.participantId, itemToDelete.questionnaireId);
            handleCloseConfirmModal(); // Ferme le modal
            // Optionnel : rafraîchir les données ou afficher une notification de succès
        }
    };

    const handelDeleteUserResponses = async (participantId: number, questionnaireId: string) => {
        try {
            const response = await fetch(`${CAMPAIGN_URLS.deleteUserResponses}/${participantId}/${questionnaireId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const swrKey = `${CAMPAIGN_URLS.campaignEvaluationDetail}/${id}`;
            await mutate(swrKey);
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const renderers = {
        status: (value: string, row: NeedsEvaluationCampaignDetailsProps) => (
            <StatusRenderer
                value={value}
                row={row}
                groupeConfig={statusConfig}
            />
        ),
        actions: (_: any, row: NeedsEvaluationCampaignDetailsProps) => {
            return (
                <div className={"flex gap-4 items-center justify-center"}>
                    <div onClick={() => handleOpenModal("view", row.questionnaireId, row.participantId)}>
                        <EyeFileIcon/>
                    </div>
                    <div onClick={() => {
                        setItemToDelete({participantId: row.participantId, questionnaireId: row.questionnaireId});
                        openConfirmModal(); // Ouvre le modal de confirmation
                    }}>
                        <DeleteIcon/>
                    </div>
                </div>
            );
        }
    };

    const handleBackToList = () => {
        navigateTo("/Needs/evaluation?tab=campaign");
    }
    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-xl pt-6">
                <div
                    className="relative pl-2 flex items-center mb-4">
                    {/* Bouton Retour à la liste alignée à gauche */}
                    <button
                        onClick={handleBackToList}
                        className="text-blue-500 border-2 rounded-xl p-2 hover:underline focus:outline-none"
                    >
                        Retour à la liste
                    </button>

                    <div className="absolute inset-x-0 flex justify-center items-center pointer-events-none">
                        <h1 className="text-2xl font-semibold text-gray-800 pointer-events-auto">
                            {""}
                        </h1>
                    </div>
                </div>
                <div className="flex items-start gap-2 md:gap-8">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={false}
                        leftTextButton="Filtrer les colonnes"
                        filters={[]}
                        placeholderText={"Recherche de besoins"}
                    />
                    {/* Bouton pour afficher/masquer la fenêtre modale */}
                    <ModalButton
                        headers={TABLE_HEADERS}
                        visibleColumns={visibleColumns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                </div>

                {/* Tableau */}
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
                    loading={false}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />
            </div>
            <QuestionResponseCard
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={evaluationData?.title || "Détail de l'évaluation"}
                category={evaluationData?.type || "Évaluation"}
                description={evaluationData?.description || ""}
                questions={evaluationData?.questions}
                progress={evaluationData?.progress || 0}
                initialResponses={evaluationData?.responses}
                mode={modalMode}
                questionCardRef={questionCardRef}
                loadingResponses={loadingResponses}
                errorLoadingResponses={errorLoadingResponses}
            />

            {/* Modal de confirmation d'envoi reste ici */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseConfirmModal}
                onConfirm={handleConfirmDelete}
                title="Confirmation de suppression"
                message="Êtes-vous sûr de vouloir supprimer les réponses?"
            />
        </ProtectedRoute>
    )
}
export default CampaignEvaluationDetails