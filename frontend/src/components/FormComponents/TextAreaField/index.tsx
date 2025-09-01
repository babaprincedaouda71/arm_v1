// src/components/Forms/TextAreaField.tsx
import React from 'react';

interface TextAreaFieldProps {
    label: string;
    name: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    labelClassName?;
    textAreaClassName?;
    error?: string;
}

const TextAreaField = ({
    label,
    name,
    value,
    onChange,
    className = "",
    labelClassName,
    textAreaClassName,
    error,
}: TextAreaFieldProps) => (
    <div className={`flex items-center w-full font-tHead text-formInputTextColor font-semibold text-xs md:text-sm lg:text-base ${className}`}>
        <label className={`flex-[1] block break-words pt-2 ${labelClassName}`}>
            {label}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            className={`flex-[4] min-h-[150px] outline-none border-[1px] bg-inputBgColor border-none p-5 rounded-md resize-none ${textAreaClassName}`}
        />
        {error && (
            <p className="mt-1 text-sm text-red">
                {error}
            </p>
        )}
    </div>
);

export default TextAreaField;