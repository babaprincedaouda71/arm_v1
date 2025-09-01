import React from 'react'
import {NeedsInternalCatalogCProps} from '../../../../types/dataTypes';
import {needsInternalCatalogCData} from "../../../../data/needsInternalCatalogCData"
import Table from '../../../Tables/Table/index';
import ModalButton from '../../../ModalButton';
import SearchFilterAddBar from '../../../SearchFilterAddBar';
import {handleSort} from '@/utils/sortUtils';
import useTable from '@/hooks/useTable';

// Table Headers and Keys
const TABLE_HEADERS = [
    "Ref",
    "Domaine",
    "Thème",
    "Plan",
    "Département",
    "Type",
    "Sélection",
];

const TABLE_KEYS = [
    "ref",
    "domain",
    "theme",
    "plan",
    "department",
    "type",
    "select",
];

const RECORDS_PER_PAGE = 4;

const NeedsInternalCatalogC = () => {
    const {
        visibleColumns,
        handleSortData,
        toggleColumnVisibility,
        totalRecords,
        sortableColumns,
        paginatedData,
    } = useTable<NeedsInternalCatalogCProps>(needsInternalCatalogCData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)
    /**
     * Objets de rendu personnalisés pour certaines colonnes.
     */
    const renderers = {
        select: (_: string, row: NeedsInternalCatalogCProps) => (
            <div className="flex justify-center items-center">
                <input
                    type="checkbox"
                    className="h-5 w-5 accent-primary"
                    onClick={() => console.log("Élément coché :", row)}
                    aria-label={`Sélectionner ${row}`}
                />
            </div>
        ),
    };
    return (
        <div className='mx-auto bg-white font-title rounded-lg px-6 pb-2 pt-6'>
            <div className="flex items-start gap-2 md:gap-8 mt-4">
                <SearchFilterAddBar
                    isLeftButtonVisible={false}
                    isFiltersVisible={false}
                    isRightButtonVisible={false}
                    leftTextButton="Filtrer les colonnes"
                    rightTextButton="Nouvel"
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

            {/* Section : Tableau des données */}
            <Table
                data={paginatedData}
                keys={TABLE_KEYS}
                headers={TABLE_HEADERS}
                sortableCols={sortableColumns}
                onSort={(column, order) => handleSortData(column, order, handleSort)}
                isPagination={false}
                totalRecords={totalRecords}
                loading={false}
                onAdd={() => console.log("Nouveau")}
                visibleColumns={visibleColumns}
                renderers={renderers}
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

export default NeedsInternalCatalogC