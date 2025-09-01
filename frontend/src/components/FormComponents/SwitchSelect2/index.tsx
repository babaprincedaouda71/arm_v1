
import React, { useState, useRef, useEffect } from "react";

interface Participant {
    id: string;
    name: string;
    checked: boolean;
}

export interface SwitchOption {
    id: string;
    label: string;
    checked: boolean;
    hasSubOptions?: boolean;
    subOptions?: Participant[];
}

interface SwitchSelectProps {
    name?: string;
    options: SwitchOption[];
    onChange: (options: SwitchOption[]) => void;
    className?: string;
    label?: string;
    labelClassName?: string;
}

const ChevronIcon = ({ className = "" }) => (
    <svg
        className={`w-5 h-5 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
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

const UserIcon = () => (
    <svg className="w-4 h-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

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
    const [openSubOptionId, setOpenSubOptionId] = useState<string | null>(null);
    const [participantSearchTerm, setParticipantSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // 🔥 AJOUT : Synchroniser l'état local avec les nouvelles props
    useEffect(() => {
        console.log("SwitchSelect - Nouvelles options reçues:", options);
        setLocalOptions(options);
    }, [options]);

    // Calcul du nombre total de sélections
    const getSelectionCount = () => {
        return localOptions.reduce((count, opt) => {
            if (opt.hasSubOptions && opt.subOptions) {
                return count + opt.subOptions.filter(subOpt => subOpt.checked).length;
            }
            return count + (opt.checked ? 1 : 0);
        }, 0);
    };

    // Texte d'affichage amélioré
    const getDisplayText = () => {
        const selectionCount = getSelectionCount();

        if (selectionCount === 0) return "Sélectionner";

        const selectedOptions = localOptions.flatMap(opt => {
            if (opt.hasSubOptions && opt.subOptions) {
                if (opt.checked) {
                    return [opt.label];
                }
                return opt.subOptions.filter(subOpt => subOpt.checked).map(subOpt => subOpt.name);
            }
            return opt.checked ? [opt.label] : [];
        });

        if (selectedOptions.length === 1) {
            return selectedOptions[0];
        }
        if (selectedOptions.length === 2) {
            return selectedOptions.join(", ");
        }
        return `${selectionCount} destinataires sélectionnés`;
    };

    // Filtrage des participants uniquement
    const filterParticipants = (participants: Participant[], searchTerm: string) => {
        if (!searchTerm) return participants;
        return participants.filter(participant =>
            participant.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const handleSwitchChange = (optionId: string, checked: boolean, participantId?: string) => {
        const newOptions = localOptions.map(opt => {
            if (opt.id === optionId) {
                if (opt.hasSubOptions && opt.subOptions) {
                    if (participantId) {
                        const newSubOptions = opt.subOptions.map(subOpt =>
                            subOpt.id === participantId ? { ...subOpt, checked } : subOpt
                        );
                        const allChecked = newSubOptions.every(subOpt => subOpt.checked);
                        return {
                            ...opt,
                            checked: allChecked,
                            subOptions: newSubOptions
                        };
                    } else {
                        return {
                            ...opt,
                            checked,
                            subOptions: opt.subOptions.map(subOpt => ({
                                ...subOpt,
                                checked
                            }))
                        };
                    }
                }
                return { ...opt, checked };
            }
            return opt;
        });

        setLocalOptions(newOptions);
        onChange(newOptions);
    };

    const toggleSubOptions = (optionId: string) => {
        setOpenSubOptionId(openSubOptionId === optionId ? null : optionId);
        setParticipantSearchTerm(""); // Reset search when toggling
    };

    // Focus sur la recherche quand la liste des participants s'ouvre
    useEffect(() => {
        if (openSubOptionId && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [openSubOptionId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setOpenSubOptionId(null);
                setParticipantSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 🔥 AJOUT : Debug pour voir l'état local
    useEffect(() => {
        const allParticipantsOption = localOptions.find(opt => opt.id === 'all-participants');
        console.log("SwitchSelect - État local participants:", allParticipantsOption?.subOptions);
    }, [localOptions]);

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
                    className="relative flex items-center justify-between w-full h-12 bg-inputBgColor rounded-md px-4 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="flex items-center">
                        <UserIcon />
                        <span>{getDisplayText()}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        {getSelectionCount() > 0 && (
                            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                                {getSelectionCount()}
                            </span>
                        )}
                        <ChevronIcon className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50 max-h-96">
                        <div className="overflow-y-auto max-h-80">
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
                                            <div
                                                className="flex-[2] flex items-center gap-2 font-medium text-gray-700 break-words cursor-pointer"
                                                onClick={() => option.hasSubOptions && toggleSubOptions(option.id)}
                                            >
                                                {option.label}
                                                {option.hasSubOptions && (
                                                    <>
                                                        <span className={`transition-transform duration-200 ${
                                                            openSubOptionId === option.id ? "transform rotate-180" : ""
                                                        }`}>
                                                            <ChevronIcon />
                                                        </span>
                                                        {option.subOptions && (
                                                            <span className="text-xs text-gray-500 ml-1">
                                                                ({option.subOptions.filter(s => s.checked).length}/{option.subOptions.length})
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex-[2] flex items-center justify-end gap-4">
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
                                                            : 'bg-inputBgColor border-gray-500 border-2'
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

                                    {option.hasSubOptions && openSubOptionId === option.id && option.subOptions && option.subOptions.length > 0 && (
                                        <div className="border-t border-gray-100">
                                            {/* Barre de recherche pour les participants uniquement */}
                                            {option.subOptions.length > 5 && (
                                                <div className="px-24 py-2 bg-gray-50 border-b border-gray-100">
                                                    <input
                                                        ref={searchInputRef}
                                                        type="text"
                                                        placeholder="Rechercher un participant..."
                                                        value={participantSearchTerm}
                                                        onChange={(e) => setParticipantSearchTerm(e.target.value)}
                                                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>
                                            )}

                                            <div className="px-24 max-h-48 overflow-y-auto">
                                                {filterParticipants(option.subOptions, participantSearchTerm).map((participant) => (
                                                    <div key={participant.id} className="relative group">
                                                        <div
                                                            className={`
                                                                flex items-center justify-center w-full px-5 py-3 cursor-pointer
                                                                hover:bg-primary hover:bg-opacity-5 bg-gray-50
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
                                                                <label className="flex-[4] block font-medium text-gray-700 break-words">
                                                                    {participant.name}
                                                                </label>
                                                                <div className="flex-[1] flex items-center justify-end gap-4">
                                                                    <div className="w-[48px]">
                                                                        <button
                                                                            role="switch"
                                                                            aria-checked={participant.checked}
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleSwitchChange(option.id, !participant.checked, participant.id);
                                                                            }}
                                                                            className={`
                                                                                relative inline-flex h-8 w-[52px] items-center rounded-full
                                                                                ${participant.checked
                                                                                ? 'bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd'
                                                                                : 'bg-inputBgColor border border-gray-500 border-2'
                                                                            }
                                                                                transition-colors duration-200 ease-in-out focus:outline-none
                                                                            `}
                                                                        >
                                                                            <span
                                                                                className={`
                                                                                    inline-block transform rounded-full transition-transform duration-200 ease-in-out
                                                                                    ${participant.checked
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
                                                {filterParticipants(option.subOptions, participantSearchTerm).length === 0 && (
                                                    <div className="px-5 py-3 text-center text-gray-500 text-sm">
                                                        Aucun participant trouvé
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {/* 🔥 AJOUT : Message si pas de participants */}
                                    {option.hasSubOptions && openSubOptionId === option.id && (!option.subOptions || option.subOptions.length === 0) && (
                                        <div className="border-t border-gray-100 px-24 py-4">
                                            <div className="text-center text-gray-500 text-sm">
                                                Aucun participant disponible
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SwitchSelect;