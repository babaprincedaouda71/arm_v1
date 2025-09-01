// src/components/Forms/InputField.tsx
import React from "react";

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    value?: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const InputField = ({
    label,
    name,
    type = "number",
    value,
    onChange,
    className = "",
}: InputFieldProps) => (
    <div
        className={`flex gap-3 items-center w-full text-xs md:text-sm lg:text-base ${className}`}
    >
        <label className="block font-medium text-gray-700 break-words">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="md:w-24 h-[48px] outline-none border-[1px] bg-inputBgColor border-none text-center rounded-md"
        />
    </div>
);

export default InputField;