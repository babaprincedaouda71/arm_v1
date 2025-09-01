import React from "react";
import Table from "@/components/Tables/Table/index";
import ModalButton from "@/components/ModalButton";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {PlanRefundExerciceProps} from "@/types/dataTypes";
import {planRefundExerciceData} from "@/data/planRefundExerciceData";
import {handleSort} from "@/utils/sortUtils";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import {statusConfig} from "@/config/tableConfig";
import useTable from "@/hooks/useTable";

const TABLE_HEADERS = [
    "N°",
    "Thème",
    "Date de réalisation",
    "Éffectif",
    "Coût",
    "OCF",
    "Statut",
    "DocumentPage",
    "Actions",
];
const TABLE_KEYS = [
    "number",
    "theme",
    "completionDate",
    "staff",
    "cost",
    "ocf",
    "status",
    "document",
    "actions",
];

const ACTIONS_TO_SHOW = ["edit", "delete"];
const RECORDS_PER_PAGE = 4;

const index = () => {
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
    } = useTable<PlanRefundExerciceProps>(planRefundExerciceData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const renderers = {
        // Renderer pour les statuts
        status: (value: string) => (
            <StatusRenderer value={value} groupeConfig={statusConfig}/>
        ),
        actions: (_: any, row: any) =>
            <DynamicActionsRenderer actions={ACTIONS_TO_SHOW} row={row}/>
    };
    return (
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
                    placeholderText={"Recherche de plans"}
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
    );
};

export default index;