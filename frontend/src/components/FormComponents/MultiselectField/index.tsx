import React, {useEffect, useRef, useState} from "react";

const ChevronIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m6 9 6 6 6-6"/>
    </svg>
);

interface MultiSelectFieldProps {
    options: string[];
    value: string[];
    onChange: (selected: string[]) => void;
    label?: string;
    className?: string;
    labelClassName?: string;
    error?: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
                                                               options,
                                                               value,
                                                               onChange,
                                                               label,
                                                               className = "",
                                                               labelClassName,
                                                               error,
                                                           }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCheckboxChange = (option: string) => {
        if (value.includes(option)) {
            onChange(value.filter((item) => item !== option));
        } else {
            onChange([...value, option]);
        }
    };

    return (
        <div
            className={`flex items-center text-formInputTextColor font-semibold w-full text-xs md:text-sm lg:text-base ${className}`}
            ref={dropdownRef}
        >
            {label && (
                <label className={`flex-[0.94] block break-words truncate ${labelClassName}`}>
                    {label}
                </label>
            )}

            <div className="flex-[4] relative">
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="relative flex items-center w-full h-12 bg-inputBgColor rounded-md"
                >
                    <span className="absolute left-1/2 -translate-x-1/2 truncate max-w-[80%]">
                        {value.length > 0 ? value.join(", ") : "Sélectionner..."}
                    </span>
                    <span
                        className={`absolute right-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
                        }`}>
                        <ChevronIcon/>
                    </span>
                </button>

                {isOpen && (
                    <div
                        className="absolute w-full mt-1 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50">
                        {options.map((option) => (
                            <div
                                key={option}
                                className="relative group"
                            >
                                <label
                                    className={`
                                        flex items-center px-5 py-3 cursor-pointer
                                        hover:bg-primary hover:bg-opacity-5
                                        ${value.includes(option) ? 'bg-primary bg-opacity-5' : ''}
                                        group-hover:before:content-['']
                                        group-hover:before:absolute
                                        group-hover:before:left-0
                                        group-hover:before:top-0
                                        group-hover:before:h-full
                                        group-hover:before:w-1
                                        group-hover:before:bg-primary
                                    `}
                                >
                                    <input
                                        type="checkbox"
                                        checked={value.includes(option)}
                                        onChange={() => handleCheckboxChange(option)}
                                        className="w-5 h-5 border-2 border-primary rounded accent-primary mr-4"
                                    />
                                    <span className="flex-1 text-center">{option}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                )}
                {error && (
                    <p className="text-right mt-1 text-sm text-red">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MultiSelectField;