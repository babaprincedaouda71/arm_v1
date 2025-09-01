import React from "react";
import Table from "@/components/Tables/Table/index";
import ModalButton from "@/components/ModalButton";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import {useRouter} from "next/router";
import {InternalCatalogProps} from "@/types/dataTypes";
import {internalCatalogData} from "@/data/internalCatalogData"
import {handleSort} from "@/utils/sortUtils";
import useTable from "@/hooks/useTable";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";

const TABLE_HEADERS = [
    "Ref",
    "Domaine",
    "Thème",
    "Plan",
    "Département",
    "Type",
    "Actions",
];
const TABLE_KEYS = [
    "ref",
    "domaine",
    "theme",
    "plan",
    "department",
    "type",
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
    } = useTable<InternalCatalogProps>(internalCatalogData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)


    const renderers = {
        actions: (_: any, row: any) =>
            <DynamicActionsRenderer actions={ACTIONS_TO_SHOW} row={row}/>
    };
    const router = useRouter();
    const handleAdd = () => router.push("/catalog/internal/add");
    return (
        <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-xl pt-6">
            <div className="flex items-start gap-2 md:gap-8">
                <SearchFilterAddBar
                    isLeftButtonVisible={false}
                    isFiltersVisible={false}
                    isRightButtonVisible={true}
                    leftTextButton="Filtrer les colonnes"
                    rightTextButton="Nouveau"
                    onRightButtonClick={handleAdd}
                    filters={[]}
                    placeholderText={"Recherche de fournisseurs"}
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