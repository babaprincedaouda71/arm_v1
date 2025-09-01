import CustomSelect from '@/components/FormComponents/CustomSelect'
import InputField from '@/components/FormComponents/InputField'
import Table from '@/components/Tables/Table/index'
import React, {useState} from 'react'
import {planGroupUserData} from '@/data/planGroupUserData'
import {PlanGroupUserProps} from '@/types/dataTypes'
import {handleSort} from '@/utils/sortUtils'
import useTable from '@/hooks/useTable'

const TABLE_HEADERS = [
    "Code",
    "Nom",
    "Prénoms",
    "Sélection",
];
const TABLE_KEYS = [
    "code",
    "firstName",
    "lastName",
    "select",
];

const RECORDS_PER_PAGE = 4;


const EvaluationForm = ({onClick}) => {
    const {
        visibleColumns,
        handleSortData,
        totalRecords,
        sortableColumns,
        paginatedData,
    } = useTable<PlanGroupUserProps>(planGroupUserData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const [formData, setFormData] = useState({
        type: "",
    })

    const renderers = {
        select: (_: string, row: PlanGroupUserProps) => (
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

    // Fonction pour gérer les changements dans les champs du formulaire
    const handleChange = (event) => {
        const {name, value} = event;

        // Mettre à jour l'état formData avec la nouvelle valeur
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    return (
        <form className='flex flex-col gap-4'>
            {/*<InputField label={'Label'} name={'label'} onChange={() => null}/>*/}
            <div className='flex items-center gap-4'>
                <CustomSelect name='type' label='Type de quizz' options={['Pré-formation', "Quizz final"]}
                              value={formData.type} onChange={handleChange}/>
                <img src='/images/view_eval.svg'/>
            </div>
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
            <div className="flex items-center justify-between text-xs md:text-sm lg:text-base">
                <button type='button' className='border p-2 md:p-3 lg:p-4 rounded-xl' onClick={onClick}>Annuler</button>
                <button
                    type="button"
                    className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                    onClick={() => alert("MyEvaluationsComponent ajoutée avec succès")}
                >
                    Valider
                </button>
            </div>
        </form>
    )
}

export default EvaluationForm