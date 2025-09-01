import React, { useState, useRef, useEffect } from "react";

interface MultiSelectFieldProps {
    options: string[];
    value: string[];
    onChange: (selected: string[]) => void;
    label?: string;
    className?: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
    options,
    value,
    onChange,
    label,
    className = "",
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
        <div className="relative w-full space-y-2 text-formInputTextColor font-semibold" ref={dropdownRef}>
            <div className="flex items-center">
                {/* Label séparé */}
                {label && (
                    <label className="flex-[1] block text-base">
                        {label}
                    </label>
                )}

                <div className="flex-[4] relative">
                    {/* Zone cliquable */}
                    <div
                        onClick={toggleDropdown}
                        className="w-full h-14 bg-gray-100 rounded-md flex justify-between items-center px-4 cursor-pointer"
                    >
                        <span className="text-base">
                            {value.length > 0 ? value.join(", ") : "Sélectionner..."}
                        </span>
                        <svg
                            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    {/* Dropdown */}
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {options.map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-3"
                                        checked={value.includes(option)}
                                        onChange={() => handleCheckboxChange(option)}
                                    />
                                    <span className="">{option}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultiSelectField;