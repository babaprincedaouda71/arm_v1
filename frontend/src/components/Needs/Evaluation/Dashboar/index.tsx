import React, {useMemo} from "react";
import DashboardBar from "../../../DashbordBar";
import SearchFilterAddBar from "../../../SearchFilterAddBar";
import ModalButton from "../../../ModalButton";
import Table from "../../../Tables/Table/index";
import {NeedsEvaluationProps} from "@/types/dataTypes";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {statusConfig} from "@/config/tableConfig";
import {handleSort} from "@/utils/sortUtils";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import useTable from "@/hooks/useTable";
import useSWR from "swr";
import {NEED_EVALUATION_URLS, NEEDS_STRATEGIC_AXES_URLS, NEEDS_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

const TABLE_HEADERS = [
    "Domaine",
    "Thème",
    "Questionnaire",
    "Priorité",
    "Validé par",
    "Statut",
    "Actions",
];
const TABLE_KEYS = [
    "domain",
    "theme",
    "questionnaire",
    "priority",
    "validatedBy",
    "status",
    "actions",
];

const ACTIONS_TO_SHOW = ["view", "edit", "delete"];
const RECORDS_PER_PAGE = 4;

const NeedsEvaluationDashboard = () => {
    const {navigateTo, buildRoleBasedPath} = useRoleBasedNavigation()
    const {data: needEvaluationData} = useSWR<NeedsEvaluationProps[]>(NEED_EVALUATION_URLS.mutate, fetcher);

    const memorizedNeedEvaluationData = useMemo(() => needEvaluationData || [], [needEvaluationData]);

    console.log(memorizedNeedEvaluationData)
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
        memorizedNeedEvaluationData,
        TABLE_HEADERS,
        TABLE_KEYS,
        RECORDS_PER_PAGE)

    const renderers = {
        theme: (value: string, row: NeedsEvaluationProps) => (
            <span
                className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline font-medium"
                onClick={() => {
                    const viewUrl = buildRoleBasedPath(`${NEEDS_STRATEGIC_AXES_URLS.view}`);
                    navigateTo(viewUrl, {query: {id: row.id}});
                }}
            >
            {value}
        </span>
        ),
        status: (value: string, row: any) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                row={row}
                statusOptions={['Brouillon', 'Validé']}
                apiUrl={NEEDS_URLS.updateStatus}
                mutateUrl={NEED_EVALUATION_URLS.mutate}
            />
        ),
        actions: (_: any, row: any) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={NEEDS_URLS.delete}
                mutateUrl={NEED_EVALUATION_URLS.mutate}
                editUrl={NEED_EVALUATION_URLS.editPage}
                viewUrl={buildRoleBasedPath(`${NEEDS_STRATEGIC_AXES_URLS.view}`)}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer le besoin ${row.theme}`}
                // 🆕 Fonction unifiée pour désactiver les actions selon le statut
                getActionDisabledState={(actionKey: string, row: any) => {
                    // Désactiver l'édition ET la suppression si le statut est "Validé"
                    return (actionKey === 'edit' || actionKey === 'delete') && row.status === "Validé";

                }}
            />
        )
    };

    return (
        <div>
            <DashboardBar/>
            <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-xl pt-6">
                <div className="flex items-start gap-2 md:gap-8">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={false}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouvelle"
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
                    onAdd={() => console.log("Nouveau")}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />
            </div>
        </div>
    );
};

export default NeedsEvaluationDashboard;