// src/components/FormComponents/Switch/AddOCFPage.tsx - Version améliorée
import React from 'react';

interface SwitchProps {
    label: string;
    name: string;
    checked: boolean;
    onChange?: (checked: boolean) => void;
    planifieField?: React.ReactNode;
    className?: string;
    error?: string;
    disabled?: boolean; // 🆕 Nouvelle prop pour désactiver le switch
    title?: string; // 🆕 Nouvelle prop pour le tooltip
}

const Switch = ({
                    label,
                    name,
                    checked,
                    onChange,
                    planifieField,
                    className,
                    error,
                    disabled = false, // 🆕 Par défaut non désactivé
                    title
                }: SwitchProps) => {

    const handleClick = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    return (
        <div className={`flex items-center w-full text-xs md:text-sm lg:text-base ${className}`}>
            <label className="flex-[1] block font-medium text-gray-700 break-words">
                {label}
            </label>
            <div className="flex-[4] flex items-center gap-4">
                <div className="w-[48px]" title={title}>
                    <button
                        role="switch"
                        aria-checked={checked}
                        type="button"
                        name={name}
                        onClick={handleClick}
                        disabled={disabled} // 🆕 Utilisation de la prop disabled
                        className={`
                            relative inline-flex h-8 w-[52px] items-center rounded-full
                            ${checked
                            ? 'bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd'
                            : 'bg-inputBgColor border-gray-500 border-2'
                        }
                            ${disabled
                            ? 'opacity-50 cursor-not-allowed' // 🆕 Style pour l'état désactivé
                            : 'cursor-pointer hover:opacity-90' // 🆕 Style pour l'état actif
                        }
                            transition-all duration-200 ease-in-out focus:outline-none
                        `}
                    >
                        <span
                            className={`
                                inline-block transform rounded-full transition-transform duration-200 ease-in-out
                                ${checked
                                ? 'translate-x-6 h-6 w-6 bg-white'
                                : 'translate-x-1 h-4 w-4 bg-gray-500'
                            }
                                ${disabled ? 'opacity-75' : ''} // 🆕 Opacité réduite si désactivé
                            `}
                        />
                    </button>
                </div>
                {planifieField && (
                    <div className="flex-1">
                        {planifieField}
                    </div>
                )}
                {error && (
                    <p className="mt-1 text-sm text-red">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Switch;