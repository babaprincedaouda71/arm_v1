import React, {useMemo} from "react";
import Table from "@/components/Tables/Table/index";
import {PlaningDataProps} from "@/types/dataTypes";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import useTable from "@/hooks/useTable";
import {handleSort} from "@/utils/sortUtils";
import useSWR from "swr";
import {TRAINING_GROUPE_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";

const TABLE_HEADERS = ["Thème", "Dates de formation"];
const TABLE_KEYS = ["theme", "dates"];

const RECORDS_PER_PAGE = 4;

const Planning = ({userId}) => {
    const {
        data: planningData,
        error,
        mutate
    } = useSWR<PlaningDataProps[]>(`${TRAINING_GROUPE_URLS.getUserPlanning}/${userId}`, fetcher)

    const memoizedUserData = useMemo(() => planningData || [], [planningData]);
    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalRecords,
        paginatedData,
        sortableColumns,
        totalPages
    } = useTable(memoizedUserData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    return (
        <div>
            <div className="flex items-start gap-2 md:gap-8">
                <SearchFilterAddBar
                    isLeftButtonVisible={false}
                    isFiltersVisible={false}
                    isRightButtonVisible={false}
                    leftTextButton="Filtrer les colonnes"
                    rightTextButton="Nouveau"
                    onRightButtonClick={() => console.log("Nouveau button clicked")}
                    filters={[]}
                    placeholderText={"Rechercher une formation"}
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
            />
        </div>
    );
};

export default Planning;