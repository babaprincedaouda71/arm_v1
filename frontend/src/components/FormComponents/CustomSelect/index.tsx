import React, { useEffect, useRef, useState } from "react";

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
        <path d="m6 9 6 6 6-6" />
    </svg>
);

export interface CustomSelectProps {
    name?: string;
    options: string[];
    value: string;
    onChange?: (event: { name: string; value: string }) => void;
    className?: string;
    label?: string;
    labelClassName?: string;
    error?: string; // Ajout du type string pour la prop error
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    name,
    options,
    value,
    onChange,
    className,
    label,
    labelClassName,
    error // Utilisation de la nouvelle prop
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelect = (option: string) => {
        onChange({ name, value: option });
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            className={`flex items-center text-formInputTextColor font-semibold text-xs md:text-sm lg:text-base w-full ${className}`}
            ref={dropdownRef}
        >
            {label && (
                <label htmlFor={name} className={`flex-[1] block break-words ${labelClassName}`}>
                    {label}
                </label>
            )}
            <div className="flex-[4] relative m-0">
                <button
                    type="button"
                    className={`relative flex items-center justify-between w-full h-12 bg-inputBgColor rounded-md ${error ? "border border-red-500" : "border-none"
                        }`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="absolute left-1/2 -translate-x-1/2 truncate max-w-[80%]">
                        {value.length > 0 ? "" : "Sélectionner..."}
                    </span>
                    <span className="absolute left-1/2 -translate-x-1/2">{value}</span>
                    <span
                        className={`absolute right-5 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
                            }`}
                    >
                        <ChevronIcon />
                    </span>
                </button>

                {isOpen && (
                    <div
                        className="absolute w-full mt-1 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50">
                        {options.map((option, index) => (
                            <div key={index} className="relative group">
                                <div
                                    className={`
                                        flex items-center justify-center px-5 py-3 cursor-pointer
                                        hover:bg-primary hover:bg-opacity-5
                                        group-hover:before:content-['']
                                        group-hover:before:absolute
                                        group-hover:before:left-0
                                        group-hover:before:top-0
                                        group-hover:before:h-full
                                        group-hover:before:w-1
                                        group-hover:before:bg-violet-600
                                    `}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Affichage du message d'erreur */}
                {error && (
                    <p className="text-right mt-1 text-sm text-red">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CustomSelect;