import Table from '@/components/Tables/Table1'
import React from 'react'
import {planGroupUserData} from '@/data/planGroupUserData'
import {PlanGroupUserProps} from '@/types/dataTypes'
import ProgressBar from '@/components/ProgressBar'
import {handleSort} from '@/utils/sortUtils'
import EyeFileIcon from '@/components/Svgs/EyeFileIcon'
import PDFIcon from '@/components/Svgs/PDFIcon'
import useTable from '@/hooks/useTable'

const TABLE_HEADERS = [
    "Code",
    "Nom",
    "Prénoms",
    "État d'avancement",
    "Actions",
];
const TABLE_KEYS = [
    "code",
    "firstName",
    "lastName",
    "progress",
    "actions",
];

const RECORDS_PER_PAGE = 4;

const DetailEvaluation = () => {
    const {
        visibleColumns,
        handleSortData,
        totalRecords,
        sortableColumns,
        paginatedData,
    } = useTable<PlanGroupUserProps>(planGroupUserData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const renderers = {
        progress: (_: string) => (
            <ProgressBar progress={50}/>
        ),
        actions: (_: string, row: any) => (
            <div className="flex justify-around items-center">
                <EyeFileIcon className='h-6 w-6'/>
                <PDFIcon className='h-6 w-6'/>
                <input
                    type="checkbox"
                    className="h-5 w-5 accent-primary"
                    onClick={() => console.log("Élément coché :", row)}
                    aria-label={`Sélectionner ${row}`}
                /></div>
        )
    };
    return (
        <form className='flex flex-col gap-4'>
            <Table
                data={paginatedData}
                keys={TABLE_KEYS}
                headers={TABLE_HEADERS}
                sortableCols={sortableColumns}
                onSort={(column, order) => handleSortData(column, order, handleSort)}
                isPagination={false}
                totalRecords={totalRecords}
                loading={false}
                onAdd={() => null}
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
                    Télécharger
                </button>
            </div>
            <div className='flex items-center justify-items-start gap-4 hover:cursor-pointer'>
                <span className='text-primary font-extrabold'>Générer la fiche d'évaluation synthétique</span>
                <img src='/images/pdf.svg' className='h-8 w-8'/>
            </div>
        </form>
    )
}

export default DetailEvaluation