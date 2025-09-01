import React from "react";
import {NeedsOCFCatalogDashboardProps} from "../../../../types/dataTypes";
import {needsOCFCatalogDashboardData} from "../../../../data/needsOCFCatalogDashboardData";
import DashboardBar from "../../../DashbordBar";
import SearchFilterAddBar from "../../../SearchFilterAddBar";
import ModalButton from "../../../ModalButton";
import Table from "../../../Tables/Table/index";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {statusConfig} from "@/config/tableConfig";
import {handleSort} from "@/utils/sortUtils";
import useTable from "@/hooks/useTable";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";

// Table Headers and Keys
const TABLE_HEADERS = [
    "Ref",
    "Domaine",
    "Thème",
    "OCF",
    "Site",
    "Département",
    "Statut",
    "Actions",]

const TABLE_KEYS = [
    "ref",
    "domaine",
    "theme",
    "ocf",
    "site",
    "department",
    "status",
    "actions",]

const ACTIONS_TO_SHOW = ["edit", "delete"];

const RECORDS_PER_PAGE = 4;

const NeedsOCFCatalogDashboard = () => {
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
    } = useTable<NeedsOCFCatalogDashboardProps>(needsOCFCatalogDashboardData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const renderers = {
        status: (value: string) => (
            <StatusRenderer value={value} groupeConfig={statusConfig}/>
        ),
        actions: (_: any, row: NeedsOCFCatalogDashboardProps) =>
            (
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
    );
};

export default NeedsOCFCatalogDashboard;