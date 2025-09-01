import React from 'react';
import DatePicker from "@/components/FormComponents/DatePicker";

interface MultipleDateFieldProps {
    label: string;
    dates: string[];
    onDateChange: (index: number, value: string) => void;
    onAddDate: () => void;
    onRemoveDate: (index: number) => void;
    error?: string;
    className?: string;
}

const MultipleDateField: React.FC<MultipleDateFieldProps> = ({
                                                                 label,
                                                                 dates,
                                                                 onDateChange,
                                                                 onAddDate,
                                                                 onRemoveDate,
                                                                 error,
                                                                 className = ""
                                                             }) => {
    return (
        <div className={`${className}`}>
            <div className="flex justify-between items-center mb-2">
                <label className="block break-words font-tHead text-formInputTextColor font-semibold text-xs md:text-sm lg:text-base">
                    {label}
                </label>
                <button
                    type="button"
                    onClick={onAddDate}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm focus:outline-none focus:shadow-outline transition-colors duration-200"
                >
                    +
                </button>
            </div>

            <div>
                {dates.map((date, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <DatePicker
                            value={date}
                            onChange={(value) => onDateChange(index, value)}
                            placeholder="Sélectionner une date"
                            error={index === 0 ? error : undefined}
                            className="flex-grow"
                        />

                        {dates.length > 1 && (
                            <button
                                type="button"
                                onClick={() => onRemoveDate(index)}
                                className="bg-red hover:bg-redShade-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                            >
                                -
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Affichage des erreurs */}
            {error && (
                <p className="mt-1 text-sm text-redShade">
                    {error}
                </p>
            )}
        </div>
    );
};

export default MultipleDateField;