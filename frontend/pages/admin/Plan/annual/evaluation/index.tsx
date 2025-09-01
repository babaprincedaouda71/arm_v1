// pages/admin/Plan/annual/evaluation/AddOCFPage.tsx - Modifications pour l'édition
import ModalButton from '@/components/ModalButton'
import SearchFilterAddBar from '@/components/SearchFilterAddBar'
import StatusRenderer from '@/components/Tables/StatusRenderer'
import Table from '@/components/Tables/Table/index'
import {GroupeEvaluationProps} from '@/types/dataTypes'
import React, {useCallback, useMemo, useState} from 'react'
import EvaluationForm from './add'
import DetailEvaluation from './detail'
import {handleSort} from '@/utils/sortUtils'
import {statusConfig} from '@/config/tableConfig'
import useTable from '@/hooks/useTable'
import DynamicActionsRenderer from '@/components/Tables/DynamicActionsRenderer'
import useSWR from "swr";
import {GROUPE_EVALUATION_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import {useRouter} from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";

const TABLE_HEADERS = [
    "Label",
    "Type",
    "Date de création",
    "Statut",
    "Actions",
];
const TABLE_KEYS = [
    "label",
    "type",
    "creationDate",
    "status",
    "actions",
];

// Définition des actions selon le statut
const getActionsForStatus = (status: string): string[] => {
    switch (status) {
        case "Brouillon":
            return ["view", "edit", "delete"];
        case "Publiée":
            return ["view", "delete"];
        case "Terminée":
            return ["view"];
        default:
            return ["view"];
    }
};

const RECORDS_PER_PAGE = 5;

const Evaluation = () => {
    const router = useRouter();
    const {trainingId, groupId, evaluationId} = router.query; // 🆕 Ajout d'evaluationId

    // Récupération des données via SWR
    const {
        data: groupeEvaluationData,
        error,
        mutate: mutateEvaluations
    } = useSWR<GroupeEvaluationProps[]>(GROUPE_EVALUATION_URLS.mutate + `/${trainingId}/${groupId}`, fetcher);

    // Mémorisation des données
    const memorizedData = useMemo(() => groupeEvaluationData || [], [groupeEvaluationData]);
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
    } = useTable(
        memorizedData,
        TABLE_HEADERS,
        TABLE_KEYS,
        RECORDS_PER_PAGE
    )

    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GroupeEvaluationProps | null>(null);
    const [editingItem, setEditingItem] = useState<GroupeEvaluationProps | null>(null); // 🆕 État pour l'édition

    // 🆕 Effet pour gérer l'édition via URL
    React.useEffect(() => {
        if (evaluationId && memorizedData.length > 0) {
            const itemToEdit = memorizedData.find(item => item.id === evaluationId);
            if (itemToEdit) {
                setEditingItem(itemToEdit);
                setShowForm(true);
                setShowDetails(false);
            }
        }
    }, [evaluationId, memorizedData]);

    const handleLabelClick = (row: GroupeEvaluationProps) => {
        setSelectedItem(row);
        setShowDetails(true);
        setShowForm(false);
        setEditingItem(null); // 🆕 Reset editing
    };

    const handleViewAction = (row: GroupeEvaluationProps) => {
        setSelectedItem(row);
        setShowDetails(true);
        setShowForm(false);
        setEditingItem(null); // 🆕 Reset editing
    };

    const getActionDisabledState = useCallback((actionKey: string, row: GroupeEvaluationProps): boolean => {
        const allowedActions = getActionsForStatus(row.status);
        return !allowedActions.includes(actionKey);
    }, []);

    // 🆕 Fonction pour gérer l'édition
    const handleEditAction = useCallback((row: GroupeEvaluationProps) => {
        console.log("Édition de l'évaluation:", row);

        // Vérifier si l'édition est autorisée
        if (row.status !== "Brouillon") {
            console.log("L'édition n'est pas autorisée pour ce statut:", row.status);
            return;
        }

        // Mettre à jour l'URL avec l'ID de l'évaluation
        router.push({
            pathname: router.pathname,
            query: {
                ...router.query,
                evaluationId: row.id
            }
        }, undefined, { shallow: true });

        setEditingItem(row);
        setShowForm(true);
        setShowDetails(false);
        setSelectedItem(null);
    }, [router]);

    const handleDeleteSuccess = useCallback((deletedId: number) => {
        console.log("Évaluation supprimée avec succès:", deletedId);
        mutateEvaluations();
    }, [mutateEvaluations]);

    const renderers = {
        label: (value: string, row: GroupeEvaluationProps) => (
            <button
                onClick={() => handleLabelClick(row)}
                className="hover:text-primary hover:underline"
            >
                {value}
            </button>
        ),
        status: (value: string, row: GroupeEvaluationProps) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                statusOptions={["Brouillon", "Publiée"]}
                apiUrl={GROUPE_EVALUATION_URLS.updateStatus}
                mutateUrl={GROUPE_EVALUATION_URLS.mutate + `/${trainingId}/${groupId}`}
                row={row}
            />
        ),
        actions: (_: any, row: GroupeEvaluationProps) => {
            const allowedActions = getActionsForStatus(row.status);

            return (
                <DynamicActionsRenderer
                    actions={allowedActions}
                    row={row}
                    customViewHandler={() => handleViewAction(row)}
                    customEditHandler={handleEditAction}
                    getActionDisabledState={getActionDisabledState}
                    deleteUrl={GROUPE_EVALUATION_URLS.delete}
                    mutateUrl={GROUPE_EVALUATION_URLS.mutate + `/${trainingId}/${groupId}`}
                    onDeleteSuccess={handleDeleteSuccess}
                    confirmMessage={(row) => {
                        if (!row) {
                            return "Êtes-vous sûr de vouloir supprimer cette évaluation ?";
                        }
                        return `Êtes-vous sûr de vouloir supprimer l'évaluation "${row.label || 'sans nom'}" ?`;
                    }}
                />
            );
        }
    };

    const handleAdd = () => {
        setEditingItem(null); // 🆕 Reset editing
        setShowForm(true);

        // 🆕 Nettoyer l'URL des paramètres d'édition
        const {evaluationId, ...cleanQuery} = router.query;
        router.push({
            pathname: router.pathname,
            query: cleanQuery
        }, undefined, { shallow: true });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingItem(null); // 🆕 Reset editing

        // 🆕 Nettoyer l'URL des paramètres d'édition
        const {evaluationId, ...cleanQuery} = router.query;
        router.push({
            pathname: router.pathname,
            query: cleanQuery
        }, undefined, { shallow: true });
    };

    const handleBackToList = () => {
        setShowDetails(false);
        setSelectedItem(null);
        setEditingItem(null); // 🆕 Reset editing

        // 🆕 Nettoyer l'URL des paramètres d'édition
        const {evaluationId, ...cleanQuery} = router.query;
        router.push({
            pathname: router.pathname,
            query: cleanQuery
        }, undefined, { shallow: true });
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingItem(null); // 🆕 Reset editing
        mutateEvaluations();

        // 🆕 Nettoyer l'URL des paramètres d'édition
        const {evaluationId, ...cleanQuery} = router.query;
        router.push({
            pathname: router.pathname,
            query: cleanQuery
        }, undefined, { shallow: true });
    };

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="mx-auto bg-white font-title rounded-lg px-6 pb-2 pt-6">
                {!showForm ? !showDetails ? (
                    <>
                        <div className="flex items-start gap-2 md:gap-8 mt-4">
                            <SearchFilterAddBar
                                isLeftButtonVisible={false}
                                isFiltersVisible={false}
                                isRightButtonVisible={true}
                                leftTextButton="Filtrer les colonnes"
                                rightTextButton="Nouvelle"
                                onRightButtonClick={handleAdd}
                                filters={[]}
                                placeholderText={"Recherche..."}
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
                            isPagination={false}
                            totalRecords={totalRecords}
                            loading={false}
                            onAdd={handleAdd}
                            visibleColumns={visibleColumns}
                            renderers={renderers}
                        />
                    </>
                ) : (
                    <DetailEvaluation
                        groupeEvaluationId={selectedItem?.id}
                        onBack={handleBackToList}
                    />
                ) : (
                    <EvaluationForm
                        onClick={handleCancel}
                        onSuccess={handleFormSuccess}
                        editingEvaluation={editingItem} // 🆕 Passer l'évaluation à éditer
                    />
                )}
            </div>
        </ProtectedRoute>
    )
}

export default Evaluation