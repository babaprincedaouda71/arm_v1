// src/components/Forms/SelectField.tsx
import React from 'react';

interface SelectFieldProps {
    label?: string;
    name?: string;
    options: string[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
}

const SelectField = ({
    label,
    name,
    options,
    value,
    onChange,
    className = ""
}: SelectFieldProps) => (
    <div className={`flex items-center w-full text-xs md:text-sm lg:text-base ${className}`}>
        {label && (
            <label className="flex-[1] block font-medium text-gray-700 break-words">
                {label}
            </label>
        )}
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="flex-[4] h-[48px] outline-none border-[1px] bg-inputBgColor border-none px-5 rounded-md"
        >
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

export default SelectField;