import React from 'react';
import InputField from '@/components/FormComponents/InputField';

interface TrainingParticipantsFormProps {
    formData: any;
    staffError: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TrainingParticipantsForm: React.FC<TrainingParticipantsFormProps> = ({
                                                                               formData,
                                                                               staffError,
                                                                               onInputChange
                                                                           }) => {
    return (
        <div className="grid md:grid-cols-2 md:gap-10 gap-4">
            <div>
                <InputField
                    label="Public cible"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={onInputChange}
                />
            </div>
            <div>
                <InputField
                    type='number'
                    label="Éffectif"
                    name="staff"
                    value={formData.staff}
                    onChange={onInputChange}
                />
                {staffError && <p className="text-red text-sm">{staffError}</p>}
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
                    <InputField
                        type='number'
                        label="Manager"
                        name="managerCount"
                        value={formData.managerCount}
                        onChange={onInputChange}
                    />
                    <InputField
                        type='number'
                        label="Employé"
                        name="employeeCount"
                        value={formData.employeeCount}
                        onChange={onInputChange}
                    />
                    <InputField
                        type='number'
                        label="Ouvrier"
                        name="workerCount"
                        value={formData.workerCount}
                        onChange={onInputChange}
                    />
                    <InputField
                        type='number'
                        label="Temporaire"
                        name="temporaryWorkerCount"
                        value={formData.temporaryWorkerCount}
                        onChange={onInputChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default TrainingParticipantsForm;