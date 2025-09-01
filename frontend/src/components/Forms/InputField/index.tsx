import * as React from "react";

interface InputFieldProps {
    label: string;
    name: string;
    type?: React.HTMLInputTypeAttribute;
    value?: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
                                                   label,
                                                   name,
                                                   type = "text",
                                                   onChange,
                                                   value,
                                                   className,
                                               }) => (
    <div className={`flex items-center w-full text-xs md:text-sm lg:text-base ${className}`}>
        <label className="flex-[1] block font-medium text-gray-700 break-words">{label}</label>
        <input
            type={type}
            name={name}
            onChange={onChange}
            value={value}
            className="flex-[4] h-[48px] outline-none border-[1px] bg-inputBgColor border-none px-5 rounded-md"
        />
    </div>
);

export default InputField;