import React from "react";
import Table from "@/components/Tables/Table/index";
import ModalButton from "@/components/ModalButton";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import {useRouter} from "next/router";
import {ExternalCatalogProps} from "@/types/dataTypes";
import {externalCatalogData} from "@/data/externalCatalogData"
import {handleSort} from "@/utils/sortUtils";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import useTable from "@/hooks/useTable";

const TABLE_HEADERS = [
    "Ref",
    "Domaine",
    "Thème",
    "OCF",
    "Actions",
];
const TABLE_KEYS = [
    "ref",
    "domaine",
    "theme",
    "ocf",
    "actions",
];

const ACTIONS_TO_SHOW = ["edit", "delete"];
const RECORDS_PER_PAGE = 4;

const index = () => {
    const {
        data: allData,
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalRecords,
        totalPages,
        sortableColumns,
        paginatedData,
    } = useTable<ExternalCatalogProps>(externalCatalogData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

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
                headers={TABLE_HEADERS}
                keys={TABLE_KEYS}
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