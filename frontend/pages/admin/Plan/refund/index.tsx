import React from 'react'
import SearchFilterAddBar from '@/components/SearchFilterAddBar'
import ModalButton from '@/components/ModalButton'
import Table from '@/components/Tables/Table/index'
import router from 'next/router'
import StatusRenderer from '@/components/Tables/StatusRenderer'
import {planRefundData} from "@/data/planRefundData"
import {PlanRefundProps} from '@/types/dataTypes'
import {statusConfig} from '@/config/tableConfig'
import {handleSort} from '@/utils/sortUtils'
import useTable from '@/hooks/useTable'

const TABLE_HEADERS = [
    "Exercice",
    "Titre du plan",
    "Demande de financement",
    "Demande de remboursement",
    "Statut",
];
const TABLE_KEYS = [
    "exercice",
    "title",
    "fundingRequest",
    "refundRequest",
    "status",
];
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
    } = useTable<PlanRefundProps>(planRefundData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    // Gestionnaire de clic pour la colonne Exercice
    const handleExerciceClick = (value: string, row: any) => {
        router.push(`/Plan/refund/${value}`); // Adaptez la route selon vos besoins
    };

    // Configuration des colonnes cliquables
    const columnConfigs = {
        exercice: {
            onClick: handleExerciceClick,
            className: 'hover:underline cursor-pointer'
        }
    };

    const renderers = {
        // Renderer pour exercice
        exercice: (value: string, row: any) => (
            <div
                onClick={() => columnConfigs.exercice.onClick(value, row)}
                className={columnConfigs.exercice.className}
            >
                {value}
            </div>
        ),
        // Renderer pour les demandes de financement
        fundingRequest: (value: string) => (
            <StatusRenderer value={value} groupeConfig={statusConfig}/>
        ),
        // Renderer pour les demandes de remboursement
        refundRequest: (value: string) => (
            <StatusRenderer value={value} groupeConfig={statusConfig}/>
        ),
        // Renderer pour les statuts
        status: (value: string) => (
            <StatusRenderer value={value} groupeConfig={statusConfig}/>
        ),
    };
    const handleAdd = () => {
        router.push("/Needs/individual-request/add")
    }
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
    )
}

export default index