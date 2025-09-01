import React from "react";
import InputField from "@/components/FormComponents/InputField";
interface InputFieldConfig {
    label: string;
    name: string;
    type: string;
    value?: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface MultipleInputFieldProps {
    label: string;
    className?: string;
    fromFields: InputFieldConfig[];
    toFields: InputFieldConfig[];
    errorFrom?: string;
    errorTo?: string;
}

const MultipleInputField: React.FC<MultipleInputFieldProps> = ({
    label,
    className = "",
    fromFields,
    toFields,
    errorFrom,
    errorTo,
}) => (
    <div className={`md:col-span-1 ${className}`}>
        <label className="block break-words font-tHead text-formInputTextColor font-semibold text-xs md:text-sm lg:text-base mb-3">
            {label}
        </label>
        
        {/* Matin */}
        <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Matin</div>
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <InputField
                        type={fromFields[0].type}
                        label="De"
                        name={fromFields[0].name}
                        value={fromFields[0].value}
                        onChange={fromFields[0].onChange}
                        error={errorFrom}
                        labelClassName="text-xs font-normal mb-1"
                    />
                </div>
                <div className="flex-1">
                    <InputField
                        type={toFields[0].type}
                        label="À"
                        name={toFields[0].name}
                        value={toFields[0].value}
                        onChange={toFields[0].onChange}
                        error={errorTo}
                        labelClassName="text-xs font-normal mb-1"
                    />
                </div>
            </div>
        </div>
        
        {/* Après-midi */}
        <div>
            <div className="text-sm text-gray-600 mb-2">Après-midi</div>
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <InputField
                        type={fromFields[1]?.type || "time"}
                        label="De"
                        name={fromFields[1]?.name || "fromAfternoon"}
                        value={fromFields[1]?.value || ""}
                        onChange={fromFields[1]?.onChange || (() => {})}
                        labelClassName="text-xs font-normal mb-1"
                    />
                </div>
                <div className="flex-1">
                    <InputField
                        type={toFields[1]?.type || "time"}
                        label="À"
                        name={toFields[1]?.name || "toAfternoon"}
                        value={toFields[1]?.value || ""}
                        onChange={toFields[1]?.onChange || (() => {})}
                        labelClassName="text-xs font-normal mb-1"
                    />
                </div>
            </div>
        </div>
    </div>
);

export default MultipleInputField;