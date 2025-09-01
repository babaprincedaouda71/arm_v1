import React, {useMemo, useState} from "react";
import {OCFCatalogProps} from "@/types/dataTypes";
import Table from "../Tables/Table/index0";
import {needsOCFData} from "../../data/needsOCFData";
import Modal from "../Modal";
import RadioButton from "../FormComponents/RadioButton";
import ModalButton from "../ModalButton";
import SearchFilterAddBar from "../SearchFilterAddBar";
import CustomSelect from "../FormComponents/CustomSelect";
import useTable from "@/hooks/useTable";
import {handleSort} from "@/utils/sortUtils";
import FolderIcon from "@/components/Svgs/FolderIcon";

// Table Headers and Keys
const TABLE_HEADERS = ["Ref", "Domaine", "Thème", "OCF", "Sélection"];

const TABLE_KEYS = ["ref", "domaine", "theme", "ocf", "select"]

const RECORDS_PER_PAGE = 4;


/**
 * Composant principal pour afficher un catalogue OCF et gérer la sélection d'un axe.
 * @returns {JSX.Element} Le composant OcfCatalog
 */
const OcfCatalog = (): JSX.Element => {
    const {
        data: allData,
        currentPage,
        visibleColumns,
        handleSortData,
        toggleColumnVisibility,
    } = useTable<OCFCatalogProps>(needsOCFData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const totalRecords = allData.length;
    const totalPages = useMemo(() => Math.ceil(totalRecords / RECORDS_PER_PAGE), [totalRecords]);

    // Sortable Columns
    const sortableCols = useMemo(
        () => TABLE_HEADERS.filter((TABLE_HEADERS) => !["Actions", "Sélection"].includes(TABLE_HEADERS)),
        []
    );

    // Pagination des données
    const paginatedData = useMemo(
        () => allData.slice((currentPage - 1) * RECORDS_PER_PAGE, currentPage * RECORDS_PER_PAGE),
        [allData, currentPage]
    );


    const [formData, setFormData] = useState({
        axe: "",
    });

    const handleChange = (event) => {
        const {name, value} = event;

        // Mettre à jour l'état formData avec la nouvelle valeur
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    /**
     * Objets de rendu personnalisés pour certaines colonnes.
     */
    const renderers = {
        /**
         * Rendu personnalisé pour la colonne "Sélection".
         * @returns {JSX.Element}
         * @param _
         * @param row
         */
        select: (_: string, row: OCFCatalogProps): JSX.Element => (
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

    const [selectedOption, setSelectedOption] = useState("");

    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const handleSave = () => {
        closeModal();
        setTimeout(() => {
            alert("Besoin enregistré !");
        }, 100);
    };

    const options = [
        {
            id: "option1",
            value: "catalogue",
            label: "Enregistrer dans le catalogue interne et le plan de formation",
        },
        {
            id: "option2",
            value: "plan",
            label: "Enregistrer uniquement dans le plan de formation",
        },
    ];

    return (
        <div className="mx-auto bg-white font-title rounded-lg px-6 pb-14">
            {/* Section : En-tête et sélection de l'axe */}
            <div className="flex flex-col lg:flex-row lg:space-x-44 justify-between items-center mb-4">
                <h2 className="flex-[1] text-base md-custom:text-lg lg:text-xl font-bold text-center md:text-start">
                    Veuillez choisir l'axe à partir duquel vous souhaitez ajouter le thème
                </h2>
                <CustomSelect
                    options={["Axe 1", "Axe 2", "Axe 3"]}
                    name="axe"
                    value={formData.axe}
                    onChange={handleChange}
                    className="lg:flex-1"
                />
            </div>

            <div className="flex items-start gap-2 md:gap-8">
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
                sortableCols={sortableCols}
                onSort={(column, order) => handleSortData(column, order, handleSort)}
                isPagination={false}
                totalRecords={totalRecords}
                loading={false}
                onAdd={() => console.log("Nouveau")}
                visibleColumns={visibleColumns}
                renderers={renderers}
            />

            {/* Section : Bouton d'action */}
            <div className="mt-5 text-right text-xs md:text-sm lg:text-base">
                <button
                    type="button"
                    className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                    onClick={openModal}
                >
                    Enregistrer
                </button>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={"Sélection de la source"}
                subtitle={"Veuillez choisir la destination de ce nouveau besoin"}
                actions={[
                    {label: "Annuler", onClick: closeModal, className: "border"},
                    {
                        label: "Valider",
                        onClick: handleSave,
                        className:
                            "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white",
                    },
                ]}
                icon={<FolderIcon/>}
            >
                <div className="flex flex-col items-start justify-center space-y-4">
                    {options.map((option) => (
                        <RadioButton
                            key={option.id}
                            id={option.id}
                            name="destination"
                            value={option.value}
                            label={option.label}
                            checked={selectedOption === option.value}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className={"w-6 h-6"}
                        />
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default OcfCatalog;