import React, { useState, useRef, useEffect } from "react";

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

export interface SwitchOption {
    label: string;
    id: string;
    checked: boolean;
}

interface SwitchSelectProps {
    name?: string;
    options: SwitchOption[];
    onChange: (options: SwitchOption[]) => void;
    className?: string;
    label?: string;
    labelClassName?: string;
}

const SwitchSelect: React.FC<SwitchSelectProps> = ({
    name,
    options,
    onChange,
    className,
    label,
    labelClassName,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localOptions, setLocalOptions] = useState<SwitchOption[]>(options);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getDisplayText = () => {
        const selectedOptions = localOptions.filter(opt => opt.checked);
        if (selectedOptions.length === 0) return "Sélectionner";
        if (selectedOptions.length <= 2) {
            return selectedOptions.map(opt => opt.label).join(", ");
        }
        return `${selectedOptions[0].label}, ${selectedOptions[1].label}, ...`;
    };

    const handleSwitchChange = (id: string, checked: boolean) => {
        const newOptions = localOptions.map(opt =>
            opt.id === id ? { ...opt, checked } : opt
        );
        setLocalOptions(newOptions);
        onChange(newOptions);
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
            <div className="flex-[4] relative">
                <button
                    type="button"
                    className="relative flex items-center justify-between w-full h-12 bg-inputBgColor rounded-md px-4"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="absolute left-1/2 -translate-x-1/2">
                        {getDisplayText()}
                    </span>
                    <span
                        className={`absolute right-5 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
                            }`}
                    >
                        <ChevronIcon />
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50">
                        {localOptions.map((option) => (
                            <div key={option.id} className="relative group">
                                <div
                                    className={`
                                        flex items-center justify-center w-full px-5 py-3 cursor-pointer
                                        hover:bg-primary hover:bg-opacity-5
                                        group-hover:before:content-['']
                                        group-hover:before:absolute
                                        group-hover:before:left-0
                                        group-hover:before:top-0
                                        group-hover:before:h-full
                                        group-hover:before:w-1
                                        group-hover:before:bg-violet-600
                                    `}
                                >
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex-[2] block font-medium  text-gray-700 break-words">
                                            {option.label}
                                        </label>
                                        <div className="flex-[2] flex items-center justify-center gap-4">
                                            <div className="w-[48px]">
                                                <button
                                                    role="switch"
                                                    aria-checked={option.checked}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSwitchChange(option.id, !option.checked);
                                                    }}
                                                    className={`
                                                        relative inline-flex h-8 w-[52px] items-center rounded-full
                                                        ${option.checked
                                                            ? 'bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd'
                                                            : 'bg-inputBgColor border border-gray-500 border-2'
                                                        }
                                                        transition-colors duration-200 ease-in-out focus:outline-none
                                                    `}
                                                >
                                                    <span
                                                        className={`
                                                            inline-block transform rounded-full transition-transform duration-200 ease-in-out
                                                            ${option.checked
                                                                ? 'translate-x-6 h-6 w-6 bg-white'
                                                                : 'translate-x-1 h-4 w-4 bg-gray-500'
                                                            }
                                                        `}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SwitchSelect;