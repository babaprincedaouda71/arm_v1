// hooks/useParticipantsFormValidation.ts
import {useCallback, useState} from 'react';

interface ParticipantsFormData {
    targetAudience: string;
    staff: number;
    managerCount: number;
    employeeCount: number;
    workerCount: number;
    temporaryWorkerCount: number;
}

export const useParticipantsFormValidation = (initialFormData: ParticipantsFormData) => {
    const [formData, setFormData] = useState(initialFormData);
    const [staffError, setStaffError] = useState('');

    const validateStaffCount = useCallback((currentFormData: ParticipantsFormData) => {
        const {staff, managerCount, employeeCount, workerCount, temporaryWorkerCount} = currentFormData;
        const numStaff = typeof staff === 'number' ? staff : parseInt(staff as any, 10) || 0;
        const numManager = typeof managerCount === 'number' ? managerCount : parseInt(managerCount as any, 10) || 0;
        const numEmployee = typeof employeeCount === 'number' ? employeeCount : parseInt(employeeCount as any, 10) || 0;
        const numWorker = typeof workerCount === 'number' ? workerCount : parseInt(workerCount as any, 10) || 0;
        const numTemporary = typeof temporaryWorkerCount === 'number' ? temporaryWorkerCount : parseInt(temporaryWorkerCount as any, 10) || 0;

        const sumOfCounts = numManager + numEmployee + numWorker + numTemporary;

        if ((numStaff !== 0 || sumOfCounts !== 0) && sumOfCounts !== numStaff) {
            setStaffError(`La somme des effectifs (${sumOfCounts}) doit être égale à l'effectif total (${numStaff}).`);
            return false;
        } else {
            setStaffError('');
            return true;
        }
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        let newValue;

        if (name === 'staff' || name.endsWith('Count')) {
            newValue = value === '' ? '' : parseInt(value, 10) || 0;
        } else {
            newValue = value;
        }

        setFormData(prev => {
            const nextFormData = {...prev, [name]: newValue};
            if (name === 'staff' || name.endsWith('Count')) {
                validateStaffCount(nextFormData);
            }
            return nextFormData;
        });
    }, [validateStaffCount]);

    return {
        formData,
        setFormData,
        staffError,
        handleInputChange,
        validateStaffCount
    };
};