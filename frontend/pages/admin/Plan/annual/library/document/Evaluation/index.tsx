import CustomSelect from '@/components/FormComponents/CustomSelect'
import FileInputField from '@/components/FormComponents/FileInputField'
import React from 'react'
import F4Generator from "@/components/ui/F4Generator";
import F4Generator1 from "@/components/ui/F4Generator1";

const Evaluation = () => {
    return (
        <div className='space-y-10'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <CustomSelect label="Veuillez choisir un questionnaire" name='date' onChange={() => null}
                              labelClassName='font-extrabold' className='col-span-3' options={['Formulaire F4']}
                              value={''}/>
            </div>
            <div className='shadow-2xl flex flex-col space-y-4 p-4 rounded-lg'>
                <span className='font-bold text-gray-700'>Formulaire F4 émargé</span>
                <FileInputField label="Questionnaire d'évaluation" name='evaluationSurvey' onChange={() => null}
                                inputClassName='w-1/3'/>
                <FileInputField label="Fiche d'évaluation synthétique" name='syntheticEvaluation' onChange={() => null}
                                inputClassName='w-1/3'/>
            </div>
            <div>
                <F4Generator trainingTheme={''} beneficiaryLastName={''} beneficiaryFirstName={''} trainingDates={''} cin={''} cnss={''}/>
                <F4Generator1/>
            </div>
        </div>
    )
}

export default Evaluation