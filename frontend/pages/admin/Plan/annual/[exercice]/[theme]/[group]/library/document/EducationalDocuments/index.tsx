import FileInputField from '@/components/FormComponents/FileInputField'
import React from 'react'

const EducationalDocuments = () => {
    return (
        <div className='shadow-2xl flex flex-col space-y-8 p-4 rounded-lg'>
            <span className='font-bold text-gray-700'>Documents pédagogiques</span>
            <FileInputField label="Support de formation" name='evaluationSurvey' onChange={() => null} inputClassName='w-1/3' />
            <FileInputField label="Exercices" name='syntheticEvaluation' onChange={() => null} inputClassName='w-1/3' />
            <FileInputField label="Autres documents" name='syntheticEvaluation' onChange={() => null} inputClassName='w-1/3' />
        </div>
    )
}

export default EducationalDocuments
