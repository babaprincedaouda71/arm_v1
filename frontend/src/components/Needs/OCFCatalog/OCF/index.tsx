import React, { useMemo } from "react";
import { NeedsOCFCatalogCProps } from "../../../../types/dataTypes";
import { needsOCFCatalogCData } from "../../../../data/needsOCFCatalogCData";
import SearchFilterAddBar from "../../../SearchFilterAddBar";
import ModalButton from "../../../ModalButton";
import Table from "../../../Tables/Table/index";
import { handleSort } from "@/utils/sortUtils";
import { useRouter } from "next/router";
import useTable from "@/hooks/useTable";

const TABLE_HEADERS = ["Ref", "Domaine", "Thème", "OCF", "Selection"];
const TABLE_KEYS = ["ref", "domaine", "theme", "ocf", "select"];

const ACTIONS_TO_SHOW = ["view", "edit", "delete"];
const RECORDS_PER_PAGE = 4;

const NeedsOCFCatalogC = () => {
    const {
        data: allData,
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
    } = useTable<NeedsOCFCatalogCProps>(needsOCFCatalogCData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const router = useRouter();

    const totalRecords = allData.length;
    const totalPages = useMemo(() => Math.ceil(totalRecords / RECORDS_PER_PAGE), [totalRecords]);

    // Sortable Columns
    const sortableColumns = useMemo(
        () => TABLE_HEADERS.filter((TABLE_HEADERS) => !["Actions", "Sélection"].includes(TABLE_HEADERS)),
        []
    );

    // Pagination des données
    const paginatedData = useMemo(
        () => allData.slice((currentPage - 1) * RECORDS_PER_PAGE, currentPage * RECORDS_PER_PAGE),
        [allData, currentPage]
    );

    /**
     * Objets de rendu personnalisés pour certaines colonnes.
     */
    const renderers = {
        /**
         * Rendu personnalisé pour la colonne "Sélection".
         * @param {string} value - Valeur actuelle de la cellule.
         * @returns {JSX.Element}
         */
        select: (_: string, row: NeedsOCFCatalogCProps) => (
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
        <div className="mx-auto bg-white font-title rounded-lg px-6 pb-2 pt-6">
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
    );
};

export default NeedsOCFCatalogC;