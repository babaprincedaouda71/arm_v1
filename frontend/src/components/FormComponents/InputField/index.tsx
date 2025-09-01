// src/components/Forms/InputField.tsx
import React from "react";

interface InputFieldProps {
    label?: string;
    name: string;
    type?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
    autoComplete?: string;
    error?: string; // Nouvelle prop pour afficher les erreurs
    disabled?: boolean; // Nouvelle prop pour désactiver l'input
    minValue?: number | string | undefined;
}

const InputField = ({
                        label,
                        name,
                        type = "text",
                        value,
                        onChange,
                        className,
                        labelClassName,
                        inputClassName,
                        autoComplete,
                        error, // Utilisation de la nouvelle prop
                        disabled = false,
                        minValue,
                    }: InputFieldProps) => {
    // 🔧 FIX: Assurer une valeur par défaut pour éviter undefined/null
    const safeValue = value ?? "";

    return (
        <div
            className={`flex flex-col w-full font-tHead text-formInputTextColor font-semibold text-xs md:text-sm lg:text-base ${className}`}
        >
            <div className="flex items-center">
                <label className={`flex-[1] block break-words ${labelClassName}`}>
                    {label}
                </label>
                <input
                    readOnly={disabled}
                    // disabled={disabled} // Utilisation de la nouvelle prop
                    autoComplete={autoComplete}
                    type={type}
                    name={name}
                    value={safeValue} // 🔧 FIX: Utiliser la valeur sécurisée
                    min={minValue}
                    onChange={onChange}
                    className={`flex-[4] h-[48px] outline-none border-[1px] bg-inputBgColor ${error ? "border-red" : "border-none"
                    } px-5 rounded-md ${inputClassName}`}
                />
            </div>
            {/* Affichage du message d'erreur */}
            {error && (
                <p className="mt-1 text-sm text-red flex-[4] ml-auto">
                    {error}
                </p>
            )}
        </div>
    );
};

export default InputField;