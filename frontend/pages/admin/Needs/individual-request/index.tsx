import React, {useMemo} from 'react'
import {NeedsIndividualRequestProps, StrategicAxesNeedsProps} from '@/types/dataTypes';
import DashboardBar from '@/components/DashbordBar';
import ModalButton from '@/components/ModalButton';
import SearchFilterAddBar from '@/components/SearchFilterAddBar';
import Table from '@/components/Tables/Table/index';
import {handleSort} from '@/utils/sortUtils';
import StatusRenderer from '@/components/Tables/StatusRenderer';
import {statusConfig} from '@/config/tableConfig';
import useTable from '@/hooks/useTable';
import DynamicActionsRenderer from '@/components/Tables/DynamicActionsRenderer';
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import useSWR from "swr";
import {NEED_INDIVIDUAL_REQUESTS_URLS, NEEDS_STRATEGIC_AXES_URLS, NEEDS_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";

const TABLE_HEADERS = [
    "Exercice",
    "Domaine",
    "Thème",
    "Site",
    "Département",
    "Date",
    "Demandeur",
    "Validé par",
    "Statut",
    "Actions",
];
const TABLE_KEYS = [
    "year",
    "domain",
    "theme",
    "site",
    "department",
    "date",
    "requester",
    "approver",
    "status",
    "actions",
];

const ACTIONS_TO_SHOW = ["view", "edit", "delete"];
const RECORDS_PER_PAGE = 4;

const NeedsIndividualRequest = () => {
    const {navigateTo, buildRoleBasedPath} = useRoleBasedNavigation()
    const {data: needsIndividualRequestData} = useSWR<NeedsIndividualRequestProps[]>(NEED_INDIVIDUAL_REQUESTS_URLS.mutate, fetcher)
    const memorizedNeedIndividualRequestData = useMemo(() => needsIndividualRequestData || [], [needsIndividualRequestData]);
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
    } = useTable(memorizedNeedIndividualRequestData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const renderers = {
        theme: (value: string, row: NeedsIndividualRequestProps) => (
            <span
                className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline font-medium"
                onClick={() => {
                    const viewUrl = buildRoleBasedPath(`${NEEDS_STRATEGIC_AXES_URLS.view}`);
                    navigateTo(viewUrl, { query: { id: row.id } });
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
                statusOptions={["Brouillon", "Validé"]}
                apiUrl={NEEDS_URLS.updateStatus}
                mutateUrl={NEED_INDIVIDUAL_REQUESTS_URLS.mutate}
            />
        ),
        actions: (_: any, row: any) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={NEEDS_URLS.delete}
                mutateUrl={NEED_INDIVIDUAL_REQUESTS_URLS.mutate}
                editUrl={NEED_INDIVIDUAL_REQUESTS_URLS.editPage}
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

    const handleAdd = () => {
        navigateTo("/Needs/individual-request/add")
    }

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <DashboardBar/>
            <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-xl pt-6">
                <div className="flex items-start gap-2 md:gap-8">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={true}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouvelle"
                        onRightButtonClick={handleAdd}
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
        </ProtectedRoute>
    )
}

export default NeedsIndividualRequest