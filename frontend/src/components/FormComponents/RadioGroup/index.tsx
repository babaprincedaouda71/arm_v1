import React from "react";

interface RadioGroupProps {
    groupLabel: string;
    options: { id: string; value: string; label: string }[];
    name: string;
    selectedValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const RadioGroup : React.FC<RadioGroupProps> = ({  groupLabel, 
    options, 
    name, 
    selectedValue, 
    onChange,
    className
}) => {
    return (
        <div className={`flex items-center gap-20 justify-center ${className}`}>
            <label className="font-extrabold text-gray-700">
                {groupLabel}
            </label>
            <div className="flex gap-20">
                {options.map((option) => (
                    <div key={option.id} className="flex items-center gap-4">
                        <input
                            id={option.id}
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={onChange}
                            className="w-6 h-6 text-primary accent-primary focus:ring-primary border-gray-300"
                        />
                        <label
                            htmlFor={option.id}
                            className="font-medium text-gray-700"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RadioGroup;