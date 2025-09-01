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
import useSWR from "swr";
import {NEEDS_STRATEGIC_AXES_URLS, NEEDS_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

interface StrategicAxesCampaignProps {
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

const StrategicAxesCampaign = ({handleDuplicateGroup, handleAddGroup, handleEditGroup}: StrategicAxesCampaignProps) => {
    const {navigateTo, buildRoleBasedPath} = useRoleBasedNavigation()
    const {
        data: strategicAxeNeedData,
    } = useSWR<StrategicAxesNeedsProps[]>(NEEDS_STRATEGIC_AXES_URLS.mutate, fetcher);
    const memorizeStrategicAxeNeedData = useMemo(() => strategicAxeNeedData || [], [strategicAxeNeedData]);
    console.log("memorizeStrategicAxeNeedData", memorizeStrategicAxeNeedData);

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
        actions: (_: any, row: StrategicAxesNeedsProps) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={NEEDS_URLS.delete}
                mutateUrl={NEEDS_STRATEGIC_AXES_URLS.mutate}
                editUrl={NEEDS_STRATEGIC_AXES_URLS.editPage}
                viewUrl={buildRoleBasedPath(`${NEEDS_STRATEGIC_AXES_URLS.view}`)}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer le besoin ${row.theme}`}
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
        <div className='mx-auto bg-white font-title rounded-lg px-6 pb-2 pt-6'>
            <div className="flex items-start gap-2 md:gap-8 mt-4">
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

            {/* Section : Tableau des données */}
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

            {/* Section : Bouton d'action */}
            <div className="text-right text-xs md:text-sm lg:text-base">
                <button
                    type="button"
                    className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                    onClick={() => alert("MyEvaluationsComponent ajoutée avec succès")}
                >
                    Enregistrer
                </button>
            </div>
        </div>
    )
}
export default StrategicAxesCampaign;