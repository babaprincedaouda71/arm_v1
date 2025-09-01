import React from 'react'
import Table from '../../../Tables/Table/index';
import ModalButton from '../../../ModalButton';
import SearchFilterAddBar from '../../../SearchFilterAddBar';
import DashboardBar from '../../../DashbordBar';
import {needsInternalCatalogDashboardData} from "../../../../data/needsInternalCatalogDashboardData"
import {NeedsInternalCatalogDashboardProps} from '@/types/dataTypes';
import {handleSort} from '@/utils/sortUtils';
import StatusRenderer from '@/components/Tables/StatusRenderer';
import {statusConfig} from '@/config/tableConfig';
import useTable from '@/hooks/useTable';
import DynamicActionsRenderer from '@/components/Tables/DynamicActionsRenderer';

// Table Headers and Keys
const TABLE_HEADERS = [
    "Ref",
    "Domaine",
    "Thème",
    "Site",
    "Département",
    "Statut",
    "Actions",
];
const TABLE_KEYS = [
    "ref",
    "domaine",
    "theme",
    "site",
    "department",
    "status",
    "actions",
];

const ACTIONS_TO_SHOW = ["edit", "delete"];
const RECORDS_PER_PAGE = 4;

const NeedsInternalCatalogDashboard = () => {
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
    } = useTable<NeedsInternalCatalogDashboardProps>(needsInternalCatalogDashboardData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const renderers = {
        status: (value: string) => (
            <StatusRenderer value={value} groupeConfig={statusConfig}/>
        ),
        actions: (_: any, row: any) => (
            <DynamicActionsRenderer actions={ACTIONS_TO_SHOW} row={row}/>
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
                        isRightButtonVisible={true}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouveau"
                        onRightButtonClick={() => null}
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
    )
}

export default NeedsInternalCatalogDashboard