import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import Table from "@/components/Tables/Table/index";
import {handleSort} from "@/utils/sortUtils";
import React, {useMemo} from "react";
import useTable from "@/hooks/useTable";
import {StrategicAxesNeedsProps} from "@/types/dataTypes";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {statusConfig} from "@/config/tableConfig";
import DashboardBar from "@/components/DashbordBar";
import useSWR from "swr";
import {NEEDS_STRATEGIC_AXES_URLS, NEEDS_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

interface StrategicAxesDashboardProps {
    handleDuplicateGroup: (group: any) => void;
    handleAddGroup: (need: any) => void;
    handleEditGroup: (need: any, groupId: number) => void;
}

// Table Headers and Keys
const TABLE_HEADERS = [
    "Domaine",
    "Thème",
    "Axe",
    "Source",
    "Nbr groupe",
    "Site",
    "Département",
    "Date",
    "Statut",
    "Actions",
];

const TABLE_KEYS = [
    "domain",
    "theme",
    "axe",
    "source",
    "nbrGroup",
    "site",
    "department",
    "creationDate",
    "status",
    "actions",
];

const ACTIONS_TO_SHOW = ["view", "edit", "delete"];
const RECORDS_PER_PAGE = 4;

const StrategicAxesDashboard = ({
                                    handleDuplicateGroup,
                                    handleAddGroup,
                                    handleEditGroup
                                }: StrategicAxesDashboardProps) => {
    const {navigateTo, buildRoleBasedPath} = useRoleBasedNavigation()
    const {
        data: strategicAxeNeedData,
    } = useSWR<StrategicAxesNeedsProps[]>(NEEDS_STRATEGIC_AXES_URLS.mutate, fetcher);
    const memorizeStrategicAxeNeedData = useMemo(() => strategicAxeNeedData || [], [strategicAxeNeedData]);

    const defaultVisibleColumns = [
        "Domaine",
        "Thème",
        "Axe",
        "Nbr groupe",
        "Date",
        "Statut",
        "Actions",
    ];
    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalPages,
        totalRecords,
        sortableColumns,
        paginatedData,
    } = useTable(
        memorizeStrategicAxeNeedData,
        TABLE_HEADERS,
        TABLE_KEYS,
        RECORDS_PER_PAGE,
        defaultVisibleColumns,
    )

    const renderers = {
        theme: (value: string, row: StrategicAxesNeedsProps) => (
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
        actions: (_: any, row: StrategicAxesNeedsProps) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={NEEDS_URLS.delete}
                mutateUrl={NEEDS_STRATEGIC_AXES_URLS.mutate}
                editUrl={NEEDS_STRATEGIC_AXES_URLS.editPage}
                viewUrl={buildRoleBasedPath(`${NEEDS_STRATEGIC_AXES_URLS.view}`)}
                isEditDisabled={(item) => item.status === "Validé"}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer le besoin ${row.theme}`}
                // 🆕 Fonction unifiée pour désactiver les actions selon le statut
                getActionDisabledState={(actionKey: string, row: StrategicAxesNeedsProps) => {
                    // Désactiver l'édition ET la suppression si le statut est "Validé"
                    return (actionKey === 'edit' || actionKey === 'delete') && row.status === "Validé";

                }}
            />
        ),
        status: (value: string, row: StrategicAxesNeedsProps) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                row={row}
                statusOptions={["Brouillon", "Validé"]}
                apiUrl={NEEDS_URLS.updateStatus}
                mutateUrl={NEEDS_STRATEGIC_AXES_URLS.mutate}
            />
        )
    };

    const handleAddAxe = () => {
        navigateTo("/Needs/strategic-axes/manual-entry");
    };

    return (
        <div>
            <DashboardBar/>
            <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-xl pt-6">
                <div className="flex items-start gap-2 md:gap-8">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={true}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouvel"
                        onRightButtonClick={handleAddAxe}
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
                    expandable={true}
                    onDuplicate={handleDuplicateGroup}
                    onGroupAdd={handleAddGroup}
                    onGroupEdit={handleEditGroup}
                />
            </div>
        </div>
    )
}
export default StrategicAxesDashboard;