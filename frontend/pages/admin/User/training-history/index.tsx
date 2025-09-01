import React, {useMemo} from "react";
import Table from "@/components/Tables/Table/index";
import {PlaningDataProps, TrainingHistoricProps} from "@/types/dataTypes";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import useTable from "@/hooks/useTable";
import PDFIcon from "@/components/Svgs/PDFIcon";
import {handleSort} from "@/utils/sortUtils";
import useSWR from "swr";
import {TRAINING_GROUPE_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";

const TABLE_HEADERS = [
    "Exercice",
    "Thème",
    "Dates de formation",
    "Certificat et licence",
];
const TABLE_KEYS = ["year", "theme", "dates", "certificateAndLicence"];
const RECORDS_PER_PAGE = 5;

const TrainingHistoric = ({userId}) => {
    const {
        data: trainingHistoryData,
        error,
        mutate
    } = useSWR<TrainingHistoricProps[]>(`${TRAINING_GROUPE_URLS.getUserTrainingHistory}/${userId}`, fetcher)

    const memoizedUserData = useMemo(() => trainingHistoryData || [], [trainingHistoryData]);
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

    const renderers = {
        certificateAndLicence: (_: string) => (
            <div className={"flex items-center justify-center"}>
                <PDFIcon/>
            </div>
        ),
    };

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
                renderers={renderers}
            />
        </div>
    );
};

export default TrainingHistoric;