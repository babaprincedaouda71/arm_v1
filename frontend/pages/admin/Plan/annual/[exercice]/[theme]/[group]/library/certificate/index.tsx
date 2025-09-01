import ModalButton from '@/components/ModalButton'
import SearchFilterAddBar from '@/components/SearchFilterAddBar'
import PDFIcon from '@/components/Svgs/PDFIcon'
import Table from '@/components/Tables/Table/index'
import WarningModal from '@/components/WarningModal'
import useTable from '@/hooks/useTable'
import { PlanGroupUserProps } from '@/types/dataTypes'
import { handleSort } from '@/utils/sortUtils'
import { planGroupUserData } from '@/data/planGroupUserData'
import React, { useMemo, useState } from 'react'

const TABLE_HEADERS = [
    "N°",
    "Nom",
    "Prénoms",
    "Certificat",
];
const TABLE_KEYS = [
    "code",
    "firstName",
    "lastName",
    "certificate",
];

const RECORDS_PER_PAGE = 4;

const Certificate = () => {
    const {
        data: allData,
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
    } = useTable<PlanGroupUserProps>(planGroupUserData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)


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
    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const renderers = {
        certificate: (_: string) => (
            <div className='flex justify-center items-center'>
                <PDFIcon className='h-6 w-6' />
            </div>
        ),
    };
    return (
        <>
            <div className="flex items-start gap-2 md:gap-8 font-title">
                <SearchFilterAddBar
                    isLeftButtonVisible={false}
                    isFiltersVisible={false}
                    isRightButtonVisible={false}
                    leftTextButton="Filtrer les colonnes"
                    rightTextButton="Nouvelle"
                    onRightButtonClick={() => null}
                    filters={[]}
                    placeholderText={"Recherche..."}
                />
                {/* Bouton pour afficher/masquer la fenêtre modale */}
                <ModalButton
                    headers={TABLE_HEADERS}
                    visibleColumns={visibleColumns}
                    toggleColumnVisibility={toggleColumnVisibility}
                />
            </div>
            <Table
                data={paginatedData}
                keys={TABLE_KEYS}
                headers={TABLE_HEADERS}
                sortableCols={sortableColumns}
                onSort={(column, order) => handleSortData(column, order, handleSort)}
                isPagination={true}
                pagination={{
                    currentPage,
                    totalPages,
                    onPageChange: setCurrentPage,
                }}
                totalRecords={totalRecords}
                loading={false}
                onAdd={() => null}
                visibleColumns={visibleColumns}
                renderers={renderers}
            />
            <div className='flex justify-end mr-8 lg:mr-0'>
                <button type='button' onClick={openModal} className='font-extrabold lg:text-xl text-primary'>Envoyer une demande de certificat</button>
            </div>
            <WarningModal isOpen={isModalOpen} title={"La demande de certificats a été envoyée avec succès à l'organisme de formation"} onClose={closeModal} />
        </>
    )
}

export default Certificate